import { ActivityType } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Footprints, Bike, TrainFront, Recycle, Coffee, Users, Leaf, ArrowRight } from "lucide-react";
import Link from "next/link";

const iconMap: Record<string, React.ReactNode> = {
  Footprints: <Footprints className="h-5 w-5" />,
  Bike: <Bike className="h-5 w-5" />,
  TrainFront: <TrainFront className="h-5 w-5" />,
  Recycle: <Recycle className="h-5 w-5" />,
  Coffee: <Coffee className="h-5 w-5" />,
  Users: <Users className="h-5 w-5" />,
};

interface ActivityCardProps {
  activity: ActivityType;
}

export function ActivityCard({ activity }: ActivityCardProps) {
  const Icon = iconMap[activity.icon] || <Leaf className="h-5 w-5" />;

  return (
    <Card className="flex flex-col h-full overflow-hidden border-border/50 transition-all hover:shadow-md hover:border-primary/30 group">
      <CardHeader className="pb-3 flex flex-row items-start justify-between">
        <div className="space-y-1">
          <Badge variant="outline" className="mb-2 uppercase text-[10px] tracking-wider font-semibold">
            {activity.category}
          </Badge>
          <CardTitle className="text-lg leading-tight">{activity.title}</CardTitle>
        </div>
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
          {Icon}
        </div>
      </CardHeader>
      <CardContent className="pb-4 flex-grow">
        <CardDescription className="line-clamp-2">{activity.description}</CardDescription>
        
        <div className="mt-4 flex flex-wrap gap-2">
          <div className="inline-flex items-center text-sm font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-1 rounded-md">
            <span>+{activity.points} pts</span>
          </div>
          {activity.carbonReduction > 0 && (
            <div className="inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 px-2.5 py-1 rounded-md">
              <Leaf className="mr-1 h-3.5 w-3.5" />
              <span>-{activity.carbonReduction} kgCO₂</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/activities/submit?id=${activity.id}`} className="w-full">
          <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            Submit Action
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
