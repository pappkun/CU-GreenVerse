"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Leaf, Gift, User, ScanLine } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const pathname = usePathname();
  const { t, lang } = useLang();

  const navItems = [
    { name: t("dashboard"), href: "/dashboard", icon: LayoutDashboard },
    { name: t("activities"), href: "/activities", icon: Leaf },
    // Center scan button
    { name: lang === "th" ? "สแกน" : "Scan", href: "/activities/submit?scan=true", icon: ScanLine, isSpecial: true },
    { name: t("rewards"), href: "/rewards", icon: Gift },
    { name: t("profile"), href: "/profile", icon: User },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-lg border-t border-border/50 pb-safe">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href) && !item.isSpecial);
          
          if (item.isSpecial) {
            return (
              <Link key={item.name} href={item.href} className="flex flex-col items-center justify-center -mt-6">
                <div className="bg-primary text-primary-foreground h-14 w-14 rounded-full flex items-center justify-center shadow-lg shadow-primary/20 border-4 border-background">
                  <item.icon className="h-6 w-6" />
                </div>
                <span className="text-[10px] font-medium mt-1 text-primary">{item.name}</span>
              </Link>
            );
          }

          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive && "fill-primary/20")} />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
