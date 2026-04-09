"use client"

import * as React from "react"
import Image from "next/image"
import {
  LayoutDashboard,
  BarChart2,
  Briefcase,
  Users,
  Settings,
} from "lucide-react"

export function Logo() {
  return (
    <div className="fixed left-4 top-4 md:left-8 md:top-8 z-50">
      <Image
        src="/Blue White Professional Minimal Brand Logo.png"
        alt="Logo"
        width={40}
        height={40}
        className="w-8 h-8 md:w-10 md:h-10 object-contain"
      />
    </div>
  )
}

const navItems = [
  { icon: LayoutDashboard, active: true },
  { icon: BarChart2, active: false },
  { icon: Briefcase, active: false },
  { icon: Users, active: false },
]

export function AppSidebar() {
  return (
    <aside className="hidden md:flex fixed left-6 top-1/2 -translate-y-1/2 z-50 h-auto min-h-[320px] w-20 bg-[#111111]/90 backdrop-blur-xl rounded-full shadow-2xl border border-white/10 py-4 flex-col items-center justify-center gap-4">
      {navItems.map((item, index) => (
        <a
          key={index}
          href="#"
          className="relative flex items-center justify-center"
        >
          {item.active ? (
            <div className="bg-[#D3FF33] text-black w-12 h-12 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(211,255,51,0.3)] transition-all duration-200">
              <item.icon className="w-5 h-5" strokeWidth={2.5} />
            </div>
          ) : (
            <div className="w-12 h-12 flex items-center justify-center text-gray-500 hover:text-white transition-colors">
              <item.icon className="w-5 h-5" strokeWidth={2} />
            </div>
          )}
        </a>
      ))}
      <a
        href="#"
        className="w-12 h-12 flex items-center justify-center text-gray-500 hover:text-white transition-colors"
      >
        <Settings className="w-5 h-5" strokeWidth={2} />
      </a>
    </aside>
  )
}
