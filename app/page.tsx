import type { Metadata } from "next"
import MinutesTaker from "@/components/minutes-taker"

export const metadata: Metadata = {
  title: "MinuteTaker.io - Professional Meeting Minutes",
  description: "Take meeting minutes efficiently with our privacy-focused, offline-capable web app",
}

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-6">
      <MinutesTaker />
    </div>
  )
}
