"use client"

import Image from "next/image"
import type { ReactNode } from "react"
import { useEffect, useRef, useState } from "react"
import { ArrowUpRight, BarChart3, Code2, LayoutDashboard, LineChart, PieChart } from "lucide-react"

type ProjectTerminalCardProps = {
  title: string
  type: string
  code: string
  accent: string
  dashboardImageSrc?: string
  dashboardImageAlt?: string
  dashboardHref?: string
}

export function ProjectTerminalCard({
  title,
  type,
  code,
  accent,
  dashboardImageSrc,
  dashboardImageAlt,
  dashboardHref,
}: ProjectTerminalCardProps) {
  const [activePanel, setActivePanel] = useState<"code" | "dashboard">("code")
  const isCodeActive = activePanel === "code"

  return (
    <article className="overflow-hidden rounded-lg border border-white/12 bg-[#050617]/88 text-white shadow-2xl shadow-black/30 backdrop-blur">
      <TerminalHeader
        label="query.sql"
        active={isCodeActive}
        icon={<Code2 className="h-3.5 w-3.5" />}
        onClick={() => setActivePanel("code")}
      />

      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          isCodeActive ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="px-5 pb-4 pt-4">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-[#6cb5ff]">{type}</p>
                <h3 className="mt-2 text-xl font-black tracking-normal text-white">{title}</h3>
              </div>
              <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-[#ff6b5d]" />
            </div>
            <pre
              data-code-scroll
              className="code-scrollbar h-[255px] overflow-auto whitespace-pre-wrap break-words rounded-md border border-white/10 bg-black/55 p-4 font-mono text-[0.54rem] leading-3 text-[#d7e7ff] shadow-inner shadow-black/30"
            >
              <code>{code}</code>
            </pre>
          </div>
        </div>
      </div>

      <TerminalHeader
        label="dashboard.preview"
        active={!isCodeActive}
        icon={<LayoutDashboard className="h-3.5 w-3.5" />}
        onClick={() => setActivePanel("dashboard")}
      />

      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          isCodeActive ? "grid-rows-[0fr]" : "grid-rows-[1fr]"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <DashboardPreview
            title={title}
            accent={accent}
            imageSrc={dashboardImageSrc}
            imageAlt={dashboardImageAlt ?? `${title} dashboard preview`}
            href={dashboardHref}
          />
        </div>
      </div>
    </article>
  )
}

function TerminalHeader({
  label,
  active,
  icon,
  onClick,
}: {
  label: string
  active: boolean
  icon: ReactNode
  onClick: () => void
}) {
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const button = buttonRef.current

    if (!button || active || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return
    }

    const animation = button.animate(
      [
        { transform: "translateY(0)" },
        { transform: "translateY(-4px)" },
        { transform: "translateY(0)" },
      ],
      {
        duration: 4200,
        easing: "ease-in-out",
        iterations: Infinity,
      },
    )

    return () => animation.cancel()
  }, [active])

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={onClick}
      className={`flex w-full items-center justify-between border-b border-white/10 px-4 py-3 text-left transition ${
        active ? "bg-black/45" : "bg-black/70 hover:bg-black/55"
      }`}
      aria-expanded={active}
    >
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-[#ff6b5d]" />
          <span className="h-3 w-3 rounded-full bg-[#ffcf7a]" />
          <span className="h-3 w-3 rounded-full bg-[#6cb5ff]" />
        </div>
        <span className="flex items-center gap-2 font-mono text-xs text-white/56">
          {icon}
          {label}
        </span>
      </div>
      <span className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-white/32">
        {active ? "expanded" : "minimized"}
      </span>
    </button>
  )
}

