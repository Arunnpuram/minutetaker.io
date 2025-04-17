"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Trash, Edit, Check, X } from "lucide-react"
import { useMeetingStore } from "@/store/meeting-store"
import type { Decision } from "@/types/meeting"

export default function Decisions() {
  const { activeMeetingId, meetings, addDecision, updateDecision, deleteDecision } = useMeetingStore()
  const activeMeeting = meetings.find((m) => m.id === activeMeetingId)

  const [newDecision, setNewDecision] = useState<Omit<Decision, "id">>({
    description: "",
    decisionMakers: "",
    rationale: "",
    date: new Date().toISOString().split("T")[0],
  })

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingDecision, setEditingDecision] = useState<Omit<Decision, "id">>({
    description: "",
    decisionMakers: "",
    rationale: "",
    date: "",
  })

  const handleAddDecision = (e: React.FormEvent) => {
    e.preventDefault()
    if (!activeMeetingId || !newDecision.description) return

    addDecision(activeMeetingId, newDecision)
    setNewDecision({
      description: "",
      decisionMakers: "",
      rationale: "",
      date: new Date().toISOString().split("T")[0],
    })
  }

  const handleEditDecision = (decision: Decision) => {
    setEditingId(decision.id)
    setEditingDecision({
      description: decision.description,
      decisionMakers: decision.decisionMakers,
      rationale: decision.rationale,
      date: decision.date,
    })
  }

  const handleSaveEdit = () => {
    if (!activeMeetingId || !editingId) return

    updateDecision(activeMeetingId, editingId, editingDecision)
    setEditingId(null)
  }

  const handleCancelEdit = () => {
    setEditingId(null)
  }

  const handleDeleteDecision = (id: string) => {
    if (!activeMeetingId) return

    if (confirm("Are you sure you want to delete this decision?")) {
      deleteDecision(activeMeetingId, id)
    }
  }

  if (!activeMeeting) {
    return <div className="text-center py-8 text-muted-foreground">No active meeting selected.</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Decisions</h3>

        {activeMeeting.decisions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No decisions recorded yet. Add some below.</div>
        ) : (
          <div className="space-y-3">
            {activeMeeting.decisions.map((decision) => (
              <Card key={decision.id}>
                <CardContent className="p-4">
                  {editingId === decision.id ? (
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor={`edit-description-${decision.id}`}>Decision</Label>
                        <Textarea
                          id={`edit-description-${decision.id}`}
                          value={editingDecision.description}
                          onChange={(e) => setEditingDecision({ ...editingDecision, description: e.target.value })}
                          className="mt-1"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor={`edit-makers-${decision.id}`}>Decision Makers</Label>
                          <Input
                            id={`edit-makers-${decision.id}`}
                            value={editingDecision.decisionMakers}
                            onChange={(e) => setEditingDecision({ ...editingDecision, decisionMakers: e.target.value })}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`edit-date-${decision.id}`}>Date</Label>
                          <Input
                            id={`edit-date-${decision.id}`}
                            type="date"
                            value={editingDecision.date}
                            onChange={(e) => setEditingDecision({ ...editingDecision, date: e.target.value })}
                            className="mt-1"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor={`edit-rationale-${decision.id}`}>Rationale</Label>
                        <Textarea
                          id={`edit-rationale-${decision.id}`}
                          value={editingDecision.rationale}
                          onChange={(e) => setEditingDecision({ ...editingDecision, rationale: e.target.value })}
                          className="mt-1"
                        />
                      </div>
                      <div className="flex justify-end space-x-2 mt-2">
                        <Button size="sm" variant="ghost" onClick={handleCancelEdit}>
                          <X className="h-4 w-4 mr-1" /> Cancel
                        </Button>
                        <Button size="sm" onClick={handleSaveEdit}>
                          <Check className="h-4 w-4 mr-1" /> Save
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex justify-between">
                        <h4 className="font-medium">{decision.description}</h4>
                        <div className="flex space-x-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleEditDecision(decision)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() => handleDeleteDecision(decision.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Decision Makers:</span>{" "}
                          {decision.decisionMakers || "Not specified"}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Date:</span> {decision.date || "Not specified"}
                        </div>
                      </div>
                      {decision.rationale && (
                        <div className="mt-2 text-sm">
                          <span className="text-muted-foreground">Rationale:</span> {decision.rationale}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <form onSubmit={handleAddDecision} className="border rounded-md p-4">
        <h4 className="font-medium mb-3">Add New Decision</h4>
        <div className="space-y-3">
          <div>
            <Label htmlFor="description">Decision</Label>
            <Textarea
              id="description"
              placeholder="What was decided?"
              value={newDecision.description}
              onChange={(e) => setNewDecision({ ...newDecision, description: e.target.value })}
              required
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="decisionMakers">Decision Makers</Label>
              <Input
                id="decisionMakers"
                placeholder="Who made this decision?"
                value={newDecision.decisionMakers}
                onChange={(e) => setNewDecision({ ...newDecision, decisionMakers: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={newDecision.date}
                onChange={(e) => setNewDecision({ ...newDecision, date: e.target.value })}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="rationale">Rationale</Label>
            <Textarea
              id="rationale"
              placeholder="Why was this decision made?"
              value={newDecision.rationale}
              onChange={(e) => setNewDecision({ ...newDecision, rationale: e.target.value })}
            />
          </div>
          <Button type="submit" className="w-full">
            <Plus className="h-4 w-4 mr-2" /> Add Decision
          </Button>
        </div>
      </form>
    </div>
  )
}
