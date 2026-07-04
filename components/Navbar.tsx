"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Leaf,
  Moon,
  Sun,
  User as UserIcon,
  LogOut,
  Settings,
} from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
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

export function Navbar() {
  const pathname = usePathname();
  const { setTheme, resolvedTheme } = useTheme();
  const { user, profile, signOut } = useAuth();
  const { lang, setLang, t } = useLang();

  const displayName =
    profile?.name ||
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "User";
  const displayEmail = user?.email ?? "";
  const displayAvatar = profile?.avatar_url ?? "";
  const isAdmin = profile?.role === "admin";

  const isPublicPage = pathname === "/" || pathname === "/login";

  const navLinks = isPublicPage
    ? [
        { name: t("home"), href: "/" },
        { name: t("features"), href: "/#features" },
      ]
    : [];

  return (
    <nav
      className={`sticky top-0 z-50 w-full border-b shadow-sm ${isPublicPage ? "bg-white/95 border-slate-200" : "bg-background/95"}`}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link
            href={isPublicPage ? "/" : "/dashboard"}
            className="flex items-center gap-2"
          >
            <div className="border border-emerald-200 bg-emerald-50/90 p-2 rounded-2xl">
              <Leaf className="h-6 w-6 text-emerald-700" />
            </div>
            <span
              className={`font-semibold text-xl tracking-tight hidden sm:inline-block ${isPublicPage ? "text-slate-900" : "text-foreground"}`}
            >
              CU GreenVerse
            </span>
          </Link>
        </div>

        {/* Desktop Nav (Only on Public Pages since Dashboard has Sidebar) */}
        {isPublicPage && (
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === link.href
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        )}

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
            onClick={() =>
              setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
            className="rounded-full"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {isPublicPage ? (
            <div>
              <Link href="/login">
                <Button className="rounded-full px-4 md:px-6 h-9 md:h-10 text-xs md:text-sm">
                  {t("login")}
                </Button>
              </Link>
            </div>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    className="relative h-9 w-9 md:h-10 md:w-10 rounded-full"
                  />
                }
              >
                <Avatar className="h-9 w-9 md:h-10 md:w-10 border-2 border-primary/20">
                  <AvatarImage src={displayAvatar} alt={displayName} />
                  <AvatarFallback>
                    {displayName.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                {/* User info header - plain div avoids base-ui MenuGroupLabel context error */}
                <div className="px-3 py-2 border-b border-border/60 mb-1">
                  <p className="text-sm font-semibold leading-none">
                    {displayName}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground mt-1">
                    {displayEmail}
                  </p>
                </div>
                <DropdownMenuItem
                  render={<Link href="/profile" className="cursor-pointer" />}
                >
                  <UserIcon className="mr-2 h-4 w-4" />
                  <span>{t("profile")}</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  render={<Link href="/passport" className="cursor-pointer" />}
                >
                  <Leaf className="mr-2 h-4 w-4" />
                  <span>{t("passport")}</span>
                </DropdownMenuItem>
                {isAdmin && (
                  <>
                    <DropdownMenuItem
                      render={
                        <Link
                          href="/admin"
                          className="cursor-pointer text-primary"
                        />
                      }
                    >
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
