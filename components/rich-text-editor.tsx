"use client"

import { useCallback, useEffect, useState } from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"
import Table from "@tiptap/extension-table"
import TableRow from "@tiptap/extension-table-row"
import TableCell from "@tiptap/extension-table-cell"
import TableHeader from "@tiptap/extension-table-header"
import { Button } from "@/components/ui/button"
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Undo,
  Redo,
  TableIcon,
  Clock,
  Code,
  Quote,
  Strikethrough,
  Minus,
} from "lucide-react"
import { useMeetingStore } from "@/store/meeting-store"

export default function RichTextEditor() {
  const { activeMeetingId, meetings, updateMeeting } = useMeetingStore()
  const activeMeeting = meetings.find((m) => m.id === activeMeetingId)

  const [content, setContent] = useState(activeMeeting?.minutes || "")

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Type your meeting minutes here...",
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableCell,
      TableHeader,
    ],
    content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      setContent(html)
      if (activeMeetingId) {
        updateMeeting(activeMeetingId, { minutes: html })
      }
    },
  })

  useEffect(() => {
    if (editor && activeMeeting) {
      if (editor.getHTML() !== activeMeeting.minutes) {
        editor.commands.setContent(activeMeeting.minutes || "")
      }
    }
  }, [activeMeeting, editor])

  const insertTimestamp = useCallback(() => {
    if (!editor) return

    const now = new Date()
    const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    editor.chain().focus().insertContent(`[${time}] `).run()
  }, [editor])

  const insertTable = useCallback(() => {
    if (!editor) return

    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
  }, [editor])

  if (!activeMeeting) {
    return <div className="text-center py-8 text-muted-foreground">No active meeting selected.</div>
  }

  return (
    <div className="space-y-4">
      <div className="border rounded-md p-1 flex flex-wrap gap-1 bg-muted/20">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className={editor?.isActive("bold") ? "bg-muted" : ""}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className={editor?.isActive("italic") ? "bg-muted" : ""}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor?.chain().focus().toggleStrike().run()}
          className={editor?.isActive("strike") ? "bg-muted" : ""}
        >
          <Strikethrough className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
          className={editor?.isActive("heading", { level: 1 }) ? "bg-muted" : ""}
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor?.isActive("heading", { level: 2 }) ? "bg-muted" : ""}
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          className={editor?.isActive("bulletList") ? "bg-muted" : ""}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          className={editor?.isActive("orderedList") ? "bg-muted" : ""}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
          className={editor?.isActive("codeBlock") ? "bg-muted" : ""}
        >
          <Code className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor?.chain().focus().toggleBlockquote().run()}
          className={editor?.isActive("blockquote") ? "bg-muted" : ""}
        >
          <Quote className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor?.chain().focus().setHorizontalRule().run()}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={insertTable}>
          <TableIcon className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={insertTimestamp}>
          <Clock className="h-4 w-4" />
        </Button>
        <div className="ml-auto flex gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor?.chain().focus().undo().run()}
            disabled={!editor?.can().undo()}
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor?.chain().focus().redo().run()}
            disabled={!editor?.can().redo()}
          >
            <Redo className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="border rounded-md min-h-[400px] prose dark:prose-invert max-w-none">
        <EditorContent editor={editor} className="min-h-[400px] p-4" />
      </div>

      <div className="text-xs text-muted-foreground">
        <p>Tip: Use the toolbar for formatting. Your notes are automatically saved.</p>
      </div>
    </div>
  )
}
