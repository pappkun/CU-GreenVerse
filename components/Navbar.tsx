"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Leaf, Moon, Sun, User as UserIcon, LogOut, Settings } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";
import { useLang } from "@/context/LanguageContext";
import { currentUser } from "@/data/mockUsers";

export function Navbar() {
  const pathname = usePathname();
  const { setTheme, theme } = useTheme();
  const { user, profile, signOut } = useAuth();
  const { lang, setLang, t } = useLang();

  // Use real user data if logged in, else fall back to mock for public pages
  const displayName = profile?.name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || currentUser.name;
  const displayEmail = user?.email || currentUser.email;
  const displayAvatar = profile?.avatar_url || currentUser.avatar;
  const isAdmin = profile?.role === 'admin' || currentUser.role === 'admin';

  const isPublicPage = pathname === "/" || pathname === "/login";
  
  const navLinks = isPublicPage 
    ? [
        { name: t("home"),     href: "/" },
        { name: t("features"), href: "/#features" },
        { name: t("partners"), href: "/#partners" },
      ]
    : [
        { name: t("dashboard"),    href: "/dashboard" },
        { name: t("rewards"),      href: "/rewards" },
        { name: t("leaderboard"),  href: "/leaderboard" },
      ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href={isPublicPage ? "/" : "/dashboard"} className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-full">
              <Leaf className="h-6 w-6 text-primary" />
            </div>
            <span className="font-bold text-xl tracking-tight hidden sm:inline-block">CU GreenVerse</span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === link.href ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {/* Language Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLang(lang === "th" ? "en" : "th")}
            className="rounded-full font-bold text-sm px-3 h-9 border border-border/50 hover:bg-primary/10 min-w-[52px]"
          >
            {lang === "th" ? "EN" : "TH"}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="rounded-full"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {isPublicPage ? (
            <div>
              <Link href="/login">
                <Button className="rounded-full px-4 md:px-6 h-9 md:h-10 text-xs md:text-sm">{t("login")}</Button>
              </Link>
            </div>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="ghost" className="relative h-9 w-9 md:h-10 md:w-10 rounded-full" />}>
                <Avatar className="h-9 w-9 md:h-10 md:w-10 border-2 border-primary/20">
                  <AvatarImage src={displayAvatar} alt={displayName} />
                  <AvatarFallback>{displayName.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                {/* User info header - plain div avoids base-ui MenuGroupLabel context error */}
                <div className="px-3 py-2 border-b border-border/60 mb-1">
                  <p className="text-sm font-semibold leading-none">{displayName}</p>
                  <p className="text-xs leading-none text-muted-foreground mt-1">{displayEmail}</p>
                </div>
                <DropdownMenuItem render={<Link href="/profile" className="cursor-pointer" />}>
                  <UserIcon className="mr-2 h-4 w-4" />
                  <span>{t("profile")}</span>
                </DropdownMenuItem>
                <DropdownMenuItem render={<Link href="/passport" className="cursor-pointer" />}>
                  <Leaf className="mr-2 h-4 w-4" />
                  <span>{t("passport")}</span>
                </DropdownMenuItem>
                {isAdmin && (
                  <>
                    <DropdownMenuItem render={<Link href="/admin" className="cursor-pointer text-primary" />}>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>แดชบอร์ดผู้ดูแลระบบ</span>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer text-destructive focus:text-destructive"
                  onClick={async () => {
                    await signOut();
                    window.location.href = "/";
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{t("logout")}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </nav>
  );
}
