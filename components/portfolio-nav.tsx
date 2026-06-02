"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { ArrowUpRight, Database, Github, HomeIcon, Linkedin, X } from "lucide-react"
import { CvPreviewModal } from "@/components/cv-preview-button"

const sectionIds = ["inicio", "blog"]
const portfolioRepositoryUrl = "https://github.com/duguimaraes/power-bi-analytics-portfolio/blob/main/README.pt-br.md"

const navItems = [
  { label: "Principal", href: "#inicio", icon: HomeIcon },
  { label: "Galeria de projetos", href: "#blog", icon: Database },
  { label: "Avatar", href: "#inicio", avatar: true, accentOnly: true },
  { label: "GitHub", href: portfolioRepositoryUrl, icon: Github, external: true, accentOnly: true },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/eduardo-ladeira-guimar%C3%A3es-a272a427b/",
    icon: Linkedin,
    external: true,
    accentOnly: true,
  },
]

export type ExternalLinkTarget = {
  label: string
  href: string
}

export function PortfolioNav() {
  const [activeSection, setActiveSection] = useState("inicio")
  const [isCvOpen, setIsCvOpen] = useState(false)
  const [externalTarget, setExternalTarget] = useState<(typeof navItems)[number] | null>(null)

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
      top: 0,
      behavior: "smooth",
    })
  }

  return (
    <>
      <header className="fixed inset-x-0 top-4 z-50 flex justify-center sm:top-5 lg:top-6">
        <nav className="flex items-center gap-2 rounded-[14px] border border-white/10 bg-black/78 p-2 shadow-2xl shadow-black/45 backdrop-blur-xl">
          {navItems.map((item) => {
            const Icon = item.icon
            const sectionId = item.href.startsWith("#") ? item.href.slice(1) : ""
            const isActive = !item.accentOnly && activeSection === sectionId

            return (
              <a
                key={item.label}
                href={item.avatar ? "#curriculo" : item.href}
                aria-label={item.label}
                title={item.avatar ? "Abrir curriculo" : item.label}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noreferrer" : undefined}
                aria-current={isActive ? "page" : undefined}
                onClick={(event) => {
                  if (item.external) {
                    event.preventDefault()
                    setExternalTarget(item)
                    return
                  }

                  if (item.avatar) {
                    event.preventDefault()
                    setIsCvOpen(true)
                    return
                  }

                  if (!item.external) {
                    event.preventDefault()
                    handleInternalClick(item.href)
                  }
                }}
                className={
                  item.avatar
                    ? "relative h-11 w-11 overflow-visible rounded-full border border-[#6cf6ff]/34 bg-[radial-gradient(circle_at_45%_28%,rgba(108,246,255,0.52),rgba(117,75,255,0.34)_48%,rgba(255,138,91,0.36)_100%)] p-0 shadow-[0_0_0_1px_rgba(108,246,255,0.18),0_0_16px_rgba(108,246,255,0.16)] transition hover:border-[#6cf6ff]/70 hover:shadow-[0_0_0_1px_rgba(108,246,255,0.36),0_0_22px_rgba(108,246,255,0.32)]"
                    : `flex h-9 w-9 items-center justify-center rounded-lg border bg-white/[0.06] text-white/76 transition hover:border-white/24 hover:bg-white/[0.12] hover:text-white ${
                        isActive
                          ? "border-[#6cf6ff]/80 text-white shadow-[0_0_0_1px_rgba(108,246,255,0.42),0_0_18px_rgba(108,246,255,0.5)]"
                          : "border-white/10"
                      }`
                }
              >
                {item.avatar ? (
                  <>
                    <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
                      <Image
                        src="/nav-face-avatar.png"
                        alt=""
                        width={72}
                        height={72}
                        className="absolute left-[48%] top-[-8px] h-[51px] w-[51px] max-w-none -translate-x-1/2 object-contain drop-shadow-[0_8px_10px_rgba(0,0,0,0.42)]"
                      />
                    </span>
                    <Image
                      src="/nav-face-avatar.png"
                      alt=""
                      width={72}
                      height={72}
                      className="pointer-events-none absolute left-[48%] top-[-8px] h-[51px] w-[51px] max-w-none -translate-x-1/2 object-contain [clip-path:inset(0_0_37px_0)]"
                    />
                  </>
                ) : (
                  Icon && <Icon className="h-[18px] w-[18px]" />
                )}
              </a>
            )
          })}
        </nav>
      </header>
      {externalTarget && <ExternalLinkDialog item={externalTarget} onClose={() => setExternalTarget(null)} />}
      <CvPreviewModal isOpen={isCvOpen} onClose={() => setIsCvOpen(false)} />
    </>
  )
}

export function ExternalLinkDialog({
  item,
  onClose,
}: {
  item: ExternalLinkTarget
  onClose: () => void
}) {
  return (
    <div
      className="fixed inset-0 z-[998] flex items-start justify-center bg-black/42 px-4 pt-24 backdrop-blur-sm sm:pt-28"
      role="dialog"
      aria-modal="true"
      aria-label={`Confirmar abertura do ${item.label}`}
      onClick={onClose}
    >
      <div
        className="w-[min(92vw,360px)] rounded-lg border border-[#6cf6ff]/28 bg-[#050617]/96 p-4 text-white shadow-[0_0_0_1px_rgba(108,246,255,0.12),0_0_28px_rgba(108,246,255,0.18)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-mono text-[0.6rem] font-bold uppercase tracking-[0.2em] text-[#6cf6ff]">Link externo</p>
            <h2 className="mt-1 text-base font-black text-white">Ir para {item.label}?</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/12 bg-white/[0.04] text-white/64 transition hover:border-white/28 hover:bg-white/10 hover:text-white"
            aria-label="Fechar confirmacao"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-3 text-sm leading-6 text-white/68">
          Você será direcionado para minha página no {item.label} em uma nova guia.
        </p>
        <div className="mt-4 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-white/12 px-3.5 py-2 text-sm font-bold text-white/68 transition hover:border-white/28 hover:text-white"
          >
            Cancelar
          </button>
          <a
            href={item.href}
            target="_blank"
            rel="noreferrer"
            onClick={onClose}
            className="inline-flex items-center gap-2 rounded-lg bg-white px-3.5 py-2 text-sm font-black text-[#0a0a2d] transition hover:bg-[#ffe2dd]"
          >
            Abrir
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  )
}
