"use client"

import { useEffect, useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Bold, Italic, List, ListOrdered, Clock } from "lucide-react"

interface MinutesEditorProps {
  value: string
  onChange: (value: string) => void
}

export default function MinutesEditor({ value, onChange }: MinutesEditorProps) {
  const [textareaRef, setTextareaRef] = useState<HTMLTextAreaElement | null>(null)
  const { toast } = useToast()

  // Auto-save functionality
  useEffect(() => {
    const interval = setInterval(() => {
      if (value) {
        localStorage.setItem("minutes", value)
      }
    }, 10000) // Save every 10 seconds

    return () => clearInterval(interval)
  }, [value])

  const insertFormatting = (format: string) => {
    if (!textareaRef) return

    const start = textareaRef.selectionStart
    const end = textareaRef.selectionEnd
    const selectedText = value.substring(start, end)
    let newText = value

    switch (format) {
      case "bold":
        newText = value.substring(0, start) + `**${selectedText}**` + value.substring(end)
        break
      case "italic":
        newText = value.substring(0, start) + `_${selectedText}_` + value.substring(end)
        break
      case "bullet":
        newText = value.substring(0, start) + `• ${selectedText}` + value.substring(end)
        break
      case "number":
        newText = value.substring(0, start) + `1. ${selectedText}` + value.substring(end)
        break
      case "timestamp":
        const now = new Date()
        const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        newText = value.substring(0, start) + `[${time}] ${selectedText}` + value.substring(end)
        break
    }

    onChange(newText)

    // Set focus back to textarea and adjust cursor position
    setTimeout(() => {
      if (textareaRef) {
        textareaRef.focus()
        const newCursorPos =
          format === "timestamp"
            ? start + time.length + 3 + selectedText.length
            : end +
              (format === "bold" ? 4 : format === "italic" ? 2 : format === "bullet" || format === "number" ? 2 : 0)
        textareaRef.setSelectionRange(newCursorPos, newCursorPos)
      }
    }, 0)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" size="sm" onClick={() => insertFormatting("bold")} title="Bold">
          <Bold className="h-4 w-4" />
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => insertFormatting("italic")} title="Italic">
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => insertFormatting("bullet")}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => insertFormatting("number")}
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => insertFormatting("timestamp")}
          title="Insert Timestamp"
        >
          <Clock className="h-4 w-4" />
        </Button>
      </div>

      <Textarea
        ref={setTextareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type your meeting minutes here..."
        className="min-h-[400px] font-mono text-sm"
      />

      <div className="text-xs text-muted-foreground">
        <p>Tip: Use markdown formatting for better readability. Your notes are automatically saved.</p>
      </div>
    </div>
  )
}
