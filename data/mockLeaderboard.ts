import { LeaderboardEntry } from "@/types";

export const mockFacultyLeaderboard: LeaderboardEntry[] = [
  { id: "fac_1", rank: 1, name: "Engineering", type: "faculty", greenCredits: 45200, carbonSaved: 1250 },
  { id: "fac_2", rank: 2, name: "Science", type: "faculty", greenCredits: 41100, carbonSaved: 1100 },
  { id: "fac_3", rank: 3, name: "Arts", type: "faculty", greenCredits: 38900, carbonSaved: 950 },
  { id: "fac_4", rank: 4, name: "Architecture", type: "faculty", greenCredits: 35000, carbonSaved: 880 },
  { id: "fac_5", rank: 5, name: "Commerce and Accountancy", type: "faculty", greenCredits: 32400, carbonSaved: 760 },
];

export const mockIndividualLeaderboard: LeaderboardEntry[] = [
  { id: "ind_1", rank: 1, name: "Patarapon W.", type: "individual", greenCredits: 3200, carbonSaved: 150 },
  { id: "ind_2", rank: 2, name: "Nattapong J.", type: "individual", greenCredits: 2450, carbonSaved: 128.5 },
  { id: "ind_3", rank: 3, name: "Kittipong M.", type: "individual", greenCredits: 2100, carbonSaved: 95 },
  { id: "ind_4", rank: 4, name: "Supitcha S.", type: "individual", greenCredits: 1950, carbonSaved: 88 },
  { id: "ind_5", rank: 5, name: "Wisarut T.", type: "individual", greenCredits: 1800, carbonSaved: 75 },
];
