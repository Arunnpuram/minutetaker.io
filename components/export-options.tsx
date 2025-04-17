"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, FileDown, Download } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { jsPDF } from "jspdf"
import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, BorderStyle } from "docx"
import { useMeetingStore } from "@/store/meeting-store"

export default function ExportOptions() {
  const { activeMeetingId, meetings } = useMeetingStore()
  const activeMeeting = meetings.find((m) => m.id === activeMeetingId)

  const [isExporting, setIsExporting] = useState(false)
  const { toast } = useToast()

  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getMeetingTypeLabel = (type: string) => {
    if (!type) return ""
    return type.charAt(0).toUpperCase() + type.slice(1).replace(/-/g, " ")
  }

  const exportToPDF = async () => {
    if (!activeMeeting) return

    try {
      setIsExporting(true)

      const doc = new jsPDF()

      // Title
      doc.setFontSize(18)
      doc.text(activeMeeting.title || "Meeting Minutes", 14, 20)

      // Meeting details
      doc.setFontSize(12)
      if (activeMeeting.meetingType) {
        const meetingTypeLabel = getMeetingTypeLabel(activeMeeting.meetingType)
        doc.text(`Type: ${meetingTypeLabel}`, 14, 26)
        // Adjust other positions by adding 6 to their y-coordinate
        doc.text(`Date: ${formatDate(activeMeeting.date)}`, 14, 36)
        if (activeMeeting.startTime && activeMeeting.endTime) {
          doc.text(`Time: ${activeMeeting.startTime} - ${activeMeeting.endTime}`, 14, 42)
        }
        if (activeMeeting.location) {
          doc.text(`Location: ${activeMeeting.location}`, 14, 48)
        }
      } else {
        // Keep original positions if no meeting type
        doc.text(`Date: ${formatDate(activeMeeting.date)}`, 14, 30)
        if (activeMeeting.startTime && activeMeeting.endTime) {
          doc.text(`Time: ${activeMeeting.startTime} - ${activeMeeting.endTime}`, 14, 36)
        }
        if (activeMeeting.location) {
          doc.text(`Location: ${activeMeeting.location}`, 14, 42)
        }
      }

      // Attendees
      if (activeMeeting.attendees) {
        doc.text("Attendees:", 14, 52)
        doc.setFontSize(10)
        const attendeeLines = doc.splitTextToSize(activeMeeting.attendees, 180)
        doc.text(attendeeLines, 14, 58)
      }

      // Agenda
      let yPos = 70
      if (activeMeeting.agenda) {
        doc.setFontSize(12)
        doc.text("Agenda:", 14, yPos)
        doc.setFontSize(10)
        const agendaLines = doc.splitTextToSize(activeMeeting.agenda, 180)
        doc.text(agendaLines, 14, yPos + 6)
        yPos += 6 + agendaLines.length * 5
      }

      // Minutes
      yPos += 10
      doc.setFontSize(12)
      doc.text("Minutes:", 14, yPos)
      doc.setFontSize(10)

      // Strip HTML tags from minutes for PDF
      const strippedMinutes = activeMeeting.minutes.replace(/<[^>]*>?/gm, "")
      const minutesLines = doc.splitTextToSize(strippedMinutes, 180)
      doc.text(minutesLines, 14, yPos + 6)
      yPos += 6 + minutesLines.length * 5

      // Decisions
      if (activeMeeting.decisions.length > 0) {
        yPos += 10
        doc.setFontSize(12)
        doc.text("Decisions:", 14, yPos)
        doc.setFontSize(10)

        yPos += 6
        activeMeeting.decisions.forEach((decision, index) => {
          const decisionText = `${index + 1}. ${decision.description}`
          const decisionLines = doc.splitTextToSize(decisionText, 180)

          // Check if we need a new page
          if (yPos + decisionLines.length * 5 > 280) {
            doc.addPage()
            yPos = 20
          }

          doc.text(decisionLines, 14, yPos)
          yPos += decisionLines.length * 5

          if (decision.decisionMakers) {
            const makersText = `   Decision Makers: ${decision.decisionMakers}`
            doc.text(makersText, 14, yPos)
            yPos += 5
          }

          if (decision.rationale) {
            const rationaleText = `   Rationale: ${decision.rationale}`
            const rationaleLines = doc.splitTextToSize(rationaleText, 180)
            doc.text(rationaleLines, 14, yPos)
            yPos += rationaleLines.length * 5
          }

          yPos += 2
        })
      }

      // Action Items
      if (activeMeeting.actionItems.length > 0) {
        yPos += 10
        doc.setFontSize(12)
        doc.text("Action Items:", 14, yPos)
        doc.setFontSize(10)

        yPos += 6
        activeMeeting.actionItems.forEach((item, index) => {
          const status = item.completed ? "[COMPLETED] " : ""
          const assignee = item.assignee ? ` (${item.assignee})` : ""
          const dueDate = item.dueDate ? ` - Due: ${formatDate(item.dueDate)}` : ""

          const actionText = `${status}${index + 1}. ${item.description}${assignee}${dueDate}`
          const actionLines = doc.splitTextToSize(actionText, 180)

          // Check if we need a new page
          if (yPos + actionLines.length * 5 > 280) {
            doc.addPage()
            yPos = 20
          }

          doc.text(actionLines, 14, yPos)
          yPos += actionLines.length * 5 + 2
        })
      }

      // Save the PDF
      doc.save(`${activeMeeting.title || "Meeting_Minutes"}.pdf`)

      toast({
        title: "PDF exported successfully",
        description: "Your meeting minutes have been exported to PDF.",
      })
    } catch (error) {
      console.error("PDF export error:", error)
      toast({
        title: "Export failed",
        description: "There was an error exporting to PDF. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  const exportToWord = async () => {
    if (!activeMeeting) return

    try {
      setIsExporting(true)

      // Create document
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: [
              // Title
              new Paragraph({
                text: activeMeeting.title || "Meeting Minutes",
                heading: HeadingLevel.HEADING_1,
              }),

              // Meeting details
              ...(activeMeeting.meetingType
                ? [
                    new Paragraph({
                      children: [
                        new TextRun({ text: "Type: ", bold: true }),
                        new TextRun(getMeetingTypeLabel(activeMeeting.meetingType)),
                      ],
                    }),
                  ]
                : []),
              new Paragraph({
                children: [new TextRun({ text: "Date: ", bold: true }), new TextRun(formatDate(activeMeeting.date))],
              }),

              ...(activeMeeting.startTime && activeMeeting.endTime
                ? [
                    new Paragraph({
                      children: [
                        new TextRun({ text: "Time: ", bold: true }),
                        new TextRun(`${activeMeeting.startTime} - ${activeMeeting.endTime}`),
                      ],
                    }),
                  ]
                : []),

              ...(activeMeeting.location
                ? [
                    new Paragraph({
                      children: [new TextRun({ text: "Location: ", bold: true }), new TextRun(activeMeeting.location)],
                    }),
                  ]
                : []),

              // Attendees
              ...(activeMeeting.attendees
                ? [
                    new Paragraph({
                      text: "Attendees:",
                      heading: HeadingLevel.HEADING_2,
                      spacing: { before: 400 },
                    }),
                    new Paragraph(activeMeeting.attendees),
                  ]
                : []),

              // Agenda
              ...(activeMeeting.agenda
                ? [
                    new Paragraph({
                      text: "Agenda:",
                      heading: HeadingLevel.HEADING_2,
                      spacing: { before: 400 },
                    }),
                    new Paragraph(activeMeeting.agenda),
                  ]
                : []),

              // Minutes
              new Paragraph({
                text: "Minutes:",
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 400 },
              }),
              new Paragraph(activeMeeting.minutes.replace(/<[^>]*>?/gm, "")),

              // Decisions
              ...(activeMeeting.decisions.length > 0
                ? [
                    new Paragraph({
                      text: "Decisions:",
                      heading: HeadingLevel.HEADING_2,
                      spacing: { before: 400 },
                    }),
                    ...activeMeeting.decisions.map(
                      (decision) =>
                        new Paragraph({
                          children: [
                            new TextRun({ text: decision.description, bold: true }),
                            ...(decision.decisionMakers
                              ? [
                                  new TextRun({ text: "\nDecision Makers: ", bold: true }),
                                  new TextRun(decision.decisionMakers),
                                ]
                              : []),
                            ...(decision.rationale
                              ? [new TextRun({ text: "\nRationale: ", bold: true }), new TextRun(decision.rationale)]
                              : []),
                          ],
                          spacing: { after: 200 },
                        }),
                    ),
                  ]
                : []),

              // Action Items
              ...(activeMeeting.actionItems.length > 0
                ? [
                    new Paragraph({
                      text: "Action Items:",
                      heading: HeadingLevel.HEADING_2,
                      spacing: { before: 400 },
                    }),
                    new Table({
                      width: { size: 100, type: "pct" },
                      rows: [
                        // Header row
                        new TableRow({
                          children: [
                            new TableCell({
                              children: [new Paragraph({ text: "Item", bold: true })],
                              width: { size: 50, type: "pct" },
                            }),
                            new TableCell({
                              children: [new Paragraph({ text: "Assignee", bold: true })],
                              width: { size: 20, type: "pct" },
                            }),
                            new TableCell({
                              children: [new Paragraph({ text: "Due Date", bold: true })],
                              width: { size: 15, type: "pct" },
                            }),
                            new TableCell({
                              children: [new Paragraph({ text: "Status", bold: true })],
                              width: { size: 15, type: "pct" },
                            }),
                          ],
                        }),
                        // Action item rows
                        ...activeMeeting.actionItems.map(
                          (item) =>
                            new TableRow({
                              children: [
                                new TableCell({
                                  children: [new Paragraph(item.description)],
                                }),
                                new TableCell({
                                  children: [new Paragraph(item.assignee || "")],
                                }),
                                new TableCell({
                                  children: [new Paragraph(item.dueDate ? formatDate(item.dueDate) : "")],
                                }),
                                new TableCell({
                                  children: [new Paragraph(item.completed ? "Completed" : "Pending")],
                                }),
                              ],
                            }),
                        ),
                      ],
                      borders: {
                        top: { style: BorderStyle.SINGLE, size: 1 },
                        bottom: { style: BorderStyle.SINGLE, size: 1 },
                        left: { style: BorderStyle.SINGLE, size: 1 },
                        right: { style: BorderStyle.SINGLE, size: 1 },
                        insideHorizontal: { style: BorderStyle.SINGLE, size: 1 },
                        insideVertical: { style: BorderStyle.SINGLE, size: 1 },
                      },
                    }),
                  ]
                : []),
            ],
          },
        ],
      })

      // Generate and save document
      const buffer = await Packer.toBuffer(doc)
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      })
      const url = URL.createObjectURL(blob)

      const link = document.createElement("a")
      link.href = url
      link.download = `${activeMeeting.title || "Meeting_Minutes"}.docx`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "Word document exported successfully",
        description: "Your meeting minutes have been exported to Word format.",
      })
    } catch (error) {
      console.error("Word export error:", error)
      toast({
        title: "Export failed",
        description: "There was an error exporting to Word. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  if (!activeMeeting) {
    return <div className="text-center py-8 text-muted-foreground">No active meeting selected.</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Export Options</h3>
        <p className="text-muted-foreground mb-6">
          Export your meeting minutes to share with your team or for your records.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5" /> PDF Export
              </CardTitle>
              <CardDescription>Export your minutes as a PDF document</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={exportToPDF} disabled={isExporting || !activeMeeting.title} className="w-full">
                <Download className="mr-2 h-4 w-4" /> Export to PDF
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileDown className="mr-2 h-5 w-5" /> Word Export
              </CardTitle>
              <CardDescription>Export your minutes as a Word document</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={exportToWord} disabled={isExporting || !activeMeeting.title} className="w-full">
                <Download className="mr-2 h-4 w-4" /> Export to Word
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="text-sm text-muted-foreground">
        <p>Note: Please ensure you've filled in the meeting title before exporting.</p>
      </div>
    </div>
  )
}
