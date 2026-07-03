"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  subtitle?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  className?: string;
  accentColor?: "green" | "blue" | "amber" | "purple" | "orange";
}

const accentMap = {
  green:  { bg: "from-emerald-500/10 to-emerald-500/5", iconBg: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400", border: "group-hover:border-emerald-500/40" },
  blue:   { bg: "from-blue-500/10 to-blue-500/5",       iconBg: "bg-blue-500/15 text-blue-600 dark:text-blue-400",         border: "group-hover:border-blue-500/40" },
  amber:  { bg: "from-amber-500/10 to-amber-500/5",     iconBg: "bg-amber-500/15 text-amber-600 dark:text-amber-400",       border: "group-hover:border-amber-500/40" },
  purple: { bg: "from-purple-500/10 to-purple-500/5",   iconBg: "bg-purple-500/15 text-purple-600 dark:text-purple-400",   border: "group-hover:border-purple-500/40" },
  orange: { bg: "from-orange-500/10 to-orange-500/5",   iconBg: "bg-orange-500/15 text-orange-600 dark:text-orange-400",   border: "group-hover:border-orange-500/40" },
};

export function DashboardCard({
  title,
  value,
  icon,
  subtitle,
  trend,
  trendValue,
  className,
  accentColor = "green",
}: DashboardCardProps) {
  const accent = accentMap[accentColor];

  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const trendColor = trend === "up" ? "text-emerald-500" : trend === "down" ? "text-destructive" : "text-muted-foreground";

  return (
    <div
      className={cn(
        "group relative rounded-2xl border border-border/60 bg-card overflow-hidden",
        "transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 cursor-default",
        accent.border,
        className
      )}
    >
      {/* Gradient bg decoration */}
      <div className={cn("absolute inset-0 bg-gradient-to-br opacity-60", accent.bg)} />

      <div className="relative p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate mb-0.5">{title}</p>
            <p className="text-2xl sm:text-3xl font-bold tracking-tight mt-1 tabular-nums">{value}</p>
          </div>
          <div className={cn("h-10 w-10 sm:h-11 sm:w-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110", accent.iconBg)}>
            {icon}
          </div>
        </div>

        {(subtitle || trendValue) && (
          <div className="mt-3 flex items-center gap-1.5">
            {trendValue && (
              <span className={cn("flex items-center gap-0.5 text-xs font-semibold", trendColor)}>
                <TrendIcon className="h-3 w-3" />
                {trend === "up" ? "+" : trend === "down" ? "-" : ""}{trendValue}
              </span>
            )}
            {subtitle && <span className="text-xs text-muted-foreground">{subtitle}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
