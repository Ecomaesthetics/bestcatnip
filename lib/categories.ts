export interface CategoryMeta {
  name: string;
  emoji: string;
  description: string;
  color: string;      // Tailwind bg class for the tile accent
  textColor: string;  // Tailwind text class for the emoji circle
}

export const CATEGORIES: CategoryMeta[] = [
  { name: "Catnip",    emoji: "🌿", description: "Organic blends & sprays",       color: "bg-emerald-50",  textColor: "bg-emerald-100" },
  { name: "Toys",      emoji: "🎾", description: "Wands, balls & track toys",      color: "bg-yellow-50",   textColor: "bg-yellow-100"  },
  { name: "Scratchers",emoji: "🐾", description: "Posts, pads & loungers",         color: "bg-orange-50",   textColor: "bg-orange-100"  },
  { name: "Beds",      emoji: "😴", description: "Cozy spots to curl up",          color: "bg-purple-50",   textColor: "bg-purple-100"  },
  { name: "Carriers",  emoji: "🎒", description: "Backpacks, bags & crates",       color: "bg-blue-50",     textColor: "bg-blue-100"    },
  { name: "Trees",     emoji: "🌳", description: "Cat trees & climbing towers",    color: "bg-lime-50",     textColor: "bg-lime-100"    },
  { name: "Furniture", emoji: "🛋️", description: "Window perches & cat shelves",  color: "bg-amber-50",    textColor: "bg-amber-100"   },
  { name: "Feeders",   emoji: "🍽️", description: "Bowls, fountains & dispensers", color: "bg-cyan-50",     textColor: "bg-cyan-100"    },
  { name: "Food",      emoji: "🐟", description: "Wet food, dry food & toppers",   color: "bg-red-50",      textColor: "bg-red-100"     },
  { name: "Treats",    emoji: "🍬", description: "Snacks, chews & lickable treats",color: "bg-pink-50",     textColor: "bg-pink-100"    },
  { name: "Health",    emoji: "💊", description: "Supplements & wellness",         color: "bg-teal-50",     textColor: "bg-teal-100"    },
  { name: "Grooming",  emoji: "✂️", description: "Brushes, clippers & shampoos",  color: "bg-violet-50",   textColor: "bg-violet-100"  },
  { name: "Collars",   emoji: "🏷️", description: "Collars, harnesses & leashes",  color: "bg-indigo-50",   textColor: "bg-indigo-100"  },
  { name: "Litter",    emoji: "🪣", description: "Litter, boxes & deodorizers",   color: "bg-stone-50",    textColor: "bg-stone-100"   },
];

export const CATEGORY_MAP = Object.fromEntries(
  CATEGORIES.map((c) => [c.name, c])
) as Record<string, CategoryMeta>;
