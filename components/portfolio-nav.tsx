"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { Database, FileText, Github, HomeIcon, Linkedin, Terminal } from "lucide-react"

const sectionIds = ["inicio", "sobre", "projetos", "blog"]

const navItems = [
  { label: "Inicio", href: "#inicio", icon: HomeIcon },
  { label: "Terminal", href: "#sobre", icon: Terminal },
  { label: "Dados", href: "#projetos", icon: Database },
  { label: "Avatar", href: "#inicio", avatar: true, accentOnly: true },
  { label: "Blog", href: "#blog", icon: FileText },
  { label: "GitHub", href: "https://github.com/duguimaraes", icon: Github, external: true, accentOnly: true },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/eduardo-ladeira-guimar%C3%A3es-a272a427b/",
    icon: Linkedin,
    external: true,
    accentOnly: true,
  },
]

export function PortfolioNav() {
  const [activeSection, setActiveSection] = useState("inicio")

  useEffect(() => {
    const root = document.getElementById("portfolio-scroll-root")

    if (!root) {
      return
    }

    const updateActiveSection = () => {
      const current = sectionIds
        .map((id) => {
          const section = document.getElementById(id)
          return {
            id,
            distance: section ? Math.abs(section.offsetLeft - root.scrollLeft) : Number.POSITIVE_INFINITY,
          }
        })
        .sort((a, b) => a.distance - b.distance)[0]

      if (current) {
        setActiveSection(current.id)
      }
    }

    updateActiveSection()
    root.addEventListener("scroll", updateActiveSection, { passive: true })
    window.addEventListener("resize", updateActiveSection)

    return () => {
      root.removeEventListener("scroll", updateActiveSection)
      window.removeEventListener("resize", updateActiveSection)
    }
  }, [])

  const handleInternalClick = (href: string) => {
    const root = document.getElementById("portfolio-scroll-root")
    const section = document.getElementById(href.replace("#", ""))

    if (!root || !section) {
      return
    }

    root.scrollTo({
      left: section.offsetLeft,
      behavior: "smooth",
    })
  }

  return (
    <header className="fixed inset-x-0 top-4 z-50 flex justify-center sm:top-5 lg:top-6">
      <nav className="flex items-center gap-2 rounded-[14px] border border-white/10 bg-black/78 p-2 shadow-2xl shadow-black/45 backdrop-blur-xl">
        {navItems.map((item) => {
          const Icon = item.icon
          const sectionId = item.href.startsWith("#") ? item.href.slice(1) : ""
          const isActive = !item.accentOnly && activeSection === sectionId

          return (
            <a
              key={item.label}
              href={item.href}
              aria-label={item.label}
              title={item.label}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noreferrer" : undefined}
              aria-current={isActive ? "page" : undefined}
              onClick={(event) => {
                if (!item.external) {
                  event.preventDefault()
                  handleInternalClick(item.href)
                }
              }}
              className={`flex h-9 w-9 items-center justify-center rounded-lg border bg-white/[0.06] text-white/76 transition hover:border-white/24 hover:bg-white/[0.12] hover:text-white ${
                isActive
                  ? "border-[#6cf6ff]/80 text-white shadow-[0_0_0_1px_rgba(108,246,255,0.42),0_0_18px_rgba(108,246,255,0.5)]"
                  : "border-white/10"
              }`}
            >
              {item.avatar ? (
                <span className="relative h-8 w-8 overflow-hidden rounded-full bg-[#6cb5ff]">
                  <Image src="/hero-avatar.png" alt="" fill sizes="32px" className="object-cover object-top" />
                </span>
              ) : (
                Icon && <Icon className="h-[18px] w-[18px]" />
              )}
            </a>
          )
        })}
      </nav>
    </header>
  )
}
