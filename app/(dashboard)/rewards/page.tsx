"use client";

import { useState, useEffect } from "react";
import { RewardCard } from "@/components/RewardCard";
import { MysteryBox } from "@/components/MysteryBox";
import { currentUser } from "@/data/mockUsers";
import { Leaf, Loader2, Gift } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/lib/supabase";

export default function RewardsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [rewards, setRewards] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRewards() {
      try {
        const { data, error } = await supabase
          .from("rewards")
          .select("*")
          .order("points_required", { ascending: true });
          
        if (error) throw error;
        
        // Map Supabase schema to RewardCard props format
        const mappedData = data.map((item: any) => ({
          id: item.id,
          title: item.name,
          description: item.description || "",
          category: item.category.toLowerCase(),
          cost: item.points_required,
          image: item.image_url || "/rewards/mystery-box.png",
          stock: item.quantity_available
        }));
        
        setRewards(mappedData);
      } catch (error) {
        console.error("Error fetching rewards:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchRewards();
  }, []);

  const categories = [
    { id: "all", label: "ทั้งหมด" },
    { id: "coupon", label: "คูปอง" },
    { id: "merchandise", label: "สินค้า" },
    { id: "avatar", label: "Avatar" },
    { id: "event", label: "กิจกรรม" },
  ];

  const filteredRewards = activeTab === "all" 
    ? rewards 
    : rewards.filter(r => 
        (activeTab === "coupon" && r.category === "voucher") ||
        (activeTab === "merchandise" && r.category === "physical") ||
        (activeTab === "avatar" && r.category === "digital") ||
        (activeTab === "event" && r.category === "event") ||
        (r.category === activeTab)
      );

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">ร้านค้าของรางวัล</h1>
          <p className="text-muted-foreground mt-1">
            แลก Green Credits เพื่อรับของรางวัลและสิทธิพิเศษได้
          </p>
        </div>
        
        <div className="bg-primary/10 border border-primary/20 px-4 py-2 rounded-xl flex items-center gap-3 w-full md:w-auto">
          <div className="bg-background p-1.5 rounded-full shadow-sm">
            <Leaf className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">ยอดคงเหลือ</p>
            <p className="text-lg font-bold text-primary leading-none">{currentUser.greenCredits.toLocaleString()} Credits</p>
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
        
        <div className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Mystery Box - always first */}
          <MysteryBox userCredits={currentUser.greenCredits} />
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
                ไม่พบของรางวัลในหมวดหมู่นี้
              </div>
            )}
          </div>
        </div>
      </Tabs>
    </div>
  );
}
