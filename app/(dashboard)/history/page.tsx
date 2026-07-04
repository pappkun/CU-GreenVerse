"use client";

import { useLang } from "@/context/LanguageContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { History, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function HistoryPage() {
  const { lang } = useLang();

  // Mock transaction data based on actual mockActivities and mockRewards
  const transactions = [
    { id: 1, type: "earn", title: lang === "th" ? "นำแก้วมาเอง" : "Bring your own cup", points: 10, date: lang === "th" ? "4 ก.ค. 2026 08:30" : "July 4, 2026 08:30", category: lang === "th" ? "ลดขยะ" : "Reduce" },
    { id: 2, type: "spend", title: lang === "th" ? "แลกส่วนลด True Coffee 30 บาท" : "Redeem True Coffee Discount 30 THB", points: 500, date: lang === "th" ? "3 ก.ค. 2026 13:15" : "July 3, 2026 13:15", category: lang === "th" ? "คูปอง" : "Coupon" },
    { id: 3, type: "earn", title: lang === "th" ? "แยกขยะ" : "Recycle Waste", points: 10, date: lang === "th" ? "2 ก.ค. 2026 16:45" : "July 2, 2026 16:45", category: lang === "th" ? "รีไซเคิล" : "Recycle" },
    { id: 4, type: "earn", title: lang === "th" ? "ปั่นจักรยาน Anywheel" : "Ride Anywheel bike", points: 20, date: lang === "th" ? "2 ก.ค. 2026 09:00" : "July 2, 2026 09:00", category: lang === "th" ? "การเดินทาง" : "Transport" },
    { id: 5, type: "spend", title: lang === "th" ? "แลกกระเป๋าผ้า CU GreenVerse" : "Redeem CU GreenVerse Tote Bag", points: 3000, date: lang === "th" ? "28 มิ.ย. 2026 19:20" : "June 28, 2026 19:20", category: lang === "th" ? "ของที่ระลึก" : "Merchandise" },
    { id: 6, type: "earn", title: lang === "th" ? "นั่งรถป๊อป" : "Take Pop Bus", points: 15, date: lang === "th" ? "25 มิ.ย. 2026 17:10" : "June 25, 2026 17:10", category: lang === "th" ? "การเดินทาง" : "Transport" },
  ];

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-primary/10 rounded-xl">
          <History className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {lang === "th" ? "ประวัติการใช้งาน" : "History"}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {lang === "th" ? "ดูรายการได้รับคะแนนและใช้คะแนนของคุณทั้งหมด" : "View all your points earning and spending transactions"}
          </p>
        </div>
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
            {transactions.map((tx) => (
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
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
