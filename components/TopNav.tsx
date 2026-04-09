"use client"

import * as React from "react"
import Image from "next/image"
import { Search, MessageSquare, Bell, Menu } from "lucide-react"

export function TopNav() {
  return (
    <header className="w-full flex items-center justify-between pb-4 pt-2 gap-4">
      {/* Left Section: Logo (mobile) / Dashboard title (desktop) */}
      
      {/* Mobile: Logo only */}
      <div className="flex md:hidden items-center">
        <Image
          src="/Blue White Professional Minimal Brand Logo.png"
          alt="Logo"
          width={36}
          height={36}
          className="w-9 h-9 object-contain"
        />
      </div>
      
      {/* Desktop: Dashboard */}
      <div className="hidden md:flex flex-col min-w-0">
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Dashboard
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Overview of your assets and metrics
        </p>
      </div>

      {/* Right Section: Greeting & Actions */}
      <div className="flex items-center gap-2 md:gap-4 shrink-0">
        {/* Greeting - Desktop only */}
        <div className="hidden md:flex items-center mr-3">
          <span className="text-lg font-bold text-white">Hello, Shajar!</span>
        </div>

        {/* Message Button - Desktop only */}
        <button className="hidden md:flex w-10 h-10 rounded-full bg-[#111111] border border-white/5 items-center justify-center hover:bg-white/10 transition-colors cursor-pointer">
          <MessageSquare className="w-4 h-4 text-gray-400" />
        </button>

        {/* Notification Button with Dot - Always visible */}
        <button className="relative w-10 h-10 rounded-full bg-[#111111] border border-white/5 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer">
          <Bell className="w-4 h-4 text-gray-400" />
          {/* Notification Dot */}
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#D3FF33]" />
        </button>
        
        {/* Hamburger Menu - Mobile only */}
        <button className="md:hidden w-10 h-10 rounded-full bg-[#111111] border border-white/5 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer">
          <Menu className="w-5 h-5 text-gray-400" />
        </button>
      </div>
    </header>
  )
}
