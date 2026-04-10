"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { Sun, Moon, MessageSquare, Bell, Menu, X, LayoutDashboard, BarChart2, Briefcase, Users, Settings } from "lucide-react"

const navItems = [
  { icon: LayoutDashboard, href: "/dashboard", label: "Overview" },
  { icon: BarChart2, href: "/dashboard/lifecycle", label: "Lifecycle" },
  { icon: Briefcase, href: "/dashboard/projects", label: "Projects" },
  { icon: Users, href: "/dashboard/team", label: "Team" },
  { icon: Settings, href: "/dashboard/settings", label: "Settings" },
]

export function TopNav() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const pathname = usePathname()

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Close mobile menu when route changes
  React.useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }
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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
          Dashboard
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Overview of your assets and metrics
        </p>
      </div>

      {/* Right Section: Actions */}
      <div className="flex items-center gap-2 md:gap-4 shrink-0">
        {/* Theme Toggle - Desktop only */}
        {mounted && (
          <button
            onClick={toggleTheme}
            className="hidden md:flex w-10 h-10 rounded-full bg-gray-100 dark:bg-[#111111] border border-gray-200 dark:border-white/5 items-center justify-center hover:bg-gray-200 dark:hover:bg-white/10 transition-colors cursor-pointer"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-gray-400" />
            ) : (
              <Moon className="w-4 h-4 text-gray-600" />
            )}
          </button>
        )}

        {/* Message Button - Desktop only */}
        <button className="hidden md:flex w-10 h-10 rounded-full bg-gray-100 dark:bg-[#111111] border border-gray-200 dark:border-white/5 items-center justify-center hover:bg-gray-200 dark:hover:bg-white/10 transition-colors cursor-pointer">
          <MessageSquare className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        </button>

        {/* Notification Button with Dot - Always visible */}
        <button className="relative w-10 h-10 rounded-full bg-gray-100 dark:bg-[#111111] border border-gray-200 dark:border-white/5 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-white/10 transition-colors cursor-pointer">
          <Bell className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          {/* Notification Dot */}
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#D3FF33]" />
        </button>
        
        {/* Hamburger Menu - Mobile only */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden w-10 h-10 rounded-full bg-gray-100 dark:bg-[#111111] border border-gray-200 dark:border-white/5 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-white/10 transition-colors cursor-pointer"
        >
          {mobileMenuOpen ? (
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          ) : (
            <Menu className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          )}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          {/* Mobile Menu Panel */}
          <div className="fixed top-0 right-0 h-full w-[280px] bg-white dark:bg-[#111111] z-50 md:hidden shadow-2xl">
            <div className="flex flex-col h-full p-6">
              {/* Close button */}
              <div className="flex justify-end mb-8">
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>
              
              {/* Navigation Items */}
              <nav className="flex flex-col gap-2">
                {navItems.map((item, index) => {
                  const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
                  return (
                    <Link
                      key={index}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                        isActive 
                          ? "bg-[#D3FF33] text-black font-medium" 
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5"
                      }`}
                    >
                      <item.icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                      <span>{item.label}</span>
                    </Link>
                  )
                })}
              </nav>

              {/* Theme Toggle in Mobile Menu */}
              {mounted && (
                <button
                  onClick={toggleTheme}
                  className="flex items-center gap-3 px-4 py-3 mt-auto rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-all duration-200"
                >
                  {theme === "dark" ? (
                    <>
                      <Sun className="w-5 h-5" />
                      <span>Light Mode</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-5 h-5" />
                      <span>Dark Mode</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </header>
  )
}
