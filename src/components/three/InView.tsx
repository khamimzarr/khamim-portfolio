"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";

/** Mount children only while the wrapper is near the viewport, so 3D unloads off-screen. */
export default function InView({
  children,
  className = "",
  rootMargin = "300px",
}: {
  children: ReactNode;
  className?: string;
  rootMargin?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin });
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);

  return (
    <div ref={ref} className={className}>
      {visible ? children : null}
    </div>
  );
}
