"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import type { Service } from "@/lib/types"

interface ServiceEditDialogProps {
  service?: Service
  isCreating?: boolean
  onSave: (service: any) => void
  onCancel: () => void
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ServiceEditDialog({
  service,
  isCreating = false,
  onSave,
  onCancel,
  open,
  onOpenChange,
}: ServiceEditDialogProps) {
  const [formData, setFormData] = useState<any>({
    id: service?.id || "",
    name: service?.name || "",
    description: service?.description || "",
    category: service?.category || "social",
    price: service?.price || 1.0,
    minOrder: service?.minOrder || 100,
    unit: service?.unit || "item",
    active: service?.active !== undefined ? service.active : true,
    targetOptions: service?.targetOptions || [],
    deviceTypes: service?.deviceTypes || ["desktop", "mobile", "tablet"],
  })

  const handleChange = (field: string, value: any) => {
    setFormData({
      ...formData,
      [field]: value,
    })
  }

  const handleSubmit = () => {
    onSave(formData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isCreating ? "Create New Service" : "Edit Service"}</DialogTitle>
          <DialogDescription>
            {isCreating ? "Add a new service to the marketplace." : "Make changes to the existing service."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Category
            </Label>
            <Select value={formData.category} onValueChange={(value) => handleChange("category", value)}>
              <SelectTrigger id="category" className="col-span-3">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="social">Social</SelectItem>
                <SelectItem value="traffic">Traffic</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right">
              Price
            </Label>
            <Input
              id="price"
              type="number"
              min="0.01"
              step="0.01"
              value={formData.price}
              onChange={(e) => handleChange("price", Number.parseFloat(e.target.value))}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="minOrder" className="text-right">
              Min Order
            </Label>
            <Input
              id="minOrder"
              type="number"
              min="1"
              value={formData.minOrder}
              onChange={(e) => handleChange("minOrder", Number.parseInt(e.target.value))}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="unit" className="text-right">
              Unit
            </Label>
            <Input
              id="unit"
              value={formData.unit}
              onChange={(e) => handleChange("unit", e.target.value)}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="active" className="text-right">
              Active
            </Label>
            <div className="flex items-center space-x-2 col-span-3">
              <Switch
                id="active"
                checked={formData.active}
                onCheckedChange={(checked) => handleChange("active", checked)}
              />
              <Label htmlFor="active">{formData.active ? "Service is active" : "Service is inactive"}</Label>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>{isCreating ? "Create Service" : "Save Changes"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
