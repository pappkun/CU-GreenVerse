"use client";

import { useState } from "react";
import { useLang } from "@/context/LanguageContext";
import { useSearchParams } from "next/navigation";
import { currentUser } from "@/data/mockUsers";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Leaf,
  Trophy,
  Zap,
  Recycle,
  Star,
  Share2,
  Lock,
  CheckCircle2,
  Bike,
  TrainFront,
  Coffee,
  Users,
  BookOpen,
  Award,
  Target,
  TrendingUp,
  Calendar,
  Footprints,
} from "lucide-react";
import { toast } from "sonner";

// --- Avatar Tier System (ตามเอกสาร) ---
const AVATAR_TIERS = [
  { id: "seed",    label: "Seed Starter",    emoji: "🌱", minCredits: 0,     color: "text-slate-500",  bg: "bg-slate-500/10",  ring: "ring-slate-400/30" },
  { id: "eco",     label: "Eco Explorer",    emoji: "🌿", minCredits: 500,   color: "text-emerald-600", bg: "bg-emerald-500/10", ring: "ring-emerald-400/40" },
  { id: "energy",  label: "Energy Saver",    emoji: "⚡", minCredits: 1200,  color: "text-blue-600",   bg: "bg-blue-500/10",   ring: "ring-blue-400/40" },
  { id: "carbon",  label: "Carbon Champion", emoji: "🏆", minCredits: 2000,  color: "text-purple-600", bg: "bg-purple-500/10", ring: "ring-purple-400/40" },
  { id: "guardian",label: "Green Guardian",  emoji: "🌍", minCredits: 5000,  color: "text-amber-500",  bg: "bg-amber-500/10",  ring: "ring-amber-400/50" },
];

// --- Badge Definitions ---
const ALL_BADGES = [
  { id: "first_action",  emoji: "🌱", label: "First Step",       desc: "ทำกิจกรรมรักษ์โลกครั้งแรก",   earned: true },
  { id: "walker",        emoji: "🚶", label: "Urban Walker",     desc: "เดินเท้าสะสม 10 ครั้ง",          earned: true },
  { id: "cyclist",       emoji: "🚴", label: "Campus Cyclist",   desc: "ปั่นจักรยานสะสม 5 ครั้ง",        earned: true },
  { id: "recycler",      emoji: "♻️", label: "Recycler",         desc: "แยกขยะสะสม 20 ครั้ง",            earned: true },
  { id: "top10",         emoji: "🏅", label: "Top 10%",          desc: "ติดอันดับ Top 10% ของมหาวิทยาลัย", earned: true },
  { id: "carbon100",     emoji: "💚", label: "Carbon Saver",     desc: "ลดคาร์บอนได้ 100 kgCO₂",         earned: true },
  { id: "event10",       emoji: "🎟️", label: "Event Goer",       desc: "เข้าร่วมกิจกรรม 10 ครั้ง",       earned: false },
  { id: "streak30",      emoji: "🔥", label: "30-Day Streak",    desc: "ทำกิจกรรมติดต่อกัน 30 วัน",     earned: false },
  { id: "champion",      emoji: "🏆", label: "Carbon Champion",  desc: "ถึงระดับ Carbon Champion",        earned: false },
  { id: "guardian",      emoji: "🌍", label: "Green Guardian",   desc: "ถึงระดับ Green Guardian",         earned: false },
  { id: "mystery",       emoji: "🎁", label: "Lucky Box",        desc: "ได้รับ Legendary จาก Mystery Box", earned: false },
  { id: "faculty1",      emoji: "🥇", label: "Faculty #1",       desc: "คณะของคุณอยู่อันดับ 1",           earned: false },
];

