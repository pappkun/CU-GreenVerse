"use client";

import { DashboardCard } from "@/components/DashboardCard";
import { TrendChart } from "@/components/Charts";
import { mockStats } from "@/data/mockStats";
import { Users, Activity, Leaf, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLang } from "@/context/LanguageContext";

export default function AdminDashboardPage() {
  const { lang, t } = useLang();
  
  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard 
          title={lang === "th" ? "ผู้ใช้งานทั้งหมด" : "Total Users"}
          value={mockStats.totalUsers.toLocaleString()}
          icon={<Users className="h-5 w-5" />}
          subtitle={`${mockStats.activeUsers.toLocaleString()} ${lang === "th" ? "ใช้งานเดือนนี้" : "active this month"}`}
        />
        <DashboardCard 
          title={lang === "th" ? "กิจกรรมลดคาร์บอนทั้งหมด" : "Total Green Actions"}
          value={mockStats.totalGreenActions.toLocaleString()}
          icon={<Activity className="h-5 w-5" />}
          trend="up"
          trendValue="15%"
          subtitle={lang === "th" ? "เทียบกับเดือนก่อน" : "vs last month"}
        />
        <DashboardCard 
          title={lang === "th" ? "คาร์บอนที่ลดได้ทั้งหมด" : "Total Carbon Saved"}
          value={`${mockStats.totalCarbonSaved.toLocaleString()} kg`}
          icon={<Leaf className="h-5 w-5" />}
        />
        <DashboardCard 
          title={lang === "th" ? "แจก Credits ไปแล้ว" : "Credits Issued"}
          value={(mockStats.totalCreditsIssued / 1000000).toFixed(2) + "M"}
          icon={<AwardIcon />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TrendChart />
        </div>
        
        <div className="lg:col-span-1">
          <Card className="h-full border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>{lang === "th" ? "รอยืนยันกิจกรรม" : "Pending Verifications"}</CardTitle>
              <Badge variant="destructive" className="rounded-full">12 {lang === "th" ? "รายการ" : "Actions"}</Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mt-4">
                {[
                  { user: "Patarapon W.", action: lang === "th" ? "นั่งรถป๊อบ" : "MuvMi Ride", time: lang === "th" ? "10 นาทีที่แล้ว" : "10 mins ago" },
                  { user: "Siriya S.", action: lang === "th" ? "แยกขยะ" : "Waste Separation", time: lang === "th" ? "1 ชั่วโมงที่แล้ว" : "1 hour ago" },
                  { user: "Kittipong M.", action: lang === "th" ? "ใช้แก้วส่วนตัว" : "Bring Your Own Cup", time: lang === "th" ? "2 ชั่วโมงที่แล้ว" : "2 hours ago" },
                  { user: "Nattapong J.", action: lang === "th" ? "ขนส่งสาธารณะ" : "Public Transport", time: lang === "th" ? "3 ชั่วโมงที่แล้ว" : "3 hours ago" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg border bg-muted/20">
                    <div>
                      <p className="text-sm font-medium">{item.user}</p>
                      <p className="text-xs text-muted-foreground">{item.action} • {item.time}</p>
                    </div>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" className="h-7 w-7 text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30">
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                      </Button>
                      <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10">
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">{lang === "th" ? "ดูรายการรอยืนยันทั้งหมด" : "View All Pending"}</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function AwardIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-award h-5 w-5"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>
  );
}
