"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Service } from "@/lib/types"
import { MoreHorizontal, Plus } from "lucide-react"
import { getServices, updateService } from "@/lib/services"
import { useToast } from "@/components/ui/use-toast"
import { logAdminAction } from "@/lib/logging"
import { ServiceEditDialog } from "@/components/service-edit-dialog"

export function AdminServices() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    async function loadServices() {
      try {
        const allServices = await getServices()
        setServices(allServices)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load services. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadServices()
  }, [toast])

  const handleServiceUpdate = async (updatedService: Service) => {
    try {
      await updateService(updatedService)

      // Log admin action
      await logAdminAction({
        action: "update_service",
        user: "admin",
        timestamp: new Date().toISOString(),
        details: `Updated service ${updatedService.id}`,
        serviceId: updatedService.id,
        canUndo: true,
      })

      // Update local state
      setServices(services.map((service) => (service.id === updatedService.id ? updatedService : service)))

      toast({
        title: "Service updated",
        description: "The service has been updated successfully.",
      })

      setEditingService(null)
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update service. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleServiceCreate = async (newService: Omit<Service, "id">) => {
    try {
      // Generate a new ID
      const id = `service-${Date.now()}`
      const createdService = { ...newService, id }

      await updateService(createdService as Service)

      // Log admin action
      await logAdminAction({
        action: "create_service",
        user: "admin",
        timestamp: new Date().toISOString(),
        details: `Created new service ${id}`,
        serviceId: id,
      })

      // Update local state
      setServices([...services, createdService as Service])

      toast({
        title: "Service created",
        description: "The new service has been created successfully.",
      })

      setIsCreating(false)
    } catch (error) {
      toast({
        title: "Creation failed",
        description: "Failed to create service. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return <div>Loading services...</div>
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Service
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Min Order</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.map((service) => (
              <TableRow key={service.id}>
                <TableCell className="font-mono text-xs">{service.id}</TableCell>
                <TableCell className="font-medium">{service.name}</TableCell>
                <TableCell>
                  <Badge variant={service.category === "social" ? "default" : "secondary"}>{service.category}</Badge>
                </TableCell>
                <TableCell>${service.price.toFixed(2)}</TableCell>
                <TableCell>{service.minOrder}</TableCell>
                <TableCell>
                  <Badge variant={service.active ? "success" : "outline"}>
                    {service.active ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setEditingService(service)}>Edit Service</DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          handleServiceUpdate({
                            ...service,
                            active: !service.active,
                          })
                        }}
                      >
                        {service.active ? "Deactivate" : "Activate"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Service Edit Dialog */}
      {editingService && (
        <ServiceEditDialog
          service={editingService}
          onSave={handleServiceUpdate}
          onCancel={() => setEditingService(null)}
          open={!!editingService}
          onOpenChange={() => setEditingService(null)}
        />
      )}

      {/* Service Create Dialog */}
      {isCreating && (
        <ServiceEditDialog
          isCreating={true}
          onSave={handleServiceCreate}
          onCancel={() => setIsCreating(false)}
          open={isCreating}
          onOpenChange={() => setIsCreating(false)}
        />
      )}
    </>
  )
}
