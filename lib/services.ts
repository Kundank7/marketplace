import type { Service } from "@/lib/types"

// Mock services data
const mockServices: Service[] = [
  {
    id: "service-1",
    name: "Instagram Followers",
    description: "High-quality Instagram followers to boost your profile's credibility.",
    category: "social",
    price: 2.5,
    minOrder: 100,
    unit: "follower",
    active: true,
    targetOptions: ["global", "usa", "europe", "asia"],
    deviceTypes: ["desktop", "mobile", "tablet"],
  },
  {
    id: "service-2",
    name: "Facebook Page Likes",
    description: "Increase your Facebook page's popularity with real-looking likes.",
    category: "social",
    price: 3.0,
    minOrder: 50,
    unit: "like",
    active: true,
    targetOptions: ["global", "usa", "europe", "asia"],
    deviceTypes: ["desktop", "mobile", "tablet"],
  },
  {
    id: "service-3",
    name: "YouTube Views",
    description: "Boost your YouTube video's visibility with high-retention views.",
    category: "social",
    price: 1.5,
    minOrder: 1000,
    unit: "view",
    active: true,
    targetOptions: ["global", "usa", "europe", "asia"],
    deviceTypes: ["desktop", "mobile", "tablet"],
  },
  {
    id: "service-4",
    name: "Website Traffic",
    description: "Drive real-looking traffic to your website from various sources.",
    category: "traffic",
    price: 0.8,
    minOrder: 1000,
    unit: "visitor",
    active: true,
    targetOptions: ["global", "usa", "europe", "asia"],
    deviceTypes: ["desktop", "mobile", "tablet"],
  },
  {
    id: "service-5",
    name: "Telegram Channel Members",
    description: "Grow your Telegram channel with real-looking members.",
    category: "social",
    price: 2.0,
    minOrder: 100,
    unit: "member",
    active: true,
    targetOptions: ["global", "usa", "europe", "asia"],
    deviceTypes: ["desktop", "mobile", "tablet"],
  },
  {
    id: "service-6",
    name: "Mobile App Installs",
    description: "Increase your app's install count and improve store rankings.",
    category: "traffic",
    price: 0.5,
    minOrder: 100,
    unit: "install",
    active: true,
    targetOptions: ["global", "usa", "europe", "asia"],
    deviceTypes: ["mobile", "tablet"],
  },
]

// Initialize services in localStorage if not already present
function initializeServices() {
  if (typeof window === "undefined") return

  const storedServices = localStorage.getItem("services")
  if (!storedServices) {
    localStorage.setItem("services", JSON.stringify(mockServices))
  }
}

// Get all services
export async function getServices(): Promise<Service[]> {
  initializeServices()

  const storedServices = localStorage.getItem("services")
  if (!storedServices) {
    return []
  }

  try {
    return JSON.parse(storedServices)
  } catch (error) {
    console.error("Failed to parse services from localStorage:", error)
    return []
  }
}

// Get service by ID
export async function getServiceById(id: string): Promise<Service | null> {
  const services = await getServices()
  return services.find((service) => service.id === id) || null
}

// Update service
export async function updateService(service: Service): Promise<void> {
  const services = await getServices()
  const index = services.findIndex((s) => s.id === service.id)

  if (index !== -1) {
    services[index] = service
  } else {
    services.push(service)
  }

  localStorage.setItem("services", JSON.stringify(services))
}

// Delete service
export async function deleteService(id: string): Promise<void> {
  const services = await getServices()
  const filteredServices = services.filter((service) => service.id !== id)
  localStorage.setItem("services", JSON.stringify(filteredServices))
}

// Get service categories
export async function getServiceCategories(): Promise<string[]> {
  const services = await getServices()
  const categories = new Set(services.map((service) => service.category))
  return Array.from(categories)
}

// Get target options
export async function getTargetOptions(): Promise<string[]> {
  const services = await getServices()
  const targetOptions = new Set<string>()

  services.forEach((service) => {
    if (service.targetOptions) {
      service.targetOptions.forEach((option) => targetOptions.add(option))
    }
  })

  return Array.from(targetOptions)
}
