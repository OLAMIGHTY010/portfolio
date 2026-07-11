"use client";

import { motion } from "framer-motion";
import { Award, ExternalLink, Calendar, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import type { Certificate } from "@/lib/types";

export function CertCard({ certificate }: { certificate: Certificate }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="overflow-hidden border-border card-hover group">
        {/* Image area */}
        {certificate.image_url ? (
          <div className="aspect-[4/3] overflow-hidden bg-muted">
            {certificate.image_url.toLowerCase().includes('.pdf') ? (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5 text-muted-foreground group-hover:bg-primary/10 transition-colors duration-500">
                <FileText className="h-16 w-16 mb-2 opacity-50 group-hover:opacity-80 transition-opacity" />
                <span className="text-sm font-medium tracking-wider uppercase opacity-70 group-hover:opacity-100 transition-opacity">PDF Document</span>
              </div>
            ) : (
              <img
                src={certificate.image_url}
                alt={certificate.name}
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            )}
          </div>
        ) : (
          <div className="aspect-[4/3] bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center">
            <Award className="h-12 w-12 text-primary/30" />
          </div>
        )}

        <CardContent className="p-5">
          <h3 className="text-base font-semibold text-foreground mb-1 line-clamp-2">
            {certificate.name}
          </h3>
          <p className="text-sm text-primary/80 font-medium mb-3">
            {certificate.organization}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Calendar className="h-3 w-3" />
              {formatDate(certificate.date_achieved)}
            </span>
            {certificate.verification_url && (
              <a
                href={certificate.verification_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                Verify
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
