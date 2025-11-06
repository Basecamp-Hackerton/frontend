"use client"

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Award, Lock, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface NFTBadge {
  id: number;
  name: string;
  description: string;
  image: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  earned: boolean;
  claimable?: boolean;
  date?: string;
}

interface NFTBadgesProps {
  badges: NFTBadge[];
}

const rarityColors: Record<string, { bg: string; border: string; text: string }> = {
  common: {
    bg: "bg-slate-100",
    border: "border-slate-300",
    text: "text-slate-700",
  },
  rare: {
    bg: "bg-blue-100",
    border: "border-blue-400",
    text: "text-blue-700",
  },
  epic: {
    bg: "bg-purple-100",
    border: "border-purple-400",
    text: "text-purple-700",
  },
  legendary: {
    bg: "bg-yellow-100",
    border: "border-yellow-400",
    text: "text-yellow-700",
  },
};

export default function NFTBadges({ badges }: NFTBadgesProps) {
  const earnedBadges = badges.filter((b) => b.earned);
  const claimableBadges = badges.filter((b) => b.claimable);
  const lockedBadges = badges.filter((b) => !b.earned && !b.claimable);

  return (
    <div className="space-y-6">
      {/* Claimable Badges */}
      {claimableBadges.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-500" />
            획득 가능한 배지
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {claimableBadges.map((badge) => (
              <motion.div
                key={badge.id}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.05 }}
                className="relative"
              >
                <Card className={cn("border-2 border-dashed", rarityColors[badge.rarity].border)}>
                  <CardContent className="p-4 text-center">
                    <div className="text-4xl mb-2">{badge.image}</div>
                    <h4 className="font-semibold text-sm mb-1">{badge.name}</h4>
                    <p className="text-xs text-slate-600 mb-3">{badge.description}</p>
                    <Button size="sm" className="w-full">
                      <Award className="h-3 w-3 mr-1" />
                      획득하기
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Earned Badges */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Award className="h-5 w-5 text-green-500" />
          획득한 배지 ({earnedBadges.length})
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {earnedBadges.map((badge, index) => (
            <motion.div
              key={badge.id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <Card className={cn("border-2", rarityColors[badge.rarity].border)}>
                <CardContent className="p-4 text-center">
                  <div className="text-4xl mb-2">{badge.image}</div>
                  <h4 className="font-semibold text-sm mb-1">{badge.name}</h4>
                  <p className="text-xs text-slate-600 mb-2">{badge.description}</p>
                  {badge.date && (
                    <p className="text-xs text-slate-500">{badge.date}</p>
                  )}
                  <Badge
                    variant="secondary"
                    className={cn("mt-2 text-xs", rarityColors[badge.rarity].text)}
                  >
                    {badge.rarity}
                  </Badge>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Locked Badges */}
      {lockedBadges.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Lock className="h-5 w-5 text-slate-400" />
            잠금 해제 대기 중 ({lockedBadges.length})
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {lockedBadges.map((badge, index) => (
              <motion.div
                key={badge.id}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="opacity-50"
              >
                <Card className="border-2 border-slate-200">
                  <CardContent className="p-4 text-center relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Lock className="h-8 w-8 text-slate-300" />
                    </div>
                    <div className="text-4xl mb-2 opacity-30">{badge.image}</div>
                    <h4 className="font-semibold text-sm mb-1 text-slate-400">{badge.name}</h4>
                    <p className="text-xs text-slate-400 mb-2">{badge.description}</p>
                    <Badge variant="secondary" className="mt-2 text-xs text-slate-400">
                      {badge.rarity}
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

