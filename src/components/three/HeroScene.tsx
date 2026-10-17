"use client";
import dynamic from "next/dynamic";
import InView from "./InView";

const HeroObject = dynamic(() => import("./HeroObject"), { ssr: false });

export default function HeroScene({ className = "" }: { className?: string }) {
  return (
    <InView className={className} rootMargin="400px">
      <HeroObject className="w-full h-full" />
    </InView>
  );
}
