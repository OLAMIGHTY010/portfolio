"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Clock, Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { BlogPost } from "@/lib/types";

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Link href={`/blog/${post.slug}`} className="block group">
        <article className="rounded-2xl border border-border bg-card overflow-hidden transition-shadow duration-300 hover:shadow-lg hover:shadow-primary/5">
          {/* Cover image */}
          {post.cover_image_url ? (
            <div className="aspect-video overflow-hidden bg-muted">
              <img
                src={post.cover_image_url}
                alt={post.title}
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </div>
          ) : (
            <div className="aspect-video bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10 flex items-center justify-center">
              <div className="text-5xl font-bold text-primary/15">
                {post.title.charAt(0)}
              </div>
            </div>
          )}

          <div className="p-6">
            {/* Meta */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3 w-3" />
                {formatDate(post.created_at)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-3 w-3" />
                {post.reading_time} min read
              </span>
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-2 line-clamp-2">
              {post.title}
            </h3>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed mb-4">
                {post.excerpt}
              </p>
            )}

            {/* Read more */}
            <span className="text-sm font-medium text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
              Read article
              <ArrowUpRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}
