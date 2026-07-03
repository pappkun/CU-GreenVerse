"use client";

import { useState, useEffect } from "react";
import { ActivityCard } from "@/components/ActivityCard";
import { Input } from "@/components/ui/input";
import { Search, Filter, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useLang } from "@/context/LanguageContext";

export default function ActivitiesPage() {
  const { t } = useLang();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [activities, setActivities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchMissions() {
      try {
        const { data, error } = await supabase
          .from("missions")
          .select("*")
          .order("created_at", { ascending: false });
          
        if (error) throw error;
        
        // Map Supabase schema to ActivityCard props format
        const mappedData = data.map((item: any) => ({
          id: item.id,
          title: item.title,
          description: item.description || "",
          category: item.category.toLowerCase(),
          points: item.reward_points,
          carbonReduction: item.carbon_offset_estimate || 0,
          icon: item.image_url || "Leaf"
        }));
        
        setActivities(mappedData);
      } catch (error) {
        console.error("Error fetching missions:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchMissions();
  }, []);

  const categories = ["all", "transport", "waste", "energy", "food", "education"];

  const filteredActivities = activities.filter((activity) => {
    const matchesSearch = activity.title.toLowerCase().includes(search.toLowerCase()) || 
                          activity.description.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || activity.category === filter;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-5 sm:space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{t("activitiesTitle")}</h1>
        <p className="text-muted-foreground mt-1 text-sm sm:text-base">
          {t("activitiesDesc")}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between rounded-2xl border border-border/60 bg-card p-3.5 shadow-sm">
        <div className="relative w-full sm:w-72 md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("searchPlaceholder")}
            className="pl-9 bg-background rounded-xl h-9 text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex gap-1.5 overflow-x-auto w-full sm:w-auto pb-0.5 sm:pb-0 scrollbar-hide">
          <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0 my-auto" />
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={filter === cat ? "default" : "ghost"}
              size="sm"
              className={`capitalize whitespace-nowrap rounded-full h-8 text-xs font-semibold flex-shrink-0 transition-all ${
                filter === cat ? "shadow-sm" : "hover:bg-muted"
              }`}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
        {isLoading ? (
          <div className="col-span-full py-16 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredActivities.length > 0 ? (
          filteredActivities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))
        ) : (
          <div className="col-span-full py-16 text-center text-muted-foreground">
            <div className="mx-auto mb-4 h-16 w-16 rounded-2xl bg-muted/50 flex items-center justify-center">
              <Search className="h-7 w-7 opacity-40" />
            </div>
            {t("noActivities")}
          </div>
        )}
      </div>
    </div>
  );
}
