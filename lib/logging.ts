import type { AdminLog } from "@/lib/types"
import { generateId } from "@/lib/utils"

// Log admin action
export async function logAdminAction(log: Omit<AdminLog, "id">): Promise<AdminLog> {
  const storedLogs = localStorage.getItem("adminLogs")
  let logs: AdminLog[] = []

  if (storedLogs) {
    try {
      logs = JSON.parse(storedLogs)
    } catch (error) {
      console.error("Failed to parse admin logs from localStorage:", error)
    }
  }

  const newLog: AdminLog = {
    ...log,
    id: generateId("log"),
  }

  logs.unshift(newLog) // Add to the beginning of the array
  localStorage.setItem("adminLogs", JSON.stringify(logs))

  return newLog
}

// Get admin logs
export async function getAdminLogs(): Promise<AdminLog[]> {
  const storedLogs = localStorage.getItem("adminLogs")
  if (!storedLogs) {
    return []
  }

  try {
    return JSON.parse(storedLogs)
  } catch (error) {
    console.error("Failed to parse admin logs from localStorage:", error)
    return []
  }
}

// Get admin log by ID
export async function getAdminLogById(id: string): Promise<AdminLog | null> {
  const storedLogs = localStorage.getItem("adminLogs")
  if (!storedLogs) {
    return null
  }

  try {
    const logs: AdminLog[] = JSON.parse(storedLogs)
    return logs.find((log) => log.id === id) || null
  } catch (error) {
    console.error("Failed to parse admin logs from localStorage:", error)
    return null
  }
}
