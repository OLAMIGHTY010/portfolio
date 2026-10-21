"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  Trash2,
  Minimize2,
  Maximize2,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const INITIAL_SUGGESTIONS = [
  "🏦 What is his banking operations & monitoring experience?",
  "🛠️ Which tech stack and languages does he specialize in?",
  "🚀 Tell me about the Banking Transaction Monitor project",
  "📬 How can I contact or hire Olalekan?",
];

const INITIAL_MESSAGE: Message = {
  id: "welcome",
  role: "assistant",
  content:
    "Hi there! 👋 I'm **Olalekan's AI Assistant**.\n\nI can answer questions about his full-stack engineering background, banking operations monitoring, Power BI analytics, or case studies. How can I help you today?",
};

export function AiChatModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
      inputRef.current?.focus();
    }
  }, [messages, isOpen, isMinimized]);

  async function handleSend(queryText?: string) {
    const textToSend = queryText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: textToSend.trim(),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map(({ role, content }) => ({ role, content })),
        }),
      });

      if (!res.ok) throw new Error("Failed to fetch response");

      const data = await res.json();
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.reply || "Sorry, I could not generate a response.",
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content:
            "I'm having trouble connecting right now, but you can reach Olalekan directly at [nanicomlekan111@gmail.com](mailto:nanicomlekan111@gmail.com) or via the [Contact Page](/contact)!",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function renderFormattedContent(content: string) {
    const lines = content.split("\n");
    return lines.map((line, idx) => {
      let parsed = line;

      if (parsed.startsWith("### ")) {
        return (
          <h4 key={idx} className="font-semibold text-foreground text-sm mt-2 mb-1">
            {parsed.replace("### ", "")}
          </h4>
        );
      }

      const isBullet = parsed.startsWith("- ") || parsed.startsWith("* ");
      if (isBullet) {
        parsed = parsed.replace(/^[-*]\s+/, "");
      }

      const parts = parsed.split(/(\*\*.*?\*\*|\[.*?\]\(.*?\))/g);

      const formattedLine = parts.map((part, pIdx) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={pIdx} className="font-semibold text-foreground">
              {part.slice(2, -2)}
            </strong>
          );
        }
        const linkMatch = part.match(/\[(.*?)\]\((.*?)\)/);
        if (linkMatch) {
          return (
            <a
              key={pIdx}
              href={linkMatch[2]}
              target={linkMatch[2].startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="text-primary underline hover:text-primary/80 inline-flex items-center gap-0.5"
            >
              {linkMatch[1]}
              {linkMatch[2].startsWith("http") && <ExternalLink className="h-2.5 w-2.5 inline" />}
            </a>
          );
        }
        return part;
      });

      if (isBullet) {
        return (
          <div key={idx} className="flex items-start gap-2 my-1 text-xs">
            <span className="text-primary mt-1">•</span>
            <div className="flex-1">{formattedLine}</div>
          </div>
        );
      }

      return (
        <p key={idx} className="my-1 text-xs leading-relaxed">
          {formattedLine}
        </p>
      );
    });
  }

  return (
    <>
      {/* Floating Launcher Button */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          className={cn(
            "relative flex items-center gap-2.5 px-4 py-3 rounded-full shadow-xl transition-all duration-300",
            "bg-gradient-to-r from-primary to-accent text-primary-foreground font-medium text-xs sm:text-sm",
            "border border-white/20 hover:shadow-primary/25 hover:shadow-2xl",
            isOpen && "hidden"
          )}
          aria-label="Open AI Assistant"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
          <Sparkles className="h-4 w-4 shrink-0" />
          <span className="font-semibold tracking-wide">Ask My AI</span>
        </motion.button>
      </div>

      {/* Chat Window Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              height: isMinimized ? "auto" : "560px",
            }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "fixed bottom-6 right-4 sm:right-6 z-50 w-[380px] sm:w-[420px] max-w-[calc(100vw-32px)] max-h-[85vh]",
              "bg-card/95 backdrop-blur-xl border border-border shadow-2xl rounded-2xl flex flex-col overflow-hidden"
            )}
          >
            {/* Header */}
            <div className="px-4 py-3.5 bg-muted/50 border-b border-border flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-primary-foreground shrink-0 shadow-sm">
                  <Bot className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    Ask Olalekan&apos;s AI
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    Full-Stack &amp; Banking Operations
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setMessages([INITIAL_MESSAGE])}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  title="Clear conversation"
                  aria-label="Clear chat"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  title={isMinimized ? "Expand" : "Minimize"}
                  aria-label="Toggle minimize"
                >
                  {isMinimized ? (
                    <Maximize2 className="h-3.5 w-3.5" />
                  ) : (
                    <Minimize2 className="h-3.5 w-3.5" />
                  )}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  aria-label="Close"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Body (Hidden if minimized) */}
            {!isMinimized && (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
                  {messages.map((m) => {
                    const isUser = m.role === "user";
                    return (
                      <div
                        key={m.id}
                        className={cn("flex gap-2.5", isUser ? "justify-end" : "justify-start")}
                      >
                        {!isUser && (
                          <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                            <Bot className="h-3.5 w-3.5" />
                          </div>
                        )}
                        <div
                          className={cn(
                            "max-w-[85%] rounded-2xl px-3.5 py-2.5 shadow-xs",
                            isUser
                              ? "bg-primary text-primary-foreground rounded-br-xs"
                              : "bg-muted/80 text-foreground border border-border/60 rounded-bl-xs"
                          )}
                        >
                          {isUser ? (
                            <p className="whitespace-pre-wrap">{m.content}</p>
                          ) : (
                            renderFormattedContent(m.content)
                          )}
                        </div>
                        {isUser && (
                          <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 mt-0.5">
                            <User className="h-3.5 w-3.5" />
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Typing Indicator */}
                  {loading && (
                    <div className="flex items-center gap-2 text-muted-foreground py-1">
                      <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <Bot className="h-3.5 w-3.5 animate-spin" />
                      </div>
                      <div className="bg-muted px-3 py-2 rounded-2xl flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce" />
                        <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:0.2s]" />
                        <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:0.4s]" />
                      </div>
                    </div>
                  )}

                  {/* Suggestion Chips */}
                  {messages.length === 1 && (
                    <div className="pt-2 space-y-1.5">
                      <div className="text-[10px] uppercase font-semibold text-muted-foreground/70 tracking-wider px-1">
                        Suggested questions
                      </div>
                      <div className="flex flex-col gap-1.5">
                        {INITIAL_SUGGESTIONS.map((s, i) => (
                          <button
                            key={i}
                            onClick={() => handleSend(s)}
                            className="text-left px-3 py-2 rounded-xl bg-muted/60 hover:bg-muted border border-border/60 text-[11px] text-foreground transition-colors hover:border-primary/40"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input Bar */}
                <div className="p-3 border-t border-border bg-card shrink-0">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSend();
                    }}
                    className="flex items-center gap-2"
                  >
                    <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask about Olalekan's skills, banking role..."
                      className="flex-1 bg-muted/60 text-foreground placeholder:text-muted-foreground px-3.5 py-2.5 rounded-xl text-xs border border-border/80 focus:outline-none focus:border-primary/50 transition-colors"
                      disabled={loading}
                    />
                    <button
                      type="submit"
                      disabled={!input.trim() || loading}
                      className={cn(
                        "h-9 w-9 rounded-xl flex items-center justify-center shrink-0 transition-all",
                        input.trim() && !loading
                          ? "bg-primary text-primary-foreground hover:bg-primary/90"
                          : "bg-muted text-muted-foreground opacity-50 cursor-not-allowed"
                      )}
                      aria-label="Send message"
                    >
                      <Send className="h-3.5 w-3.5" />
                    </button>
                  </form>
                  <div className="text-[9px] text-center text-muted-foreground/60 mt-2">
                    Powered by Olalekan&apos;s Portfolio Knowledge Base
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
