"use client"

import React from "react";
import { motion } from "framer-motion";
import {
  Edit3,
  Code,
  Shield,
  Award,
  Zap,
  MessageSquare,
  Heart,
  ExternalLink,
  LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TimelineEvent {
  id: number;
  timestamp: string;
  type: "post" | "comment" | "like" | "transaction" | "deploy" | "ctf" | "article";
  title: string;
  description: string;
  xp: number;
  icon: LucideIcon;
}

interface TimelineProps {
  events: TimelineEvent[];
}

const typeColors: Record<string, string> = {
  post: "bg-blue-100 text-blue-800",
  comment: "bg-green-100 text-green-800",
  like: "bg-pink-100 text-pink-800",
  transaction: "bg-purple-100 text-purple-800",
  deploy: "bg-orange-100 text-orange-800",
  ctf: "bg-red-100 text-red-800",
  article: "bg-yellow-100 text-yellow-800",
};

export default function Timeline({ events }: TimelineProps) {
  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-200" />

      <div className="space-y-6">
        {events.map((event, index) => {
          const Icon = event.icon;
          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative flex gap-4"
            >
              {/* Icon */}
              <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white border-2 border-slate-200 shadow-sm">
                <Icon className="h-5 w-5 text-slate-600" />
              </div>

              {/* Content */}
              <div className="flex-1 pb-8">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-slate-900">{event.title}</h4>
                      <Badge
                        variant="secondary"
                        className={cn("text-xs", typeColors[event.type] || "bg-slate-100")}
                      >
                        {event.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600 mb-2">{event.description}</p>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span>{event.timestamp}</span>
                      <span className="flex items-center gap-1">
                        <Zap className="h-3 w-3 text-yellow-500" />
                        +{event.xp} XP
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

