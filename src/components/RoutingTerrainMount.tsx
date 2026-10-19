"use client";

import dynamic from "next/dynamic";

/* WebGL hanya ada di browser; ssr:false mencegah hydration mismatch. */
const RoutingTerrain = dynamic(() => import("./RoutingTerrain"), {
  ssr: false,
  loading: () => null,
});

export default RoutingTerrain;
