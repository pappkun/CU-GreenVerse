"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type Lang = "th" | "en";

export const translations = {
  th: {
    // Navbar
    home: "หน้าหลัก",
    features: "ฟีเจอร์",
    partners: "พาร์ทเนอร์",
    leaderboard: "กระดานผู้นำ",
    login: "เข้าสู่ระบบ",
    startJourney: "เริ่มต้นการเดินทาง",
    profile: "โปรไฟล์ของฉัน",
    passport: "สมุดพาสปอร์ตสีเขียว",
    adminDashboard: "แดชบอร์ดผู้ดูแลระบบ",
    logout: "ออกจากระบบ",

    // Sidebar
    dashboard: "แดชบอร์ด",
    activities: "กิจกรรมรักษ์โลก",
    rewards: "ร้านค้าของรางวัล",
    passport_side: "กรีนพาสปอร์ต",
    partners_side: "พาร์ทเนอร์",
    admin: "ผู้ดูแลระบบ",

    // Dashboard
    welcomeBack: "ยินดีต้อนรับกลับ",
    greenCredits: "Green Credits",
    carbonSaved: "คาร์บอนที่ลดได้",
    activitiesCount: "กิจกรรมที่ทำ",
    currentRank: "อันดับปัจจุบัน",
    todayChallenge: "ภารกิจวันนี้",
    recentActivity: "กิจกรรมล่าสุด",
    viewAll: "ดูทั้งหมด",

    // Activities
    activitiesTitle: "กิจกรรมรักษ์โลก",
    activitiesDesc: "ค้นหากิจกรรมที่ช่วยลดคาร์บอนและรับ Green Credits",
    searchPlaceholder: "ค้นหากิจกรรม...",
    submitAction: "บันทึกกิจกรรม",
    noActivities: "ไม่พบกิจกรรมที่ตรงกับเงื่อนไขการค้นหา",

    // Rewards
    rewardsTitle: "ร้านค้าของรางวัล",
    rewardsDesc: "แลก Green Credits เพื่อรับของรางวัลและสิทธิพิเศษได้",
    yourBalance: "ยอดคงเหลือ",
    redeemNow: "แลกเลย",
    notEnough: "Credits ไม่พอ",
    outOfStock: "หมดแล้ว",
    remaining: "เหลืออยู่",

    // Leaderboard
    leaderboardTitle: "กระดานผู้นำ",
    leaderboardDesc: "ดูอันดับผู้นำด้านความยั่งยืนของจุฬาลงกรณ์มหาวิทยาลัย",
    faculties: "คณะ",
    individuals: "บุคคล",
    liveData: "ข้อมูล Live",
    refresh: "รีเฟรช",
    seasonEnds: "Season สิ้นสุดใน 14 วัน",

    // Common
    pts: "คะแนน",
    kgCO2: "kgCO₂",
    credits: "Credits",
  },
  en: {
    // Navbar
    home: "Home",
    features: "Features",
    partners: "Partners",
    leaderboard: "Leaderboard",
    login: "Login",
    startJourney: "Start Green Journey",
    profile: "My Profile",
    passport: "Green Passport",
    adminDashboard: "Admin Dashboard",
    logout: "Logout",

    // Sidebar
    dashboard: "Dashboard",
    activities: "Green Activities",
    rewards: "Reward Store",
    passport_side: "Green Passport",
    partners_side: "Partners",
    admin: "Admin",

    // Dashboard
    welcomeBack: "Welcome back",
    greenCredits: "Green Credits",
    carbonSaved: "Carbon Saved",
    activitiesCount: "Activities Done",
    currentRank: "Current Rank",
    todayChallenge: "Today's Challenge",
    recentActivity: "Recent Activity",
    viewAll: "View All",

    // Activities
    activitiesTitle: "Green Activities",
    activitiesDesc: "Discover activities to reduce carbon emissions and earn Green Credits.",
    searchPlaceholder: "Search activities...",
    submitAction: "Submit Action",
    noActivities: "No activities found matching your criteria.",

    // Rewards
    rewardsTitle: "Reward Store",
    rewardsDesc: "Exchange your Green Credits for exclusive items and discounts.",
    yourBalance: "Your Balance",
    redeemNow: "Redeem Now",
    notEnough: "Not Enough Credits",
    outOfStock: "Out of Stock",
    remaining: "remaining",

    // Leaderboard
    leaderboardTitle: "Leaderboard",
    leaderboardDesc: "See who is leading the sustainability movement at Chulalongkorn University.",
    faculties: "Faculties",
    individuals: "Individuals",
    liveData: "Live Data",
    refresh: "Refresh",
    seasonEnds: "Season Ends in 14 Days",

    // Common
    pts: "pts",
    kgCO2: "kgCO₂",
    credits: "Credits",
  },
};

type TranslationKeys = keyof typeof translations.th;

interface LanguageContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: TranslationKeys) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "th",
  setLang: () => {},
  t: (key) => translations.th[key],
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("th");

  function t(key: TranslationKeys): string {
    return translations[lang][key] ?? key;
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}
