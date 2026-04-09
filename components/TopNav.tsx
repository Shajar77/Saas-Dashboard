"use client"

import * as React from "react"
import { Search, MessageSquare, Bell } from "lucide-react"

export function TopNav() {
  const [searchQuery, setSearchQuery] = React.useState("")

  return (
    <header className="w-full flex items-center justify-between pb-4 pt-2">
      {/* Left Section: Greeting */}
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Hello, Shajar!
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Explore information and activity about your assets
        </p>
      </div>

      {/* Right Section: Search & Actions */}
      <div className="flex items-center gap-4">
        {/* Search Pill */}
        <div className="flex items-center bg-[#111111] border border-white/5 rounded-full pl-4 pr-1 py-1 w-[300px] shadow-sm">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none text-sm text-white placeholder:text-gray-500 outline-none w-full"
          />
          <button className="w-8 h-8 rounded-full bg-[#D3FF33] text-black flex items-center justify-center shrink-0 hover:brightness-110 transition-all">
            <Search className="w-4 h-4" />
          </button>
        </div>

        {/* Message Button */}
        <button className="w-10 h-10 rounded-full bg-[#111111] border border-white/5 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer">
          <MessageSquare className="w-4 h-4 text-gray-400" />
        </button>

        {/* Notification Button with Dot */}
        <button className="relative w-10 h-10 rounded-full bg-[#111111] border border-white/5 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer">
          <Bell className="w-4 h-4 text-gray-400" />
          {/* Notification Dot */}
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#D3FF33]" />
        </button>
      </div>
    </header>
  )
}
