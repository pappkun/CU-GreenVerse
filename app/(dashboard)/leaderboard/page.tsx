"use client";

import { useState, useEffect, useCallback } from "react";
import { LeaderboardTable } from "@/components/LeaderboardTable";
import { mockFacultyLeaderboard } from "@/data/mockLeaderboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Trophy, RefreshCw, Wifi } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState("faculties");
  const [individuals, setIndividuals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isLive, setIsLive] = useState(false);

  const fetchIndividuals = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, name, green_credits, carbon_saved_kg, avatar_url, faculty")
        .order("green_credits", { ascending: false })
        .limit(20);

      if (error) throw error;

      const ranked = data.map((user: any, index: number) => ({
        id: user.id,
        rank: index + 1,
        name: user.name || user.id.substring(0, 8),
        type: "individual" as const,
        greenCredits: user.green_credits ?? 0,
        carbonSaved: user.carbon_saved_kg ?? 0,
        avatar: user.avatar_url ?? undefined,
      }));

      setIndividuals(ranked);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Error fetching leaderboard:", err);
      // fallback stays with whatever we had
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchIndividuals();
  }, [fetchIndividuals]);

  // Real-time subscription on profiles table
  useEffect(() => {
    const channel = supabase
      .channel("leaderboard-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "profiles" },
        () => {
          fetchIndividuals();
        }
      )
      .subscribe((status) => {
        setIsLive(status === "SUBSCRIBED");
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchIndividuals]);

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">กระดานผู้นำ</h1>
          <p className="text-muted-foreground mt-1">
            ดูอันดับผู้นำด้านความยั่งยืนของจุฬาลงกรณ์มหาวิทยาลัย
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Live badge */}
          <Badge
            variant="outline"
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold ${
              isLive
                ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "border-muted text-muted-foreground"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                isLive ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground"
              }`}
            />
            {isLive ? "Real-time" : "Connecting..."}
          </Badge>

          <Button
            variant="outline"
            size="sm"
            onClick={fetchIndividuals}
            className="gap-2"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            รีเฟรช
          </Button>

          <div className="hidden md:flex bg-amber-500/10 text-amber-600 dark:text-amber-500 px-4 py-2 rounded-xl items-center gap-2 border border-amber-500/20">
            <Trophy className="h-5 w-5" />
            <span className="font-semibold text-sm">Season สิ้นสุดใน 14 วัน</span>
          </div>
        </div>
      </div>

      {lastUpdated && (
        <p className="text-xs text-muted-foreground -mt-4">
          อัปเดตล่าสุด: {lastUpdated.toLocaleTimeString("th-TH")}
        </p>
      )}

      <Card className="border-border/50 shadow-sm">
        <CardHeader className="pb-3 border-b border-border/50 bg-muted/20">
          <Tabs defaultValue="faculties" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 max-w-sm h-12">
              <TabsTrigger value="faculties">คณะ</TabsTrigger>
              <TabsTrigger value="individuals" className="relative">
                บุคคล
                <span className="ml-1.5 inline-flex items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-bold px-1.5 py-0.5 min-w-[18px]">
                  LIVE
                </span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>

        <CardContent className="pt-6">
          {activeTab === "faculties" && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="mb-4">
                <h3 className="font-bold text-lg">อันดับคณะ</h3>
                <p className="text-sm text-muted-foreground">จัดอันดับตาม Green Credits รวมทั้งคณะ</p>
              </div>
              <LeaderboardTable data={mockFacultyLeaderboard} />
            </div>
          )}

          {activeTab === "individuals" && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-lg">อันดับบุคคล</h3>
                  <p className="text-sm text-muted-foreground">
                    อัปเดตแบบ Real-time จากฐานข้อมูลจริง
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1">
                  <Wifi className="h-3 w-3" />
                  <span>Live Database</span>
                </div>
              </div>

              {isLoading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="h-14 rounded-xl bg-muted/50 animate-pulse"
                      style={{ opacity: 1 - i * 0.15 }}
                    />
                  ))}
                </div>
              ) : individuals.length > 0 ? (
                <LeaderboardTable data={individuals} />
              ) : (
                <div className="py-12 text-center text-muted-foreground">
                  <Trophy className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p className="font-medium">ยังไม่มีผู้เข้าร่วม</p>
                  <p className="text-sm mt-1">เป็นคนแรกที่ล็อกอินและทำกิจกรรมเพื่อขึ้นกระดานนี้!</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
