"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Gift,
  Leaf,
  Sparkles,
  Star,
  PackageOpen,
  RotateCcw,
  PartyPopper,
} from "lucide-react";
import { toast } from "sonner";
import { currentUser } from "@/data/mockUsers";

// Pool of possible mystery items
const MYSTERY_POOL = [
  { name: "ส่วนลด True Coffee 30 บาท", rarity: "common", color: "text-slate-500", bg: "bg-slate-500/10", credits: 300, emoji: "☕" },
  { name: "ถุงผ้า CU Green", rarity: "common", color: "text-slate-500", bg: "bg-slate-500/10", credits: 500, emoji: "👜" },
  { name: "Avatar: ใบไม้สีเขียว", rarity: "common", color: "text-slate-500", bg: "bg-slate-500/10", credits: 200, emoji: "🍃" },
  { name: "Avatar: หมวก Solar Panel", rarity: "rare", color: "text-blue-500", bg: "bg-blue-500/10", credits: 800, emoji: "🎩" },
  { name: "บัตรเข้า CU Green Day", rarity: "rare", color: "text-blue-500", bg: "bg-blue-500/10", credits: 1000, emoji: "🎟️" },
  { name: "Avatar: ปีก Butterfly", rarity: "epic", color: "text-purple-500", bg: "bg-purple-500/10", credits: 1500, emoji: "🦋" },
  { name: "ส่วนลด 100 บาท ร้านอาหาร Green Zone", rarity: "epic", color: "text-purple-500", bg: "bg-purple-500/10", credits: 1200, emoji: "🌿" },
  { name: "🏆 Grand Prize: ทริป Eco Tour", rarity: "legendary", color: "text-yellow-500", bg: "bg-yellow-500/10", credits: 5000, emoji: "🌍" },
];

const RARITY_LABELS: Record<string, string> = {
  common: "ธรรมดา",
  rare: "หายาก",
  epic: "พิเศษ",
  legendary: "ตำนาน",
};

const RARITY_WEIGHTS: Record<string, number> = {
  common: 55,
  rare: 30,
  epic: 13,
  legendary: 2,
};

function getWeightedRandom() {
  const weightedPool = MYSTERY_POOL.flatMap((item) =>
    Array(RARITY_WEIGHTS[item.rarity]).fill(item)
  );
  return weightedPool[Math.floor(Math.random() * weightedPool.length)];
}

const MYSTERY_BOX_COST = 1000;

interface MysteryBoxProps {
  userCredits?: number;
}

