"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Leaf, ScanLine, ArrowLeft, CheckCircle2, Bus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLang } from "@/context/LanguageContext";
import { toast } from "sonner";
import Link from "next/link";

function ScanQRContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isScan = searchParams.get("scan") === "true";
  const { lang, t } = useLang();
  
  const [scanning, setScanning] = useState(true);
  const [success, setSuccess] = useState(false);
  const [scannedActivity, setScannedActivity] = useState<any>(null);

  // Mock scanning process
  useEffect(() => {
    if (!isScan) return;
    
    const timer = setTimeout(() => {
      setScanning(false);
      setSuccess(true);
      // Randomly pick an activity
      const isBus = Math.random() > 0.5;
      setScannedActivity({
        title: isBus ? (lang === "th" ? "เช็คอินรถป๊อบ (MuvMi)" : "MuvMi Bus Check-in") : (lang === "th" ? "แยกขยะขวดพลาสติก" : "Plastic Bottle Recycling"),
        points: isBus ? 10 : 30,
        carbon: isBus ? 0.5 : 0.2,
        icon: isBus ? Bus : Trash2,
      });
      
      toast.success(lang === "th" ? "สแกนสำเร็จ!" : "Scan Successful!");
    }, 2500); // Fake scan delay

    return () => clearTimeout(timer);
  }, [isScan, lang]);

  if (!isScan) {
    // Fallback if not ?scan=true, just redirect to activities list or show manual form
    return (
      <div className="p-6 max-w-lg mx-auto text-center space-y-4">
        <h1 className="text-2xl font-bold">Submit Action Manually</h1>
        <p>Form goes here...</p>
        <Link href="/dashboard">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
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

      {/* Camera Viewport Mockup */}
      <div className="flex-1 relative overflow-hidden flex flex-col items-center justify-center">
        {/* Background Image simulating camera */}
        <div 
          className="absolute inset-0 opacity-40 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1590240402855-32e67df1488c?auto=format&fit=crop&q=80&w=600')" }}
        />
        <div className="absolute inset-0 bg-black/40" />

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
                {lang === "th" ? "เล็งกล้องไปที่ QR Code บนรถป๊อบหรือถังขยะ" : "Point camera at QR code on MuvMi bus or recycling bin"}
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

                <Link href="/dashboard" className="w-full mt-4 block">
                  <Button className="w-full text-lg h-12 rounded-full">
                    {lang === "th" ? "กลับสู่หน้าหลัก" : "Back to Dashboard"}
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
