"use client";
import dynamic from "next/dynamic";
import InView from "./InView";

const KaryaBackdrop = dynamic(() => import("./KaryaBackdrop"), { ssr: false });

export default function KaryaScene({ className = "" }: { className?: string }) {
  return (
    <InView className={className} rootMargin="300px">
      <KaryaBackdrop className="w-full h-full" />
    </InView>
  );
}
