"use client";

import { Suspense } from "react";
import ImagesPage from "@/views/ImagesPage/ImagesPage.jsx";

export default function ImagesRoute() {
  return (
    <Suspense fallback={null}>
      <ImagesPage />
    </Suspense>
  );
}
