import { StatSummary, Partner } from "@/types";

export const mockStats: StatSummary = {
  totalUsers: 12540,
  activeUsers: 4200,
  totalGreenActions: 85000,
  totalCarbonSaved: 12500.5, // kgCO2e
  totalCreditsIssued: 4250000,
};

export const mockPartners: Partner[] = [
  {
    id: "p_1",
    name: "True Coffee CU",
    description: "Enjoy special discounts when bringing your own cup.",
    logo: "/partners/true.png",
    discount: "5 THB off for BYOC",
    badges: ["Eco-friendly", "BYOC Partner"],
  },
  {
    id: "p_2",
    name: "POP-BUS",
    description: "Electric tuk-tuk sharing service around campus.",
    logo: "/partners/muvmi.png",
    discount: "Earn 10 Green Credits per ride",
    badges: ["EV", "Shared Mobility"],
  },
  {
    id: "p_3",
    name: "CU Canteen",
    description: "University canteens supporting waste separation.",
    logo: "/partners/canteen.png",
    discount: "Double points for food waste separation",
    badges: ["Zero Waste"],
  }
];
