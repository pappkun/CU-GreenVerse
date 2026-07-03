"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Leaf, Award, TrendingDown, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { useLang } from "@/context/LanguageContext";

export default function LandingPage() {
  const { lang, t } = useLang();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 lg:py-28 bg-gradient-to-b from-emerald-50 via-white to-white">
          <div className="absolute inset-x-0 top-0 h-60 bg-emerald-100/60 blur-3xl -z-10" />
          <div className="absolute right-0 top-10 w-72 h-72 rounded-[48%] bg-amber-100/55 blur-3xl -z-10" />
          <div className="absolute left-1/2 bottom-0 -translate-x-1/2 w-96 h-72 rounded-full bg-emerald-50/60 blur-3xl -z-10" />

          <div className="container mx-auto px-4 text-center">
            <Badge />
            <h1 className="mt-8 text-5xl md:text-6xl font-semibold tracking-tight max-w-4xl mx-auto leading-tight text-slate-900">
              {lang === "th" ? (
                <>ก้าวเล็กๆ ของคุณ <br className="hidden md:block" /></>
              ) : (
                <>Your small steps <br className="hidden md:block" /></>
              )}
              <span className="block text-emerald-700 mt-2">
                {lang === "th" ? "สู่ก้าวที่ยิ่งใหญ่เพื่อโลกของเรา" : "towards a giant leap for our planet"}
              </span>
            </h1>
            <p className="mt-6 text-base md:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              {lang === "th" 
                ? "ร่วมเป็นส่วนหนึ่งกับ CU GreenVerse เพื่อติดตามการเดินทางสู่ความยั่งยืนของคุณ สะสม Green Credits แข่งขันกับเพื่อน และช่วยจุฬาลงกรณ์มหาวิทยาลัยก้าวสู่ความเป็นกลางทางคาร์บอน" 
                : "Join CU GreenVerse to track your sustainability journey. Earn Green Credits, compete with friends, and help Chulalongkorn University achieve carbon neutrality."}
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/login">
                <Button size="lg" className="rounded-full h-14 px-8 text-lg w-full sm:w-auto shadow-lg shadow-emerald-200/60">
                  {lang === "th" ? "เริ่มการเดินทางสีเขียว" : "Start Green Journey"}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline" className="rounded-full h-14 px-8 text-lg w-full sm:w-auto border-emerald-200 text-slate-700 hover:border-emerald-300 hover:text-slate-900">
                  {lang === "th" ? "เรียนรู้เพิ่มเติม" : "Learn More"}
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 border-y bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x border-border">
              <div className="py-4">
                <p className="text-4xl font-bold text-primary mb-2">12,500+</p>
                <p className="text-muted-foreground font-medium">{lang === "th" ? "นิสิตและบุคลากรที่เข้าร่วม" : "Students & Staff Joined"}</p>
              </div>
              <div className="py-4">
                <p className="text-4xl font-bold text-emerald-500 mb-2">45,000 kg</p>
                <p className="text-muted-foreground font-medium">{lang === "th" ? "คาร์บอนที่ลดได้ (CO₂)" : "Carbon Saved (CO₂)"}</p>
              </div>
              <div className="py-4">
                <p className="text-4xl font-bold text-blue-500 mb-2">2M+</p>
                <p className="text-muted-foreground font-medium">{lang === "th" ? "Green Credits ที่แจกจ่าย" : "Green Credits Issued"}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{lang === "th" ? "ระบบทำงานอย่างไร" : "How it Works"}</h2>
              <p className="text-lg text-muted-foreground">
                {lang === "th" ? "เปลี่ยนกิจวัตรประจำวันของคุณให้เป็นผลลัพธ์ทางสิ่งแวดล้อมที่วัดผลได้ผ่าน Gamification" : "Turn your daily routines into measurable environmental impact through gamification."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard 
                icon={<Leaf className="h-10 w-10 text-emerald-500" />}
                title={lang === "th" ? "บันทึกกิจกรรม" : "Log Actions"}
                description={lang === "th" ? "บันทึกกิจกรรมรักษ์โลกของคุณ เช่น การใช้บริการ POP-BUS การแยกขยะ หรือการนำแก้วน้ำส่วนตัวมาเอง" : "Log your eco-friendly activities like taking POP-BUS, recycling, or bringing your own cup."}
              />
              <FeatureCard 
                icon={<TrendingDown className="h-10 w-10 text-blue-500" />}
                title={lang === "th" ? "ติดตามการลดคาร์บอน" : "Track Carbon Reduction"}
                description={lang === "th" ? "ดูผลกระทบจากการกระทำของคุณแบบเรียลไทม์ ซึ่งแปลงเป็นกิโลกรัมคาร์บอน (kgCO₂e) ที่ช่วยลดให้แก่มหาวิทยาลัย" : "See your real-time impact translated to kgCO₂e saved for the university."}
              />
              <FeatureCard 
                icon={<Award className="h-10 w-10 text-amber-500" />}
                title={lang === "th" ? "รับของรางวัล" : "Earn Rewards"}
                description={lang === "th" ? "สะสม Green Credits และนำไปแลกรับของรางวัลพิเศษ ส่วนลดร้านค้า หรือไอเท็มสำหรับอวาตาร์ดิจิทัล" : "Collect Green Credits to redeem exclusive rewards, discounts, or digital avatar items."}
              />
            </div>
          </div>
        </section>


      </main>
    </div>
  );
}

function Badge() {
  return (
    <div className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50/90 px-4 py-2 text-sm font-semibold text-emerald-700 shadow-sm shadow-emerald-200/40">
      <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
      CU Sustainability Initiative
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="flex flex-col items-center text-center p-8 rounded-[2rem] border border-emerald-100 bg-white shadow-[0_18px_50px_-32px_rgba(16,185,129,0.25)] transition-all hover:shadow-[0_20px_55px_-28px_rgba(16,185,129,0.2)]">
      <div className="h-20 w-20 rounded-[1.5rem] bg-emerald-50 flex items-center justify-center mb-6 shadow-sm shadow-emerald-100/80">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3 text-slate-900">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{description}</p>
    </div>
  );
}
