"use client"

import { useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Toaster } from "@/components/ui/toaster"
import MeetingInfoForm from "./meeting-info-form"
import RichTextEditor from "./rich-text-editor"
import ActionItems from "./action-items"
import Decisions from "./decisions"
import ExportOptions from "./export-options"
import MeetingSelector from "./meeting-selector"
import MeetingTimer from "./meeting-timer"
import { useMeetingStore } from "@/store/meeting-store"

export default function MinutesTaker() {
  const { meetings, createMeeting, activeMeetingId } = useMeetingStore()

  // Create a default meeting if none exists
  useEffect(() => {
    if (meetings.length === 0) {
      createMeeting()
    }
  }, [meetings.length, createMeeting])

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">MinuteTaker.io</h1>
          <p className="text-muted-foreground">Take professional meeting minutes</p>
        </div>
        <MeetingSelector />
      </header>

      {activeMeetingId && <MeetingTimer />}

      <Card>
        <CardContent className="p-0">
          <Tabs defaultValue="info" className="w-full">
            <TabsList className="w-full grid grid-cols-5">
              <TabsTrigger value="info">Meeting Info</TabsTrigger>
              <TabsTrigger value="minutes">Minutes</TabsTrigger>
              <TabsTrigger value="actions">Action Items</TabsTrigger>
              <TabsTrigger value="decisions">Decisions</TabsTrigger>
              <TabsTrigger value="export">Export</TabsTrigger>
            </TabsList>
            <TabsContent value="info" className="p-4 sm:p-6">
              <MeetingInfoForm />
            </TabsContent>
            <TabsContent value="minutes" className="p-4 sm:p-6">
              <RichTextEditor />
            </TabsContent>
            <TabsContent value="actions" className="p-4 sm:p-6">
              <ActionItems />
            </TabsContent>
            <TabsContent value="decisions" className="p-4 sm:p-6">
              <Decisions />
            </TabsContent>
            <TabsContent value="export" className="p-4 sm:p-6">
              <ExportOptions />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      <Toaster />
    </div>
  )
}
