"use client";

import { useState, useEffect } from "react";
import { RewardCard } from "@/components/RewardCard";
import { currentUser } from "@/data/mockUsers";
import { Leaf, Loader2, Gift } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/lib/supabase";
import { useLang } from "@/context/LanguageContext";
import { mockRewards } from "@/data/mockRewards";

export default function RewardsPage() {
  const { lang, t } = useLang();
  const [activeTab, setActiveTab] = useState("all");
  const [rewards, setRewards] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRewards() {
      try {
        if (!supabase) {
          setRewards([]);
          return;
        }

        const { data, error } = await supabase
          .from("rewards")
          .select("*")
          .order("points_required", { ascending: true });

        if (error || !data || data.length === 0) {
          console.log("Using mock rewards as fallback");
          setRewards(mockRewards);
          return;
        }

        const mappedData = data
          .map((item: any) => ({
            id: item.id,
            title: item.name,
            description: item.description || "",
            category: item.category.toLowerCase(),
            cost: item.points_required,
            image: item.image_url || "/rewards/mystery-box.png",
            stock: item.quantity_available,
          }))
          .filter(
            (item: any) =>
              item.category !== "avatar" &&
              item.category !== "digital" &&
              item.category !== "event" &&
              !item.title.toLowerCase().includes("avatar") &&
              !item.title.toLowerCase().includes("mystery box") &&
              !item.title.toLowerCase().includes("workshop")
          );

        setRewards(mappedData);
      } catch (error) {
        console.error("Error fetching rewards:", error);
        setRewards(mockRewards);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRewards();
  }, []);

  const categories = [
    { id: "all", label: lang === "th" ? "ทั้งหมด" : "All" },
    { id: "coupon", label: lang === "th" ? "คูปอง" : "Coupons" },
    { id: "merchandise", label: lang === "th" ? "สินค้า" : "Merch" },
  ];

  const filteredRewards =
    activeTab === "all"
      ? rewards
      : rewards.filter(
          (r) =>
            (activeTab === "coupon" && (r.category === "voucher" || r.category === "coupon")) ||
            (activeTab === "merchandise" && (r.category === "physical" || r.category === "merchandise")) ||
            r.category === activeTab,
        );

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-5 sm:space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {t("rewardsTitle")}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            {t("rewardsDesc")}
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card px-4 py-2.5 w-full sm:w-auto shadow-sm">
          <div className="bg-primary/10 p-2 rounded-xl">
            <Leaf className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              {t("yourBalance")}
            </p>
            <p className="text-lg font-bold text-primary leading-tight">
              {currentUser.greenCredits.toLocaleString()} {t("credits")}
            </p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
        <div className="overflow-x-auto pb-2 scrollbar-hide">
          <TabsList className="w-full md:w-auto inline-flex h-11 items-center justify-start rounded-xl p-1 bg-muted/50">
            {categories.map((cat) => (
              <TabsTrigger
                key={cat.id}
                value={cat.id}
                className="rounded-lg px-4 py-2"
              >
                {cat.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <div className="mt-4 sm:mt-6">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
            {isLoading ? (
              <div className="col-span-full py-12 flex justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredRewards.length > 0 ? (
              filteredRewards.map((reward) => (
                <RewardCard
                  key={reward.id}
                  reward={reward}
                  userCredits={currentUser.greenCredits}
                />
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-muted-foreground">
                {lang === "th"
                  ? "ไม่พบของรางวัลในหมวดหมู่นี้"
                  : "No rewards found in this category"}
              </div>
            )}
          </div>
        </div>
      </Tabs>
    </div>
  );
}
