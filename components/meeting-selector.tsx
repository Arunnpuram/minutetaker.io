"use client"

import { useState } from "react"
import { Plus, FileText, LayoutTemplateIcon as Template, MoreHorizontal, Copy, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useMeetingStore } from "@/store/meeting-store"
import { useToast } from "@/hooks/use-toast"

export default function MeetingSelector() {
  const {
    meetings,
    templates,
    activeMeetingId,
    createMeeting,
    deleteMeeting,
    setActiveMeeting,
    createFromTemplate,
    saveAsTemplate,
  } = useMeetingStore()
  const { toast } = useToast()
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false)
  const [templateName, setTemplateName] = useState("")
  const [isTemplateSelectOpen, setIsTemplateSelectOpen] = useState(false)

  const activeMeeting = meetings.find((m) => m.id === activeMeetingId)

  const handleCreateMeeting = () => {
    createMeeting()
    toast({
      title: "New meeting created",
    })
  }

  const handleDeleteMeeting = (id: string) => {
    if (confirm("Are you sure you want to delete this meeting?")) {
      deleteMeeting(id)
      toast({
        title: "Meeting deleted",
      })
    }
  }

  const handleSaveTemplate = () => {
    if (!activeMeetingId || !templateName) return

    saveAsTemplate(templateName, activeMeetingId)
    setIsTemplateDialogOpen(false)
    setTemplateName("")

    toast({
      title: "Template saved",
      description: `Template "${templateName}" has been saved.`,
    })
  }

  const handleCreateFromTemplate = (templateId: string) => {
    createFromTemplate(templateId)
    setIsTemplateSelectOpen(false)

    toast({
      title: "Meeting created from template",
    })
  }

  return (
    <div className="flex items-center space-x-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-[200px] justify-start truncate">
            <FileText className="mr-2 h-4 w-4" />
            {activeMeeting ? activeMeeting.title || "Untitled Meeting" : "Select Meeting"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[200px] max-h-[300px] overflow-auto">
          {meetings.length === 0 ? (
            <div className="px-2 py-4 text-center text-sm text-muted-foreground">No meetings yet</div>
          ) : (
            meetings.map((meeting) => (
              <div key={meeting.id} className="flex items-center justify-between">
                <DropdownMenuItem className="flex-1 truncate" onSelect={() => setActiveMeeting(meeting.id)}>
                  {meeting.title || "Untitled Meeting"}
                </DropdownMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onSelect={() => handleDeleteMeeting(meeting.id)}>
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Button onClick={handleCreateMeeting}>
        <Plus className="mr-2 h-4 w-4" />
        New Meeting
      </Button>

      <DropdownMenu open={isTemplateSelectOpen} onOpenChange={setIsTemplateSelectOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <Template className="mr-2 h-4 w-4" />
            Templates
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {templates.length > 0 && (
            <>
              {templates.map((template) => (
                <DropdownMenuItem key={template.id} onSelect={() => handleCreateFromTemplate(template.id)}>
                  <Copy className="mr-2 h-4 w-4" />
                  {template.name}
                </DropdownMenuItem>
              ))}
              <hr className="my-2" />
            </>
          )}
          <DropdownMenuItem onSelect={() => setIsTemplateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Save as Template
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save as Template</DialogTitle>
            <DialogDescription>Create a reusable template from the current meeting.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="template-name">Template Name</Label>
              <Input
                id="template-name"
                placeholder="Weekly Team Meeting"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTemplateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveTemplate} disabled={!templateName}>
              Save Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
