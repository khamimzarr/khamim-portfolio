"use client";

import dynamic from "next/dynamic";

/* Globe WebGL hanya hidup di browser; ssr:false mencegah hydration mismatch
   dan sekaligus supaya shader tidak ikut ter-render di server. */
const Globe = dynamic(() => import("./Globe"), {
  ssr: false,
  loading: () => null,
});

export default Globe;
