"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useLang } from "@/context/LanguageContext";
import {
  getOngoingTrip,
  endTrip,
  checkAndAutoCheckout,
  getUserLocation,
  calcDistanceKm,
  GPS_POLL_INTERVAL_MS,
  CREDITS_PER_KM,
} from "@/lib/popbus";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Bus, MapPin, Leaf, Clock, CheckCircle2, QrCode } from "lucide-react";

export default function PopBusPage() {
  const { user } = useAuth();
  const { lang } = useLang();
  const router = useRouter();

  const [ongoingTrip, setOngoingTrip] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [elapsed, setElapsed] = useState(0); // วินาที
  const [currentKm, setCurrentKm] = useState(0);
  const [autoCheckedOut, setAutoCheckedOut] = useState(false);
  const [checkoutResult, setCheckoutResult] = useState<{ km: number; credits: number } | null>(null);

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const clockRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ─── Load ongoing trip ───────────────────────────────────────────────────
  useEffect(() => {
    if (!user) return;
    getOngoingTrip(user.id).then((trip) => {
      setOngoingTrip(trip);
      setIsLoading(false);
    });
  }, [user]);

  // ─── Clock: นับเวลา ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!ongoingTrip) return;
    const start = new Date(ongoingTrip.boarded_at).getTime();
    clockRef.current = setInterval(() => {
      setElapsed(Math.floor((Date.now() - start) / 1000));
    }, 1000);
    return () => { if (clockRef.current) clearInterval(clockRef.current); };
  }, [ongoingTrip]);

  // ─── GPS Polling: auto checkout ─────────────────────────────────────────
  const pollGPS = useCallback(async () => {
    if (!ongoingTrip || !user) return;
    try {
      const coords = await getUserLocation();
      const km = calcDistanceKm(
        ongoingTrip.boarded_lat, ongoingTrip.boarded_lng,
        coords.latitude, coords.longitude
      );
      setCurrentKm(km);

      const checkedOut = await checkAndAutoCheckout(
        ongoingTrip.id,
        ongoingTrip.bus_id,
        coords.latitude,
        coords.longitude
      );

      if (checkedOut) {
        setAutoCheckedOut(true);
        setCheckoutResult({ km, credits: Math.round(km * CREDITS_PER_KM) });
        setOngoingTrip(null);
        if (pollRef.current) clearInterval(pollRef.current);
        if (clockRef.current) clearInterval(clockRef.current);
      }
    } catch (e) {
      console.error("GPS poll error:", e);
    }
  }, [ongoingTrip, user]);

  useEffect(() => {
    if (!ongoingTrip) return;
    pollRef.current = setInterval(pollGPS, GPS_POLL_INTERVAL_MS);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [ongoingTrip, pollGPS]);

  // ─── Manual Checkout ─────────────────────────────────────────────────────
  async function handleManualCheckout() {
    if (!ongoingTrip) return;
    try {
      const coords = await getUserLocation();
      const { distanceKm, credits } = await endTrip(
        ongoingTrip.id,
        coords.latitude,
        coords.longitude
      );
      setCheckoutResult({ km: distanceKm, credits });
      setOngoingTrip(null);
      if (pollRef.current) clearInterval(pollRef.current);
      if (clockRef.current) clearInterval(clockRef.current);
    } catch (e) {
      alert(lang === "th" ? "ไม่สามารถระบุตำแหน่งได้" : "Cannot get location");
    }
  }

  // ─── Format elapsed ──────────────────────────────────────────────────────
  function formatTime(sec: number) {
    const m = Math.floor(sec / 60).toString().padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  // ─── Render: Loading ─────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  // ─── Render: Checkout Result ─────────────────────────────────────────────
  if (checkoutResult) {
    return (
      <div className="p-6 max-w-lg mx-auto flex flex-col items-center gap-6 pt-20">
        <div className="h-20 w-20 rounded-full bg-emerald-100 dark:bg-emerald-950/40 flex items-center justify-center">
          <CheckCircle2 className="h-10 w-10 text-emerald-500" />
        </div>
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold">{lang === "th" ? "ลงรถเรียบร้อย!" : "Trip Completed!"}</h1>
          <p className="text-muted-foreground text-sm">
            {autoCheckedOut
              ? (lang === "th" ? "ระบบตรวจพบว่าคุณออกจากรถแล้ว" : "System detected you left the bus")
              : (lang === "th" ? "คุณกดลงรถด้วยตนเอง" : "You manually checked out")}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full">
          <Card className="border-border/50">
            <CardContent className="pt-6 text-center">
              <MapPin className="h-5 w-5 mx-auto mb-2 text-blue-500" />
              <p className="text-2xl font-bold">{checkoutResult.km.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">km</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="pt-6 text-center">
              <Leaf className="h-5 w-5 mx-auto mb-2 text-emerald-500" />
              <p className="text-2xl font-bold text-emerald-500">+{checkoutResult.credits}</p>
              <p className="text-xs text-muted-foreground">Green Credits</p>
            </CardContent>
          </Card>
        </div>

        <Button className="w-full" onClick={() => router.push("/dashboard")}>
          {lang === "th" ? "กลับหน้าหลัก" : "Back to Dashboard"}
        </Button>
      </div>
    );
  }

  // ─── Render: Ongoing Trip ─────────────────────────────────────────────────
  if (ongoingTrip) {
    return (
      <div className="p-6 max-w-lg mx-auto space-y-6 pt-10">
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-2 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 px-4 py-1.5 rounded-full text-sm font-medium">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            {lang === "th" ? "กำลังนั่งรถอยู่" : "On Board"}
          </div>
          <h1 className="text-3xl font-bold mt-3">{ongoingTrip.bus_id}</h1>
          <p className="text-muted-foreground text-sm">
            {lang === "th" ? "ขึ้นรถเมื่อ" : "Boarded at"}{" "}
            {new Date(ongoingTrip.boarded_at).toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="border-border/50">
            <CardContent className="pt-4 pb-4 text-center">
              <Clock className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
              <p className="text-xl font-bold font-mono">{formatTime(elapsed)}</p>
              <p className="text-[11px] text-muted-foreground">{lang === "th" ? "เวลา" : "Time"}</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="pt-4 pb-4 text-center">
              <MapPin className="h-4 w-4 mx-auto mb-1 text-blue-500" />
              <p className="text-xl font-bold">{currentKm.toFixed(2)}</p>
              <p className="text-[11px] text-muted-foreground">km</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="pt-4 pb-4 text-center">
              <Leaf className="h-4 w-4 mx-auto mb-1 text-emerald-500" />
              <p className="text-xl font-bold text-emerald-500">~{Math.round(currentKm * CREDITS_PER_KM)}</p>
              <p className="text-[11px] text-muted-foreground">Credits</p>
            </CardContent>
          </Card>
        </div>

        {/* Info */}
        <div className="rounded-2xl border border-border/50 bg-muted/30 p-4 text-sm text-muted-foreground space-y-1">
          <p className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
            {lang === "th"
              ? "ระบบจะตรวจตำแหน่งของคุณทุก 30 วินาที"
              : "System checks your location every 30 seconds"}
          </p>
          <p className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
            {lang === "th"
              ? "เมื่อคุณห่างจากรถ 100m ระบบจะลงรถให้อัตโนมัติ"
              : "Auto checkout when 100m away from the bus"}
          </p>
        </div>

        {/* Manual checkout */}
        <Button
          variant="outline"
          className="w-full border-destructive/50 text-destructive hover:bg-destructive/10"
          onClick={handleManualCheckout}
        >
          <Bus className="h-4 w-4 mr-2" />
          {lang === "th" ? "กดลงรถด้วยตนเอง" : "Manual Checkout"}
        </Button>
      </div>
    );
  }

  // ─── Render: No Trip — Show Scan Button ──────────────────────────────────
  return (
    <div className="p-6 max-w-lg mx-auto flex flex-col items-center gap-8 pt-16">
      {/* Hero */}
      <div className="relative">
        <div className="h-32 w-32 rounded-3xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-xl shadow-emerald-500/30">
          <Bus className="h-16 w-16 text-white" />
        </div>
        <span className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shadow">
          POP
        </span>
      </div>

      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">POP BUS Tracker</h1>
        <p className="text-muted-foreground text-sm max-w-xs">
          {lang === "th"
            ? "สแกน QR Code บนรถ POP BUS เพื่อเริ่มบันทึกการเดินทางและรับ Green Credits"
            : "Scan the QR Code on the POP BUS to start tracking your trip and earn Green Credits"}
        </p>
      </div>

      {/* How it works */}
      <div className="w-full space-y-3">
        {[
          { step: "1", title: lang === "th" ? "สแกน QR บนรถ" : "Scan QR on bus", icon: QrCode },
          { step: "2", title: lang === "th" ? "ระบบติดตาม GPS อัตโนมัติ" : "GPS auto-tracking", icon: MapPin },
          { step: "3", title: lang === "th" ? "รับ Credits เมื่อลงรถ" : "Earn credits on arrival", icon: Leaf },
        ].map(({ step, title, icon: Icon }) => (
          <div key={step} className="flex items-center gap-4 rounded-xl border border-border/50 bg-card p-3.5">
            <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 font-bold text-sm">
              {step}
            </div>
            <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <p className="text-sm font-medium">{title}</p>
          </div>
        ))}
      </div>

      <Button
        size="lg"
        className="w-full h-14 rounded-2xl text-base font-bold shadow-lg shadow-primary/20"
        onClick={() => router.push("/pop-bus/scan")}
      >
        <QrCode className="h-5 w-5 mr-2" />
        {lang === "th" ? "สแกน QR ขึ้นรถ" : "Scan QR to Board"}
      </Button>
    </div>
  );
}
