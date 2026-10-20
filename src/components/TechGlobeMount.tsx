"use client";

import dynamic from "next/dynamic";

/* Canvas globe hanya hidup di browser; ssr:false mencegah hydration mismatch. */
const TechGlobe = dynamic(() => import("./TechGlobe"), {
  ssr: false,
  loading: () => null,
});

export default TechGlobe;
