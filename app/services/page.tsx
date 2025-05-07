import dynamic from "next/dynamic";
import { Suspense } from "react";

// Dynamically import client components without SSR to avoid build-time errors
const ServiceGrid = dynamic(() => import("@/components/service-grid"), { ssr: false });
const ServiceFilter = dynamic(() => import("@/components/service-filter"), { ssr: false });
const ServiceSkeleton = dynamic(() => import("@/components/service-skeleton"), { ssr: false });

export default function ServicesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Our Services</h1>
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
    </div>
  );
}
