"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Leaf, Gift, Trophy, Bike, ArrowRight, Check } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import confetti from "canvas-confetti";

const slides = [
  {
    id: "welcome",
    icon: Leaf,
    color: "text-emerald-500",
    bg: "bg-emerald-100",
    title: { th: "ยินดีต้อนรับสู่ CU GreenVerse", en: "Welcome to CU GreenVerse" },
    desc: {
      th: "เปลี่ยนทุกการกระทำเพื่อโลก ให้กลายเป็นรางวัลที่จับต้องได้ สะสม Green Credits และช่วยจุฬาฯ ลดคาร์บอน",
      en: "Turn your eco-friendly actions into real rewards. Earn Green Credits and help Chula reduce carbon footprint.",
    },
  },
  {
    id: "actions",
    icon: Bike,
    color: "text-blue-500",
    bg: "bg-blue-100",
    title: { th: "ทำกิจกรรมเพื่อรับแต้ม", en: "Log Actions to Earn Points" },
    desc: {
      th: "ใช้ POP-BUS, ปั่น Anywheel, พกแก้วน้ำมาเอง หรือแยกขยะ ทุกกิจกรรมมีค่า! สแกน QR Code เพื่อรับแต้มทันที",
      en: "Take POP-BUS, ride Anywheel, bring your own cup, or separate waste. Every action counts! Scan QR to earn points.",
    },
  },
  {
    id: "rewards",
    icon: Gift,
    color: "text-amber-500",
    bg: "bg-amber-100",
    title: { th: "แลกของรางวัลสุดพิเศษ", en: "Redeem Exclusive Rewards" },
    desc: {
      th: "นำ Green Credits ไปแลกส่วนลด True Coffee, ของที่ระลึกจาก CU, หรือร่วมกิจกรรมพิเศษเฉพาะชาวรักษ์โลก",
      en: "Use Green Credits to redeem True Coffee discounts, CU merchandise, or join exclusive eco-friendly events.",
    },
  },
  {
    id: "leaderboard",
    icon: Trophy,
    color: "text-purple-500",
    bg: "bg-purple-100",
    title: { th: "แข่งขันกับเพื่อนๆ", en: "Compete with Friends" },
    desc: {
      th: "คณะไหนจะช่วยโลกได้มากที่สุด? สะสมคะแนนให้คณะของคุณและไต่ขึ้นอันดับหนึ่งใน Leaderboard",
      en: "Which faculty will save the most carbon? Earn points for your faculty and climb the Leaderboard.",
    },
  },
];

export function OnboardingModal() {
  const { lang } = useLang();
  const [isOpen, setIsOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    // Check if user has seen onboarding
    const hasSeen = localStorage.getItem("cu_greenverse_onboarding");
    if (!hasSeen) {
      setIsOpen(true);
    }
  }, []);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    localStorage.setItem("cu_greenverse_onboarding", "true");
    setIsOpen(false);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10b981', '#3b82f6', '#f59e0b'],
      zIndex: 1000
    });
  };

  if (!isOpen) return null;

  const slide = slides[currentSlide];
  const Icon = slide.icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Progress bar */}
            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 flex">
              {slides.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`flex-1 h-full transition-colors duration-300 ${idx <= currentSlide ? 'bg-primary' : ''}`}
                />
              ))}
            </div>

            <div className="p-8 flex flex-col items-center text-center flex-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col items-center w-full"
                >
                  <div className={`w-24 h-24 rounded-full ${slide.bg} dark:bg-opacity-20 flex items-center justify-center mb-6`}>
                    <Icon className={`w-12 h-12 ${slide.color}`} />
                  </div>
                  
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                    {slide.title[lang as keyof typeof slide.title]}
                  </h2>
                  
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {slide.desc[lang as keyof typeof slide.desc]}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="p-6 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
              <div className="flex gap-1.5">
                {slides.map((_, idx) => (
                  <div 
                    key={idx} 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      idx === currentSlide ? "w-6 bg-primary" : "w-2 bg-slate-300 dark:bg-slate-600"
                    }`}
                  />
                ))}
              </div>

              <div className="flex gap-2">
                {currentSlide < slides.length - 1 ? (
                  <>
                    <Button variant="ghost" className="text-slate-500" onClick={handleComplete}>
                      {lang === "th" ? "ข้าม" : "Skip"}
                    </Button>
                    <Button onClick={handleNext} className="rounded-full px-6 gap-2 shadow-md">
                      {lang === "th" ? "ถัดไป" : "Next"}
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </>
                ) : (
                  <Button onClick={handleNext} className="rounded-full px-8 gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/30">
                    {lang === "th" ? "เริ่มต้นเลย!" : "Get Started!"}
                    <Check className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
