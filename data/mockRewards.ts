import { Reward } from "@/types";

export const mockRewards: Reward[] = [
  {
    id: "r_1",
    title: "True Coffee Discount 30 THB",
    description: "Get 30 THB off your next drink at any True Coffee CU branch.",
    cost: 200,
    image: "/rewards/true.png",
    category: "coupon", // Note: The old code used 'voucher' but the type is 'coupon'
    stock: 50,
  },
  {
    id: "r_2",
    title: "Anywheel 1-Day Free Pass",
    description: "Ride Anywheel for free for 24 hours inside CU campus.",
    cost: 350,
    image: "/rewards/anywheel.png",
    category: "coupon",
    stock: 20,
  },
  {
    id: "r_3",
    title: "CU Canteen 20% Discount",
    description: "Get 20% discount on food at any CU canteen.",
    cost: 150,
    image: "/rewards/canteen.png",
    category: "coupon",
    stock: 100,
  },
  {
    id: "r_4",
    title: "CU GreenVerse Tote Bag",
    description: "Exclusive eco-friendly tote bag from CU GreenVerse.",
    cost: 800,
    image: "/rewards/bag.png",
    category: "merchandise",
    stock: 5,
  },
  {
    id: "r_5",
    title: "CU Eco Tumbler",
    description: "Stainless steel tumbler, keeps cold for 24 hours.",
    cost: 1200,
    image: "/rewards/tumbler.png",
    category: "merchandise",
    stock: 2,
  },

  {
    id: "r_8",
    title: "Sustainability Workshop Entry",
    description: "Ticket to join CU Sustainability workshop next month.",
    cost: 600,
    image: "/rewards/workshop.png",
    category: "event",
    stock: 15,
  },
  {
    id: "r_9",
    title: "Plant a Tree in Your Name",
    description: "We will plant a real tree on campus with your name on it.",
    cost: 1500,
    image: "/rewards/tree.png",
    category: "event",
    stock: 3,
  },
  {
    id: "r_10",
    title: "POP BUS VIP Pass 7 Days",
    description: "Priority queue boarding for POP BUS during rush hours.",
    cost: 500,
    image: "/rewards/popbus.png",
    category: "coupon",
    stock: 10,
  }
];
