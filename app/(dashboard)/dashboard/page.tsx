"use client";

import { DashboardCard } from "@/components/DashboardCard";
import { ActivityChart } from "@/components/Charts";
import { currentUser } from "@/data/mockUsers";
import { useAuth } from "@/context/AuthContext";
import { useLang } from "@/context/LanguageContext";
import { Leaf, Award, Footprints, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";

export default function DashboardPage() {
  const { profile, user } = useAuth();
  const { t, lang } = useLang();

  const displayName = profile?.name || user?.user_metadata?.full_name || user?.email?.split("@")[0] || currentUser.name;
  const credits     = profile?.green_credits   ?? currentUser.greenCredits;
  const carbon      = profile?.carbon_saved_kg ?? currentUser.carbonSaved;
  const actions     = currentUser.greenActions;

  const xpForNextLevel = 5000;
  const currentXp  = credits % 5000;
  const progress   = (currentXp / xpForNextLevel) * 100;
  const toNextLevel = Math.ceil((xpForNextLevel - currentXp) / 50);

  const recentActivities = lang === "th"
    ? [
        { action: "ใช้ MuvMi (รถป๊อบ)",      pts: "+10",  time: "2 ชั่วโมงที่แล้ว" },
        { action: "พกแก้วมาเอง",              pts: "+40",  time: "เมื่อวาน" },
        { action: "แยกขยะพลาสติก",            pts: "+30",  time: "2 วันที่แล้ว" },
        { action: "เดินเท้าเข้ามหาวิทยาลัย", pts: "+50",  time: "3 วันที่แล้ว" },
      ]
    : [
        { action: "Used MuvMi",          pts: "+10", time: "2 hours ago" },
        { action: "Bring Your Own Cup",  pts: "+40", time: "Yesterday" },
        { action: "Waste Separation",    pts: "+30", time: "2 days ago" },
        { action: "Walk to Campus",      pts: "+50", time: "3 days ago" },
      ];

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-5 sm:space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {lang === "th" ? "แดชบอร์ด" : "Dashboard"}
          </h1>
          <p className="text-muted-foreground mt-0.5 text-sm sm:text-base truncate">
            {lang === "th" ? `ยินดีต้อนรับกลับ, ${displayName} 🌱` : `Welcome back, ${displayName} 🌱`}
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <Link href="/activities">
            <Button className="h-9 sm:h-10 rounded-xl font-semibold text-sm gap-1.5 shadow-sm shadow-primary/20">
              <Leaf className="h-4 w-4" />
              <span className="hidden xs:inline">{lang === "th" ? "บันทึกกิจกรรม" : "Log Activity"}</span>
              <span className="xs:hidden">{lang === "th" ? "บันทึก" : "Log"}</span>
            </Button>
          </Link>
          <Link href="/activities/submit?scan=true">
            <Button variant="outline" className="h-9 sm:h-10 rounded-xl font-semibold text-sm gap-1.5">
              <span>{lang === "th" ? "สแกน QR" : "Scan QR"}</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Level Progress — Hero Card */}
      <div className="relative rounded-2xl overflow-hidden border border-border/60 bg-card shadow-sm">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-emerald-500/5 pointer-events-none" />
        <div className="relative p-4 sm:p-6 flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
          {/* Avatar */}
          <div className="relative h-20 w-20 sm:h-24 sm:w-24 flex-shrink-0">
            <div className="h-full w-full rounded-2xl overflow-hidden ring-4 ring-primary/20 shadow-xl">
              <img src={profile?.avatar_url || currentUser.avatar} alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground text-xs font-bold h-7 w-7 rounded-full flex items-center justify-center shadow-md border-2 border-background">
              {currentUser.level}
            </div>
          </div>

          {/* Level info */}
          <div className="flex-1 w-full min-w-0 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  {lang === "th" ? "เลเวล" : "Level"}
                </p>
                <h2 className="text-xl sm:text-2xl font-bold">
                  {lang === "th" ? `เลเวล ${currentUser.level}` : `Level ${currentUser.level}`}
                </h2>
              </div>
              <span className="text-sm font-medium text-muted-foreground tabular-nums">{currentXp.toLocaleString()} / {xpForNextLevel.toLocaleString()} XP</span>
            </div>
            <Progress value={progress} className="h-2.5 rounded-full" />
            <p className="text-xs text-muted-foreground mt-2">
              {lang === "th"
                ? `ทำกิจกรรมอีก ${toNextLevel} ครั้ง เพื่อเลื่อนเป็น เลเวล ${currentUser.level + 1}!`
                : `Complete ${toNextLevel} more activities to reach Level ${currentUser.level + 1}!`}
            </p>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <DashboardCard
          title={t("greenCredits")}
          value={credits.toLocaleString()}
          icon={<Award className="h-5 w-5" />}
          subtitle={lang === "th" ? "ยอดที่ใช้ได้" : "Available to spend"}
          accentColor="green"
        />
        <DashboardCard
          title={t("carbonSaved")}
          value={`${carbon} kg`}
          icon={<Leaf className="h-5 w-5" />}
          trend="up"
          trendValue="12.5%"
          subtitle={lang === "th" ? "เทียบเดือนก่อน" : "vs last month"}
          accentColor="blue"
        />
        <DashboardCard
          title={t("activitiesCount")}
          value={actions}
          icon={<Footprints className="h-5 w-5" />}
          trend="up"
          trendValue="3"
          subtitle={lang === "th" ? "สัปดาห์นี้" : "this week"}
          accentColor="amber"
        />
        <DashboardCard
          title={lang === "th" ? "สตรีคต่อเนื่อง" : "Current Streak"}
          value={lang === "th" ? "5 วัน" : "5 Days"}
          icon={<Flame className="h-5 w-5" />}
          subtitle={lang === "th" ? "สู้ต่อไป!" : "Keep it up!"}
          accentColor="orange"
        />
      </div>

      {/* Chart + Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="lg:col-span-3">
          <ActivityChart />
        </div>
        <div className="lg:col-span-1">
          <div className="rounded-2xl border border-border/60 bg-card shadow-sm overflow-hidden h-full flex flex-col">
            <div className="p-4 border-b border-border/60 bg-muted/20">
              <h3 className="font-bold text-base">
                {lang === "th" ? "กิจกรรมล่าสุด" : "Recent Activities"}
              </h3>
            </div>
            <div className="divide-y divide-border/60 flex-1">
              {recentActivities.map((act, i) => (
                <div key={i} className="p-3.5 flex items-center justify-between hover:bg-muted/40 transition-colors">
                  <div className="min-w-0 space-y-0.5">
                    <p className="text-sm font-medium leading-none truncate">{act.action}</p>
                    <p className="text-xs text-muted-foreground">{act.time}</p>
                  </div>
                  <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full flex-shrink-0 ml-2">
                    {act.pts}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 border-t border-border/60 bg-muted/10">
              <Link href="/passport">
                <Button variant="ghost" className="w-full text-sm text-primary h-9 rounded-xl font-semibold">
                  {lang === "th" ? "ดูประวัติทั้งหมด" : "View Full History"}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