export function MysteryBox({ userCredits = currentUser.greenCredits }: MysteryBoxProps) {
  const [phase, setPhase] = useState<"idle" | "shaking" | "opening" | "revealed">("idle");
  const [prize, setPrize] = useState<(typeof MYSTERY_POOL)[0] | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const canAfford = userCredits >= MYSTERY_BOX_COST;

  function handleOpen() {
    if (!canAfford) return;
    setIsDialogOpen(true);
    setPhase("shaking");

    setTimeout(() => {
      setPhase("opening");
      setTimeout(() => {
        const result = getWeightedRandom();
        setPrize(result);
        setPhase("revealed");
        if (result.rarity === "legendary") {
          toast.success("🎉 Legendary! คุณโชคดีมาก!", { duration: 6000 });
        }
      }, 800);
    }, 1200);
  }

  function handleReset() {
    setPhase("idle");
    setPrize(null);
    setIsDialogOpen(false);
  }

  return (
    <>
      {/* Mystery Box Card */}
      <div
        className={`relative flex flex-col items-center justify-center p-8 rounded-2xl border-2 cursor-pointer transition-all duration-300 group
          ${canAfford
            ? "border-amber-400/50 bg-gradient-to-b from-amber-500/10 to-orange-500/5 hover:border-amber-400 hover:shadow-lg hover:shadow-amber-500/10"
            : "border-border/30 bg-muted/30 opacity-60 cursor-not-allowed"
          }`}
        onClick={canAfford ? handleOpen : undefined}
      >
        {/* Sparkles */}
        {canAfford && (
          <>
            <Sparkles className="absolute top-3 right-3 h-4 w-4 text-amber-400 animate-pulse" />
            <Star className="absolute top-4 left-4 h-3 w-3 text-amber-300 animate-pulse" style={{ animationDelay: "0.5s" }} />
            <Sparkles className="absolute bottom-4 left-5 h-3 w-3 text-orange-400 animate-pulse" style={{ animationDelay: "1s" }} />
          </>
        )}

        <div className="relative mb-4">
          <div className={`h-24 w-24 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg
            ${canAfford ? "group-hover:scale-110 transition-transform duration-300" : ""}`}>
            <Gift className="h-12 w-12 text-white" />
          </div>
          <Badge className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-amber-500 hover:bg-amber-500 text-white text-[10px] px-2 whitespace-nowrap">
            สุ่มรับของรางวัล
          </Badge>
        </div>

        <h3 className="font-bold text-lg mt-3">Green Capsule</h3>
        <p className="text-sm text-muted-foreground text-center mt-1 max-w-[180px]">
          สุ่มรับของรางวัลสุดพิเศษ มีโอกาสได้รางวัล Legendary!
        </p>

        <div className="mt-4 flex items-center gap-1.5 text-sm font-bold text-amber-600 dark:text-amber-400">
          <Leaf className="h-4 w-4" />
          {MYSTERY_BOX_COST.toLocaleString()} Credits
        </div>

        <Button
          className="mt-4 w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0"
          disabled={!canAfford}
          onClick={(e) => { e.stopPropagation(); handleOpen(); }}
        >
          <Gift className="mr-2 h-4 w-4" />
          {canAfford ? "เปิดกล่องสุ่ม!" : "Credits ไม่พอ"}
        </Button>
      </div>

      {/* Opening Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => !open && handleReset()}>
        <DialogContent className="sm:max-w-md text-center overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">Green Capsule</DialogTitle>
            <DialogDescription className="text-center">
              ใช้ {MYSTERY_BOX_COST} Green Credits
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center justify-center py-6 gap-6 min-h-[260px]">
            {/* SHAKING phase */}
            {phase === "shaking" && (
              <div className="flex flex-col items-center gap-4">
                <div
                  className="h-32 w-32 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-xl"
                  style={{
                    animation: "shake 0.4s ease-in-out infinite",
                  }}
                >
                  <Gift className="h-16 w-16 text-white" />
                </div>
                <p className="text-muted-foreground text-sm animate-pulse">กำลังสุ่มของรางวัล...</p>
                <style>{`
                  @keyframes shake {
                    0%, 100% { transform: rotate(-6deg) scale(1.05); }
                    25% { transform: rotate(6deg) scale(1.1); }
                    50% { transform: rotate(-4deg) scale(1.05); }
                    75% { transform: rotate(4deg) scale(1.1); }
                  }
                `}</style>
              </div>
            )}

            {/* OPENING phase */}
            {phase === "opening" && (
              <div className="flex flex-col items-center gap-4">
                <div
                  className="h-32 w-32 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-xl"
                  style={{ animation: "pop 0.6s cubic-bezier(0.36, 0.07, 0.19, 0.97) forwards" }}
                >
                  <PackageOpen className="h-16 w-16 text-white animate-bounce" />
                </div>
                <style>{`
                  @keyframes pop {
                    0% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.3); opacity: 0.8; }
                    100% { transform: scale(0); opacity: 0; }
                  }
                `}</style>
              </div>
            )}

            {/* REVEALED phase */}
            {phase === "revealed" && prize && (
              <div
                className="flex flex-col items-center gap-4 w-full animate-in zoom-in-75 duration-500"
              >
                {prize.rarity === "legendary" && (
                  <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {[...Array(12)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute text-2xl"
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                          animation: `fall ${1 + Math.random()}s ease-in forwards`,
                          animationDelay: `${Math.random() * 0.5}s`,
                        }}
                      >
                        {["🎉", "⭐", "✨", "🎊"][Math.floor(Math.random() * 4)]}
                      </div>
                    ))}
                  </div>
                )}

                <div className={`h-24 w-24 rounded-2xl ${prize.bg} flex items-center justify-center text-5xl shadow-lg ring-4 ${
                  prize.rarity === "legendary" ? "ring-yellow-400/50 animate-pulse" :
                  prize.rarity === "epic" ? "ring-purple-400/30" :
                  prize.rarity === "rare" ? "ring-blue-400/30" : "ring-border"
                }`}>
                  {prize.emoji}
                </div>

                <div className="space-y-1 text-center">
                  <Badge
                    className={`${prize.bg} ${prize.color} border-0 font-bold uppercase text-xs tracking-wider`}
                  >
                    {RARITY_LABELS[prize.rarity]}
                  </Badge>
                  <h3 className="font-bold text-xl mt-2">{prize.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    มูลค่าประมาณ{" "}
                    <span className="text-primary font-bold">
                      {prize.credits.toLocaleString()} Credits
                    </span>
                  </p>
                </div>

                <div className="flex gap-3 w-full pt-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={handleReset}
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    ปิด
                  </Button>
                  {canAfford && (
                    <Button
                      className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0"
                      onClick={() => {
                        setPhase("idle");
                        setPrize(null);
                        setTimeout(handleOpen, 100);
                      }}
                    >
                      <PartyPopper className="mr-2 h-4 w-4" />
                      เปิดอีกครั้ง!
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
