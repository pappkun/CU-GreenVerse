import { Reward } from "@/types";

export const mockRewards: Reward[] = [
  {
    id: "r_1",
    title: "True Coffee Discount 30 THB",
    description: "Get 30 THB off your next drink at any True Coffee CU branch.",
    cost: 500,
    image: "/rewards/true.png",
    category: "coupon", // Note: The old code used 'voucher' but the type is 'coupon'
    stock: 50,
  },
  {
    id: "r_2",
    title: "Anywheel 1-Day Free Pass",
    description: "Ride Anywheel for free for 24 hours inside CU campus.",
    cost: 800,
    image: "/rewards/anywheel.png",
    category: "coupon",
    stock: 20,
  },
  {
    id: "r_3",
    title: "CU Canteen 20% Discount",
    description: "Get 20% discount on food at any CU canteen.",
    cost: 400,
    image: "/rewards/canteen.png",
    category: "coupon",
    stock: 100,
  },
  {
    id: "r_4",
    title: "CU GreenVerse Tote Bag",
    description: "Exclusive eco-friendly tote bag from CU GreenVerse.",
    cost: 3000,
    image: "/rewards/bag.png",
    category: "merchandise",
    stock: 5,
  },
  {
    id: "r_5",
    title: "CU Eco Tumbler",
    description: "Stainless steel tumbler, keeps cold for 24 hours.",
    cost: 5000,
    image: "/rewards/tumbler.png",
    category: "merchandise",
    stock: 2,
  },
  {
    id: "r_10",
    title: "POP BUS VIP Pass 7 Days",
    description: "Priority queue boarding for POP BUS during rush hours.",
    cost: 1000,
    image: "/rewards/popbus.png",
    category: "coupon",
    stock: 10,
  }
];
