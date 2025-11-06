"use client"

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Activity {
  date: string;
  count: number;
  type: "post" | "comment" | "like" | "transaction" | "deploy" | "ctf";
}

interface ActivityCalendarProps {
  activities: Activity[];
  selectedDate: string | null;
  onDateSelect: (date: string | null) => void;
}

export default function ActivityCalendar({
  activities,
  selectedDate,
  onDateSelect,
}: ActivityCalendarProps) {
  // Generate last 365 days
  const days = useMemo(() => {
    const result = [];
    const today = new Date();
    for (let i = 364; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      result.push(date);
    }
    return result;
  }, []);

  // Create activity map
  const activityMap = useMemo(() => {
    const map = new Map<string, Activity>();
    activities.forEach((activity) => {
      map.set(activity.date, activity);
    });
    return map;
  }, [activities]);

  // Get intensity level (0-4)
  const getIntensity = (count: number): number => {
    if (count === 0) return 0;
    if (count <= 2) return 1;
    if (count <= 5) return 2;
    if (count <= 8) return 3;
    return 4;
  };

  // Get color based on intensity
  const getColor = (intensity: number): string => {
    const colors = [
      "bg-slate-100", // 0
      "bg-green-200", // 1
      "bg-green-300", // 2
      "bg-green-400", // 3
      "bg-green-500", // 4
    ];
    return colors[intensity];
  };

  // Group days by weeks
  const weeks = useMemo(() => {
    const result: Date[][] = [];
    let currentWeek: Date[] = [];
    
    days.forEach((day, index) => {
      if (index % 7 === 0 && currentWeek.length > 0) {
        result.push(currentWeek);
        currentWeek = [];
      }
      currentWeek.push(day);
    });
    if (currentWeek.length > 0) {
      result.push(currentWeek);
    }
    return result;
  }, [days]);

  const formatDate = (date: Date): string => {
    return date.toISOString().split("T")[0];
  };

  const getDayLabel = (day: number): string => {
    const labels = ["일", "월", "화", "수", "목", "금", "토"];
    return labels[day];
  };

  return (
    <div className="space-y-4">
      {/* Legend */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-600">활동량</span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">적음</span>
          <div className="flex gap-1">
            {[0, 1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className={cn("h-3 w-3 rounded", getColor(level))}
              />
            ))}
          </div>
          <span className="text-xs text-slate-500">많음</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          <div className="flex gap-1">
            {/* Day labels */}
            <div className="flex flex-col gap-1 pr-2">
              {["일", "월", "화", "수", "목", "금", "토"].map((day, idx) => (
                <div
                  key={day}
                  className="h-3 text-xs text-slate-500 text-center"
                  style={{ marginTop: idx === 0 ? "0" : "0" }}
                >
                  {idx % 2 === 0 ? day : ""}
                </div>
              ))}
            </div>

            {/* Weeks */}
            <div className="flex gap-1">
              {weeks.map((week, weekIdx) => (
                <div key={weekIdx} className="flex flex-col gap-1">
                  {week.map((day, dayIdx) => {
                    const dateStr = formatDate(day);
                    const activity = activityMap.get(dateStr);
                    const intensity = getIntensity(activity?.count || 0);
                    const isSelected = selectedDate === dateStr;

                    return (
                      <motion.div
                        key={dateStr}
                        className={cn(
                          "h-3 w-3 rounded cursor-pointer transition-all",
                          getColor(intensity),
                          isSelected && "ring-2 ring-blue-500 ring-offset-1",
                          intensity > 0 && "hover:ring-2 hover:ring-slate-400"
                        )}
                        whileHover={{ scale: 1.2 }}
                        onClick={() => onDateSelect(isSelected ? null : dateStr)}
                        title={`${dateStr}: ${activity?.count || 0}개 활동`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Selected Date Info */}
      {selectedDate && activityMap.has(selectedDate) && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-slate-50 rounded-lg border"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{selectedDate}</p>
              <p className="text-sm text-slate-600">
                {activityMap.get(selectedDate)?.count || 0}개의 활동
              </p>
            </div>
            <button
              onClick={() => onDateSelect(null)}
              className="text-sm text-slate-500 hover:text-slate-700"
            >
              닫기
            </button>
          </div>
        </motion.div>
      )}

      {/* Month labels */}
      <div className="flex gap-1 pl-8">
        {Array.from({ length: 12 }).map((_, monthIdx) => {
          const monthDate = new Date();
          monthDate.setMonth(monthIdx);
          const monthName = monthDate.toLocaleDateString("ko-KR", { month: "short" });
          return (
            <div
              key={monthIdx}
              className="text-xs text-slate-500"
              style={{ width: `${(365 / 12) * 3}px` }}
            >
              {monthName}
            </div>
          );
        })}
      </div>
    </div>
  );
}

