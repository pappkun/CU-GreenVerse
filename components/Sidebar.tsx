"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Leaf, 
  Gift, 
  Trophy, 
  User, 
  Users,
  Settings,
  BookOpen
} from "lucide-react";
import { currentUser } from "@/data/mockUsers";
import { useLang } from "@/context/LanguageContext";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const { t } = useLang();

  const userLinks = [
    { name: t("dashboard"),    href: "/dashboard",  icon: LayoutDashboard },
    { name: t("activities"),   href: "/activities",  icon: Leaf },
    { name: t("rewards"),      href: "/rewards",     icon: Gift },
    { name: t("leaderboard"),  href: "/leaderboard", icon: Trophy },
    { name: t("passport_side"),href: "/passport",    icon: BookOpen },
    { name: t("profile"),      href: "/profile",     icon: User },
    { name: t("partners_side"),href: "/partners",    icon: Users },
  ];

  const adminLinks = [
    { name: t("admin"), href: "/admin", icon: Settings },
  ];

  const links = currentUser.role === "admin" ? [...userLinks, ...adminLinks] : userLinks;

  return (
    <div className={cn("pb-12 w-64 hidden lg:block border-r min-h-[calc(100vh-4rem)] bg-muted/20", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            เมนู
          </h2>
          <div className="space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
              
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all hover:bg-muted/80",
                    isActive 
                      ? "bg-primary/10 text-primary hover:bg-primary/15" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground")} />
                  {link.name}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
