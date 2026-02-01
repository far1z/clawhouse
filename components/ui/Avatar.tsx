"use client";

import { cn, getInitials } from "@/lib/utils";

interface AvatarProps {
  name: string;
  size?: "sm" | "md" | "lg";
  isSpeaking?: boolean;
  className?: string;
}

const sizeMap = {
  sm: "w-8 h-8 text-xs",
  md: "w-12 h-12 text-sm",
  lg: "w-16 h-16 text-base",
};

const colors = [
  "bg-coral/20 text-coral",
  "bg-teal/20 text-teal",
  "bg-green/20 text-green",
  "bg-yellow/20 text-yellow",
];

function getColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export function Avatar({
  name,
  size = "md",
  isSpeaking = false,
  className,
}: AvatarProps) {
  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center font-semibold select-none",
        sizeMap[size],
        getColor(name),
        isSpeaking && "ring-2 ring-green animate-speak-pulse",
        className
      )}
    >
      {getInitials(name)}
    </div>
  );
}
