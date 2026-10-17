"use client";
import dynamic from "next/dynamic";

const AmbientScene = dynamic(() => import("./AmbientScene"), { ssr: false });

export default function AmbientBackground({ className = "" }: { className?: string }) {
  return <AmbientScene className={className} />;
}
