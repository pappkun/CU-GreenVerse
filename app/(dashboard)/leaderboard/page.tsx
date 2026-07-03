"use client";

import { LeaderboardTable } from "@/components/LeaderboardTable";
import { mockFacultyLeaderboard } from "@/data/mockLeaderboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";
import { useLang } from "@/context/LanguageContext";

export default function LeaderboardPage() {
  const { lang, t } = useLang();

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("leaderboardTitle")}</h1>
          <p className="text-muted-foreground mt-1">
            {t("leaderboardDesc")}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex bg-amber-500/10 text-amber-600 dark:text-amber-500 px-4 py-2 rounded-xl items-center gap-2 border border-amber-500/20">
            <Trophy className="h-5 w-5" />
            <span className="font-semibold text-sm">{t("seasonEnds")}</span>
          </div>
        </div>
      </div>

      <Card className="border-border/50 shadow-sm">
        <CardHeader className="pb-3 border-b border-border/50 bg-muted/20">
          <CardTitle className="text-lg flex flex-col">
            <span>{lang === "th" ? "อันดับคณะ" : "Faculty Ranking"}</span>
            <span className="text-sm font-normal text-muted-foreground mt-1">
              {lang === "th" ? "จัดอันดับตาม Green Credits รวมทั้งคณะ" : "Ranked by total Green Credits of the faculty"}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <LeaderboardTable data={mockFacultyLeaderboard} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
