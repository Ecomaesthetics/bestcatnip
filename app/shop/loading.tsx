import ProductCardSkeleton from "@/components/ProductCardSkeleton";

export default function ShopLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header skeleton */}
      <div className="mb-8 animate-pulse">
        <div className="h-8 w-48 bg-border/60 rounded-full mb-2" />
        <div className="h-4 w-24 bg-border/40 rounded-full" />
      </div>

      {/* Filter pills skeleton */}
      <div className="flex flex-wrap gap-2 mb-10 pb-6 border-b border-border animate-pulse">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-8 w-24 bg-border/40 rounded-full" />
        ))}
      </div>

      {/* Product grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {Array.from({ length: 24 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
