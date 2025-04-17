"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { v4 as uuidv4 } from "uuid"
import type { Meeting, ActionItem, Decision, MeetingTemplate } from "@/types/meeting"

interface MeetingStore {
  meetings: Meeting[]
  templates: MeetingTemplate[]
  activeMeetingId: string | null

  // Meeting actions
  createMeeting: (meeting?: Partial<Meeting>) => string
  updateMeeting: (id: string, data: Partial<Meeting>) => void
  deleteMeeting: (id: string) => void
  setActiveMeeting: (id: string | null) => void

  // Action items
  addActionItem: (meetingId: string, item: Omit<ActionItem, "id">) => void
  updateActionItem: (meetingId: string, id: string, data: Partial<ActionItem>) => void
  deleteActionItem: (meetingId: string, id: string) => void

  // Decisions
  addDecision: (meetingId: string, decision: Omit<Decision, "id">) => void
  updateDecision: (meetingId: string, id: string, data: Partial<Decision>) => void
  deleteDecision: (meetingId: string, id: string) => void

  // Templates
  saveAsTemplate: (name: string, meetingId: string) => void
  createFromTemplate: (templateId: string) => string
  updateTemplate: (id: string, data: Partial<MeetingTemplate>) => void
  deleteTemplate: (id: string) => void
}

export const useMeetingStore = create<MeetingStore>()(
  persist(
    (set, get) => ({
      meetings: [],
      templates: [],
      activeMeetingId: null,

      createMeeting: (meeting = {}) => {
        const id = uuidv4()
        const newMeeting: Meeting = {
          id,
          title: meeting.title || "",
          date: meeting.date || new Date().toISOString().split("T")[0],
          startTime: meeting.startTime || "",
          endTime: meeting.endTime || "",
          location: meeting.location || "",
          attendees: meeting.attendees || "",
          agenda: meeting.agenda || "",
          meetingType: meeting.meetingType || "",
          minutes: meeting.minutes || "",
          actionItems: meeting.actionItems || [],
          decisions: meeting.decisions || [],
          timerDuration: meeting.timerDuration || 0,
          isTemplate: false,
        }

        set((state) => ({
          meetings: [...state.meetings, newMeeting],
          activeMeetingId: id,
        }))

        return id
      },

      updateMeeting: (id, data) => {
        set((state) => ({
          meetings: state.meetings.map((meeting) => (meeting.id === id ? { ...meeting, ...data } : meeting)),
        }))
      },

      deleteMeeting: (id) => {
        set((state) => {
          const newMeetings = state.meetings.filter((meeting) => meeting.id !== id)
          const newActiveMeetingId =
            state.activeMeetingId === id ? (newMeetings.length > 0 ? newMeetings[0].id : null) : state.activeMeetingId

          return {
            meetings: newMeetings,
            activeMeetingId: newActiveMeetingId,
          }
        })
      },

      setActiveMeeting: (id) => {
        set({ activeMeetingId: id })
      },

      addActionItem: (meetingId, item) => {
        set((state) => ({
          meetings: state.meetings.map((meeting) => {
            if (meeting.id === meetingId) {
              return {
                ...meeting,
                actionItems: [
                  ...meeting.actionItems,
                  {
                    id: uuidv4(),
                    ...item,
                  },
                ],
              }
            }
            return meeting
          }),
        }))
      },

      updateActionItem: (meetingId, id, data) => {
        set((state) => ({
          meetings: state.meetings.map((meeting) => {
            if (meeting.id === meetingId) {
              return {
                ...meeting,
                actionItems: meeting.actionItems.map((item) => (item.id === id ? { ...item, ...data } : item)),
              }
            }
            return meeting
          }),
        }))
      },

      deleteActionItem: (meetingId, id) => {
        set((state) => ({
          meetings: state.meetings.map((meeting) => {
            if (meeting.id === meetingId) {
              return {
                ...meeting,
                actionItems: meeting.actionItems.filter((item) => item.id !== id),
              }
            }
            return meeting
          }),
        }))
      },

      addDecision: (meetingId, decision) => {
        set((state) => ({
          meetings: state.meetings.map((meeting) => {
            if (meeting.id === meetingId) {
              return {
                ...meeting,
                decisions: [
                  ...meeting.decisions,
                  {
                    id: uuidv4(),
                    ...decision,
                  },
                ],
              }
            }
            return meeting
          }),
        }))
      },

      updateDecision: (meetingId, id, data) => {
        set((state) => ({
          meetings: state.meetings.map((meeting) => {
            if (meeting.id === meetingId) {
              return {
                ...meeting,
                decisions: meeting.decisions.map((decision) =>
                  decision.id === id ? { ...decision, ...data } : decision,
                ),
              }
            }
            return meeting
          }),
        }))
      },

      deleteDecision: (meetingId, id) => {
        set((state) => ({
          meetings: state.meetings.map((meeting) => {
            if (meeting.id === meetingId) {
              return {
                ...meeting,
                decisions: meeting.decisions.filter((decision) => decision.id !== id),
              }
            }
            return meeting
          }),
        }))
      },

      saveAsTemplate: (name, meetingId) => {
        const meeting = get().meetings.find((m) => m.id === meetingId)
        if (!meeting) return

        const template: MeetingTemplate = {
          id: uuidv4(),
          name,
          meetingType: meeting.meetingType,
          agenda: meeting.agenda,
          attendees: meeting.attendees,
          location: meeting.location,
        }

        set((state) => ({
          templates: [...state.templates, template],
        }))
      },

      createFromTemplate: (templateId) => {
        const template = get().templates.find((t) => t.id === templateId)
        if (!template) return ""

        return get().createMeeting({
          meetingType: template.meetingType,
          agenda: template.agenda,
          attendees: template.attendees,
          location: template.location,
        })
      },

      updateTemplate: (id, data) => {
        set((state) => ({
          templates: state.templates.map((template) => (template.id === id ? { ...template, ...data } : template)),
        }))
      },

      deleteTemplate: (id) => {
        set((state) => ({
          templates: state.templates.filter((template) => template.id !== id),
        }))
      },
    }),
    {
      name: "meeting-store",
    },
  ),
)
