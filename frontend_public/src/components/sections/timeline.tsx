"use client";

import { motion } from "framer-motion";
import type { TimelineItem } from "@/lib/types";
import { FadeIn } from "./animated-section";

export function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-px" />

      <div className="space-y-12">
        {items.map((item, index) => {
          const isLeft = index % 2 === 0;
          return (
            <FadeIn key={index} delay={index * 0.1}>
              <div className="relative flex items-start gap-8 md:gap-0">
                {/* Dot */}
                <div className="absolute left-4 md:left-1/2 w-3 h-3 rounded-full bg-primary border-4 border-background -translate-x-1.5 mt-1.5 z-10" />

                {/* Content */}
                <div
                  className={`ml-12 md:ml-0 md:w-1/2 ${
                    isLeft
                      ? "md:pr-12 md:text-right"
                      : "md:pl-12 md:ml-auto"
                  }`}
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="p-5 rounded-xl bg-card border border-border card-hover"
                  >
                    <span className="inline-block px-3 py-1 text-xs font-semibold text-primary bg-primary/10 rounded-full mb-3">
                      {item.year}
                    </span>
                    <h3 className="text-lg font-semibold text-foreground mb-1">
                      {item.title}
                    </h3>
                    <p className="text-sm font-medium text-primary/80 mb-2">
                      {item.institution}
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </motion.div>
                </div>
              </div>
            </FadeIn>
          );
        })}
      </div>
    </div>
  );
}
