import { cn } from "@/lib/utils";
import Image from "next/image";

/** InfyCrest stacked-layers mark. */
export function CrestMark({ className }: { className?: string }) {
  return (
    <Image
      src="/logo.png"
      alt=""
      width={40}
      height={40}
      priority
      className={cn("size-8 shrink-0 rounded-lg object-contain", className)}
    />
  );
}

export default function Logo({
  className,
  showSuffix = true,
}: {
  className?: string;
  showSuffix?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <CrestMark />
      <span className="text-[15px] font-semibold tracking-tight text-neutral-900">
        InfyCrest
        {showSuffix && (
          <span className="font-medium text-neutral-400"> Solutions</span>
        )}
      </span>
    </span>
  );
}
