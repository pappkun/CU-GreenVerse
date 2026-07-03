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
  green: {
    iconBg: "bg-emerald-100 text-emerald-700",
    ring: "ring-emerald-200/70",
  },
  blue: { iconBg: "bg-sky-100 text-sky-700", ring: "ring-sky-200/70" },
  amber: { iconBg: "bg-amber-100 text-amber-700", ring: "ring-amber-200/70" },
  purple: {
    iconBg: "bg-violet-100 text-violet-700",
    ring: "ring-violet-200/70",
  },
  orange: {
    iconBg: "bg-orange-100 text-orange-700",
    ring: "ring-orange-200/70",
  },
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

  const TrendIcon =
    trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const trendColor =
    trend === "up"
      ? "text-emerald-600"
      : trend === "down"
        ? "text-destructive"
        : "text-slate-500";

  return (
    <div
      className={cn(
        "group relative rounded-[2rem] border border-slate-200 bg-white shadow-[0_20px_50px_-30px_rgba(15,23,42,0.18)] overflow-hidden",
        "transition-all duration-300 hover:-translate-y-1",
        className,
      )}
    >
      <div className="absolute -right-10 top-6 h-24 w-24 rounded-full bg-slate-100 opacity-90 blur-2xl pointer-events-none" />
      <div className="absolute -left-8 bottom-8 h-28 w-28 rounded-full bg-emerald-100/70 opacity-70 blur-2xl pointer-events-none" />

      <div className="relative p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.18em] text-slate-500 truncate mb-1">
              {title}
            </p>
            <p className="text-2xl sm:text-3xl font-semibold tracking-tight mt-1 tabular-nums text-slate-900">
              {value}
            </p>
          </div>
          <div
            className={cn(
              "h-12 w-12 rounded-[1.25rem] flex items-center justify-center flex-shrink-0 ring-1",
              accent.iconBg,
              accent.ring,
            )}
          >
            {icon}
          </div>
        </div>

        {(subtitle || trendValue) && (
          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
            {trendValue && (
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold",
                  trendColor,
                )}
              >
                <TrendIcon className="h-3.5 w-3.5" />
                {trend === "up" ? "+" : trend === "down" ? "-" : ""}
                {trendValue}
              </span>
            )}
            {subtitle && (
              <span className="text-sm text-slate-600">{subtitle}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
