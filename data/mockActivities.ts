import { ActivityType } from "@/types";

export const availableActivities: ActivityType[] = [
  {
    id: "act_1",
    title: "Walk to Campus",
    description: "Walk at least 1km to the university instead of driving.",
    category: "transport",
    points: 50,
    carbonReduction: 0.5,
    icon: "Footprints",
  },
  {
    id: "act_2",
    title: "Bicycle to Campus",
    description: "Use a bicycle or POP-BUS instead of a personal car.",
    category: "transport",
    points: 80,
    carbonReduction: 1.2,
    icon: "Bike",
  },
  {
    id: "act_3",
    title: "Public Transport",
    description: "Take MRT or BTS to the university.",
    category: "transport",
    points: 60,
    carbonReduction: 1.0,
    icon: "TrainFront",
  },
  {
    id: "act_4",
    title: "Waste Separation",
    description: "Correctly separate plastic bottles at recycling bins.",
    category: "waste",
    points: 30,
    carbonReduction: 0.2,
    icon: "Recycle",
  },
  {
    id: "act_5",
    title: "Bring Your Own Cup",
    description: "Use a personal cup when buying drinks at campus cafes.",
    category: "waste",
    points: 40,
    carbonReduction: 0.1,
    icon: "Coffee",
  },
  {
    id: "act_6",
    title: "Join Sustainability Event",
    description: "Participate in a CU GreenVerse campus event.",
    category: "education",
    points: 200,
    carbonReduction: 0.0,
    icon: "Users",
  }
];
