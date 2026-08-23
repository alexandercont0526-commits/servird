import { cn } from "@/lib/utils";
import { getInitials } from "@/lib/utils";

interface AvatarProps {
  src?: string | null;
  alt?: string;
  nombre: string;
  apellido: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizes = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-base",
  xl: "w-16 h-16 text-lg",
};

export default function Avatar({
  src,
  alt,
  nombre,
  apellido,
  size = "md",
  className,
}: AvatarProps) {
  const initials = getInitials(nombre, apellido);

  if (src) {
    return (
      <img
        src={src}
        alt={alt || `${nombre} ${apellido}`}
        className={cn(
          "rounded-xl object-cover ring-2 ring-white shadow-soft",
          sizes[size],
          className
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        "rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 text-white flex items-center justify-center font-bold shadow-soft",
        sizes[size],
        className
      )}
    >
      {initials}
    </div>
  );
}
