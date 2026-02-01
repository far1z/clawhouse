import { cn } from "@/lib/utils";

type BadgeVariant = "live" | "beta" | "host" | "speaker" | "listener" | "default";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  live: "bg-green/20 text-green border-green/30",
  beta: "bg-yellow/20 text-yellow border-yellow/30",
  host: "bg-coral/20 text-coral border-coral/30",
  speaker: "bg-teal/20 text-teal border-teal/30",
  listener: "bg-bg-surface text-text-secondary border-border-subtle",
  default: "bg-bg-surface text-text-secondary border-border-subtle",
};

export function Badge({ variant = "default", children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full border",
        variantStyles[variant],
        className
      )}
    >
      {variant === "live" && (
        <span className="w-1.5 h-1.5 rounded-full bg-green animate-pulse" />
      )}
      {children}
    </span>
  );
}
