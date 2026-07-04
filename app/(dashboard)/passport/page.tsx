"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Leaf, Award, Calendar, CheckCircle2 } from "lucide-react";
import { currentUser } from "@/data/mockUsers";
import { useLang } from "@/context/LanguageContext";

export default function PassportPage() {
  const { lang } = useLang();



  return (
    <div className="p-6 md:p-8 space-y-8 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{lang === "th" ? "สมุดพาสปอร์ตสีเขียว" : "Green Passport"}</h1>
          <p className="text-muted-foreground mt-1">
            {lang === "th" ? "บันทึกความสำเร็จด้านความยั่งยืนของคุณอย่างเป็นทางการ" : "Your official record of sustainability contributions."}
          </p>
        </div>
        <Button variant="outline" className="w-full md:w-auto">
          <Download className="mr-2 h-4 w-4" />
          {lang === "th" ? "ดาวน์โหลดเกียรติบัตร" : "Export Certificate"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-xl">{lang === "th" ? "สรุปผลการรักษ์โลก" : "Sustainability Summary"}</CardTitle>
            <CardDescription>{lang === "th" ? "รับรองโดย CU GreenVerse" : "Verified by CU GreenVerse"}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-background rounded-xl p-4 border shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">{lang === "th" ? "ลดคาร์บอน" : "Carbon Offset"}</p>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{currentUser.carbonSaved} <span className="text-sm font-medium">kg</span></p>
              </div>
              <div className="bg-background rounded-xl p-4 border shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">{lang === "th" ? "กิจกรรมสีเขียว" : "Green Actions"}</p>
                <p className="text-2xl font-bold">{currentUser.greenActions}</p>
              </div>
              <div className="bg-background rounded-xl p-4 border shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">{lang === "th" ? "ชั่วโมงจิตอาสา" : "Volunteer Hours"}</p>
                <p className="text-2xl font-bold text-blue-500">12.5 <span className="text-sm font-medium">hrs</span></p>
              </div>
              <div className="bg-background rounded-xl p-4 border shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">{lang === "th" ? "คะแนนรวม" : "Total Credits"}</p>
                <p className="text-2xl font-bold">{currentUser.greenCredits}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">{lang === "th" ? "รางวัลและความสำเร็จ" : "Achievements & Badges"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex flex-col items-center gap-2 w-20">
                  <div className={`h-16 w-16 rounded-full border-4 flex items-center justify-center shadow-sm ${i <= 4 ? 'border-primary/20 bg-primary/10' : 'border-muted bg-muted/50 opacity-50 grayscale'}`}>
                    <Award className={`h-8 w-8 ${i <= 4 ? 'text-primary' : 'text-muted-foreground'}`} />
                  </div>
                  <span className={`text-[10px] text-center font-medium leading-tight ${i > 4 ? 'text-muted-foreground' : ''}`}>
                    {i === 1 ? (lang === "th" ? 'ผู้เริ่มต้น' : 'Early Bird') : i === 2 ? 'Zero Waste' : i === 3 ? (lang === "th" ? 'นักเดินเท้า' : 'Walker') : i === 4 ? 'Eco Star' : (lang === "th" ? 'ล็อคอยู่' : 'Locked')}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
