// ── Shared ship definitions ────────────────────────────────────
// Imported by both app/page.tsx and app/game/page.tsx

export interface ShipDef {
  id: string;
  name: string;
  class: string;
  cost: number;
  description: string;
  color: string;
  accentColor: string;
  speed: number;
  firepower: number;
  armor: number;
}

export const SHIPS: ShipDef[] = [
  {
    id: "corvette",
    name: "CSS CORVETTE",
    class: "SCOUT CLASS",
    cost: 0,
    description: "Fast and nimble. Standard-issue vessel for new recruits.",
    color: "#00cc66",
    accentColor: "#00eeff",
    speed: 8,
    firepower: 5,
    armor: 3,
  },
  {
    id: "destroyer",
    name: "DSS DESTROYER",
    class: "ASSAULT CLASS",
    cost: 50,
    description: "Reinforced hull. Preferred by veteran data scientists.",
    color: "#00aaff",
    accentColor: "#4488ff",
    speed: 6,
    firepower: 7,
    armor: 6,
  },
  {
    id: "cruiser",
    name: "MLS CRUISER",
    class: "HEAVY CLASS",
    cost: 150,
    description: "Built for sustained combat. Dual-barrel ML cannon array.",
    color: "#cc44ff",
    accentColor: "#ff44cc",
    speed: 4,
    firepower: 9,
    armor: 8,
  },
  {
    id: "battleship",
    name: "NNS BATTLESHIP",
    class: "DREADNOUGHT",
    cost: 300,
    description: "Neural-net powered. The pinnacle of galactic firepower.",
    color: "#ffaa00",
    accentColor: "#ff6600",
    speed: 2,
    firepower: 10,
    armor: 9,
  },
  {
    id: "phantom",
    name: "AI PHANTOM",
    class: "STEALTH CLASS",
    cost: 500,
    description:
      "Classified vessel. Equipped with generative AI cloaking tech.",
    color: "#ff3366",
    accentColor: "#ff99cc",
    speed: 9,
    firepower: 8,
    armor: 4,
  },
];
