import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  variant?: "default" | "glass" | "elevated";
}

export default function Card({
  className,
  hover = false,
  variant = "default",
  children,
  ...props
}: CardProps) {
  const variants = {
    default: "bg-white shadow-card border border-gray-100",
    glass: "glass shadow-elevated",
    elevated: "bg-white shadow-elevated border border-gray-100",
  };

  return (
    <div
      className={cn(
        "rounded-2xl",
        variants[variant],
        hover && "hover:shadow-elevated hover:-translate-y-0.5 transition-all duration-300 cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("px-6 py-5 border-b border-gray-100", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardContent({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("px-6 py-5", className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "px-6 py-4 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
