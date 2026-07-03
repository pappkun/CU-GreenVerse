"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Leaf, ArrowLeft, Loader2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { signInWithEmail, signUpWithEmail } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { useLang } from "@/context/LanguageContext";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const { session } = useAuth();
  const { lang } = useLang();
  const [isLoading, setIsLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  // ถ้าล็อกอินแล้ว ให้ redirect ไป dashboard ทันที
  useEffect(() => {
    if (session) {
      router.replace("/dashboard");
    }
  }, [session, router]);

  // Login form state
  const [loginEmail, setLoginEmail] = useState("demo@student.chula.ac.th");
  const [loginPassword, setLoginPassword] = useState("demo1234");

  // Register form state
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    const { error } = await signInWithEmail(loginEmail, loginPassword);
    if (error) {
      toast.error("เข้าสู่ระบบไม่สำเร็จ", { description: error.message });
      setIsLoading(false);
    } else {
      toast.success("เข้าสู่ระบบสำเร็จ! ยินดีต้อนรับ 🌱");
      // Hard redirect เพื่อให้ React re-render ด้วย session ใหม่ครับ
      window.location.href = "/dashboard";
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    const { error } = await signUpWithEmail(regEmail, regPassword, regName);
    if (error) {
      toast.error("สมัครสมาชิกไม่สำเร็จ", { description: error.message });
    } else {
      toast.success("สมัครสมาชิกสำเร็จ!", { description: "กรุณาตรวจสอบอีเมลของคุณเพื่อยืนยันตัวตน" });
    }
    setIsLoading(false);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-muted/30 relative">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] -z-10" />
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-primary/10 to-transparent -z-10" />
      
      <Link href="/" className="absolute top-8 left-8 flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4" />
        {lang === "th" ? "กลับหน้าหลัก" : "Back to Home"}
      </Link>

      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-primary/10 p-3 rounded-full mb-4">
            <Leaf className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">CU GreenVerse</h1>
          <p className="text-muted-foreground mt-2">{lang === "th" ? "ร่วมสร้างจุฬาฯ ที่ยั่งยืนด้วยกัน" : "Building a sustainable Chula together"}</p>
        </div>

        <Card className="border-border/50 shadow-lg backdrop-blur-sm bg-background/95">
          <Tabs defaultValue="login">
            <CardHeader className="space-y-1 text-center pb-2">
              <TabsList className="w-full">
                <TabsTrigger value="login" className="flex-1">{lang === "th" ? "เข้าสู่ระบบ" : "Login"}</TabsTrigger>
                <TabsTrigger value="register" className="flex-1">{lang === "th" ? "สมัครสมาชิก" : "Register"}</TabsTrigger>
              </TabsList>
              <CardDescription className="pt-2">
                {lang === "th" ? "ใช้อีเมลจุฬาลงกรณ์มหาวิทยาลัยเท่านั้น" : "Use Chulalongkorn University email only"}
              </CardDescription>
            </CardHeader>

            {/* Login Tab */}
            <TabsContent value="login">
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">{lang === "th" ? "อีเมล" : "Email"}</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="student.name@student.chula.ac.th"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">{lang === "th" ? "รหัสผ่าน" : "Password"}</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPass ? "text" : "password"}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Demo hint */}
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 text-xs text-muted-foreground">
                    <p className="font-semibold text-primary mb-1">🧪 Demo Account</p>
                    <p>Email: demo@student.chula.ac.th</p>
                    <p>Password: demo1234</p>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-3 pt-0">
                  <Button className="w-full h-11" type="submit" disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {lang === "th" ? "เข้าสู่ระบบด้วย CU Account" : "Login with CU Account"}
                  </Button>

                  <div className="relative w-full">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-border/60" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">หรือ</span>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full h-11 border-border/80"
                    type="button"
                    disabled={isLoading}
                    onClick={() => toast.info("ระบบนี้ต้องเชื่อมต่อกับ CU NEX API (Production)")}
                  >
                    <span className="text-[#F68B1F] font-bold mr-1">CU</span>
                    <span className="text-foreground font-bold">NEX</span>
                    <span className="ml-1 text-muted-foreground text-xs">(เร็วๆ นี้)</span>
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>

            {/* Register Tab */}
            <TabsContent value="register">
              <form onSubmit={handleRegister}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reg-name">ชื่อ-นามสกุล</Label>
                    <Input
                      id="reg-name"
                      placeholder="ชื่อ นามสกุล"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-email">อีเมลจุฬาฯ</Label>
                    <Input
                      id="reg-email"
                      type="email"
                      placeholder="student.name@student.chula.ac.th"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-password">รหัสผ่าน (อย่างน้อย 6 ตัว)</Label>
                    <Input
                      id="reg-password"
                      type="password"
                      placeholder="รหัสผ่าน"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button className="w-full h-11" type="submit" disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    สมัครสมาชิก
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-4">
          รองรับเฉพาะ @student.chula.ac.th และ @chula.ac.th เท่านั้น
        </p>
      </div>
    </div>
  );
}
