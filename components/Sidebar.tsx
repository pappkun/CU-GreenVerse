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
  BookOpen,
  ChevronRight,
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
    { name: t("dashboard"),    href: "/dashboard",   icon: LayoutDashboard },
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

  const mainLinks = links.filter(l => l.href !== "/admin");
  const adminOnlyLinks = links.filter(l => l.href === "/admin");

  return (
    <aside className={cn("hidden lg:flex flex-col w-60 xl:w-64 border-r border-border/60 min-h-[calc(100vh-4rem)] bg-sidebar/80 backdrop-blur-sm", className)}>
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-hide">
        {mainLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary/10 text-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
              )}
            >
              <div className={cn(
                "h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200",
                isActive
                  ? "bg-primary/15 text-primary"
                  : "bg-muted/0 text-muted-foreground group-hover:bg-muted group-hover:text-foreground"
              )}>
                <Icon className="h-4 w-4" />
              </div>
              <span className="flex-1 min-w-0 truncate">{link.name}</span>
              {isActive && <ChevronRight className="h-3.5 w-3.5 text-primary opacity-60" />}
            </Link>
          );
        })}

        {adminOnlyLinks.length > 0 && (
          <>
            <div className="pt-3 pb-1">
              <div className="h-px bg-border/60 mx-1" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-3 pt-3 pb-1">
                Admin
              </p>
            </div>
            {adminOnlyLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
                  )}
                >
                  <div className={cn(
                    "h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0",
                    isActive ? "bg-primary/15 text-primary" : "bg-muted/0 text-muted-foreground group-hover:bg-muted group-hover:text-foreground"
                  )}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </>
        )}
      </nav>

      {/* Bottom branding */}
      <div className="px-4 py-3 border-t border-border/60">
        <p className="text-[10px] text-muted-foreground text-center">CU GreenVerse · Beta</p>
      </div>
    </aside>
  );
}
