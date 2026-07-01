import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { getProductsPaged } from "@/lib/products";
import { CATEGORIES, CATEGORY_MAP } from "@/lib/categories";
import ProductCard from "@/components/ProductCard";
import Pagination from "@/components/Pagination";

export const revalidate = 3600;

interface ShopPageProps {
  searchParams: Promise<{ category?: string; page?: string }>;
}

export async function generateMetadata({ searchParams }: ShopPageProps): Promise<Metadata> {
  const { category } = await searchParams;
  return {
    title: category ? `${category} — Shop` : "Shop All Cat Products",
    description: category
      ? `Browse the best cat ${category.toLowerCase()} — curated and linked to Amazon.`
      : "Browse 500+ curated cat products across 14 categories on BestCatnip.com.",
  };
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const { category, page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);

  const result = await getProductsPaged(page, category);
  const { products, total, totalPages, pageSize } = result;

  const activeCat = category ? CATEGORY_MAP[category] : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page header */}
      <div className="mb-8">
        {activeCat ? (
          <div className="flex items-center gap-3 mb-1">
            <span className="text-4xl">{activeCat.emoji}</span>
            <div>
              <h1 className="text-3xl font-extrabold text-ink">{activeCat.name}</h1>
              <p className="text-ink/50 text-sm">{activeCat.description}</p>
            </div>
          </div>
        ) : (
          <h1 className="text-3xl font-extrabold text-ink">All Products</h1>
        )}
        <p className="text-ink/40 text-sm mt-1">
          {total} product{total !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Category filter pills */}
      <div id="categories" className="flex flex-wrap gap-2 mb-10 pb-6 border-b border-border">
        <Link
          href="/shop"
          className={[
            "px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors",
            !category
              ? "bg-brand text-white border-brand"
              : "border-border text-ink/70 hover:border-brand hover:text-brand",
          ].join(" ")}
        >
          All
        </Link>
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.name}
            href={`/shop?category=${encodeURIComponent(cat.name)}`}
            className={[
              "px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors",
              category === cat.name
                ? "bg-brand text-white border-brand"
                : "border-border text-ink/70 hover:border-brand hover:text-brand",
            ].join(" ")}
          >
            {cat.emoji} {cat.name}
          </Link>
        ))}
      </div>

      {/* Grid */}
      {products.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <Suspense fallback={null}>
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              total={total}
              pageSize={pageSize}
            />
          </Suspense>
        </>
      ) : (
        <div className="text-center py-24 text-ink/40">
          <p className="text-6xl mb-4">🐱</p>
          <p className="text-lg font-medium">No products in this category yet.</p>
          <Link href="/shop" className="text-brand text-sm mt-2 hover:underline inline-block">
            Browse all products →
          </Link>
        </div>
      )}
    </div>
  );
}
