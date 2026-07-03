import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Leaf, Award, TrendingDown, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function LandingPage() {
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
              ก้าวเล็กๆ ของคุณ <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-500">
                สู่ก้าวที่ยิ่งใหญ่เพื่อโลกของเรา
              </span>
            </h1>
            <p className="mt-6 text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              ร่วมเป็นส่วนหนึ่งกับ CU GreenVerse เพื่อติดตามการเดินทางสู่ความยั่งยืนของคุณ
              สะสม Green Credits แข่งขันกับเพื่อน และช่วยจุฬาลงกรณ์มหาวิทยาลัยก้าวสู่ความเป็นกลางทางคาร์บอน
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/login">
                <Button size="lg" className="rounded-full h-14 px-8 text-lg w-full sm:w-auto shadow-lg shadow-primary/20">
                  เริ่มการเดินทางสีเขียว
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline" className="rounded-full h-14 px-8 text-lg w-full sm:w-auto">
                  เรียนรู้เพิ่มเติม
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
                <p className="text-muted-foreground font-medium">นิสิตและบุคลากรที่เข้าร่วม</p>
              </div>
              <div className="py-4">
                <p className="text-4xl font-bold text-emerald-500 mb-2">45,000 kg</p>
                <p className="text-muted-foreground font-medium">คาร์บอนที่ลดได้ (CO₂)</p>
              </div>
              <div className="py-4">
                <p className="text-4xl font-bold text-blue-500 mb-2">2M+</p>
                <p className="text-muted-foreground font-medium">Green Credits ที่แจกจ่าย</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">ระบบทำงานอย่างไร</h2>
              <p className="text-lg text-muted-foreground">
                เปลี่ยนกิจวัตรประจำวันของคุณให้เป็นผลลัพธ์ทางสิ่งแวดล้อมที่วัดผลได้ผ่าน Gamification
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard 
                icon={<Leaf className="h-10 w-10 text-emerald-500" />}
                title="บันทึกกิจกรรม"
                description="บันทึกกิจกรรมรักษ์โลกของคุณ เช่น การใช้บริการ MuvMi การแยกขยะ หรือการนำแก้วน้ำส่วนตัวมาเอง"
              />
              <FeatureCard 
                icon={<TrendingDown className="h-10 w-10 text-blue-500" />}
                title="ติดตามการลดคาร์บอน"
                description="ดูผลกระทบจากการกระทำของคุณแบบเรียลไทม์ ซึ่งแปลงเป็นกิโลกรัมคาร์บอน (kgCO₂e) ที่ช่วยลดให้แก่มหาวิทยาลัย"
              />
              <FeatureCard 
                icon={<Award className="h-10 w-10 text-amber-500" />}
                title="รับของรางวัล"
                description="สะสม Green Credits และนำไปแลกรับของรางวัลพิเศษ ส่วนลดร้านค้า หรือไอเท็มสำหรับอวาตาร์ดิจิทัล"
              />
            </div>
          </div>
        </section>

      </main>
      <Footer />
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
