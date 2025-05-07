"use client";

import { Suspense } from "react";
import { ServiceGrid } from "@/components/service-grid";
import { ServiceFilter } from "@/components/service-filter";
import { ServiceSkeleton } from "@/components/service-skeleton";

export default function ServicesClient() {
  return (
    <div className="flex flex-col md:flex-row gap-8">
      <div className="w-full md:w-1/4">
        <ServiceFilter />
      </div>
      <div className="w-full md:w-3/4">
        <Suspense fallback={<ServiceSkeleton count={6} />}>
          <ServiceGrid />
        </Suspense>
      </div>
    </div>
  );
}
