"use client";

import { mockPartners } from "@/data/mockPartners";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, ExternalLink, ShieldCheck } from "lucide-react";

export default function PartnersPage() {
  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Green Partners</h1>
        <p className="text-muted-foreground mt-1">
          Support our sustainability partners around campus and enjoy exclusive benefits.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockPartners.map((partner) => (
          <Card key={partner.id} className="flex flex-col h-full border-border/50 transition-all hover:shadow-md hover:border-primary/30">
            <div className="relative h-40 w-full bg-muted flex items-center justify-center p-6 border-b">
              {/* Fallback for logo */}
              <div className="h-20 w-20 rounded-full bg-background flex items-center justify-center text-xl font-bold text-muted-foreground shadow-sm">
                {partner.name.substring(0, 1)}
              </div>
            </div>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">{partner.name}</CardTitle>
                <Badge variant="secondary" className="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800">
                  Partner
                </Badge>
              </div>
              <CardDescription className="line-clamp-2 mt-2">
                {partner.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-4 flex-grow space-y-4">
              <div className="bg-primary/5 rounded-lg p-3 border border-primary/10">
                <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">Exclusive Benefit</p>
                <p className="font-medium text-sm">{partner.discount}</p>
              </div>
              
              <div className="flex flex-wrap gap-1.5 mt-4">
                {partner.badges.map((badge, i) => (
                  <Badge key={i} variant="outline" className="text-[10px] uppercase font-semibold flex items-center">
                    <ShieldCheck className="h-3 w-3 mr-1" />
                    {badge}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="pt-2 border-t flex gap-2">
              <Button variant="outline" className="flex-1">
                <MapPin className="mr-2 h-4 w-4" />
                Find Location
              </Button>
              <Button variant="ghost" size="icon">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
