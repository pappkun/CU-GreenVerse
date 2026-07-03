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
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {lang === "th" ? "แดชบอร์ด" : "Dashboard"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {lang === "th" ? `ยินดีต้อนรับกลับ, ${displayName} 🌱` : `Welcome back, ${displayName} 🌱`}
          </p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Link href="/activities" className="w-full md:w-auto">
            <Button className="w-full">
              <Leaf className="mr-2 h-4 w-4" />
              {lang === "th" ? "บันทึกกิจกรรม" : "Log Activity"}
            </Button>
          </Link>
          <Link href="/activities/submit?scan=true" className="w-full md:w-auto">
            <Button variant="outline" className="w-full">
              {lang === "th" ? "สแกน QR" : "Scan QR"}
            </Button>
          </Link>
        </div>
      </div>

      {/* Level Progress */}
      <div className="bg-card border rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6 shadow-sm">
        <div className="h-24 w-24 rounded-full border-4 border-primary/20 bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
          <img src={profile?.avatar_url || currentUser.avatar} alt="Avatar" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 w-full space-y-3">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">
              {lang === "th" ? `เลเวล ${currentUser.level}` : `Level ${currentUser.level}`}
            </h2>
            <span className="text-sm font-medium text-muted-foreground">{currentXp} / {xpForNextLevel} XP</span>
          </div>
          <Progress value={progress} className="h-3" />
          <p className="text-sm text-muted-foreground">
            {lang === "th"
              ? `ทำกิจกรรมอีก ${toNextLevel} ครั้ง เพื่อเลื่อนเป็น เลเวล ${currentUser.level + 1}!`
              : `Complete ${toNextLevel} more activities to reach Level ${currentUser.level + 1}!`}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard
          title={t("greenCredits")}
          value={credits.toLocaleString()}
          icon={<Award className="h-5 w-5" />}
          subtitle={lang === "th" ? "ยอดที่ใช้ได้" : "Available to spend"}
        />
        <DashboardCard
          title={t("carbonSaved")}
          value={`${carbon} kg`}
          icon={<Leaf className="h-5 w-5" />}
          trend="up"
          trendValue="12.5%"
          subtitle={lang === "th" ? "เทียบเดือนก่อน" : "vs last month"}
        />
        <DashboardCard
          title={t("activitiesCount")}
          value={actions}
          icon={<Footprints className="h-5 w-5" />}
          trend="up"
          trendValue="3"
          subtitle={lang === "th" ? "สัปดาห์นี้" : "this week"}
        />
        <DashboardCard
          title={lang === "th" ? "สตรีคต่อเนื่อง" : "Current Streak"}
          value={lang === "th" ? "5 วัน" : "5 Days"}
          icon={<Flame className="h-5 w-5 text-orange-500" />}
          subtitle={lang === "th" ? "สู้ต่อไป!" : "Keep it up!"}
        />
      </div>

      {/* Chart + Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <ActivityChart />
        </div>
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
            <div className="p-4 border-b bg-muted/30">
              <h3 className="font-semibold text-lg">
                {lang === "th" ? "กิจกรรมล่าสุด" : "Recent Activities"}
              </h3>
            </div>
            <div className="divide-y">
              {recentActivities.map((act, i) => (
                <div key={i} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{act.action}</p>
                    <p className="text-xs text-muted-foreground">{act.time}</p>
                  </div>
                  <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-1 rounded">
                    {act.pts}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 border-t bg-muted/20">
              <Link href="/passport">
                <Button variant="ghost" className="w-full text-sm text-primary">
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
