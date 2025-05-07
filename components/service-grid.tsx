"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { getServices } from "@/lib/services"
import type { Service } from "@/lib/types"
import { ServiceCalculator } from "@/components/service-calculator"
import { useSession } from "@/lib/session"

export function ServiceGrid() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const searchParams = useSearchParams()
  const category = searchParams.get("category")
  const { toast } = useToast()
  const { session } = useSession()

  useEffect(() => {
    async function loadServices() {
      try {
        const allServices = await getServices()

        // Filter by category if specified
        const filteredServices = category ? allServices.filter((service) => service.category === category) : allServices

        setServices(filteredServices)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load services. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadServices()
  }, [category, toast])

  if (loading) {
    return <div>Loading services...</div>
  }

  if (services.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold mb-2">No services found</h3>
        <p className="text-muted-foreground">
          {category ? `No services found in the ${category} category.` : "No services available at the moment."}
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <Card key={service.id} className="flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{service.name}</CardTitle>
                <Badge variant={service.category === "social" ? "default" : "secondary"}>{service.category}</Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-muted-foreground mb-4">{service.description}</p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Min Order:</span>
                  <span className="font-medium">{service.minOrder}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Price:</span>
                  <span className="font-medium">
                    ${service.price.toFixed(2)} per {service.unit}
                  </span>
                </div>
                {service.targetOptions && (
                  <div className="flex justify-between">
                    <span className="text-sm">Targeting:</span>
                    <span className="font-medium">{service.targetOptions.join(", ")}</span>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => setSelectedService(service)} disabled={!session}>
                {session ? "Order Now" : "Sign in to Order"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {selectedService && <ServiceCalculator service={selectedService} onClose={() => setSelectedService(null)} />}
    </>
  )
}
