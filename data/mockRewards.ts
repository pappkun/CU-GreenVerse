import { Reward } from "@/types";

export const mockRewards: Reward[] = [
  {
    id: "r_1",
    title: "50 THB True Coffee Discount",
    description: "Get 50 THB off your next drink at True Coffee CU.",
    cost: 500,
    image: "/rewards/true-coffee.png",
    category: "coupon",
    stock: 50,
  },
  {
    id: "r_2",
    title: "CU Green Tote Bag",
    description: "Exclusive eco-friendly tote bag for CU GreenVerse members.",
    cost: 1500,
    image: "/rewards/tote-bag.png",
    category: "merchandise",
    stock: 20,
  },
  {
    id: "r_3",
    title: "Avatar: Green Cap",
    description: "Equip your digital avatar with a stylish green cap.",
    cost: 300,
    image: "/rewards/avatar-cap.png",
    category: "avatar",
    stock: 999,
  },
  {
    id: "r_4",
    title: "Sustainability Workshop Ticket",
    description: "Join an exclusive workshop on urban farming.",
    cost: 800,
    image: "/rewards/workshop.png",
    category: "event",
    stock: 10,
  },
  {
    id: "r_5",
    title: "Mystery Eco Box",
    description: "A random assortment of eco-friendly goodies.",
    cost: 1000,
    image: "/rewards/mystery-box.png",
    category: "mystery",
    stock: 5,
  }
];
