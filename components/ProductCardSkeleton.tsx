export default function ProductCardSkeleton() {
  return (
    <div className="flex flex-col bg-white border border-border rounded-2xl overflow-hidden animate-pulse">
      <div className="aspect-square bg-border/40" />
      <div className="p-4 flex flex-col gap-3">
        <div className="h-3 w-16 bg-border/60 rounded-full" />
        <div className="space-y-2">
          <div className="h-4 bg-border/60 rounded-full w-full" />
          <div className="h-4 bg-border/60 rounded-full w-3/4" />
        </div>
        <div className="h-6 w-20 bg-border/60 rounded-full" />
        <div className="h-10 bg-border/40 rounded-lg" />
      </div>
    </div>
  );
}
