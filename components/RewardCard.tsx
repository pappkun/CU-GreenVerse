"use client";

import { Reward } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Leaf, Gift, Package, Star, Zap, Lock } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";

interface RewardCardProps {
  reward: Reward;
  userCredits: number;
}

const categoryIconMap: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  voucher: Star,
  physical: Package,
  digital: Zap,
  event: Gift,
};

const categoryColors: Record<
  string,
  { bg: string; text: string; badge: string }
> = {
  voucher: {
    bg: "from-amber-200/70 to-amber-100",
    text: "text-amber-700",
    badge: "border-amber-200 bg-amber-50 text-amber-700",
  },
  physical: {
    bg: "from-sky-200/70 to-sky-100",
    text: "text-sky-700",
    badge: "border-sky-200 bg-sky-50 text-sky-700",
  },
  digital: {
    bg: "from-violet-200/70 to-violet-100",
    text: "text-violet-700",
    badge: "border-violet-200 bg-violet-50 text-violet-700",
  },
  event: {
    bg: "from-emerald-200/70 to-emerald-100",
    text: "text-emerald-700",
    badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
};

export function RewardCard({ reward, userCredits }: RewardCardProps) {
  const { lang } = useLang();
  const canAfford = userCredits >= reward.cost;
  const isOutOfStock = reward.stock <= 0;
  const colors = categoryColors[reward.category] || categoryColors.digital;
  const CatIcon = categoryIconMap[reward.category] || Gift;

  return (
    <div
      className={cn(
        "group relative flex flex-col rounded-[2rem] border border-slate-200 bg-white overflow-hidden shadow-[0_26px_60px_-40px_rgba(16,185,129,0.18)]",
        "transition-all duration-300 hover:-translate-y-1",
        isOutOfStock && "opacity-70",
      )}
    >
      {/* Image / Illustration Area */}
      <div
        className={cn(
          "relative h-40 sm:h-44 w-full overflow-hidden bg-slate-50",
          colors.bg,
        )}
      >
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.95),transparent_55%),radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.7),transparent_40%)]" />
        <div className="absolute right-4 top-4 h-16 w-16 rounded-full bg-white/80 shadow-sm" />
        <CatIcon
          className={cn(
            "relative h-16 w-16 opacity-70 transition-transform duration-500 group-hover:scale-110",
            colors.text,
          )}
        />

        {/* Top badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
          <Badge
            variant="secondary"
            className={cn(
              "text-[10px] font-semibold uppercase tracking-[0.24em] border border-slate-200 bg-white/95 shadow-sm",
              colors.badge,
            )}
          >
            {reward.category}
          </Badge>
          {isOutOfStock ? (
            <Badge
              variant="destructive"
              className="text-[10px] font-semibold uppercase tracking-[0.24em] bg-white/95 shadow-sm"
            >
              {lang === "th" ? "หมดแล้ว" : "Out of Stock"}
            </Badge>
          ) : (
            <Badge
              variant="secondary"
              className="text-[10px] font-semibold uppercase tracking-[0.24em] border border-slate-200 bg-white/95 shadow-sm"
            >
              {lang === "th" ? `เหลือ ${reward.stock}` : `${reward.stock} left`}
            </Badge>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1 gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-base leading-snug line-clamp-2 text-slate-900">
            {reward.title}
          </h3>
          <p className="text-sm text-slate-600 line-clamp-2 mt-2 leading-relaxed">
            {reward.description}
          </p>
        </div>

        <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-200/80 mt-auto">
          <div
            className={cn(
              "flex items-center gap-1.5 font-semibold text-sm",
              canAfford ? "text-emerald-700" : "text-slate-500",
            )}
          >
            <Leaf className="h-4 w-4 flex-shrink-0" />
            <span>
              {reward.cost.toLocaleString()}{" "}
              {lang === "th" ? "เครดิต" : "Credits"}
            </span>
          </div>
          {!canAfford && !isOutOfStock && (
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <Lock className="h-3.5 w-3.5" />
              <span>{lang === "th" ? "ไม่พอ" : "Low"}</span>
            </div>
          )}
        </div>

        <Button
          className={cn(
            "w-full h-11 rounded-[1.5rem] font-semibold text-sm mt-2 shadow-sm",
            canAfford && !isOutOfStock
              ? "bg-emerald-700 text-white hover:bg-emerald-800"
              : "bg-slate-100 text-slate-600",
          )}
          variant={canAfford && !isOutOfStock ? "default" : "secondary"}
          disabled={!canAfford || isOutOfStock}
        >
          {isOutOfStock
            ? lang === "th"
              ? "สินค้าหมด"
              : "Out of Stock"
            : canAfford
              ? lang === "th"
                ? "แลกเลย"
                : "Redeem Now"
              : lang === "th"
                ? "Credits ไม่พอ"
                : "Not Enough Credits"}
        </Button>
      </div>
    </div>
  );
}
