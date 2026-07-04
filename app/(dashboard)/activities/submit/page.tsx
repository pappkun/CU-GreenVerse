"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Leaf, ScanLine, ArrowLeft, CheckCircle2, Bus, Trash2, Upload, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useLang } from "@/context/LanguageContext";
import { toast } from "sonner";
import Link from "next/link";
import confetti from "canvas-confetti";
import { Scanner } from "@yudiel/react-qr-scanner";

function ScanQRContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isScan = searchParams.get("scan") === "true";
  const { lang, t } = useLang();
  
  const [scanning, setScanning] = useState(true);
  const [success, setSuccess] = useState(false);
  const [scannedActivity, setScannedActivity] = useState<any>(null);
  
  // Form State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<string>("");
  const [hasImage, setHasImage] = useState(false);

  const handleScan = (detectedCodes: any) => {
    if (detectedCodes && detectedCodes.length > 0 && !success) {
      const qrData = detectedCodes[0].rawValue;
      
      // ถ้ารหัสใน QR Code ตรงกับที่เรากำหนดไว้
      if (qrData === "POP-BUS" || qrData === "RECYCLE_CU") {
        const isBus = qrData === "POP-BUS";
        const pointsToEarn = isBus ? 5 : 10;

        // Check daily limit (100 pts)
        const today = new Date().toISOString().split('T')[0];
        const earnedTodayKey = `greenverse_earned_${today}`;
        const earnedToday = parseInt(localStorage.getItem(earnedTodayKey) || '0', 10);

        if (earnedToday + pointsToEarn > 100) {
          toast.error(lang === "th" ? "คุณได้รับแต้มสูงสุดต่อวันแล้ว (100 pts)" : "Daily point limit reached (100 pts)");
          return; // Stop here, don't give points
        }

        setScanning(false);
        setSuccess(true);
        
        // Trigger confetti 🎉
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10b981', '#3b82f6', '#f59e0b'],
          zIndex: 100
        });

        // Record points
        localStorage.setItem(earnedTodayKey, (earnedToday + pointsToEarn).toString());

        // ตรวจสอบว่าเป็น QR ของอะไร
        setScannedActivity({
          title: isBus ? (lang === "th" ? "เช็คอินรถป๊อบ (POP-BUS)" : "POP-BUS Check-in") : (lang === "th" ? "แยกขยะขวดพลาสติก" : "Plastic Bottle Recycling"),
          points: pointsToEarn,
          carbon: isBus ? 0.5 : 0.2,
          icon: isBus ? Bus : Trash2,
        });
        
        toast.success(lang === "th" ? "สแกนสำเร็จ!" : "Scan Successful!");
      }
      // ถ้า QR Code ไม่ตรง จะไม่เกิดอะไรขึ้น (ไม่ให้แอปบั๊กเวลาเผลอไปสแกนอันอื่น)
    }
  };

  const handleManualSubmit = () => {
    if (!selectedActivity || !hasImage) {
      toast.error(lang === "th" ? "กรุณาเลือกกิจกรรมและอัปโหลดรูปภาพ" : "Please select an activity and upload evidence");
      return;
    }

    const pointsMap: Record<string, number> = { byoc: 15, recycle: 10, food: 20, bag: 10 };
    const pointsToEarn = pointsMap[selectedActivity] || 10;

    // Check daily limit (100 pts)
    const today = new Date().toISOString().split('T')[0];
    const earnedTodayKey = `greenverse_earned_${today}`;
    const earnedToday = parseInt(localStorage.getItem(earnedTodayKey) || '0', 10);

    if (earnedToday + pointsToEarn > 100) {
      toast.error(lang === "th" ? "คุณได้รับแต้มสูงสุดต่อวันแล้ว (100 pts)" : "Daily point limit reached (100 pts)");
      return; // Stop here, don't simulate API call
    }
    
    setIsSubmitting(true);
    // Simulate API call and AI Verification
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      
      // Record points
      localStorage.setItem(earnedTodayKey, (earnedToday + pointsToEarn).toString());

      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#3b82f6', '#f59e0b'],
        zIndex: 100
      });
      setScannedActivity({
        title: lang === "th" ? "บันทึกสำเร็จ" : "Action Logged",
        points: pointsToEarn,
        carbon: 0.3,
        icon: Leaf,
      });
      toast.success(lang === "th" ? "บันทึกกิจกรรมเรียบร้อยแล้ว!" : "Activity successfully logged!");
    }, 1500);
  };

  if (!isScan) {
    if (success) {
      return (
        <div className="p-6 max-w-lg mx-auto flex flex-col items-center animate-in fade-in zoom-in duration-500 pt-20">
          <div className="h-24 w-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/20">
            <CheckCircle2 className="h-12 w-12 text-emerald-600" />
          </div>
          
          <Card className="w-full text-center border-emerald-100 shadow-xl shadow-emerald-500/10">
            <CardContent className="pt-6 space-y-4">
              <h2 className="text-2xl font-bold text-slate-900">
                {lang === "th" ? "กิจกรรมได้รับการยืนยัน!" : "Action Verified!"}
              </h2>
              
              <div className="w-full p-4 bg-emerald-50 rounded-xl space-y-3">
                <div className="flex items-center justify-center gap-2 text-emerald-700">
                  <Leaf className="h-5 w-5" />
                  <span className="font-semibold">{lang === "th" ? "กิจกรรมรักษ์โลก" : "Eco-friendly Action"}</span>
                </div>
                <div className="flex justify-around pt-3 border-t border-emerald-200">
                  <div>
                    <p className="text-2xl font-bold text-emerald-600">+20</p>
                    <p className="text-xs text-emerald-700/70">Green Credits</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-500">-0.3</p>
                    <p className="text-xs text-blue-700/70">kgCO₂e Saved</p>
                  </div>
                </div>
              </div>

              <Link href="/profile?tab=history" className="w-full mt-4 block">
                <Button className="w-full text-lg h-12 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-md">
                  {lang === "th" ? "ดูประวัติกิจกรรม" : "View Activity History"}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      );
    }

    return (
      <div className="p-4 sm:p-6 max-w-lg mx-auto space-y-6 pt-8">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              {lang === "th" ? "บันทึกกิจกรรม" : "Log Action"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {lang === "th" ? "บันทึกหลักฐานเพื่อรับ Green Credits" : "Submit evidence to earn Green Credits"}
            </p>
          </div>
        </div>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>{lang === "th" ? "ข้อมูลกิจกรรม" : "Activity Details"}</CardTitle>
            <CardDescription>
              {lang === "th" ? "AI จะทำการตรวจสอบภาพถ่ายของคุณโดยอัตโนมัติ" : "AI will automatically verify your photo."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label>{lang === "th" ? "เลือกประเภทกิจกรรม" : "Select Activity Type"}</Label>
              <select 
                className="flex h-12 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={selectedActivity}
                onChange={(e) => setSelectedActivity(e.target.value)}
              >
                <option value="" disabled>{lang === "th" ? "เลือกกิจกรรม..." : "Select an activity..."}</option>
                <option value="byoc">{lang === "th" ? "พกแก้วน้ำมาเอง (BYOC)" : "Bring Your Own Cup (BYOC)"}</option>
                <option value="recycle">{lang === "th" ? "แยกขยะขวดพลาสติก" : "Recycle Plastic Bottles"}</option>
                <option value="food">{lang === "th" ? "ทานอาหารหมดจาน (Zero Food Waste)" : "Zero Food Waste"}</option>
                <option value="bag">{lang === "th" ? "ใช้ถุงผ้าช้อปปิ้ง" : "Use Reusable Bag"}</option>
              </select>
            </div>

            <div className="space-y-3">
              <Label>{lang === "th" ? "อัปโหลดภาพหลักฐาน" : "Upload Evidence Photo"}</Label>
              <div 
                className={`border-2 border-dashed rounded-2xl p-8 text-center flex flex-col items-center justify-center gap-3 transition-colors cursor-pointer ${
                  hasImage ? 'border-primary bg-primary/5' : 'border-slate-300 hover:bg-slate-50'
                }`}
                onClick={() => setHasImage(true)}
              >
                {hasImage ? (
                  <>
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <CheckCircle2 className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-primary">{lang === "th" ? "อัปโหลดรูปภาพแล้ว" : "Photo uploaded"}</p>
                      <p className="text-xs text-muted-foreground mt-1">{lang === "th" ? "แตะเพื่อเปลี่ยนรูป" : "Tap to change"}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center">
                      <Camera className="h-6 w-6 text-slate-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-700">{lang === "th" ? "แตะเพื่อถ่ายรูป หรือ เลือกจากอัลบั้ม" : "Tap to take photo or choose from gallery"}</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            <Button 
              className="w-full h-12 rounded-xl text-base font-semibold shadow-md" 
              onClick={handleManualSubmit}
              disabled={isSubmitting || !selectedActivity || !hasImage}
            >
              {isSubmitting ? (
                <>{lang === "th" ? "กำลังตรวจสอบด้วย AI..." : "AI Verifying..."}</>
              ) : (
                <>{lang === "th" ? "ส่งหลักฐาน" : "Submit Evidence"}</>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-black text-white relative">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-4 flex items-center z-10 bg-gradient-to-b from-black/80 to-transparent">
        <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 rounded-full" onClick={() => router.back()}>
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="flex-1 text-center font-semibold text-lg mr-10">
          {lang === "th" ? "สแกน QR Code" : "Scan QR Code"}
        </h1>
      </div>

      {/* Camera Viewport */}
      <div className="flex-1 relative overflow-hidden flex flex-col items-center justify-center">
        {/* Actual Video Element */}
        {!success && (
          <div className="absolute inset-0 w-full h-full [&>div]:!pb-0 [&>div>video]:!object-cover [&>div>video]:!h-full">
            <Scanner 
              onScan={handleScan}
              components={{
                finder: false // We use our own finder UI
              }}
              styles={{
                container: { width: "100%", height: "100%" },
                video: { width: "100%", height: "100%", objectFit: "cover" }
              }}
            />
          </div>
        )}

        {/* Background Image simulating camera (Fallback if camera blocked) */}
        <div 
          className={`absolute inset-0 opacity-40 bg-cover bg-center ${!success ? '-z-10' : ''}`}
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1590240402855-32e67df1488c?auto=format&fit=crop&q=80&w=600')" }}
        />
        <div className={`absolute inset-0 bg-black/40 ${!success ? '-z-10' : ''}`} />

        {!success ? (
          <>
            {/* Scanner Frame */}
            <div className="relative z-10 w-64 h-64 border-2 border-primary/50 rounded-xl overflow-hidden shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]">
              {/* Animated Scan Line */}
              <div className="w-full h-1 bg-primary absolute left-0 animate-[scan_2s_ease-in-out_infinite]" style={{ boxShadow: "0 0 10px 2px hsl(var(--primary))" }} />
              
              {/* Corner brackets */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-xl" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-xl" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-xl" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-xl" />
            </div>
            
            <div className="relative z-10 mt-8 text-center space-y-2">
              <ScanLine className="h-8 w-8 mx-auto animate-pulse text-primary" />
              <p className="font-medium">
                {lang === "th" ? "กำลังค้นหา QR Code..." : "Looking for QR Code..."}
              </p>
              <p className="text-sm text-white/70">
                {lang === "th" ? "สแกน QR Code ที่รถป๊อบหรือจุดแยกขยะ" : "Point camera at QR code on POP-BUS or recycling bin"}
              </p>
            </div>
          </>
        ) : (
          /* Success State */
          <div className="relative z-10 flex flex-col items-center animate-in fade-in zoom-in duration-500 p-6 w-full max-w-sm">
            <div className="h-24 w-24 bg-primary rounded-full flex items-center justify-center mb-6 shadow-lg shadow-primary/30">
              <CheckCircle2 className="h-12 w-12 text-primary-foreground" />
            </div>
            
            <Card className="w-full bg-white/10 backdrop-blur-md border-white/20 text-white shadow-xl">
              <CardContent className="pt-6 space-y-4 flex flex-col items-center text-center">
                <h2 className="text-2xl font-bold">
                  {lang === "th" ? "บันทึกสำเร็จ!" : "Action Logged!"}
                </h2>
                
                {scannedActivity && (
                  <div className="w-full p-4 bg-black/40 rounded-xl space-y-3">
                    <div className="flex items-center justify-center gap-2 text-primary">
                      <scannedActivity.icon className="h-5 w-5" />
                      <span className="font-semibold">{scannedActivity.title}</span>
                    </div>
                    <div className="flex justify-around pt-2 border-t border-white/10">
                      <div>
                        <p className="text-2xl font-bold text-primary">+{scannedActivity.points}</p>
                        <p className="text-xs text-white/70">Green Credits</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-emerald-400">-{scannedActivity.carbon}</p>
                        <p className="text-xs text-white/70">kgCO₂e Saved</p>
                      </div>
                    </div>
                  </div>
                )}

                <Link href="/profile?tab=history" className="w-full mt-4 block">
                  <Button className="w-full text-lg h-12 rounded-full">
                    {lang === "th" ? "ดูประวัติกิจกรรม" : "View Activity History"}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes scan {
          0% { top: 0%; }
          50% { top: 100%; }
          100% { top: 0%; }
        }
      `}</style>
    </div>
  );
}

export default function ScanQRPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center bg-black text-white">Loading scanner...</div>}>
      <ScanQRContent />
    </Suspense>
  );
}
