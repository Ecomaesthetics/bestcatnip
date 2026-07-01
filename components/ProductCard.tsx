import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/products";
import { formatPrice } from "@/lib/products";
import { CATEGORY_MAP } from "@/lib/categories";
import AmazonButton from "./AmazonButton";

interface ProductCardProps {
  product: Product;
  featured?: boolean;
}

export default function ProductCard({ product, featured = false }: ProductCardProps) {
  const catMeta = CATEGORY_MAP[product.category];

  return (
    <article className="group flex flex-col bg-white border border-border rounded-2xl overflow-hidden shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-brand/40">
      {/* Image */}
      <Link
        href={`/product/${product.slug}`}
        className={`block relative overflow-hidden bg-border/20 ${featured ? "aspect-[4/3]" : "aspect-square"}`}
      >
        <Image
          src={product.image_url}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-contain p-3 transition-transform duration-300 group-hover:scale-105"
        />
        {/* Category badge */}
        {catMeta && (
          <span className={`absolute top-2 left-2 text-xs font-semibold px-2 py-0.5 rounded-full ${catMeta.textColor} text-ink/70`}>
            {catMeta.emoji} {product.category}
          </span>
        )}
      </Link>

      {/* Body */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        <Link href={`/product/${product.slug}`} className="flex-1">
          <h2 className="font-semibold text-ink text-sm leading-snug line-clamp-2 hover:text-brand transition-colors">
            {product.title}
          </h2>
        </Link>

        <div className="flex items-center justify-between">
          <p className="text-brand font-extrabold text-lg">{formatPrice(product.price)}</p>
          <div className="flex items-center gap-0.5 text-yellow-400 text-xs">
            {"★★★★★"}
          </div>
        </div>

        <AmazonButton href={product.amazon_url} />
      </div>
    </article>
  );
}
