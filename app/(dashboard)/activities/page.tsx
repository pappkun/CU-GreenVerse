"use client";

import { useState, useEffect } from "react";
import { ActivityCard } from "@/components/ActivityCard";
import { Input } from "@/components/ui/input";
import { Search, Filter, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

export default function ActivitiesPage() {
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
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Green Actions</h1>
        <p className="text-muted-foreground mt-1">
          Discover activities you can do to reduce carbon emissions and earn Green Credits.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card p-4 rounded-xl border shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search activities..." 
            className="pl-9 bg-background"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground mr-1" />
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={filter === cat ? "default" : "outline"}
                size="sm"
                className="capitalize whitespace-nowrap rounded-full"
                onClick={() => setFilter(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading ? (
          <div className="col-span-full py-12 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredActivities.length > 0 ? (
          filteredActivities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-muted-foreground">
            ไม่พบกิจกรรมที่ตรงกับเงื่อนไขการค้นหา
          </div>
        )}
      </div>
    </div>
  );
}
