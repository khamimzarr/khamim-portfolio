import type { ReactNode } from "react";

export default function SectionLabel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`section-label ${className}`}>{children}</p>;
}
