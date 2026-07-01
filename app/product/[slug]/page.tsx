import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllProducts, getProductBySlug, formatPrice } from "@/lib/products";
import { CATEGORY_MAP } from "@/lib/categories";
import AmazonButton from "@/components/AmazonButton";

export const revalidate = 3600;

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.title,
    description: product.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="text-sm text-ink/40 mb-8 flex gap-2 items-center">
        <Link href="/" className="hover:text-brand transition-colors">Home</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-brand transition-colors">Shop</Link>
        <span>/</span>
        <Link
          href={`/shop?category=${encodeURIComponent(product.category)}`}
          className="hover:text-brand transition-colors"
        >
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-ink/70 line-clamp-1">{product.title}</span>
      </nav>

      {/* Main layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image */}
        <div className="relative aspect-square w-full max-w-lg mx-auto lg:mx-0 rounded-lg overflow-hidden border border-border bg-border/20 shadow-sm">
          <Image
            src={product.image_url}
            alt={product.title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        {/* Details */}
        <div className="flex flex-col gap-6">
          <div>
            <p className="text-xs font-semibold text-brand uppercase tracking-widest mb-2">
              {product.category}
            </p>
            <h1 className="text-3xl font-extrabold text-ink leading-tight">
              {product.title}
            </h1>
            <p className="text-brand font-bold text-3xl mt-4">
              {formatPrice(product.price)}
            </p>
          </div>

          {/* Features */}
          {product.features.length > 0 && (
            <ul className="space-y-2">
              {product.features.map((feat, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-ink/80">
                  <span className="text-brand mt-0.5 shrink-0">✓</span>
                  {feat}
                </li>
              ))}
            </ul>
          )}

          {/* CTA */}
          <div className="flex flex-col gap-2">
            <AmazonButton href={product.amazon_url} className="text-base py-4" />
            <p className="text-xs text-ink/40 text-center">
              As an Amazon Associate we earn from qualifying purchases. Price may vary.
            </p>
          </div>
        </div>
      </div>

      {/* Description */}
      {product.description && (
        <section className="mt-16 max-w-2xl">
          <h2 className="text-xl font-bold text-ink mb-4">About this product</h2>
          <p className="text-ink/70 leading-relaxed">{product.description}</p>
        </section>
      )}
    </div>
  );
}
