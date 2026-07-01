import Link from "next/link";
import type { CategoryMeta } from "@/lib/categories";

interface CategoryTileProps {
  category: CategoryMeta;
  size?: "sm" | "lg";
}

export default function CategoryTile({ category, size = "lg" }: CategoryTileProps) {
  const { name, emoji, description, color, textColor } = category;

  if (size === "sm") {
    return (
      <Link
        href={`/shop?category=${encodeURIComponent(name)}`}
        className={`group flex items-center gap-3 p-3 rounded-xl border border-transparent hover:border-brand ${color} transition-all duration-200 hover:shadow-sm`}
      >
        <span className={`w-9 h-9 rounded-lg ${textColor} flex items-center justify-center text-lg shrink-0`}>
          {emoji}
        </span>
        <span className="font-semibold text-sm text-ink group-hover:text-brand transition-colors">
          {name}
        </span>
      </Link>
    );
  }

  return (
    <Link
      href={`/shop?category=${encodeURIComponent(name)}`}
      className={`group flex flex-col items-center gap-3 p-5 rounded-2xl border border-transparent hover:border-brand ${color} transition-all duration-200 hover:-translate-y-1 hover:shadow-md text-center`}
    >
      <span className={`w-14 h-14 rounded-2xl ${textColor} flex items-center justify-center text-3xl shadow-sm`}>
        {emoji}
      </span>
      <div>
        <p className="font-bold text-ink text-sm group-hover:text-brand transition-colors">
          {name}
        </p>
        <p className="text-xs text-ink/50 mt-0.5 leading-snug">{description}</p>
      </div>
    </Link>
  );
}
