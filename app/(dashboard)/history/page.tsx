"use client";

import { Suspense } from "react";
import { useLang } from "@/context/LanguageContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { History, ArrowUpRight, ArrowDownRight, FilterX } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function HistoryContent() {
  const { lang } = useLang();
  const searchParams = useSearchParams();
  const activityQuery = searchParams.get("activity");

  // Mock transaction data based on actual database entries from user screenshots
  const transactions = [
    { id: 1, type: "earn", title: lang === "th" ? "พกแก้วน้ำมาเองเมื่อซื้อเครื่องดื่มในโรงอาหาร" : "Bring Your Own Cup", points: 40, date: lang === "th" ? "4 ก.ค. 2026 08:30" : "July 4, 2026 08:30", category: lang === "th" ? "ขยะ" : "Waste" },
    { id: 2, type: "spend", title: lang === "th" ? "แลกถุงผ้ารักษ์โลก CU Green Tote Bag" : "Redeem CU Green Tote Bag", points: 1500, date: lang === "th" ? "3 ก.ค. 2026 13:15" : "July 3, 2026 13:15", category: lang === "th" ? "สินค้า" : "Merchandise" },
    { id: 3, type: "earn", title: lang === "th" ? "คัดแยกขยะพลาสติกที่ถังรีไซเคิลอย่างถูกต้อง" : "Waste Separation", points: 30, date: lang === "th" ? "2 ก.ค. 2026 16:45" : "July 2, 2026 16:45", category: lang === "th" ? "ขยะ" : "Waste" },
    { id: 4, type: "earn", title: lang === "th" ? "ใช้จักรยาน หรือ ANYWHEEL" : "Bicycle to Campus", points: 80, date: lang === "th" ? "2 ก.ค. 2026 09:00" : "July 2, 2026 09:00", category: lang === "th" ? "ขนส่ง" : "Transport" },
    { id: 5, type: "spend", title: lang === "th" ? "แลกกล่องสุ่มสินค้ารักษ์โลก Mystery Eco Box" : "Redeem Mystery Eco Box", points: 1000, date: lang === "th" ? "28 มิ.ย. 2026 19:20" : "June 28, 2026 19:20", category: lang === "th" ? "สินค้า" : "Merchandise" },
    { id: 6, type: "earn", title: lang === "th" ? "เดินทางด้วยรถ POP-BUS" : "Public Transport", points: 60, date: lang === "th" ? "25 มิ.ย. 2026 17:10" : "June 25, 2026 17:10", category: lang === "th" ? "ขนส่ง" : "Transport" },
    { id: 7, type: "earn", title: lang === "th" ? "เข้าร่วมกิจกรรมด้านสิ่งแวดล้อมของมหาวิทยาลัย" : "Join Sustainability Event", points: 200, date: lang === "th" ? "20 มิ.ย. 2026 10:00" : "June 20, 2026 10:00", category: lang === "th" ? "การเรียนรู้" : "Learning" },
  ];

  const filteredTransactions = activityQuery 
    ? transactions.filter(tx => 
        tx.title.toLowerCase().includes(activityQuery.toLowerCase()) || 
        // fallback robust match since UI title could be TH or EN
        (tx.id === 1 && ("Bring Your Own Cup".toLowerCase().includes(activityQuery.toLowerCase()) || "พกแก้วน้ำมาเอง".includes(activityQuery))) ||
        (tx.id === 3 && ("Waste Separation".toLowerCase().includes(activityQuery.toLowerCase()) || "คัดแยกขยะ".includes(activityQuery))) ||
        (tx.id === 4 && ("Bicycle to Campus".toLowerCase().includes(activityQuery.toLowerCase()) || "ใช้จักรยาน".includes(activityQuery))) ||
        (tx.id === 6 && ("Public Transport".toLowerCase().includes(activityQuery.toLowerCase()) || "เดินทางด้วยรถ".includes(activityQuery))) ||
        (tx.id === 7 && ("Join Sustainability Event".toLowerCase().includes(activityQuery.toLowerCase()) || "เข้าร่วมกิจกรรม".includes(activityQuery)))
      )
    : transactions;

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-4xl mx-auto">
      <div className="flex items-start sm:items-center justify-between flex-col sm:flex-row gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-xl">
            <History className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              {lang === "th" ? "ประวัติการใช้งาน" : "History"}
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              {activityQuery 
                ? (lang === "th" ? `ประวัติแต้มของกิจกรรม: ${activityQuery}` : `Points history for: ${activityQuery}`)
                : (lang === "th" ? "ดูรายการได้รับคะแนนและใช้คะแนนของคุณทั้งหมด" : "View all your points earning and spending transactions")}
            </p>
          </div>
        </div>
        {activityQuery && (
          <Link href="/history">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <FilterX className="h-4 w-4" />
              {lang === "th" ? "ลบตัวกรอง" : "Clear Filter"}
            </Button>
          </Link>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{lang === "th" ? "รายการล่าสุด" : "Recent Transactions"}</CardTitle>
          <CardDescription>
            {lang === "th" ? "ประวัติการสะสมและการใช้แต้ม Green Credits" : "Your Green Credits earning and spending history"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-4 border rounded-xl hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-full flex-shrink-0 ${tx.type === "earn" ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"}`}>
                      {tx.type === "earn" ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownRight className="h-5 w-5" />}
                    </div>
                    <div>
                      <p className="font-semibold text-sm md:text-base">{tx.title}</p>
                      <p className="text-xs text-muted-foreground">{tx.date}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`font-bold text-sm md:text-base whitespace-nowrap ${tx.type === "earn" ? "text-emerald-600" : "text-rose-600"}`}>
                      {tx.type === "earn" ? "+" : "-"}{tx.points} pts
                    </span>
                    <Badge variant="outline" className="text-[10px] text-muted-foreground hidden md:inline-flex">
                      {tx.category}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-muted-foreground border-2 border-dashed rounded-xl">
                <p>{lang === "th" ? "ไม่พบประวัติสำหรับกิจกรรมนี้" : "No history found for this activity."}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function HistoryPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <HistoryContent />
    </Suspense>
  );
}
