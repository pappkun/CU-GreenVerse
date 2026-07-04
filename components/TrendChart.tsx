"use client";

import { useTheme } from "@/components/ThemeProvider";
import {
  Line,
  LineChart,
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

const trendData = [
  { month: "Jan", users: 1200, actions: 4500 },
  { month: "Feb", users: 2100, actions: 8200 },
  { month: "Mar", users: 3800, actions: 15400 },
  { month: "Apr", users: 5600, actions: 24100 },
  { month: "May", users: 8400, actions: 42000 },
  { month: "Jun", users: 12540, actions: 85000 },
];

export function TrendChart() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const primaryColor = isDark ? "hsl(142 70% 45%)" : "hsl(142 76% 36%)";
  const gridColor = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";
  const textColor = isDark ? "#a1a1aa" : "#71717a";

  return (
    <Card className="col-span-1 border-border/50">
      <CardHeader>
        <CardTitle>Platform Growth</CardTitle>
        <CardDescription>
          Monthly active users &amp; green actions trend.
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={trendData}
              margin={{ top: 5, right: 10, left: 10, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke={gridColor}
              />
              <XAxis
                dataKey="month"
                stroke={textColor}
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke={textColor}
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value / 1000}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? "#18181b" : "#ffffff",
                  borderColor: isDark ? "#27272a" : "#e4e4e7",
                  borderRadius: "8px",
                }}
              />
              <Line
                type="monotone"
                dataKey="actions"
                name="Green Actions"
                stroke={primaryColor}
                strokeWidth={3}
                dot={{ r: 4, fill: primaryColor }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
