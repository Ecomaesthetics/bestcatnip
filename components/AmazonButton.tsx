import Link from "next/link";

interface AmazonButtonProps {
  href: string;
  className?: string;
  children?: React.ReactNode;
}

/**
 * All outbound Amazon links MUST go through this component.
 * It centrally enforces rel="nofollow sponsored noopener" and target="_blank".
 */
export default function AmazonButton({
  href,
  className = "",
  children = "View on Amazon",
}: AmazonButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="nofollow sponsored noopener"
      className={[
        "block w-full rounded-lg bg-cta text-white font-semibold text-center",
        "px-6 py-3 transition-opacity hover:opacity-90 active:opacity-80",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </a>
  );
}