// --- Activity History ---
const ACTIVITY_HISTORY = [
  { date: "3 ก.ค. 2567",  action: "เดินเท้าเข้ามหาวิทยาลัย",     points: 50,  carbon: 0.5,  icon: Footprints },
  { date: "3 ก.ค. 2567",  action: "ปั่นจักรยาน",                  points: 80,  carbon: 1.2,  icon: Bike },
  { date: "2 ก.ค. 2567",  action: "ใช้รถ MRT/BTS",                points: 60,  carbon: 1.0,  icon: TrainFront },
  { date: "2 ก.ค. 2567",  action: "แยกขยะพลาสติก (AI Verified)", points: 30,  carbon: 0.2,  icon: Recycle },
  { date: "1 ก.ค. 2567",  action: "พกแก้วส่วนตัว",                points: 40,  carbon: 0.1,  icon: Coffee },
  { date: "30 มิ.ย. 2567", action: "เข้าร่วมกิจกรรม Green Day",    points: 200, carbon: 0.0,  icon: Users },
  { date: "29 มิ.ย. 2567", action: "เรียนบทเรียน Zero Waste",      points: 100, carbon: 0.0,  icon: BookOpen },
];

function getCurrentTier(credits: number) {
  return [...AVATAR_TIERS].reverse().find((t) => credits >= t.minCredits) || AVATAR_TIERS[0];
}

function getNextTier(credits: number) {
  return AVATAR_TIERS.find((t) => credits < t.minCredits) || null;
}

function getTierProgress(credits: number) {
  const current = getCurrentTier(credits);
  const next = getNextTier(credits);
  if (!next) return 100;
  const range = next.minCredits - current.minCredits;
  const progress = credits - current.minCredits;
  return Math.min(100, Math.round((progress / range) * 100));
}

