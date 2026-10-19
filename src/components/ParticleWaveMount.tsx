"use client";

import dynamic from "next/dynamic";

/* WebGL hanya ada di browser. Dynamic import dengan ssr:false memastikan
   komponen ini tidak ikut dirender di server, jadi tidak ada mismatch hidrasi. */
const ParticleWave = dynamic(() => import("./ParticleWave"), {
  ssr: false,
  loading: () => null,
});

export default ParticleWave;
