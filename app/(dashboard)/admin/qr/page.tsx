"use client";

import { QRCodeSVG } from "qrcode.react";
import { useRouter } from "next/navigation";
import { useLang } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bus, Download, Play } from "lucide-react";

const BUSES = [
  { id: "POP-01", label: "สาย 1: อาคาร จุฬา → สนามกีฬา" },
  { id: "POP-02", label: "สาย 2: หอพัก → ห้องสมุด" },
  { id: "POP-03", label: "สาย 3: MRT → คณะวิศวะ" },
];

function getBusQRValue(busId: string) {
  return `popbus://board?bus_id=${busId}`;
}

export default function AdminQRPage() {
  const { lang } = useLang();
  const router = useRouter();

  function handleMockScan(busId: string) {
    // Mock scan: ไปหน้า scan พร้อม bus_id ฝังใน URL (bypass camera)
    router.push(`/pop-bus/scan?mock_bus_id=${busId}`);
  }

  function downloadQR(busId: string) {
    const svg = document.getElementById(`qr-${busId}`);
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `popbus-qr-${busId}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Bus className="h-7 w-7 text-emerald-500" />
          {lang === "th" ? "QR Code รถ POP BUS" : "POP BUS QR Codes"}
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {lang === "th"
            ? "QR Code สำหรับติดบนรถแต่ละคัน และปุ่ม Mock Scan สำหรับทดสอบ"
            : "QR codes to attach on each bus, and Mock Scan for testing"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {BUSES.map((bus) => (
          <Card key={bus.id} className="border-border/50 overflow-hidden">
            <CardHeader className="pb-3 bg-muted/30">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold">{bus.id}</CardTitle>
                <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 text-xs">
                  Active
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">{bus.label}</p>
            </CardHeader>

            <CardContent className="pt-5 flex flex-col items-center gap-4">
              {/* QR Code */}
              <div className="p-4 bg-white rounded-2xl shadow-sm border border-border/30">
                <QRCodeSVG
                  id={`qr-${bus.id}`}
                  value={getBusQRValue(bus.id)}
                  size={160}
                  level="H"
                  includeMargin={false}
                  imageSettings={{
                    src: "/favicon.ico",
                    height: 28,
                    width: 28,
                    excavate: true,
                  }}
                />
              </div>

              {/* QR Value */}
              <p className="text-[10px] text-muted-foreground font-mono text-center break-all px-2">
                {getBusQRValue(bus.id)}
              </p>

              {/* Actions */}
              <div className="flex gap-2 w-full">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs gap-1.5"
                  onClick={() => downloadQR(bus.id)}
                >
                  <Download className="h-3.5 w-3.5" />
                  {lang === "th" ? "ดาวน์โหลด" : "Download"}
                </Button>
                <Button
                  size="sm"
                  className="flex-1 text-xs gap-1.5 bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => handleMockScan(bus.id)}
                >
                  <Play className="h-3.5 w-3.5" />
                  Mock Scan
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* How to use */}
      <Card className="border-border/50 bg-muted/20">
        <CardContent className="pt-5">
          <p className="text-sm font-semibold mb-3">
            {lang === "th" ? "วิธีใช้งาน" : "How to use"}
          </p>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>
              <span className="font-medium text-foreground">Mock Scan</span>{" "}
              {lang === "th"
                ? "— กดเพื่อจำลองการสแกน QR โดยไม่ต้องใช้กล้อง (สำหรับทดสอบ)"
                : "— Press to simulate QR scan without camera (for testing)"}
            </p>
            <p>
              <span className="font-medium text-foreground">
                {lang === "th" ? "ดาวน์โหลด" : "Download"}
              </span>{" "}
              {lang === "th"
                ? "— บันทึก QR Code เป็น SVG สำหรับพิมพ์ติดรถจริง"
                : "— Save QR Code as SVG for printing on actual bus"}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
