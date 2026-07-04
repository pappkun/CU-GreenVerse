"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Leaf, Gift, Trophy, ScanLine, QrCode } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const pathname = usePathname();
  const { t, lang } = useLang();

  const { profile } = useAuth();
  const isAdmin = profile?.role === "admin";

  const userNavItems = [
    { name: t("dashboard"),   href: "/dashboard",    icon: LayoutDashboard },
    { name: t("activities"),  href: "/activities",   icon: Leaf },
    { name: lang === "th" ? "สแกน" : "Scan", href: "/activities/submit?scan=true", icon: ScanLine, isSpecial: true },
    { name: t("rewards"),     href: "/rewards",      icon: Gift },
    { name: t("leaderboard"), href: "/leaderboard",  icon: Trophy },
  ];

  const adminNavItems = [
    { name: t("admin"),       href: "/admin",        icon: LayoutDashboard },
    { name: "QR Codes",       href: "/admin/qr",     icon: QrCode },
  ];

  const navItems = isAdmin ? adminNavItems : userNavItems;

  return (
    /* Only show on < lg screens */
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
      {/* Blur + border backdrop */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-xl border-t border-border/60" />
      
      <div className="relative flex justify-around items-end h-16 px-1 pb-safe">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" &&
              !("isSpecial" in item && item.isSpecial) &&
              pathname.startsWith(item.href));

          if ("isSpecial" in item && item.isSpecial) {
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex flex-col items-center justify-center -mt-7 pb-1 touch-target"
                aria-label={item.name}
              >
                {/* Elevated floating button */}
                <div className="relative h-14 w-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-xl shadow-primary/30 border-4 border-background transition-all duration-300 active:scale-95 hover:bg-primary/90">
                  {/* Pulse ring */}
                  <span className="absolute inset-0 rounded-full bg-primary animate-ping opacity-20" />
                  <item.icon className="h-6 w-6 relative z-10" />
                </div>
                <span className="text-[10px] font-semibold mt-0.5 text-primary">{item.name}</span>
              </Link>
            );
          }

          return (
            <Link
              key={item.name}
              href={item.href}
              aria-label={item.name}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full pt-2 space-y-1 transition-all duration-200 active:scale-95 touch-target",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className={cn(
                "relative flex items-center justify-center rounded-xl transition-all duration-300",
                isActive
                  ? "bg-primary/10 h-8 w-8"
                  : "h-6 w-6"
              )}>
                <item.icon className={cn("h-5 w-5 transition-all", isActive && "scale-110")} />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                )}
              </div>
              <span className={cn("text-[10px] font-medium", isActive && "font-semibold")}>{item.name}</span>
            </Link>
          );
        })}
      </div>

      {/* Safe area filler */}
      <div className="bg-background/80 h-safe-area-inset-bottom" />
    </div>
  );
}