export default function ProfilePage() {
  const { user, profile } = useAuth();
  const { lang } = useLang();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(tabParam || "passport");

  // Use real user if logged in, else fallback to mock
  const displayName   = profile?.name   || user?.email?.split("@")[0] || currentUser.name;
  const displayEmail  = user?.email     || currentUser.email;
  const displayAvatar = profile?.avatar_url || currentUser.avatar;
  const displayFaculty = profile?.faculty || currentUser.faculty;
  const credits       = profile?.green_credits    ?? currentUser.greenCredits;
  const carbonSaved   = profile?.carbon_saved_kg  ?? currentUser.carbonSaved;

  const currentTier   = getCurrentTier(credits);
  const nextTier      = getNextTier(credits);
  const tierProgress  = getTierProgress(credits);
  const actionsCount  = ACTIVITY_HISTORY.length + 38; // mock total

  function handleShare() {
    const text = lang === "th"
      ? `🌿 ฉันลดคาร์บอนไปแล้ว ${carbonSaved} kgCO₂e บน CU GreenVerse!\nระดับ: ${currentTier.emoji} ${currentTier.label}\nGreen Credits: ${credits.toLocaleString()} pts\n\n#CUGreenVerse #Chula #Sustainability`
      : `🌿 I've reduced ${carbonSaved} kgCO₂e on CU GreenVerse!\nLevel: ${currentTier.emoji} ${currentTier.label}\nGreen Credits: ${credits.toLocaleString()} pts\n\n#CUGreenVerse #Chula #Sustainability`;
    if (navigator.share) {
      navigator.share({ title: "CU GreenVerse Achievement", text });
    } else {
      navigator.clipboard.writeText(text);
      toast.success(
        lang === "th" ? "คัดลอกข้อความสำหรับแชร์แล้ว!" : "Copied to clipboard!",
        { description: lang === "th" ? "นำไปวางใน Instagram Story ได้เลย" : "Paste it in your Instagram Story!" }
      );
    }
  }

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {lang === "th" ? "โปรไฟล์ของฉัน" : "My Profile"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {lang === "th" ? "Green Passport & ความสำเร็จด้านความยั่งยืน" : "Green Passport & Sustainability Achievements"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" onClick={handleShare} className="gap-2 rounded-lg">
            <Share2 className="h-4 w-4" /> {lang === "th" ? "แชร์โปรไฟล์" : "Share Profile"}
          </Button>
        </div>
      </div>

      {/* Hero Card */}
      <Card className="border-border/50 shadow-sm overflow-hidden">
        <div className="h-28 bg-gradient-to-r from-primary/30 via-emerald-500/20 to-teal-500/20 relative">
          <div className="absolute inset-0 opacity-20"
            style={{ backgroundImage: "radial-gradient(circle at 20% 50%, hsl(var(--primary)) 0%, transparent 60%)" }} />
        </div>
        <CardContent className="pt-0 pb-6">
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end -mt-12">
            {/* Avatar */}
            <div className={`relative h-24 w-24 rounded-full ring-4 ${currentTier.ring} shadow-xl`}>
              <Avatar className="h-24 w-24 border-4 border-background">
                <AvatarImage src={displayAvatar} alt={displayName} />
                <AvatarFallback className="text-2xl font-bold bg-primary/10">
                  {displayName.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className={`absolute -bottom-1 -right-1 h-8 w-8 rounded-full ${currentTier.bg} border-2 border-background flex items-center justify-center text-sm`}>
                {currentTier.emoji}
              </div>
            </div>

            <div className="flex-1 pb-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h2 className="text-2xl font-bold">{displayName}</h2>
                <Badge className={`${currentTier.bg} ${currentTier.color} border-0 font-semibold`}>
                  {currentTier.emoji} {currentTier.label}
                </Badge>
              </div>
              <p className="text-muted-foreground text-sm">{displayEmail} · {displayFaculty}</p>

              {/* Tier Progress */}
              {nextTier && (
                <div className="mt-3 max-w-xs">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>{currentTier.label}</span>
                    <span>{nextTier.label} ({nextTier.minCredits.toLocaleString()} pts)</span>
                  </div>
                  <Progress value={tierProgress} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    {lang === "th"
                      ? <>{"อีก "}<span className="text-primary font-semibold">{(nextTier.minCredits - credits).toLocaleString()}</span>{" Credits เพื่อเลื่อนระดับ"}</>
                      : <>{<span className="text-primary font-semibold">{(nextTier.minCredits - credits).toLocaleString()}</span>}{" more Credits to level up"}</>}
                  </p>
                </div>
              )}
              {!nextTier && (
                <div className="mt-3">
                  <Badge className="bg-amber-500/10 text-amber-600 border-0">
                    {lang === "th" ? "🌍 ระดับสูงสุด · Green Guardian" : "🌍 Max Level · Green Guardian"}
                  </Badge>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Leaf,       label: "Green Credits",                          value: credits.toLocaleString(),    unit: "pts",   color: "text-primary",                  bg: "bg-primary/10" },
          { icon: TrendingUp, label: lang==="th" ? "คาร์บอนที่ลดได้" : "Carbon Saved", value: carbonSaved.toLocaleString(), unit: "kgCO₂", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/10" },
          { icon: Target,     label: lang==="th" ? "กิจกรรมทั้งหมด" : "Total Actions",  value: actionsCount.toString(),     unit: lang==="th" ? "ครั้ง" : "times", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-500/10" },
          { icon: Award,      label: lang==="th" ? "Badge ที่ได้รับ" : "Badges Earned", value: ALL_BADGES.filter(b => b.earned).length.toString(), unit: `/ ${ALL_BADGES.length}`, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-500/10" },
        ].map((stat) => (
          <Card key={stat.label} className="border-border/50 shadow-sm">
            <CardContent className="pt-5 pb-4">
              <div className={`h-10 w-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-bold mt-0.5">
                {stat.value} <span className="text-sm font-normal text-muted-foreground">{stat.unit}</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="passport" onValueChange={setActiveTab} className="w-full">
        <div className="overflow-x-auto pb-2 scrollbar-hide">
          <TabsList className="w-full sm:w-auto inline-flex justify-start">
            <TabsTrigger value="passport" className="whitespace-nowrap">🛂 Green Passport</TabsTrigger>
            <TabsTrigger value="badges" className="whitespace-nowrap">🏅 {lang==="th" ? "Badge" : "Badges"}</TabsTrigger>
            <TabsTrigger value="history" className="whitespace-nowrap">📋 {lang==="th" ? "ประวัติ" : "History"}</TabsTrigger>
          </TabsList>
        </div>

        {/* GREEN PASSPORT */}
        <TabsContent value="passport" className="mt-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-border/50 shadow-sm bg-gradient-to-br from-primary/5 to-emerald-500/5">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <span>🛂</span> Green Passport
                  <Badge variant="outline" className="ml-auto text-xs">{lang==="th" ? "ฉบับดิจิทัล" : "Digital"}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {(lang === "th" ? [
                  { label: "ชื่อ-สกุล",         value: displayName },
                  { label: "คณะ",               value: displayFaculty || "Engineering" },
                  { label: "ระดับผู้ใช้งาน",     value: `${currentTier.emoji} ${currentTier.label}` },
                  { label: "Green Credits รวม", value: `${credits.toLocaleString()} pts` },
                  { label: "คาร์บอนที่ลดได้",    value: `${carbonSaved} kgCO₂e` },
                  { label: "กิจกรรมทั้งหมด",     value: `${actionsCount} ครั้ง` },
                  { label: "Badge ที่ได้รับ",     value: `${ALL_BADGES.filter(b => b.earned).length} รางวัล` },
                  { label: "ชั่วโมงจิตอาสา",     value: "12.5 ชั่วโมง" },
                ] : [
                  { label: "Full Name",          value: displayName },
                  { label: "Faculty",             value: displayFaculty || "Engineering" },
                  { label: "User Level",          value: `${currentTier.emoji} ${currentTier.label}` },
                  { label: "Total Green Credits", value: `${credits.toLocaleString()} pts` },
                  { label: "Carbon Saved",        value: `${carbonSaved} kgCO₂e` },
                  { label: "Total Activities",    value: `${actionsCount} times` },
                  { label: "Badges Earned",       value: `${ALL_BADGES.filter(b => b.earned).length} badges` },
                  { label: "Volunteer Hours",     value: "12.5 hrs" },
                ]).map((row) => (
                  <div key={row.label} className="flex justify-between items-center py-1 border-b border-border/30 last:border-0">
                    <span className="text-sm text-muted-foreground">{row.label}</span>
                    <span className="text-sm font-medium">{row.value}</span>
                  </div>
                ))}

                <div className="pt-3">
                  <Button className="w-full gap-2 rounded-xl h-10 shadow-sm shadow-primary/20" onClick={handleShare}>
                    <Share2 className="h-4 w-4" /> {lang==="th" ? "แชร์ความสำเร็จ (Share)" : "Share to Social Media"}
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground text-center">
                  {lang==="th" ? "ใช้ประกอบการสมัครทุน ฝึกงาน และแลกเปลี่ยนได้" : "Use for internship, scholarship & exchange program applications"}
                </p>
              </CardContent>
            </Card>


          </div>
        </TabsContent>

        {/* BADGES */}
        <TabsContent value="badges" className="mt-6">
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">
                {lang==="th" ? "Badge ทั้งหมด" : "All Badges"}
                <Badge variant="secondary" className="ml-3">
                  {lang==="th"
                    ? `ได้รับแล้ว ${ALL_BADGES.filter(b => b.earned).length}/${ALL_BADGES.length}`
                    : `${ALL_BADGES.filter(b => b.earned).length}/${ALL_BADGES.length} Earned`}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {ALL_BADGES.map((badge) => (
                  <div
                    key={badge.id}
                    className={`relative flex flex-col items-center text-center p-4 rounded-2xl border transition-all gap-2
                      ${badge.earned
                        ? "border-primary/30 bg-primary/5 hover:shadow-md hover:border-primary/50"
                        : "border-border/40 bg-muted/30 opacity-50"
                      }`}
                  >
                    {badge.earned ? (
                      <CheckCircle2 className="absolute top-2 right-2 h-4 w-4 text-primary" />
                    ) : (
                      <Lock className="absolute top-2 right-2 h-4 w-4 text-muted-foreground/50" />
                    )}
                    <div className="text-4xl mt-1">{badge.emoji}</div>
                    <p className="text-sm font-semibold leading-tight">{badge.label}</p>
                    <p className="text-xs text-muted-foreground leading-snug">{badge.desc}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ACTIVITY HISTORY */}
        <TabsContent value="history" className="mt-6">
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">
                {lang==="th" ? "ประวัติกิจกรรมล่าสุด" : "Recent Activity History"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {ACTIVITY_HISTORY.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-3 rounded-xl bg-muted/40 hover:bg-muted/60 transition-colors"
                >
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{item.action}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> {item.date}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-primary">+{item.points} pts</p>
                    {item.carbon > 0 && (
                      <p className="text-xs text-emerald-600 dark:text-emerald-400">-{item.carbon} kgCO₂</p>
                    )}
                  </div>
                </div>
              ))}

              <Button variant="outline" className="w-full mt-2">
                {lang==="th" ? "ดูประวัติทั้งหมด" : "View All History"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>


      </Tabs>
    </div>
  );
}
