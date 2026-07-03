"use client";

import { useTheme } from "next-themes";
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const weeklyData = [
  { name: "Mon", carbon: 2.4, activities: 3 },
  { name: "Tue", carbon: 1.8, activities: 2 },
  { name: "Wed", carbon: 3.2, activities: 4 },
  { name: "Thu", carbon: 0.5, activities: 1 },
  { name: "Fri", carbon: 4.1, activities: 5 },
  { name: "Sat", carbon: 5.5, activities: 6 },
  { name: "Sun", carbon: 2.0, activities: 2 },
];

export function ActivityChart() {
  const { theme } = useTheme();
  
  const primaryColor = theme === "dark" ? "hsl(142 70% 45%)" : "hsl(142 76% 36%)";
  const secondaryColor = theme === "dark" ? "hsl(160 60% 45%)" : "hsl(173 58% 39%)";
  const gridColor = theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";
  const textColor = theme === "dark" ? "#a1a1aa" : "#71717a";

  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-4 border-border/50">
      <CardHeader>
        <CardTitle>Weekly Activities & Carbon Saved</CardTitle>
        <CardDescription>
          Your sustainability impact over the last 7 days.
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
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
                cursor={{ fill: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                contentStyle={{ 
                  backgroundColor: theme === 'dark' ? '#18181b' : '#ffffff',
                  borderColor: theme === 'dark' ? '#27272a' : '#e4e4e7',
                  borderRadius: '8px'
                }}
              />
              <Bar 
                yAxisId="left"
                dataKey="carbon" 
                name="Carbon Saved (kgCO₂)" 
                fill={primaryColor} 
                radius={[4, 4, 0, 0]} 
              />
              <Bar 
                yAxisId="right"
                dataKey="activities" 
                name="Green Actions" 
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

const trendData = [
  { month: "Jan", users: 1200, actions: 4500 },
  { month: "Feb", users: 2100, actions: 8200 },
  { month: "Mar", users: 3800, actions: 15400 },
  { month: "Apr", users: 5600, actions: 24100 },
  { month: "May", users: 8400, actions: 42000 },
  { month: "Jun", users: 12540, actions: 85000 },
];

export function TrendChart() {
  const { theme } = useTheme();
  
  const primaryColor = theme === "dark" ? "hsl(142 70% 45%)" : "hsl(142 76% 36%)";
  const gridColor = theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";
  const textColor = theme === "dark" ? "#a1a1aa" : "#71717a";

  return (
    <Card className="col-span-1 border-border/50">
      <CardHeader>
        <CardTitle>Platform Growth</CardTitle>
        <CardDescription>
          Monthly active users & green actions trend.
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
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
                  backgroundColor: theme === 'dark' ? '#18181b' : '#ffffff',
                  borderColor: theme === 'dark' ? '#27272a' : '#e4e4e7',
                  borderRadius: '8px'
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
