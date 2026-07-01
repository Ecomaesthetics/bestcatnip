import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-ink/60">
        <div className="flex items-center gap-2">
          <span className="text-lg" aria-hidden>🐱</span>
          <span className="font-semibold text-ink">BestCatnip.com</span>
        </div>

        <p className="text-center max-w-lg">
          <strong className="text-ink">Affiliate Disclosure:</strong> As an Amazon
          Associate we earn from qualifying purchases. Product prices and availability
          are accurate as of the date listed and may change.
        </p>

        <div className="flex gap-4">
          <Link href="/shop" className="hover:text-brand transition-colors">Shop</Link>
          <Link href="/about" className="hover:text-brand transition-colors">About</Link>
        </div>
      </div>
    </footer>
  );
}
