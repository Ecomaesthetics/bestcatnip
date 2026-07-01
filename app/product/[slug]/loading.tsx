export default function ProductLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-pulse">
      {/* Breadcrumb */}
      <div className="flex gap-2 mb-8">
        <div className="h-4 w-16 bg-border/40 rounded-full" />
        <div className="h-4 w-4 bg-border/40 rounded-full" />
        <div className="h-4 w-24 bg-border/40 rounded-full" />
        <div className="h-4 w-4 bg-border/40 rounded-full" />
        <div className="h-4 w-48 bg-border/40 rounded-full" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image */}
        <div className="aspect-square bg-border/40 rounded-2xl" />

        {/* Details */}
        <div className="flex flex-col gap-5">
          <div className="h-5 w-24 bg-border/40 rounded-full" />
          <div className="space-y-3">
            <div className="h-8 bg-border/60 rounded-full w-full" />
            <div className="h-8 bg-border/60 rounded-full w-3/4" />
          </div>
          <div className="h-10 w-32 bg-border/40 rounded-full" />
          <div className="space-y-2 pt-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-4 bg-border/40 rounded-full w-full" />
            ))}
          </div>
          <div className="h-14 bg-border/40 rounded-xl mt-4" />
        </div>
      </div>
    </div>
  );
}
