export type FanModel = {
  id: string;
  name: string;
  origin: string;
  gender: "woman" | "man" | "nonbinary";
  /** Unsplash — person in light/neutral top for tee composite */
  photo: string;
  /** Chest overlay region (% of card) */
  teePlacement: { top: string; left: string; width: string };
};

/** Diverse fan model pool — gender, ethnicity & origin varied */
export const FAN_MODEL_POOL: FanModel[] = [
  {
    id: "fm-01",
    name: "Aisha M.",
    origin: "Nigerian-American · Houston",
    gender: "woman",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&q=80",
    teePlacement: { top: "38%", left: "28%", width: "44%" },
  },
  {
    id: "fm-02",
    name: "Marcus L.",
    origin: "Jamaican-Canadian · Toronto",
    gender: "man",
    photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&q=80",
    teePlacement: { top: "36%", left: "26%", width: "48%" },
  },
  {
    id: "fm-03",
    name: "Sofia R.",
    origin: "Cuban-American · Miami",
    gender: "woman",
    photo: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=600&q=80",
    teePlacement: { top: "40%", left: "30%", width: "42%" },
  },
  {
    id: "fm-04",
    name: "Kenji T.",
    origin: "Japanese-American · Seattle",
    gender: "man",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
    teePlacement: { top: "37%", left: "27%", width: "46%" },
  },
  {
    id: "fm-05",
    name: "Priya K.",
    origin: "Indian-American · Bay Area",
    gender: "woman",
    photo: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&q=80",
    teePlacement: { top: "39%", left: "29%", width: "43%" },
  },
  {
    id: "fm-06",
    name: "Diego V.",
    origin: "Mexican-American · Dallas",
    gender: "man",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80",
    teePlacement: { top: "36%", left: "25%", width: "50%" },
  },
  {
    id: "fm-07",
    name: "Amara O.",
    origin: "Ghanaian-British · London · visiting NYC",
    gender: "woman",
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&q=80",
    teePlacement: { top: "38%", left: "28%", width: "44%" },
  },
  {
    id: "fm-08",
    name: "Alex R.",
    origin: "Filipino-American · Los Angeles",
    gender: "nonbinary",
    photo: "https://images.unsplash.com/photo-1463453092295-0ba74328e760?w=600&q=80",
    teePlacement: { top: "37%", left: "26%", width: "47%" },
  },
  {
    id: "fm-09",
    name: "Elena P.",
    origin: "Colombian · Miami fan",
    gender: "woman",
    photo: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&q=80",
    teePlacement: { top: "40%", left: "30%", width: "42%" },
  },
  {
    id: "fm-10",
    name: "James W.",
    origin: "African-American · Philadelphia",
    gender: "man",
    photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&q=80",
    teePlacement: { top: "35%", left: "24%", width: "52%" },
  },
  {
    id: "fm-11",
    name: "Mei L.",
    origin: "Chinese-Canadian · Vancouver",
    gender: "woman",
    photo: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&q=80",
    teePlacement: { top: "39%", left: "29%", width: "43%" },
  },
  {
    id: "fm-12",
    name: "Carlos H.",
    origin: "Guatemalan-American · Kansas City",
    gender: "man",
    photo: "https://images.unsplash.com/photo-1504257436949-9bb5d90b4a56?w=600&q=80",
    teePlacement: { top: "36%", left: "26%", width: "48%" },
  },
];

function hashId(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/** Three diverse fans per stadium — rotated from pool */
export function getFanModelsForStadium(stadiumId: string, count = 3): FanModel[] {
  const start = hashId(stadiumId) % FAN_MODEL_POOL.length;
  const out: FanModel[] = [];
  for (let i = 0; i < count; i++) {
    out.push(FAN_MODEL_POOL[(start + i * 4) % FAN_MODEL_POOL.length]);
  }
  return out;
}
