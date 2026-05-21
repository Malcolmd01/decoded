import { cn } from "@/lib/cn";

type Props = {
  className?: string;
};

export function BrutalismIcon({ className }: Props) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 139.4 139.4"
      fill="currentColor"
      className={cn("shrink-0", className)}
    >
      <path d="M 139.4 69.7 C 101.752 87.402 87.402 101.752 69.7 139.4 C 51.998 101.752 37.648 87.402 0 69.7 C 37.648 51.998 51.998 37.648 69.7 0 C 87.402 37.648 101.752 51.998 139.4 69.7 Z" />
    </svg>
  );
}
