import { cn } from "@/lib/cn";
import type { ButtonHTMLAttributes } from "react";

type Variant = "dark" | "light";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

const base =
  "group relative inline-block h-[48px] overflow-hidden rounded-xl px-5 font-body font-semibold leading-[48px] tracking-tight text-sm md:h-[59px] md:px-6 md:leading-[59px] md:text-base";

const styles: Record<Variant, string> = {
  dark: "bg-black text-white",
  light: "bg-white text-black",
};

const overlay: Record<Variant, string> = {
  dark: "bg-white text-black",
  light: "bg-black text-white",
};

export function Button({
  variant = "dark",
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button {...rest} className={cn(base, styles[variant], className)}>
      <span className="block transition-transform duration-300 ease-out group-hover:-translate-y-full">
        {children}
      </span>
      <span
        className={cn(
          "absolute inset-0 flex translate-y-full items-center justify-center transition-transform duration-300 ease-out group-hover:translate-y-0",
          overlay[variant],
        )}
      >
        {children}
      </span>
    </button>
  );
}
