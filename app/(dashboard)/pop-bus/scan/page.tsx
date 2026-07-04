"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useLang } from "@/context/LanguageContext";
import { startTrip, getUserLocation } from "@/lib/popbus";
import jsQR from "jsqr";
import { QrCode, Camera, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

type ScanState = "scanning" | "processing" | "error" | "success";

function PopBusScanPageContent() {
  const { user } = useAuth();
  const { lang } = useLang();
  const router = useRouter();
  const searchParams = useSearchParams();
  const mockBusId = searchParams.get("mock_bus_id"); // mock mode

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [scanState, setScanState] = useState<ScanState>("scanning");
  const [errorMsg, setErrorMsg] = useState("");
  const [scannedBus, setScannedBus] = useState("");

  // ─── Mock Scan Mode ────────────────────────────────────────────────────
  useEffect(() => {
    if (mockBusId) {
      // ใช้ GPS ของ CU เป็น mock location (13.7367, 100.5320)
      handleQRCode(`popbus://board?bus_id=${mockBusId}`, {
        latitude: 13.7367,
        longitude: 100.532,
      } as GeolocationCoordinates);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mockBusId]);

  // ─── Start Camera (ข้ามถ้าเป็น mock mode) ─────────────────────────────
  useEffect(() => {
    if (mockBusId) return; // ไม่เปิดกล้องถ้าเป็น mock
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment", width: 640, height: 640 },
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          requestAnimationFrame(scanFrame);
        }
      } catch {
        setErrorMsg(
          lang === "th"
            ? "ไม่สามารถเปิดกล้องได้ กรุณาอนุญาตการใช้งานกล้อง"
            : "Cannot open camera. Please allow camera access."
        );
        setScanState("error");
      }
    }
    startCamera();
    return () => {
      if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Scan Frame ────────────────────────────────────────────────────────
  function scanFrame() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.readyState !== video.HAVE_ENOUGH_DATA) {
      animRef.current = requestAnimationFrame(scanFrame);
      return;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height);
    if (code) {
      handleQRCode(code.data);
      return;
    }
    animRef.current = requestAnimationFrame(scanFrame);
  }

  // ─── Handle QR Code ────────────────────────────────────────────────────
  async function handleQRCode(
    raw: string,
    mockCoords?: Pick<GeolocationCoordinates, "latitude" | "longitude">
  ) {
    if (!user) return;
    setScanState("processing");

    // หยุด camera
    if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
    if (animRef.current) cancelAnimationFrame(animRef.current);

    // Parse bus_id จาก QR เช่น "popbus://board?bus_id=POP-01"
    let busId = "";
    try {
      const url = new URL(raw);
      busId = url.searchParams.get("bus_id") ?? raw; // fallback = raw string
    } catch {
      busId = raw; // ถ้าไม่ใช่ URL ให้ใช้ raw เป็น bus_id
    }

    if (!busId) {
      setErrorMsg(lang === "th" ? "QR Code ไม่ถูกต้อง" : "Invalid QR Code");
      setScanState("error");
      return;
    }

    setScannedBus(busId);

    // Get user GPS (หรือใช้ mockCoords)
    let coords: GeolocationCoordinates;
    try {
      coords = mockCoords
        ? ({ ...mockCoords, accuracy: 10, altitude: null, altitudeAccuracy: null, heading: null, speed: null } as GeolocationCoordinates)
        : await getUserLocation();
    } catch {
      setErrorMsg(
        lang === "th"
          ? "ไม่สามารถระบุตำแหน่งได้ กรุณาอนุญาต Location"
          : "Cannot get location. Please allow location access."
      );
      setScanState("error");
      return;
    }

    // Start trip
    const { tripId, error } = await startTrip(
      user.id,
      busId,
      coords.latitude,
      coords.longitude
    );

    if (error && error !== "คุณกำลังนั่งรถอยู่แล้ว") {
      setErrorMsg(error);
      setScanState("error");
      return;
    }

    setScanState("success");
    setTimeout(() => router.push("/pop-bus"), 1500);
  }

  // ─── Render ────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background flex flex-col items-center">
      {/* Header */}
      <div className="w-full max-w-lg px-4 pt-6 pb-4 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-xl">
          ←
        </Button>
        <div>
          <h1 className="font-bold text-lg">{lang === "th" ? "สแกน QR ขึ้นรถ" : "Scan to Board"}</h1>
          <p className="text-xs text-muted-foreground">
            {lang === "th" ? "ชี้กล้องไปที่ QR Code บนรถ POP BUS" : "Point camera at POP BUS QR Code"}
          </p>
        </div>
      </div>

      {/* Camera / States */}
      <div className="relative w-full max-w-sm aspect-square mx-auto rounded-3xl overflow-hidden border-2 border-border/50 bg-black">
        {scanState === "scanning" && (
          <>
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              playsInline
              muted
            />
            {/* QR Finder overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-52 h-52 relative">
                {/* Corners */}
                {["top-0 left-0", "top-0 right-0 rotate-90", "bottom-0 right-0 rotate-180", "bottom-0 left-0 -rotate-90"].map((pos, i) => (
                  <div
                    key={i}
                    className={`absolute ${pos} w-8 h-8 border-primary`}
                    style={{
                      borderTopWidth: 3,
                      borderLeftWidth: 3,
                      borderTopLeftRadius: 4,
                    }}
                  />
                ))}
                {/* Scan line */}
                <div className="absolute inset-0 flex flex-col justify-center">
                  <div className="h-0.5 bg-primary/70 w-full animate-[scan_2s_ease-in-out_infinite]" />
                </div>
              </div>
            </div>
          </>
        )}

        {scanState === "processing" && (
          <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-background">
            <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
            <p className="text-sm text-muted-foreground">
              {lang === "th" ? "กำลังเชื่อมต่อ..." : "Connecting..."}
            </p>
          </div>
        )}

        {scanState === "success" && (
          <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-emerald-50 dark:bg-emerald-950/20">
            <div className="h-16 w-16 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
              <QrCode className="h-8 w-8 text-emerald-500" />
            </div>
            <div className="text-center">
              <p className="font-bold text-emerald-600 dark:text-emerald-400">
                {lang === "th" ? "ขึ้นรถสำเร็จ!" : "Boarded!"}
              </p>
              <p className="text-sm text-muted-foreground">{scannedBus}</p>
            </div>
          </div>
        )}

        {scanState === "error" && (
          <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-background p-6">
            <AlertCircle className="h-12 w-12 text-destructive" />
            <p className="text-sm text-center text-muted-foreground">{errorMsg}</p>
            <Button onClick={() => { setScanState("scanning"); }}>
              {lang === "th" ? "ลองอีกครั้ง" : "Try Again"}
            </Button>
          </div>
        )}
      </div>

      {/* Hidden canvas for processing */}
      <canvas ref={canvasRef} className="hidden" />

      <div className="mt-6 px-4 max-w-sm text-center">
        <p className="text-xs text-muted-foreground flex items-center gap-1.5 justify-center">
          <Camera className="h-3.5 w-3.5" />
          {lang === "th"
            ? "ต้องอนุญาตใช้กล้องและ GPS ก่อนสแกน"
            : "Camera and GPS permission required"}
        </p>
      </div>

      {/* Scan animation keyframe */}
      <style>{`
        @keyframes scan {
          0%, 100% { transform: translateY(-48px); opacity: 0.8; }
          50% { transform: translateY(48px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export default function PopBusScanPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center bg-black text-white">Loading camera...</div>}>
      <PopBusScanPageContent />
    </Suspense>
  );
}
