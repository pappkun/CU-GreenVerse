"use client";

import { DashboardCard } from "@/components/DashboardCard";
import { ActivityChart } from "@/components/ActivityChart";
import { useAuth } from "@/context/AuthContext";
import { useLang } from "@/context/LanguageContext";
import { Leaf, Award, Footprints, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { OnboardingModal } from "@/components/OnboardingModal";
import { Card, CardContent } from "@/components/ui/card";
import { TreePine, Droplets } from "lucide-react";

export default function DashboardPage() {
  const { profile, user } = useAuth();
  const { t, lang } = useLang();
  const router = useRouter();

  useEffect(() => {
    if (profile?.role === "admin") {
      router.push("/admin");
    }
  }, [profile, router]);

  if (profile?.role === "admin") return null;

  const displayName =
    profile?.name ||
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "User";
  const credits = profile?.green_credits ?? 0;
  const carbon = profile?.carbon_saved_kg ?? 0;
  const actions = profile?.green_actions ?? 0;

  const recentActivities =
    lang === "th"
      ? [
          {
            action: "ใช้รถป๊อบ (POP-BUS)",
            pts: "+10",
            time: "2 ชั่วโมงที่แล้ว",
          },
          { action: "พกแก้วมาเอง", pts: "+40", time: "เมื่อวาน" },
          { action: "แยกขยะพลาสติก", pts: "+30", time: "2 วันที่แล้ว" },
          {
            action: "เดินเท้าเข้ามหาวิทยาลัย",
            pts: "+50",
            time: "3 วันที่แล้ว",
          },
        ]
      : [
          { action: "Used POP-BUS", pts: "+10", time: "2 hours ago" },
          { action: "Bring Your Own Cup", pts: "+40", time: "Yesterday" },
          { action: "Waste Separation", pts: "+30", time: "2 days ago" },
          { action: "Walk to Campus", pts: "+50", time: "3 days ago" },
        ];

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-5 sm:space-y-6 max-w-7xl mx-auto">
      <OnboardingModal />
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {t("dashboard")}
          </h1>
          <p className="text-muted-foreground mt-0.5 text-sm sm:text-base truncate">
            {lang === "th"
              ? `ยินดีต้อนรับกลับ, ${displayName}`
              : `Welcome back, ${displayName}`}
          </p>
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
          <div className="rounded-[2rem] border border-slate-200 bg-white shadow-[0_24px_80px_-44px_rgba(15,23,42,0.2)] overflow-hidden h-full flex flex-col">
            <div className="p-5 border-b border-slate-200/70 bg-slate-50">
              <h3 className="font-semibold text-base text-slate-900">
                {lang === "th" ? "กิจกรรมล่าสุด" : "Recent Activities"}
              </h3>
            </div>
            <div className="divide-y divide-slate-200/70 flex-1">
              {recentActivities.map((act, i) => (
                <div
                  key={i}
                  className="p-4 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
                >
                  <div className="min-w-0 space-y-0.5">
                    <p className="text-sm font-semibold leading-none truncate text-slate-900">
                      {act.action}
                    </p>
                    <p className="text-xs text-slate-500">{act.time}</p>
                  </div>
                  <div className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full flex-shrink-0 ml-2">
                    {act.pts}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-slate-200/70 bg-slate-50">
              <Link href="/passport">
                <Button
                  variant="ghost"
                  className="w-full text-sm text-slate-900 h-11 rounded-[1.5rem] font-semibold border border-slate-200 bg-white shadow-sm hover:bg-slate-100"
                >
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
