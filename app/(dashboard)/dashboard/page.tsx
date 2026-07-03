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

  const recentActivities = lang === "th"
    ? [
        { action: "ใช้รถป๊อบ (POP-BUS)",      pts: "+10",  time: "2 ชั่วโมงที่แล้ว" },
        { action: "พกแก้วมาเอง",              pts: "+40",  time: "เมื่อวาน" },
        { action: "แยกขยะพลาสติก",            pts: "+30",  time: "2 วันที่แล้ว" },
        { action: "เดินเท้าเข้ามหาวิทยาลัย", pts: "+50",  time: "3 วันที่แล้ว" },
      ]
    : [
        { action: "Used POP-BUS",          pts: "+10", time: "2 hours ago" },
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
        <div className="flex md:hidden items-center gap-2 sm:gap-3 flex-shrink-0">
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
