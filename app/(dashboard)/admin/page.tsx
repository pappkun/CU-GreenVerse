"use client";

import { useLang } from "@/context/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Leaf, Bus, Recycle, Coffee, Users, Bike, BarChart2, PieChart as PieChartIcon } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

export default function AdminDashboardPage() {
  const { lang } = useLang();

  // Mock aggregated data for all users separated by activity
  const activitiesData = [
    {
      id: "popbus",
      title: lang === "th" ? "เช็คอินรถป๊อบ (POP-BUS)" : "POP-BUS Check-in",
      shortTitle: lang === "th" ? "รถป๊อบ" : "POP-BUS",
      icon: Bus,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      fill: "#3b82f6",
      count: 3240,
      usage: lang === "th" ? "รวม 16,200 กิโลเมตร" : "16,200 km total",
      carbon: 1620,
    },
    {
      id: "waste",
      title: lang === "th" ? "แยกขยะพลาสติก" : "Waste Separation",
      shortTitle: lang === "th" ? "แยกขยะ" : "Waste",
      icon: Recycle,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
      fill: "#f97316",
      count: 2800,
      usage: lang === "th" ? "แยกขยะ 2,800 ครั้ง" : "2,800 times",
      carbon: 140,
    },
    {
      id: "bike",
      title: lang === "th" ? "ใช้จักรยาน / ANYWHEEL" : "Bicycle / ANYWHEEL",
      shortTitle: lang === "th" ? "จักรยาน" : "Bicycle",
      icon: Bike,
      color: "text-teal-500",
      bg: "bg-teal-500/10",
      fill: "#14b8a6",
      count: 1850,
      usage: lang === "th" ? "รวม 5,550 กิโลเมตร" : "5,550 km total",
      carbon: 462.5,
    },
    {
      id: "cup",
      title: lang === "th" ? "พกแก้วมาเอง" : "Bring Your Own Cup",
      shortTitle: lang === "th" ? "พกแก้ว" : "Own Cup",
      icon: Coffee,
      color: "text-amber-600",
      bg: "bg-amber-600/10",
      fill: "#d97706",
      count: 1520,
      usage: lang === "th" ? "พกแก้ว 1,520 ใบ" : "1,520 cups",
      carbon: 15.2,
    },
    {
      id: "event",
      title: lang === "th" ? "เข้าร่วมกิจกรรมสิ่งแวดล้อม" : "Join Sustainability Event",
      shortTitle: lang === "th" ? "ร่วมกิจกรรม" : "Event",
      icon: Users,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      fill: "#a855f7",
      count: 450,
      usage: lang === "th" ? "เข้าร่วม 450 ครั้ง" : "450 participations",
      carbon: 0,
    },
  ];

  // Filter out activities with 0 carbon for the pie chart
  const carbonData = activitiesData.filter(act => act.carbon > 0);

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 md:space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          {lang === "th" ? "แดชบอร์ดสรุปกิจกรรม" : "Activities Dashboard Overview"}
        </h1>
        <p className="text-muted-foreground mt-1 text-base sm:text-lg">
          {lang === "th" ? "ภาพรวมข้อมูลเชิงสถิติและการทำกิจกรรมทั้งหมดของทุกคน" : "Statistical overview of all activities and user engagement."}
        </p>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart: Activity Counts */}
        <Card className="border-border/50 shadow-sm flex flex-col">
          <CardHeader className="bg-slate-50/50 dark:bg-slate-900/20 border-b border-border/50 pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart2 className="h-5 w-5 text-primary" />
              {lang === "th" ? "เปรียบเทียบจำนวนการทำกิจกรรม" : "Activity Count Comparison"}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activitiesData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="shortTitle" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#64748b' }}
                />
                <RechartsTooltip 
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={40}>
                  {activitiesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie Chart: Carbon Saved */}
        <Card className="border-border/50 shadow-sm flex flex-col">
          <CardHeader className="bg-slate-50/50 dark:bg-slate-900/20 border-b border-border/50 pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <PieChartIcon className="h-5 w-5 text-emerald-500" />
              {lang === "th" ? "สัดส่วนคาร์บอนที่ลดได้ (kgCO₂e)" : "Carbon Saved Distribution"}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 flex-1 min-h-[300px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={carbonData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="carbon"
                  nameKey="shortTitle"
                >
                  {carbonData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  formatter={(value: number) => [`${value.toLocaleString()} kg`, lang === "th" ? "คาร์บอน" : "Carbon"]}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Table Section */}
      <Card className="border-border/50 shadow-md">
        <CardHeader className="bg-slate-50/80 dark:bg-slate-900/50 border-b border-border/50">
          <CardTitle className="text-xl flex items-center gap-2">
            <Leaf className="h-6 w-6 text-primary" />
            {lang === "th" ? "สรุปยอดรวมแต่ละกิจกรรม" : "Aggregated Activities Breakdown"}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent bg-slate-100/50 dark:bg-slate-800/30">
                  <TableHead className="w-[300px] text-base font-semibold">{lang === "th" ? "ชื่อกิจกรรม" : "Activity Name"}</TableHead>
                  <TableHead className="text-right text-base font-semibold">{lang === "th" ? "จำนวนครั้งที่ทำ (รวม)" : "Total Count"}</TableHead>
                  <TableHead className="text-right text-base font-semibold">{lang === "th" ? "ข้อมูลการใช้งาน" : "Usage Data"}</TableHead>
                  <TableHead className="text-right text-base font-semibold">{lang === "th" ? "คาร์บอนที่ลดได้ (รวม)" : "Total Carbon Saved"}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activitiesData.map((act) => (
                  <TableRow key={act.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                    <TableCell className="font-medium py-4">
                      <div className="flex items-center gap-3">
                        <div className={`h-12 w-12 rounded-xl ${act.bg} flex items-center justify-center shadow-sm shrink-0`}>
                          <act.icon className={`h-6 w-6 ${act.color}`} />
                        </div>
                        <span className="text-base">{act.title}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-bold text-slate-700 dark:text-slate-300 text-lg">
                      {act.count.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-bold text-primary text-lg">
                      {act.usage}
                    </TableCell>
                    <TableCell className="text-right font-bold text-emerald-600 dark:text-emerald-400 text-lg">
                      {act.carbon > 0 ? `-${act.carbon.toLocaleString()} kgCO₂e` : "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Card View */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {activitiesData.map((act) => (
              <div key={act.id} className="border border-border/50 rounded-xl p-4 space-y-4 bg-white dark:bg-slate-900 shadow-sm">
                <div className="flex items-center gap-3 border-b border-border/50 pb-3">
                  <div className={`h-12 w-12 rounded-xl ${act.bg} flex items-center justify-center shadow-sm shrink-0`}>
                    <act.icon className={`h-6 w-6 ${act.color}`} />
                  </div>
                  <span className="text-base font-semibold leading-tight">{act.title}</span>
                </div>
                <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm">
                  <div className="flex flex-col">
                    <span className="text-muted-foreground mb-1 text-xs">{lang === "th" ? "จำนวนครั้งที่ทำ" : "Total Count"}</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300 text-base">{act.count.toLocaleString()}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-muted-foreground mb-1 text-xs">{lang === "th" ? "คาร์บอนที่ลดได้" : "Carbon Saved"}</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 text-base">
                      {act.carbon > 0 ? `-${act.carbon.toLocaleString()} kg` : "-"}
                    </span>
                  </div>
                  <div className="flex flex-col col-span-2">
                    <span className="text-muted-foreground mb-1 text-xs">{lang === "th" ? "ข้อมูลการใช้งาน" : "Usage Data"}</span>
                    <span className="font-bold text-primary text-base">{act.usage}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