function DashboardPreview({
  title,
  accent,
  imageSrc,
  imageAlt,
  href,
}: {
  title: string
  accent: string
  imageSrc?: string
  imageAlt: string
  href?: string
}) {
  if (imageSrc) {
    const previewImage = (
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        sizes="(min-width: 768px) 33vw, 100vw"
        className="object-contain transition duration-300 ease-out group-hover:scale-[1.04]"
      />
    )

    return (
      <div className="h-[318px] bg-black/42 p-3">
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          aria-label={`Abrir projeto ${title} no GitHub`}
          className="group relative block h-full overflow-hidden rounded-md border border-white/10 bg-[#050617] shadow-inner shadow-black/30 transition duration-300 hover:border-white/24 hover:shadow-black/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
        >
          {previewImage}
          <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/5" />
        </a>
      </div>
    )
  }

  return (
    <div className="h-[318px] bg-black/42 p-4">
      <div className="grid h-full grid-rows-[auto_1fr] gap-3 rounded-md border border-white/10 bg-[#080a14]/90 p-3 shadow-inner shadow-black/30">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-mono text-[0.58rem] uppercase tracking-[0.18em] text-white/42">Power BI Preview</p>
            <h4 className="mt-1 text-sm font-black text-white">{title}</h4>
          </div>
          <div className="flex gap-2">
            <Metric label="Receita" value="R$ 1.8M" accent={accent} />
            <Metric label="Meta" value="94%" accent="#6cb5ff" />
          </div>
        </div>

        <div className="grid min-h-0 grid-cols-[1.1fr_0.9fr] gap-3">
          <div className="grid gap-3">
            <Panel>
              <div className="mb-3 flex items-center gap-2 text-[0.62rem] font-bold uppercase tracking-[0.16em] text-white/48">
                <LineChart className="h-3.5 w-3.5" />
                Tendência mensal
              </div>
              <svg className="h-[88px] w-full" viewBox="0 0 240 88" preserveAspectRatio="none">
                <path d="M0 76 C40 38 58 58 86 30 C116 0 142 54 174 24 C202 -2 218 22 240 10" fill="none" stroke={accent} strokeWidth="4" />
                <path d="M0 76 C40 38 58 58 86 30 C116 0 142 54 174 24 C202 -2 218 22 240 10 V88 H0 Z" fill={accent} opacity="0.16" />
              </svg>
            </Panel>
            <Panel>
              <div className="mb-3 flex items-center gap-2 text-[0.62rem] font-bold uppercase tracking-[0.16em] text-white/48">
                <BarChart3 className="h-3.5 w-3.5" />
                Performance por canal
              </div>
              <div className="flex h-[74px] items-end gap-2">
                {[52, 76, 44, 88, 66, 94, 58].map((height, index) => (
                  <span
                    key={height + index}
                    className="flex-1 rounded-t-sm"
                    style={{
                      height: `${height}%`,
                      background: index % 2 === 0 ? accent : "rgba(108,181,255,0.72)",
                    }}
                  />
                ))}
              </div>
            </Panel>
          </div>

          <div className="grid gap-3">
            <Panel>
              <div className="mb-2 flex items-center gap-2 text-[0.62rem] font-bold uppercase tracking-[0.16em] text-white/48">
                <PieChart className="h-3.5 w-3.5" />
                Mix
              </div>
              <div
                className="mx-auto h-24 w-24 rounded-full"
                style={{
                  background: `conic-gradient(${accent} 0 42%, rgba(108,181,255,0.8) 42% 74%, rgba(255,207,122,0.8) 74% 100%)`,
                }}
              />
            </Panel>
            <Panel>
              <div className="space-y-2">
                {["SQL", "Power BI", "ETL", "DAX"].map((item, index) => (
                  <div key={item}>
                    <div className="mb-1 flex justify-between font-mono text-[0.58rem] text-white/44">
                      <span>{item}</span>
                      <span>{86 - index * 9}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-white/8">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${86 - index * 9}%`, background: index % 2 ? "#6cb5ff" : accent }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Panel>
          </div>
        </div>
      </div>
    </div>
  )
}

function Metric({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div className="rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-right">
      <p className="font-mono text-[0.55rem] uppercase tracking-[0.16em] text-white/34">{label}</p>
      <p className="text-sm font-black" style={{ color: accent }}>
        {value}
      </p>
    </div>
  )
}

function Panel({ children }: { children: ReactNode }) {
  return <div className="min-h-0 rounded-md border border-white/10 bg-white/[0.035] p-3">{children}</div>
}
