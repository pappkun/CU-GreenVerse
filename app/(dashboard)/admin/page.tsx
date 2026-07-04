"use client";

import { useEffect, useState } from "react";
import { DashboardCard } from "@/components/DashboardCard";
import { TrendChart } from "@/components/TrendChart";
import { Users, Activity, Leaf, Bus, Route, UserCheck, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { useLang } from "@/context/LanguageContext";

interface PopBusStats {
  totalKm: number;
  totalTrips: number;
  uniqueRiders: number;
  ongoingTrips: number;
}

interface ActivityStat {
  category: string;
  count: number;
}

export default function AdminDashboardPage() {
  const { lang, t } = useLang();
  const [popStats, setPopStats] = useState<PopBusStats>({
    totalKm: 0,
    totalTrips: 0,
    uniqueRiders: 0,
    ongoingTrips: 0,
  });
  const [overallStats, setOverallStats] = useState({
    totalUsers: 0,
    totalGreenActions: 0,
    totalCarbonSaved: 0,
    totalCreditsIssued: 0,
  });
  const [activityStats, setActivityStats] = useState<ActivityStat[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      if (!supabase) { setIsLoading(false); return; }

      // POP BUS stats
      const { data: trips } = await supabase
        .from("pop_bus_trips")
        .select("distance_km, user_id, status");

      if (trips) {
        const completed = trips.filter((t) => t.status === "completed");
        const ongoing = trips.filter((t) => t.status === "ongoing");
        setPopStats({
          totalKm: completed.reduce((sum, t) => sum + (t.distance_km || 0), 0),
          totalTrips: completed.length,
          uniqueRiders: new Set(completed.map((t) => t.user_id)).size,
          ongoingTrips: ongoing.length,
        });
      }

      // Activity breakdown by category
      const { data: acts } = await supabase
        .from("activity_logs")
        .select("category, points_awarded, carbon_saved_record");

      let totalActions = 0;
      let totalCarbonFromActs = 0;
      
      if (acts) {
        totalActions = acts.length;
        const grouped: Record<string, number> = {};
        acts.forEach((a: any) => {
          const cat = a.category || "other";
          grouped[cat] = (grouped[cat] || 0) + 1;
          totalCarbonFromActs += Number(a.carbon_saved_record || 0);
        });
        setActivityStats(
          Object.entries(grouped)
            .map(([category, count]) => ({ category, count }))
            .sort((a, b) => b.count - a.count)
        );
      }

      // Users stats
      const { data: profiles } = await supabase
        .from("profiles")
        .select("green_credits, carbon_saved_kg");
        
      if (profiles) {
        const totalUsers = profiles.length;
        const totalCredits = profiles.reduce((sum, p) => sum + Number(p.green_credits || 0), 0);
        const totalCarbon = profiles.reduce((sum, p) => sum + Number(p.carbon_saved_kg || 0), 0);
        
        setOverallStats({
          totalUsers,
          totalGreenActions: totalActions,
          totalCarbonSaved: totalCarbon, // or totalCarbonFromActs if prefer
          totalCreditsIssued: totalCredits,
        });
      }

      setIsLoading(false);
    }

    fetchStats();
    // Real-time: refresh ongoing trips every 30s
    const interval = setInterval(fetchStats, 30_000);
    return () => clearInterval(interval);
  }, []);

  const categoryEmoji: Record<string, string> = {
    transport: "🚌",
    waste: "♻️",
    energy: "⚡",
    food: "🥗",
    education: "📚",
    other: "🌿",
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {lang === "th" ? "แดชบอร์ดผู้ดูแลระบบ" : "Admin Dashboard"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {lang === "th" ? "ภาพรวมและการจัดการแพลตฟอร์ม" : "Platform overview and management."}
          </p>
        </div>
        <Button>{lang === "th" ? "สร้างรายงาน" : "Generate Report"}</Button>
      </div>

      {/* Platform Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard
          title={lang === "th" ? "ผู้ใช้งานทั้งหมด" : "Total Users"}
          value={isLoading ? "—" : overallStats.totalUsers.toLocaleString()}
          icon={<Users className="h-5 w-5" />}
        />
        <DashboardCard
          title={lang === "th" ? "กิจกรรมทั้งหมด" : "Total Green Actions"}
          value={isLoading ? "—" : overallStats.totalGreenActions.toLocaleString()}
          icon={<Activity className="h-5 w-5" />}
        />
        <DashboardCard
          title={lang === "th" ? "คาร์บอนที่ลดได้" : "Total Carbon Saved"}
          value={isLoading ? "—" : `${overallStats.totalCarbonSaved.toFixed(1)} kg`}
          icon={<Leaf className="h-5 w-5" />}
        />
        <DashboardCard
          title={lang === "th" ? "Credits ที่แจก" : "Credits Issued"}
          value={isLoading ? "—" : overallStats.totalCreditsIssued.toLocaleString()}
          icon={<AwardIcon />}
        />
      </div>

      {/* POP BUS Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Bus className="h-5 w-5 text-emerald-500" />
          <h2 className="text-xl font-bold">{lang === "th" ? "POP BUS Overview" : "POP BUS Overview"}</h2>
          {popStats.ongoingTrips > 0 && (
            <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 text-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse inline-block" />
              {popStats.ongoingTrips} {lang === "th" ? "เที่ยวกำลังดำเนินอยู่" : "trips in progress"}
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-9 w-9 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <Route className="h-4 w-4 text-blue-500" />
                </div>
                <p className="text-sm text-muted-foreground">
                  {lang === "th" ? "ระยะทางรวม" : "Total Distance"}
                </p>
              </div>
              <p className="text-2xl font-bold">
                {isLoading ? "—" : popStats.totalKm.toFixed(1)}
                <span className="text-sm font-normal text-muted-foreground ml-1">km</span>
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-9 w-9 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <Bus className="h-4 w-4 text-emerald-500" />
                </div>
                <p className="text-sm text-muted-foreground">
                  {lang === "th" ? "เที่ยวทั้งหมด" : "Total Trips"}
                </p>
              </div>
              <p className="text-2xl font-bold">
                {isLoading ? "—" : popStats.totalTrips.toLocaleString()}
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-9 w-9 rounded-xl bg-purple-500/10 flex items-center justify-center">
                  <UserCheck className="h-4 w-4 text-purple-500" />
                </div>
                <p className="text-sm text-muted-foreground">
                  {lang === "th" ? "ผู้ใช้ที่เคยนั่ง" : "Unique Riders"}
                </p>
              </div>
              <p className="text-2xl font-bold">
                {isLoading ? "—" : popStats.uniqueRiders.toLocaleString()}
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-9 w-9 rounded-xl bg-orange-500/10 flex items-center justify-center">
                  <Timer className="h-4 w-4 text-orange-500" />
                </div>
                <p className="text-sm text-muted-foreground">
                  {lang === "th" ? "กำลังนั่งอยู่" : "Ongoing Now"}
                </p>
              </div>
              <p className="text-2xl font-bold text-orange-500">
                {isLoading ? "—" : popStats.ongoingTrips}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Charts + Activity Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TrendChart />
        </div>

        <div className="lg:col-span-1 space-y-4">
          {/* Activity Breakdown */}
          <Card className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">
                {lang === "th" ? "กิจกรรมแยกตามหมวด" : "Activity by Category"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-8 rounded-lg bg-muted animate-pulse" />
                  ))}
                </div>
              ) : activityStats.length > 0 ? (
                <div className="space-y-2">
                  {activityStats.map(({ category, count }) => (
                    <div key={category} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{categoryEmoji[category] ?? "🌿"}</span>
                        <span className="text-sm capitalize">{category}</span>
                      </div>
                      <Badge variant="secondary" className="text-xs">{count}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  {lang === "th" ? "ยังไม่มีข้อมูล" : "No data yet"}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function AwardIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-award h-5 w-5">
      <circle cx="12" cy="8" r="6" /><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
    </svg>
  );
}
