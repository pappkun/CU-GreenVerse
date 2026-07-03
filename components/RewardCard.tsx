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

const categoryIconMap: Record<string, React.ComponentType<{className?: string}>> = {
  voucher: Star,
  physical: Package,
  digital: Zap,
  event: Gift,
};

const categoryColors: Record<string, { bg: string; text: string; cardGlow: string }> = {
  voucher:  { bg: "from-amber-500/20 to-amber-500/5",  text: "text-amber-600 dark:text-amber-400",  cardGlow: "group-hover:shadow-amber-500/10" },
  physical: { bg: "from-blue-500/20 to-blue-500/5",    text: "text-blue-600 dark:text-blue-400",    cardGlow: "group-hover:shadow-blue-500/10" },
  digital:  { bg: "from-purple-500/20 to-purple-500/5",text: "text-purple-600 dark:text-purple-400",cardGlow: "group-hover:shadow-purple-500/10" },
  event:    { bg: "from-emerald-500/20 to-emerald-500/5",text: "text-emerald-600 dark:text-emerald-400",cardGlow: "group-hover:shadow-emerald-500/10" },
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
        "group relative flex flex-col rounded-2xl border border-border/60 bg-card overflow-hidden",
        "transition-all duration-300 hover:shadow-xl hover:-translate-y-1",
        isOutOfStock && "opacity-60",
        colors.cardGlow
      )}
    >
      {/* Image / Illustration Area */}
      <div className={cn("relative h-40 sm:h-44 w-full bg-gradient-to-br flex items-center justify-center overflow-hidden", colors.bg)}>
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "radial-gradient(circle at 50% 120%, currentColor 0%, transparent 60%)",
          }}
        />
        <CatIcon className={cn("h-16 w-16 opacity-30 transition-transform duration-500 group-hover:scale-110 group-hover:opacity-50", colors.text)} />

        {/* Top badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
          <Badge
            variant="secondary"
            className="text-[10px] font-bold uppercase tracking-wider bg-background/80 backdrop-blur-sm border-0 shadow-sm"
          >
            {reward.category}
          </Badge>
          {isOutOfStock ? (
            <Badge variant="destructive" className="text-[10px] font-bold">
              {lang === "th" ? "หมดแล้ว" : "Out of Stock"}
            </Badge>
          ) : (
            <Badge variant="outline" className="text-[10px] font-bold bg-background/80 backdrop-blur-sm border-0 shadow-sm">
              {lang === "th" ? `เหลือ ${reward.stock}` : `${reward.stock} left`}
            </Badge>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 gap-2.5">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-base leading-snug line-clamp-2">{reward.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1 leading-relaxed">{reward.description}</p>
        </div>

        {/* Cost row */}
        <div className="flex items-center justify-between pt-2 border-t border-border/40 mt-auto">
          <div className={cn("flex items-center gap-1.5 font-bold text-sm", canAfford ? "text-primary" : "text-muted-foreground")}>
            <Leaf className="h-4 w-4 flex-shrink-0" />
            <span>{reward.cost.toLocaleString()} {lang === "th" ? "เครดิต" : "Credits"}</span>
          </div>
          {!canAfford && !isOutOfStock && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Lock className="h-3 w-3" />
              <span>{lang === "th" ? "ไม่พอ" : "Low"}</span>
            </div>
          )}
        </div>

        {/* CTA */}
        <Button
          className={cn(
            "w-full h-10 rounded-xl font-semibold text-sm mt-1",
            "transition-all duration-300",
            canAfford && !isOutOfStock
              ? "group-hover:shadow-md group-hover:shadow-primary/20 group-hover:scale-[1.02]"
              : ""
          )}
          variant={canAfford && !isOutOfStock ? "default" : "secondary"}
          disabled={!canAfford || isOutOfStock}
        >
          {isOutOfStock
            ? (lang === "th" ? "สินค้าหมด" : "Out of Stock")
            : canAfford
              ? (lang === "th" ? "แลกเลย" : "Redeem Now")
              : (lang === "th" ? "Credits ไม่พอ" : "Not Enough Credits")
          }
        </Button>
      </div>
    </div>
  );
}
