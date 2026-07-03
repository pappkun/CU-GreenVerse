import { Reward } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Leaf, Gift } from "lucide-react";
import Image from "next/image";

interface RewardCardProps {
  reward: Reward;
  userCredits: number;
}

export function RewardCard({ reward, userCredits }: RewardCardProps) {
  const canAfford = userCredits >= reward.cost;

  return (
    <Card className="flex flex-col h-full overflow-hidden border-border/50 transition-all hover:shadow-md hover:border-primary/30">
      <div className="relative h-48 w-full bg-muted flex items-center justify-center overflow-hidden">
        {/* Placeholder since we don't have actual images */}
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/40 flex items-center justify-center">
          <Gift className="h-20 w-20 text-primary/40" />
        </div>
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm shadow-sm font-semibold">
            {reward.category}
          </Badge>
        </div>
      </div>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg leading-tight">{reward.title}</CardTitle>
      </CardHeader>
      <CardContent className="pb-4 flex-grow space-y-4">
        <CardDescription className="line-clamp-2">{reward.description}</CardDescription>
        
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center text-sm font-bold text-primary">
            <Leaf className="mr-1.5 h-4 w-4" />
            {reward.cost} Credits
          </div>
          <div className="text-xs text-muted-foreground">
            {reward.stock} remaining
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full font-medium" 
          variant={canAfford ? "default" : "secondary"}
          disabled={!canAfford || reward.stock <= 0}
        >
          {reward.stock <= 0 ? "Out of Stock" : canAfford ? "Redeem Now" : "Not Enough Credits"}
        </Button>
      </CardFooter>
    </Card>
  );
}
