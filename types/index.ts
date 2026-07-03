export type User = {
  id: string;
  name: string;
  email: string;
  faculty: string;
  avatar: string;
  level: number;
  greenCredits: number;
  carbonSaved: number; // in kgCO2e
  greenActions: number;
  role: "user" | "admin";
};

export type ActivityType = {
  id: string;
  title: string;
  description: string;
  category: "transport" | "waste" | "energy" | "food" | "education";
  points: number;
  carbonReduction: number; // in kgCO2e
  icon: string;
};

export type UserActivity = {
  id: string;
  userId: string;
  activityId: string;
  date: string;
  status: "pending" | "approved" | "rejected";
  evidenceUrl?: string;
  pointsEarned: number;
  carbonSaved: number;
};

export type Reward = {
  id: string;
  title: string;
  description: string;
  cost: number;
  image: string;
  category: "coupon" | "merchandise" | "avatar" | "mystery" | "event";
  stock: number;
};

export type AvatarItem = {
  id: string;
  name: string;
  type: "head" | "body" | "accessory" | "background";
  image: string;
  isEquipped: boolean;
};

export type LeaderboardEntry = {
  id: string;
  rank: number;
  name: string;
  type: "faculty" | "club" | "individual";
  greenCredits: number;
  carbonSaved: number;
  avatar?: string;
};

export type Partner = {
  id: string;
  name: string;
  description: string;
  logo: string;
  discount: string;
  badges: string[];
};

export type StatSummary = {
  totalUsers: number;
  activeUsers: number;
  totalGreenActions: number;
  totalCarbonSaved: number;
  totalCreditsIssued: number;
};
