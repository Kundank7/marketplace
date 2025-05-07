"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { getServiceCategories, getTargetOptions } from "@/lib/services"

export function ServiceFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [categories, setCategories] = useState<string[]>([])
  const [targetOptions, setTargetOptions] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get("category") || "")
  const [selectedTargets, setSelectedTargets] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100])
  const [minOrder, setMinOrder] = useState<number>(0)

  useEffect(() => {
    // Load filter options
    const loadFilterOptions = async () => {
      const categories = await getServiceCategories()
      const targets = await getTargetOptions()

      setCategories(categories)
      setTargetOptions(targets)
    }

    loadFilterOptions()
  }, [])

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value)
  }

  const handleTargetChange = (target: string) => {
    setSelectedTargets((prev) => (prev.includes(target) ? prev.filter((t) => t !== target) : [...prev, target]))
  }

  const applyFilters = () => {
    const params = new URLSearchParams()

    if (selectedCategory) {
      params.set("category", selectedCategory)
    }

    if (selectedTargets.length > 0) {
      params.set("targets", selectedTargets.join(","))
    }

    if (priceRange[0] > 0 || priceRange[1] < 100) {
      params.set("minPrice", priceRange[0].toString())
      params.set("maxPrice", priceRange[1].toString())
    }

    if (minOrder > 0) {
      params.set("minOrder", minOrder.toString())
    }

    router.push(`/services?${params.toString()}`)
  }

  const resetFilters = () => {
    setSelectedCategory("")
    setSelectedTargets([])
    setPriceRange([0, 100])
    setMinOrder(0)
    router.push("/services")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filter Services</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Category Filter */}
        <div className="space-y-3">
          <h3 className="font-medium">Category</h3>
          <RadioGroup value={selectedCategory} onValueChange={handleCategoryChange}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="" id="all-categories" />
              <Label htmlFor="all-categories">All Categories</Label>
            </div>
            {categories.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <RadioGroupItem value={category} id={`category-${category}`} />
                <Label htmlFor={`category-${category}`} className="capitalize">
                  {category}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Target Options */}
        {targetOptions.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-medium">Target Options</h3>
            <div className="space-y-2">
              {targetOptions.map((target) => (
                <div key={target} className="flex items-center space-x-2">
                  <Checkbox
                    id={`target-${target}`}
                    checked={selectedTargets.includes(target)}
                    onCheckedChange={() => handleTargetChange(target)}
                  />
                  <Label htmlFor={`target-${target}`} className="capitalize">
                    {target}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Price Range */}
        <div className="space-y-3">
          <div className="flex justify-between">
            <h3 className="font-medium">Price Range</h3>
            <span className="text-sm text-muted-foreground">
              ${priceRange[0]} - ${priceRange[1]}
            </span>
          </div>
          <Slider
            defaultValue={[0, 100]}
            max={100}
            step={1}
            value={priceRange}
            onValueChange={(value) => setPriceRange(value as [number, number])}
          />
        </div>

        {/* Min Order */}
        <div className="space-y-3">
          <h3 className="font-medium">Minimum Order</h3>
          <Input
            type="number"
            min="0"
            value={minOrder}
            onChange={(e) => setMinOrder(Number.parseInt(e.target.value) || 0)}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col space-y-2">
          <Button onClick={applyFilters}>Apply Filters</Button>
          <Button variant="outline" onClick={resetFilters}>
            Reset Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
