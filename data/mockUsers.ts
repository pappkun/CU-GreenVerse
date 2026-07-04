import { User } from "@/types";

export const currentUser: User = {
  id: "u_1",
  name: "Nattapong J.",
  email: "nattapong.j@student.chula.ac.th",
  faculty: "Engineering",
  avatar: "/img/blank-profile-picture-973460_960_720.png",
  level: 12,
  greenCredits: 2450,
  carbonSaved: 128.5,
  greenActions: 45,
  role: "user",
};

export const adminUser: User = {
  id: "u_admin",
  name: "System Admin",
  email: "admin@cu-greenverse.com",
  faculty: "Central Administration",
  avatar: "/img/blank-profile-picture-973460_960_720.png",
  level: 99,
  greenCredits: 9999,
  carbonSaved: 999.9,
  greenActions: 999,
  role: "admin",
};

export const mockUsers: User[] = [
  currentUser,
  adminUser,
  {
    id: "u_2",
    name: "Siriya S.",
    email: "siriya.s@student.chula.ac.th",
    faculty: "Arts",
    avatar: "/img/blank-profile-picture-973460_960_720.png",
    level: 8,
    greenCredits: 1200,
    carbonSaved: 65.2,
    greenActions: 22,
    role: "user",
  }
];
