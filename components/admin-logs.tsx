"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { AdminLog } from "@/lib/types"
import { formatDate } from "@/lib/utils"
import { getAdminLogs, undoAdminAction } from "@/lib/admin"
import { useToast } from "@/components/ui/use-toast"
import { RotateCcw } from "lucide-react"

export function AdminLogs() {
  const [logs, setLogs] = useState<AdminLog[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    async function loadLogs() {
      try {
        const allLogs = await getAdminLogs()
        setLogs(allLogs)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load admin logs. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadLogs()
  }, [toast])

  const handleUndo = async (logId: string) => {
    try {
      await undoAdminAction(logId)

      // Update local state
      setLogs(logs.map((log) => (log.id === logId ? { ...log, undone: true } : log)))

      toast({
        title: "Action undone",
        description: "The admin action has been successfully undone.",
      })
    } catch (error) {
      toast({
        title: "Undo failed",
        description: "Failed to undo the action. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return <div>Loading admin logs...</div>
  }

  if (logs.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold mb-2">No admin logs found</h3>
        <p className="text-muted-foreground">There are no admin action logs in the system yet.</p>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Timestamp</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Details</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id}>
              <TableCell>{formatDate(log.timestamp)}</TableCell>
              <TableCell>{log.user}</TableCell>
              <TableCell className="capitalize">{log.action.replace(/_/g, " ")}</TableCell>
              <TableCell className="max-w-[200px] truncate">{log.details}</TableCell>
              <TableCell>
                {log.undone ? (
                  <Badge variant="outline" className="bg-yellow-500 text-white">
                    Undone
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-green-500 text-white">
                    Completed
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-right">
                {log.canUndo && !log.undone ? (
                  <Button variant="outline" size="sm" onClick={() => handleUndo(log.id)}>
                    <RotateCcw className="mr-2 h-3 w-3" />
                    Undo
                  </Button>
                ) : (
                  <span className="text-muted-foreground text-sm">{log.undone ? "Undone" : "No action"}</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
