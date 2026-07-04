"use client";

import { ActivityType } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Footprints, Bike, TrainFront, Recycle, Coffee, Users, Leaf, ArrowRight, Zap } from "lucide-react";
import Link from "next/link";
import { useLang } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ComponentType<{className?: string}>> = {
  Footprints, Bike, TrainFront, Recycle, Coffee, Users, Leaf,
};

const categoryColors: Record<string, { bg: string; text: string; border: string; glow: string }> = {
  transport:  { bg: "bg-blue-500/10",   text: "text-blue-600 dark:text-blue-400",   border: "group-hover:border-blue-500/40",   glow: "group-hover:shadow-blue-500/10" },
  waste:      { bg: "bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400", border: "group-hover:border-emerald-500/40", glow: "group-hover:shadow-emerald-500/10" },
  energy:     { bg: "bg-amber-500/10",  text: "text-amber-600 dark:text-amber-400",  border: "group-hover:border-amber-500/40",   glow: "group-hover:shadow-amber-500/10" },
  food:       { bg: "bg-orange-500/10", text: "text-orange-600 dark:text-orange-400", border: "group-hover:border-orange-500/40", glow: "group-hover:shadow-orange-500/10" },
  education:  { bg: "bg-purple-500/10", text: "text-purple-600 dark:text-purple-400", border: "group-hover:border-purple-500/40", glow: "group-hover:shadow-purple-500/10" },
};

const categoryLabels: Record<string, { th: string; en: string }> = {
  transport:  { th: "ขนส่ง",      en: "Transport" },
  waste:      { th: "ขยะ",        en: "Waste" },
  energy:     { th: "พลังงาน",    en: "Energy" },
  food:       { th: "อาหาร",      en: "Food" },
  education:  { th: "การศึกษา",   en: "Education" },
};

interface ActivityCardProps {
  activity: ActivityType;
}

export function ActivityCard({ activity }: ActivityCardProps) {
  const { lang } = useLang();
  const IconComponent = iconMap[activity.icon] || Leaf;
  const colors = categoryColors[activity.category] || categoryColors.waste;
  const catLabel = categoryLabels[activity.category];

  const isAnywheel = activity.title.toLowerCase().includes("anywheel");
  const href = isAnywheel ? `/anywheel?id=${activity.id}` : `/history?activity=${encodeURIComponent(activity.title)}`;

  return (
    <div
      className={cn(
        "group relative flex flex-col rounded-2xl border border-border/60 bg-card overflow-hidden",
        "transition-all duration-300 hover:shadow-xl hover:-translate-y-1",
        colors.border, colors.glow
      )}
    >
      {/* Top color band */}
      <div className={cn("h-1.5 w-full", colors.bg.replace("/10", "").replace("bg-", "bg-gradient-to-r from-") + "/60 to-transparent")} />

      <div className="p-4 sm:p-5 flex-1 flex flex-col gap-3">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div className={cn("h-11 w-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6", colors.bg)}>
            <IconComponent className={cn("h-5 w-5", colors.text)} />
          </div>
          <Badge
            variant="outline"
            className={cn("text-[10px] font-bold uppercase tracking-widest border-0 px-2 py-0.5 rounded-full", colors.bg, colors.text)}
          >
            {catLabel ? (lang === "th" ? catLabel.th : catLabel.en) : activity.category}
          </Badge>
        </div>

        {/* Title & Description */}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-base leading-snug line-clamp-2 mb-1">{activity.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{activity.description}</p>
        </div>

        {/* Rewards row */}
        <div className="flex flex-wrap gap-2 mt-auto pt-2 border-t border-border/40">
          <div className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1.5 rounded-full">
            <Zap className="h-3 w-3" />
            +{activity.points} pts
          </div>
          {activity.carbonReduction > 0 && (
            <div className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2.5 py-1.5 rounded-full">
              <Leaf className="h-3 w-3" />
              -{activity.carbonReduction} kgCO₂
            </div>
          )}
        </div>
      </div>

      {/* Footer CTA */}
      <div className="px-4 sm:px-5 pb-4 sm:pb-5">
        <Link href={href} className="w-full block">
          <Button
            variant="outline"
            className={cn(
              "w-full h-10 rounded-xl font-semibold text-sm",
              "transition-all duration-300",
              "group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary",
              "group-hover:shadow-md group-hover:shadow-primary/20"
            )}
          >
            {lang === "th" 
              ? (isAnywheel ? "เชื่อมต่อ API" : "ดูประวัติแต้ม") 
              : (isAnywheel ? "Connect API" : "View Points History")}
            <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
