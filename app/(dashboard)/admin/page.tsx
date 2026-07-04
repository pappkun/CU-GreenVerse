"use client";

import { useLang } from "@/context/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Leaf, Footprints, Bus, Recycle, Coffee, Users, Bike } from "lucide-react";

export default function AdminDashboardPage() {
  const { lang } = useLang();

  // Mock aggregated data for all users separated by activity
  const activitiesData = [
    {
      id: "walk",
      title: lang === "th" ? "เดินเท้าเข้ามหาวิทยาลัย" : "Walk to Campus",
      icon: Footprints,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      count: 4100,
      points: 205000,
      carbon: 0,
    },
    {
      id: "popbus",
      title: lang === "th" ? "เช็คอินรถป๊อบ (POP-BUS)" : "POP-BUS Check-in",
      icon: Bus,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      count: 3240,
      points: 16200,
      carbon: 1620,
    },
    {
      id: "waste",
      title: lang === "th" ? "แยกขยะพลาสติก" : "Waste Separation",
      icon: Recycle,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
      count: 2800,
      points: 84000,
      carbon: 140,
    },
    {
      id: "bike",
      title: lang === "th" ? "ใช้จักรยาน / ANYWHEEL" : "Bicycle / ANYWHEEL",
      icon: Bike,
      color: "text-teal-500",
      bg: "bg-teal-500/10",
      count: 1850,
      points: 148000,
      carbon: 462.5,
    },
    {
      id: "cup",
      title: lang === "th" ? "พกแก้วมาเอง" : "Bring Your Own Cup",
      icon: Coffee,
      color: "text-amber-600",
      bg: "bg-amber-600/10",
      count: 1520,
      points: 60800,
      carbon: 15.2,
    },
    {
      id: "event",
      title: lang === "th" ? "เข้าร่วมกิจกรรมสิ่งแวดล้อม" : "Join Sustainability Event",
      icon: Users,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      count: 450,
      points: 90000,
      carbon: 0,
    },
  ];

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {lang === "th" ? "ข้อมูลกิจกรรมของทุกคน" : "All Users Activities Overview"}
        </h1>
        <p className="text-muted-foreground mt-1 text-lg">
          {lang === "th" ? "สรุปยอดการทำกิจกรรมทั้งหมด แยกตามประเภทกิจกรรม" : "Summary of all activities done by all users, separated by activity type."}
        </p>
      </div>

      <Card className="border-border/50 shadow-md">
        <CardHeader className="bg-muted/30 border-b border-border/50">
          <CardTitle className="text-xl flex items-center gap-2">
            <Leaf className="h-6 w-6 text-primary" />
            {lang === "th" ? "สรุปยอดรวมแต่ละกิจกรรม" : "Aggregated Activities Breakdown"}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent bg-slate-50 dark:bg-slate-900/50">
                  <TableHead className="w-[300px] text-base font-semibold">{lang === "th" ? "ชื่อกิจกรรม" : "Activity Name"}</TableHead>
                  <TableHead className="text-right text-base font-semibold">{lang === "th" ? "จำนวนครั้งที่ทำ (รวม)" : "Total Count"}</TableHead>
                  <TableHead className="text-right text-base font-semibold">{lang === "th" ? "แต้มที่แจกไป (รวม)" : "Total Points Issued"}</TableHead>
                  <TableHead className="text-right text-base font-semibold">{lang === "th" ? "คาร์บอนที่ลดได้ (รวม)" : "Total Carbon Saved"}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activitiesData.map((act) => (
                  <TableRow key={act.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                    <TableCell className="font-medium py-4">
                      <div className="flex items-center gap-3">
                        <div className={`h-12 w-12 rounded-xl ${act.bg} flex items-center justify-center shadow-sm`}>
                          <act.icon className={`h-6 w-6 ${act.color}`} />
                        </div>
                        <span className="text-base">{act.title}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-bold text-slate-700 dark:text-slate-300 text-lg">
                      {act.count.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-bold text-primary text-lg">
                      +{act.points.toLocaleString()} pts
                    </TableCell>
                    <TableCell className="text-right font-bold text-emerald-600 dark:text-emerald-400 text-lg">
                      {act.carbon > 0 ? `-${act.carbon.toLocaleString()} kgCO₂e` : "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
