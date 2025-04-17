"use client"

import { useState, useEffect, useRef } from "react"
import { Play, Pause, RotateCcw, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useMeetingStore } from "@/store/meeting-store"

export default function MeetingTimer() {
  const { activeMeetingId, meetings, updateMeeting } = useMeetingStore()
  const activeMeeting = meetings.find((m) => m.id === activeMeetingId)

  const [isRunning, setIsRunning] = useState(false)
  const [time, setTime] = useState(activeMeeting?.timerDuration || 0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (activeMeeting) {
      setTime(activeMeeting.timerDuration || 0)
      setIsRunning(false)
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [activeMeeting])

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTime((prevTime) => {
          const newTime = prevTime + 1
          if (activeMeetingId) {
            updateMeeting(activeMeetingId, { timerDuration: newTime })
          }
          return newTime
        })
      }, 1000)
    } else if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [isRunning, activeMeetingId, updateMeeting])

  const handleStartStop = () => {
    setIsRunning(!isRunning)
  }

  const handleReset = () => {
    setIsRunning(false)
    setTime(0)
    if (activeMeetingId) {
      updateMeeting(activeMeetingId, { timerDuration: 0 })
    }
  }

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  if (!activeMeeting) {
    return null
  }

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Clock className="mr-2 h-5 w-5 text-muted-foreground" />
            <span className="text-lg font-medium">Meeting Timer</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-2xl font-mono tabular-nums">{formatDuration(time)}</div>
            <div className="flex space-x-1">
              <Button size="sm" variant={isRunning ? "destructive" : "default"} onClick={handleStartStop}>
                {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Button size="sm" variant="outline" onClick={handleReset}>
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
