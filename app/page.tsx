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
        <section className="relative overflow-hidden py-20 lg:py-32">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/10 -z-10" />
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10" />
          <div className="absolute top-1/2 -left-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl -z-10" />
          
          <div className="container mx-auto px-4 text-center">
            <Badge />
            <h1 className="mt-8 text-5xl md:text-7xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight">
              {lang === "th" ? (
                <>ก้าวเล็กๆ ของคุณ <br className="hidden md:block" /></>
              ) : (
                <>Your small steps <br className="hidden md:block" /></>
              )}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-500">
                {lang === "th" ? "สู่ก้าวที่ยิ่งใหญ่เพื่อโลกของเรา" : "towards a giant leap for our planet"}
              </span>
            </h1>
            <p className="mt-6 text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {lang === "th" 
                ? "ร่วมเป็นส่วนหนึ่งกับ CU GreenVerse เพื่อติดตามการเดินทางสู่ความยั่งยืนของคุณ สะสม Green Credits แข่งขันกับเพื่อน และช่วยจุฬาลงกรณ์มหาวิทยาลัยก้าวสู่ความเป็นกลางทางคาร์บอน" 
                : "Join CU GreenVerse to track your sustainability journey. Earn Green Credits, compete with friends, and help Chulalongkorn University achieve carbon neutrality."}
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/login">
                <Button size="lg" className="rounded-full h-14 px-8 text-lg w-full sm:w-auto shadow-lg shadow-primary/20">
                  {lang === "th" ? "เริ่มการเดินทางสีเขียว" : "Start Green Journey"}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline" className="rounded-full h-14 px-8 text-lg w-full sm:w-auto">
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
                description={lang === "th" ? "บันทึกกิจกรรมรักษ์โลกของคุณ เช่น การใช้บริการ MuvMi การแยกขยะ หรือการนำแก้วน้ำส่วนตัวมาเอง" : "Log your eco-friendly activities like taking MuvMi, recycling, or bringing your own cup."}
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

        {/* Partners Section */}
        <section id="partners" className="py-24 bg-muted/30">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{lang === "th" ? "พาร์ทเนอร์รักษ์โลกของเรา" : "Our Green Partners"}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12">
              {lang === "th" 
                ? "สะสมแต้มและรับสิทธิพิเศษจากร้านค้าและบริการที่เป็นมิตรต่อสิ่งแวดล้อมรอบรั้วมหาวิทยาลัย" 
                : "Earn points and enjoy exclusive benefits from eco-friendly shops and services around campus."}
            </p>
            
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
              {/* Mock partner logos */}
              <div className="flex items-center gap-2 font-bold text-xl"><Leaf className="text-emerald-500" /> CU Zero Waste</div>
              <div className="flex items-center gap-2 font-bold text-xl"><Award className="text-amber-500" /> Green Cafe</div>
              <div className="flex items-center gap-2 font-bold text-xl"><TrendingDown className="text-blue-500" /> MuvMi</div>
              <div className="flex items-center gap-2 font-bold text-xl">Anywheel</div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}

function Badge() {
  return (
    <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
      <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
      CU Sustainability Initiative
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="flex flex-col items-center text-center p-8 rounded-3xl bg-card border shadow-sm transition-all hover:shadow-md">
      <div className="h-20 w-20 rounded-2xl bg-muted/50 flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}
