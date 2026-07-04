"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useLang } from "@/context/LanguageContext";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Bike, CheckCircle2, Loader2, MapPin, AlertCircle, ArrowRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";

type ConnectionState = "idle" | "connecting" | "fetching" | "geofencing" | "success" | "error";

export default function AnywheelMockPage() {
  const { user, profile } = useAuth();
  const { lang } = useLang();
  const router = useRouter();
  const searchParams = useSearchParams();
  const activityId = searchParams.get("id") || "anywheel-mock-id";

  const [connState, setConnState] = useState<ConnectionState>("idle");
  const [progress, setProgress] = useState(0);

  // Mock Anywheel Trip Data
  const mockTrip = {
    distanceKm: 1.2,
    points: 80,
    carbonSaved: 1.2,
    startLat: 13.7367, // CU Campus coordinates
    startLng: 100.5320,
    endLat: 13.7380,
    endLng: 100.5330,
  };

  const handleConnect = () => {
    if (!user) return;
    setConnState("connecting");
    setProgress(15);

    // Simulate OAuth connection
    setTimeout(() => {
      setConnState("fetching");
      setProgress(40);

      // Simulate API Fetch
      setTimeout(() => {
        setConnState("geofencing");
        setProgress(70);

        // Simulate Geofence verification
        setTimeout(() => {
          setConnState("success");
          setProgress(100);
        }, 2000);
      }, 1500);
    }, 1500);
  };

  const handleClaim = async () => {
    if (!user || !profile) return;
    try {
      // 1. Log activity
      const { error: logError } = await supabase.from("activity_logs").insert({
        user_id: user.id,
        mission_id: activityId,
        evidence_url: "anywheel_api_sync",
        ai_verified: true, // Auto verified via API
        status: "approved",
        points_awarded: mockTrip.points,
        carbon_saved_record: mockTrip.carbonSaved,
        category: "transport"
      });
      if (logError) throw logError;

      // 2. Update user profile
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          green_credits: (profile.green_credits || 0) + mockTrip.points,
          carbon_saved_kg: (profile.carbon_saved_kg || 0) + mockTrip.carbonSaved,
          green_actions: (profile.green_actions || 0) + 1,
        })
        .eq("id", user.id);
      
      if (profileError) throw profileError;

      router.push("/dashboard?success=true");
    } catch (error) {
      console.error("Error claiming rewards:", error);
      alert("Failed to claim rewards. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 md:p-8 flex items-center justify-center">
      <Card className="w-full max-w-md border-border/50 shadow-xl overflow-hidden">
        {/* Header styling */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-6 flex flex-col items-center justify-center text-white">
          <div className="h-16 w-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4">
            <Bike className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-center">
            {lang === "th" ? "เชื่อมต่อบัญชี Anywheel" : "Connect Anywheel"}
          </h1>
          <p className="text-emerald-50 text-center mt-2 text-sm opacity-90">
            {lang === "th"
              ? "ซิงค์ข้อมูลการขี่จักรยานในพื้นที่จุฬาฯ เพื่อรับแต้มอัตโนมัติ"
              : "Sync your campus bike rides automatically to earn points."}
          </p>
        </div>

        <CardContent className="pt-6 space-y-6">
          {connState === "idle" && (
            <div className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-xl text-sm text-muted-foreground flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <p>
                  {lang === "th"
                    ? "ระบบจะทำการขอสิทธิ์เข้าถึงประวัติการเดินทางของคุณผ่าน Anywheel API เฉพาะทริปที่อยู่ในพื้นที่จุฬาลงกรณ์มหาวิทยาลัย (Geofencing) เท่านั้นที่จะถูกนำมาคิดคะแนน"
                    : "The system will request access to your ride history via Anywheel API. Only trips within CU campus (Geofencing) will be rewarded."}
                </p>
              </div>
            </div>
          )}

          {["connecting", "fetching", "geofencing"].includes(connState) && (
            <div className="space-y-6 py-4">
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="h-16 w-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    {connState === "geofencing" ? (
                      <MapPin className="h-6 w-6 text-primary" />
                    ) : (
                      <Bike className="h-6 w-6 text-primary" />
                    )}
                  </div>
                </div>
                
                <div className="text-center space-y-1">
                  <h3 className="font-bold">
                    {connState === "connecting" && (lang === "th" ? "กำลังเชื่อมต่อ API..." : "Connecting to API...")}
                    {connState === "fetching" && (lang === "th" ? "กำลังดึงข้อมูลทริปล่าสุด..." : "Fetching recent trips...")}
                    {connState === "geofencing" && (lang === "th" ? "กำลังตรวจสอบพื้นที่ (Geofencing)..." : "Verifying Geofence bounds...")}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {connState === "geofencing" && (
                      <span className="font-mono">Lat: {mockTrip.startLat}, Lng: {mockTrip.startLng}</span>
                    )}
                  </p>
                </div>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {connState === "success" && (
            <div className="space-y-6 py-2">
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="h-16 w-16 bg-emerald-100 dark:bg-emerald-900/40 rounded-full flex items-center justify-center mb-2">
                  <CheckCircle2 className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                  {lang === "th" ? "พบข้อมูลการเดินทาง!" : "Ride Found!"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {lang === "th" 
                    ? "ตรวจสอบพิกัด Geofence: ภายในพื้นที่จุฬาลงกรณ์มหาวิทยาลัย" 
                    : "Geofence verified: Inside CU Campus"}
                </p>
              </div>

              <div className="bg-muted/50 rounded-2xl p-4 grid grid-cols-2 gap-4 border border-border/50">
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase text-muted-foreground">
                    {lang === "th" ? "ระยะทาง" : "Distance"}
                  </p>
                  <p className="text-xl font-bold">{mockTrip.distanceKm} <span className="text-sm font-medium">km</span></p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase text-muted-foreground">
                    {lang === "th" ? "ลดคาร์บอน" : "CO₂ Saved"}
                  </p>
                  <p className="text-xl font-bold text-blue-500">{mockTrip.carbonSaved} <span className="text-sm font-medium">kg</span></p>
                </div>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="pb-6 px-6">
          {connState === "idle" && (
            <div className="flex gap-3 w-full">
              <Button variant="ghost" className="w-full" onClick={() => router.back()}>
                {lang === "th" ? "ยกเลิก" : "Cancel"}
              </Button>
              <Button className="w-full gap-2" onClick={handleConnect}>
                {lang === "th" ? "เชื่อมต่อบัญชี" : "Connect Account"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          )}

          {connState === "success" && (
            <Button className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700" onClick={handleClaim}>
              {lang === "th" ? `รับ +${mockTrip.points} แต้ม` : `Claim +${mockTrip.points} pts`}
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
