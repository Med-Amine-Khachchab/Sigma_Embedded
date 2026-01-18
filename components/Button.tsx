import Link from "next/link";
import { clsx } from "clsx";
import type { ReactNode } from "react";

type ButtonProps = {
  href?: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  type?: "button" | "submit" | "reset";
  className?: string;
};

export function Button({
  href,
  children,
  variant = "primary",
  type = "button",
  className,
}: ButtonProps) {
  const styles = clsx(
    "inline-flex items-center justify-center gap-2 rounded-full px-6 py-2 text-sm font-semibold transition",
    variant === "primary"
      ? "bg-neon/90 text-midnight shadow-glow hover:bg-neon"
      : "border border-neon/40 text-neon hover:border-neon hover:text-white",
    className
  );

  if (href) {
    return (
      <Link href={href} className={styles}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={styles}>
      {children}
    </button>
  );
}
