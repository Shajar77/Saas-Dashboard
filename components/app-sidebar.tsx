"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
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
  { icon: LayoutDashboard, href: "/dashboard", label: "Overview" },
  { icon: BarChart2, href: "/dashboard/lifecycle", label: "Lifecycle" },
  { icon: Briefcase, href: "/dashboard/projects", label: "Projects" },
  { icon: Users, href: "/dashboard/team", label: "Team" },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex fixed left-6 top-1/2 -translate-y-1/2 z-50 h-auto min-h-[320px] w-20 bg-white dark:bg-[#111111]/90 backdrop-blur-xl rounded-full shadow-2xl border border-gray-200 dark:border-white/10 py-4 flex-col items-center justify-center gap-4">
      {navItems.map((item, index) => {
        const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
        return (
          <Link
            key={index}
            href={item.href}
            prefetch={true}
            className="relative flex items-center justify-center"
            title={item.label}
          >
            {isActive ? (
              <div className="bg-[#D3FF33] text-black w-12 h-12 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(211,255,51,0.3)] transition-all duration-200">
                <item.icon className="w-5 h-5" strokeWidth={2.5} />
              </div>
            ) : (
              <div className="w-12 h-12 flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
                <item.icon className="w-5 h-5" strokeWidth={2} />
              </div>
            )}
          </Link>
        )
      })}
      <Link
        href="/dashboard/settings"
        prefetch={true}
        className="w-12 h-12 flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
        title="Settings"
      >
        <Settings className="w-5 h-5" strokeWidth={2} />
      </Link>
    </aside>
  )
}
