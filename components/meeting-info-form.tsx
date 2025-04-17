"use client"

import type React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useMeetingStore } from "@/store/meeting-store"

export default function MeetingInfoForm() {
  const { activeMeetingId, meetings, updateMeeting } = useMeetingStore()
  const activeMeeting = meetings.find((m) => m.id === activeMeetingId)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!activeMeetingId) return

    const { name, value } = e.target
    updateMeeting(activeMeetingId, { [name]: value })
  }

  const handleSelectChange = (value: string) => {
    if (!activeMeetingId) return
    updateMeeting(activeMeetingId, { meetingType: value })
  }

  const meetingTypes = [
    { value: "team", label: "Team Meeting" },
    { value: "one-on-one", label: "One-on-One" },
    { value: "project-kickoff", label: "Project Kickoff" },
    { value: "status-update", label: "Status Update" },
    { value: "sales", label: "Sales Meeting" },
    { value: "client", label: "Client Meeting" },
    { value: "board", label: "Board Meeting" },
    { value: "performance-review", label: "Performance Review" },
    { value: "strategy", label: "Strategy Session" },
    { value: "brainstorming", label: "Brainstorming Session" },
    { value: "training", label: "Training Session" },
    { value: "all-hands", label: "All-Hands Meeting" },
    { value: "retrospective", label: "Retrospective" },
    { value: "planning", label: "Planning Meeting" },
    { value: "interview", label: "Interview" },
    { value: "other", label: "Other" },
  ]

  if (!activeMeeting) {
    return <div className="text-center py-8 text-muted-foreground">No active meeting selected.</div>
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Meeting Title</Label>
        <Input
          id="title"
          name="title"
          value={activeMeeting.title}
          onChange={handleChange}
          placeholder="Quarterly Planning Meeting"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="meetingType">Meeting Type</Label>
        <Select value={activeMeeting.meetingType} onValueChange={handleSelectChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select meeting type" />
          </SelectTrigger>
          <SelectContent>
            {meetingTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input id="date" name="date" type="date" value={activeMeeting.date} onChange={handleChange} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="startTime">Start Time</Label>
          <Input id="startTime" name="startTime" type="time" value={activeMeeting.startTime} onChange={handleChange} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endTime">End Time</Label>
          <Input id="endTime" name="endTime" type="time" value={activeMeeting.endTime} onChange={handleChange} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          name="location"
          value={activeMeeting.location}
          onChange={handleChange}
          placeholder="Conference Room A / Zoom Meeting"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="attendees">Attendees</Label>
        <Textarea
          id="attendees"
          name="attendees"
          value={activeMeeting.attendees}
          onChange={handleChange}
          placeholder="John Doe, Jane Smith, etc."
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="agenda">Agenda</Label>
        <Textarea
          id="agenda"
          name="agenda"
          value={activeMeeting.agenda}
          onChange={handleChange}
          placeholder="1. Review previous action items
2. Discuss project status
3. Plan next steps"
          rows={5}
        />
      </div>
    </div>
  )
}
