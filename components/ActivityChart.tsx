"use client";

import { useTheme } from "@/components/ThemeProvider";
import { useLang } from "@/context/LanguageContext";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const getWeeklyData = (lang: string, hasData: boolean) => [
  { name: lang === "th" ? "จ." : "Mon", carbon: hasData ? 2.4 : 0, activities: hasData ? 3 : 0 },
  { name: lang === "th" ? "อ." : "Tue", carbon: hasData ? 1.8 : 0, activities: hasData ? 2 : 0 },
  { name: lang === "th" ? "พ." : "Wed", carbon: hasData ? 3.2 : 0, activities: hasData ? 4 : 0 },
  { name: lang === "th" ? "พฤ." : "Thu", carbon: hasData ? 0.5 : 0, activities: hasData ? 1 : 0 },
  { name: lang === "th" ? "ศ." : "Fri", carbon: hasData ? 4.1 : 0, activities: hasData ? 5 : 0 },
  { name: lang === "th" ? "ส." : "Sat", carbon: hasData ? 5.5 : 0, activities: hasData ? 6 : 0 },
  { name: lang === "th" ? "อา." : "Sun", carbon: hasData ? 2.0 : 0, activities: hasData ? 2 : 0 },
];

import { useMemo } from "react";

export function ActivityChart({ hasData = true }: { hasData?: boolean }) {
  const { resolvedTheme } = useTheme();
  const { lang } = useLang();
  const isDark = resolvedTheme === "dark";

  const primaryColor = isDark ? "hsl(142 70% 45%)" : "hsl(142 76% 36%)";
  const secondaryColor = isDark ? "hsl(160 60% 45%)" : "hsl(173 58% 39%)";
  const gridColor = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";
  const textColor = isDark ? "#a1a1aa" : "#71717a";
  const data = useMemo(() => getWeeklyData(lang, hasData), [lang, hasData]);

  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-4 border-border/50">
      <CardHeader>
        <CardTitle>{lang === "th" ? "กิจกรรมรายสัปดาห์ & คาร์บอนที่ลดได้" : "Weekly Activities & Carbon Saved"}</CardTitle>
        <CardDescription>
          {lang === "th" ? "ผลกระทบด้านความยั่งยืนของคุณในช่วง 7 วันที่ผ่านมา" : "Your sustainability impact over the last 7 days."}
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 5, right: 10, left: 10, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke={gridColor}
              />
              <XAxis
                dataKey="name"
                stroke={textColor}
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                yAxisId="left"
                stroke={textColor}
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}kg`}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke={textColor}
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                cursor={{
                  fill: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
                }}
                contentStyle={{
                  backgroundColor: isDark ? "#18181b" : "#ffffff",
                  borderColor: isDark ? "#27272a" : "#e4e4e7",
                  borderRadius: "8px",
                }}
              />
              <Bar
                yAxisId="left"
                dataKey="carbon"
                name={lang === "th" ? "คาร์บอนที่ลดได้ (kgCO₂)" : "Carbon Saved (kgCO₂)"}
                fill={primaryColor}
                radius={[4, 4, 0, 0]}
              />
              <Bar
                yAxisId="right"
                dataKey="activities"
                name={lang === "th" ? "จำนวนกิจกรรม" : "Green Actions"}
                fill={secondaryColor}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
