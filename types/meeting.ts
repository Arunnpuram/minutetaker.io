export interface Meeting {
  id: string
  title: string
  date: string
  startTime: string
  endTime: string
  location: string
  attendees: string
  agenda: string
  meetingType: string
  minutes: string
  actionItems: ActionItem[]
  decisions: Decision[]
  timerDuration: number
  isTemplate: boolean
}

export interface ActionItem {
  id: string
  description: string
  assignee: string
  dueDate: string
  completed: boolean
}

export interface Decision {
  id: string
  description: string
  decisionMakers: string
  rationale: string
  date: string
}

export interface MeetingTemplate {
  id: string
  name: string
  meetingType: string
  agenda: string
  attendees: string
  location: string
}
