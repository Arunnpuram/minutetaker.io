"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { Trash, Plus } from "lucide-react"
import { useMeetingStore } from "@/store/meeting-store"
import type { ActionItem } from "@/types/meeting"

export default function ActionItems() {
  const { activeMeetingId, meetings, addActionItem, updateActionItem, deleteActionItem } = useMeetingStore()
  const activeMeeting = meetings.find((m) => m.id === activeMeetingId)

  const [newItem, setNewItem] = useState<Omit<ActionItem, "id">>({
    description: "",
    assignee: "",
    dueDate: "",
    completed: false,
  })

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault()
    if (!activeMeetingId || !newItem.description.trim()) return

    addActionItem(activeMeetingId, newItem)
    setNewItem({
      description: "",
      assignee: "",
      dueDate: "",
      completed: false,
    })
  }

  const handleItemChange = (id: string, field: keyof ActionItem, value: string | boolean) => {
    if (!activeMeetingId) return
    updateActionItem(activeMeetingId, id, { [field]: value })
  }

  if (!activeMeeting) {
    return <div className="text-center py-8 text-muted-foreground">No active meeting selected.</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Action Items</h3>

        {activeMeeting.actionItems.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No action items yet. Add some below.</div>
        ) : (
          <div className="space-y-3">
            {activeMeeting.actionItems.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id={`item-${item.id}`}
                      checked={item.completed}
                      onCheckedChange={(checked) => handleItemChange(item.id, "completed", checked === true)}
                    />
                    <div className="flex-1 grid gap-2">
                      <Label
                        htmlFor={`item-${item.id}`}
                        className={`${item.completed ? "line-through text-muted-foreground" : ""}`}
                      >
                        {item.description}
                      </Label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <Input
                          placeholder="Assignee"
                          value={item.assignee}
                          onChange={(e) => handleItemChange(item.id, "assignee", e.target.value)}
                          className="h-8"
                        />
                        <Input
                          type="date"
                          value={item.dueDate}
                          onChange={(e) => handleItemChange(item.id, "dueDate", e.target.value)}
                          className="h-8"
                        />
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => deleteActionItem(activeMeetingId, item.id)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <form onSubmit={handleAddItem} className="border rounded-md p-4">
        <h4 className="font-medium mb-3">Add New Action Item</h4>
        <div className="space-y-3">
          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={newItem.description}
              onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
              placeholder="What needs to be done?"
              required
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="assignee">Assignee</Label>
              <Input
                id="assignee"
                value={newItem.assignee}
                onChange={(e) => setNewItem({ ...newItem, assignee: e.target.value })}
                placeholder="Who is responsible?"
              />
            </div>
            <div>
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={newItem.dueDate}
                onChange={(e) => setNewItem({ ...newItem, dueDate: e.target.value })}
              />
            </div>
          </div>
          <Button type="submit" className="w-full">
            <Plus className="h-4 w-4 mr-2" /> Add Action Item
          </Button>
        </div>
      </form>
    </div>
  )
}
