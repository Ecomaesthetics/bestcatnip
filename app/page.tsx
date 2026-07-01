import Link from "next/link";
import Image from "next/image";
import { getAllProducts } from "@/lib/products";
import { CATEGORIES } from "@/lib/categories";
import ProductCard from "@/components/ProductCard";
import CategoryTile from "@/components/CategoryTile";

export const revalidate = 3600;

const STATS = [
  { value: "500+",  label: "Curated Products" },
  { value: "14",    label: "Categories" },
  { value: "100%",  label: "Amazon-backed" },
  { value: "Free",  label: "Fast Shipping" },
];

const TRUST_POINTS = [
  { emoji: "🔍", title: "Researched & Curated", body: "Every product is hand-picked based on ratings, reviews, and real cat-owner feedback." },
  { emoji: "🛡️", title: "Amazon-backed",        body: "All orders go through Amazon — trusted returns, fast shipping, and buyer protection." },
  { emoji: "💸", title: "Best Prices",           body: "We surface the top value picks so you never overpay for your cat's favourites." },
];

export default async function HomePage() {
  const allProducts = await getAllProducts();
  const featured   = allProducts.slice(0, 8);
  const topPick    = allProducts[0];

  return (
    <>
      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand via-[#3347d4] to-[#1a2ca0]">
        {/* Decorative blobs */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-64 h-64 rounded-full bg-cta/10 blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 flex flex-col lg:flex-row items-center gap-12">
          {/* Copy */}
          <div className="flex-1 text-center lg:text-left">
            <span className="inline-block bg-white/15 text-white text-xs font-semibold px-3 py-1 rounded-full mb-5 tracking-wider uppercase">
              🐱 Curated for cat lovers
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] mb-5">
              The Best Cat Products,<br />
              <span className="text-yellow-300">All in One Place</span>
            </h1>
            <p className="text-white/75 text-lg sm:text-xl max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed">
              500+ hand-picked catnip blends, toys, scratchers, beds &amp; more —
              linked directly to Amazon with fast, free shipping.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-cta text-white font-bold px-8 py-4 text-base shadow-lg shadow-cta/30 transition-all hover:brightness-110 hover:-translate-y-0.5"
              >
                Shop Cat Favorites →
              </Link>
              <Link
                href="/shop#categories"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/15 backdrop-blur text-white font-semibold px-8 py-4 text-base border border-white/25 transition-all hover:bg-white/25"
              >
                Browse Categories
              </Link>
            </div>
          </div>

          {/* Mascot / hero card */}
          <div className="shrink-0 relative">
            <div className="w-64 h-64 sm:w-80 sm:h-80 rounded-3xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center shadow-2xl">
              <span className="text-[9rem] sm:text-[11rem] select-none leading-none">🐱</span>
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl px-4 py-2.5 flex items-center gap-2">
              <span className="text-yellow-400 text-base">★★★★★</span>
              <div>
                <p className="text-xs font-bold text-ink">Top Rated</p>
                <p className="text-xs text-ink/50">by cat parents</p>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 bg-cta text-white rounded-2xl shadow-xl px-4 py-2.5 text-center">
              <p className="text-xl font-extrabold leading-none">500+</p>
              <p className="text-xs font-medium opacity-90">products</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ─────────────────────────────────────────────────────── */}
      <section className="border-b border-border bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-border">
            {STATS.map(({ value, label }) => (
              <div key={label} className="flex flex-col items-center justify-center py-6 px-4 text-center">
                <p className="text-3xl font-extrabold text-brand">{value}</p>
                <p className="text-xs text-ink/50 font-medium mt-1 uppercase tracking-wide">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ─────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-brand text-xs font-bold uppercase tracking-widest mb-1">Staff picks</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-ink">Featured Products</h2>
          </div>
          <Link href="/shop" className="text-sm font-semibold text-brand hover:underline whitespace-nowrap">
            View all 500+ →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ── CATEGORIES ────────────────────────────────────────────────────── */}
      <section id="categories" className="bg-gradient-to-b from-white to-border/20 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-10">
            <p className="text-brand text-xs font-bold uppercase tracking-widest mb-1">All 14 categories</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-ink">Shop by Category</h2>
            <p className="text-ink/50 mt-2 max-w-md mx-auto text-sm">
              From catnip to carriers — everything your cat needs, curated and linked to Amazon.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
            {CATEGORIES.map((cat) => (
              <CategoryTile key={cat.name} category={cat} size="lg" />
            ))}
          </div>
        </div>
      </section>

      {/* ── BANNER / TOP PICK ─────────────────────────────────────────────── */}
      {topPick && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-ink to-ink/80 p-8 sm:p-12 flex flex-col sm:flex-row items-center gap-8">
            <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_70%_50%,white,transparent)]" />
            <div className="relative flex-1 text-center sm:text-left">
              <span className="inline-block bg-cta text-white text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
                🔥 Today's Top Pick
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-3 leading-tight">
                {topPick.title}
              </h3>
              <p className="text-white/60 text-sm mb-6 line-clamp-2">{topPick.description}</p>
              <div className="flex items-center gap-4 flex-wrap justify-center sm:justify-start">
                <span className="text-3xl font-extrabold text-yellow-300">
                  {formatPrice(topPick.price)}
                </span>
                <a
                  href={topPick.amazon_url}
                  target="_blank"
                  rel="nofollow sponsored noopener"
                  className="inline-flex items-center gap-2 bg-cta text-white font-bold px-6 py-3 rounded-xl transition-opacity hover:opacity-90"
                >
                  View on Amazon →
                </a>
              </div>
            </div>
            <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-2xl overflow-hidden border-4 border-white/10 shrink-0 bg-white/5">
              <Image
                src={topPick.image_url}
                alt={topPick.title}
                fill
                className="object-contain p-2"
                sizes="200px"
              />
            </div>
          </div>
        </section>
      )}

      {/* ── AMAZON SHOP ───────────────────────────────────────────────────── */}
      <section className="border-t border-border bg-gradient-to-br from-[#FF9900]/10 via-white to-[#FF9900]/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col sm:flex-row items-center gap-8 text-center sm:text-left">
          <div className="flex-1">
            <span className="inline-block bg-[#FF9900] text-white text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
              Official Amazon Shop
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-ink mb-3">
              Follow Us on Amazon 🐾
            </h2>
            <p className="text-ink/60 max-w-md mb-6 text-sm sm:text-base">
              Shop our full curated storefront directly on Amazon — follow us to get notified about new picks, seasonal favourites, and exclusive cat deals.
            </p>
            <a
              href="https://www.amazon.com/shop/captcatnip?ref=cm_sw_r_apan_aipsfshop_SB5VG7V8T6B6W34CYDFZ_2&language=en-US"
              target="_blank"
              rel="nofollow noopener"
              className="inline-flex items-center gap-2 bg-[#FF9900] hover:bg-[#e68a00] text-white font-bold px-7 py-3.5 rounded-xl transition-colors shadow-lg shadow-[#FF9900]/20 text-sm sm:text-base"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white" aria-hidden><path d="M13.958 10.09c0 1.232.029 2.256-.591 3.351-.502.891-1.301 1.438-2.186 1.438-1.214 0-1.922-.924-1.922-2.292 0-2.692 2.415-3.182 4.699-3.182v.685zm3.186 7.705a.66.66 0 01-.753.074c-1.058-.88-1.245-1.287-1.826-2.127-1.745 1.781-2.982 2.314-5.239 2.314-2.675 0-4.759-1.652-4.759-4.956 0-2.582 1.397-4.338 3.387-5.193 1.725-.756 4.131-.891 5.97-1.099v-.41c0-.753.058-1.642-.383-2.294-.383-.579-1.118-.819-1.765-.819-1.199 0-2.267.615-2.528 1.89-.054.285-.265.567-.554.58l-3.107-.335c-.26-.058-.549-.271-.474-.673C6.16 2.116 9.329 1 12.163 1c1.45 0 3.344.385 4.489 1.481 1.45 1.35 1.312 3.151 1.312 5.111v4.628c0 1.391.577 2.002 1.119 2.752.19.267.232.588-.009.787-.61.51-1.693 1.46-2.289 1.99l-.009-.009.368.055z"/></svg>
              Visit Our Amazon Storefront
            </a>
          </div>
          <div className="hidden sm:flex items-center justify-center w-48 h-48 rounded-3xl bg-[#FF9900]/10 border-2 border-[#FF9900]/20 shrink-0">
            <span className="text-7xl">🛍️</span>
          </div>
        </div>
      </section>

      {/* ── TRUST SECTION ─────────────────────────────────────────────────── */}
      <section className="border-t border-border bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-extrabold text-ink">Why BestCatnip?</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {TRUST_POINTS.map(({ emoji, title, body }) => (
              <div key={title} className="flex flex-col items-center text-center p-6 rounded-2xl bg-border/20 border border-border">
                <span className="text-4xl mb-4">{emoji}</span>
                <h3 className="font-bold text-ink mb-2">{title}</h3>
                <p className="text-sm text-ink/60 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DISCLOSURE ────────────────────────────────────────────────────── */}
      <section className="border-t border-border">
        <p className="max-w-3xl mx-auto text-center text-xs text-ink/40 py-6 px-4">
          As an Amazon Associate we earn from qualifying purchases. Product prices and availability are
          accurate as of date listed and are subject to change. Amazon and the Amazon logo are trademarks
          of Amazon.com, Inc.
        </p>
      </section>
    </>
  );
}

// Inline helper — avoids importing lib in JSX when topPick is inline
function formatPrice(price: number) {
  return `$${price.toFixed(2)}`;
}
