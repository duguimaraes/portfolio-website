"use client"

import Image from "next/image"
import type { CSSProperties } from "react"
import {
  ArrowUpRight,
  Sparkles,
} from "lucide-react"
import { CopyEmailButton } from "@/components/copy-email-button"
import { CvPreviewButton } from "@/components/cv-preview-button"
import { DashboardGallery } from "@/components/dashboard-gallery"
import { HorizontalScrollControls } from "@/components/horizontal-scroll-controls"
import { LanguageToggle } from "@/components/language-toggle"
import { useLanguage } from "@/components/language-provider"
import { PortfolioNav } from "@/components/portfolio-nav"

const skills = [
  "Power BI",
  "DAX",
  "Power Query",
  "SQL Databases",
  "PostgreSQL",
  "Firebird",
  "AWS Athena",
  "AI + MCP",
  "BI Automation",
  "Data Modeling",
]

const skillPositions = [
  { left: "49%", top: "13%", floatX: "0px", delay: "6.4s" },
  { left: "70%", top: "18%", floatX: "18px", delay: "5.6s" },
  { left: "33%", top: "15%", floatX: "-12px", delay: "6s" },
  { left: "79%", top: "59%", floatX: "18px", delay: "1.4s" },
  { left: "72%", top: "73%", floatX: "14px", delay: "0s" },
  { left: "28%", top: "73%", floatX: "-14px", delay: "0.7s" },
  { left: "14%", top: "56%", floatX: "-22px", delay: "2.1s" },
  { left: "14%", top: "36%", floatX: "-22px", delay: "3.1s" },
  { left: "84%", top: "34%", floatX: "22px", delay: "3.8s" },
  { left: "20%", top: "24%", floatX: "-18px", delay: "4.8s" },
]

export default function Home() {
  const { t } = useLanguage()

  return (
    <main
      id="portfolio-scroll-root"
      className="no-scrollbar relative flex h-[100dvh] snap-x snap-mandatory flex-row overflow-x-auto overflow-y-hidden overscroll-contain scroll-smooth bg-[#07072a] text-white"
    >
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_52%_42%,rgba(124,80,255,0.38),transparent_32%),radial-gradient(circle_at_82%_82%,rgba(255,109,77,0.26),transparent_26%),linear-gradient(135deg,#08082f_0%,#12124b_54%,#05051e_100%)]" />
      <div className="data-bg-pan pointer-events-none fixed -inset-8 z-0">
        <Image
          src="/hero-data-background.png"
          alt=""
          fill
          priority
          aria-hidden="true"
          className="object-cover object-[92%_50%] opacity-[0.40] mix-blend-screen sm:object-center"
        />
      </div>
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_50%_52%,rgba(7,7,42,0.12),rgba(7,7,42,0.5)_62%,rgba(7,7,42,0.78)_100%)]" />
      <HorizontalScrollControls />
      <PortfolioNav />
      <LanguageToggle />

      <section
        id="inicio"
        className="relative flex h-[100dvh] w-screen shrink-0 snap-start flex-col overflow-hidden px-4 pb-5 pt-24 sm:px-8 sm:pb-8 sm:pt-24 md:py-5 lg:px-16 lg:py-6"
      >
        <div className="absolute bottom-16 left-10 h-32 w-32 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute right-8 top-32 h-28 w-28 rounded-full bg-rose-400/10 blur-3xl" />

        <div className="relative z-10 grid min-h-0 flex-1 items-center gap-4 md:pb-16 md:pt-6 lg:grid-cols-[0.95fr_1.05fr] lg:gap-12 lg:pb-14 lg:pt-4">
          <div className="max-w-2xl translate-y-3 self-center text-center sm:translate-y-0 md:translate-x-16 md:text-left lg:translate-x-28 2xl:translate-x-40">
            <div>
              <div className="mb-2 flex flex-nowrap justify-center gap-1.5 sm:mb-5 sm:gap-2 md:justify-start">
                <p className="inline-flex min-w-0 items-center gap-1 whitespace-nowrap rounded-full border border-white/12 bg-white/[0.06] px-2 py-1.5 text-[0.48rem] font-bold uppercase tracking-[0.11em] text-white/70 sm:gap-1.5 sm:px-3 sm:py-2 sm:text-[0.68rem] sm:tracking-[0.18em]">
                  <Sparkles className="h-3 w-3 shrink-0 text-[#ffcf7a] sm:h-4 sm:w-4" />
                  {t.role}
                </p>
                <p className="inline-flex min-w-0 items-center gap-1 whitespace-nowrap rounded-full border border-white/12 bg-white/[0.06] px-2 py-1.5 text-[0.48rem] font-bold uppercase tracking-[0.11em] text-white/70 sm:gap-1.5 sm:px-3 sm:py-2 sm:text-[0.68rem] sm:tracking-[0.18em]">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.9)] animate-pulse sm:h-2 sm:w-2" />
                  {t.workingFor}
                </p>
              </div>
              <h1 className="text-[1.55rem] font-black leading-[1.05] tracking-normal sm:text-[2.4rem] md:whitespace-nowrap md:text-[1.6rem] lg:text-[2.1rem]">
                Eduardo Ladeira Guimarães
              </h1>
              <p className="mx-auto mt-3 max-w-lg text-justify text-[0.82rem] leading-5 text-white/72 sm:mt-5 sm:text-lg sm:leading-8 md:mx-0">
                {t.intro}
              </p>
              <div className="mx-auto mt-5 grid max-w-lg grid-cols-3 items-center gap-1.5 sm:mt-8 sm:flex sm:flex-wrap sm:gap-2.5 md:mx-0">
                <a
                  href="#blog"
                  className="inline-flex min-w-0 items-center justify-center gap-1 whitespace-nowrap rounded-lg bg-white px-2.5 py-2.5 text-[0.62rem] font-black text-[#0a0a2d] transition hover:bg-[#ffe2dd] sm:gap-1.5 sm:px-3.5 sm:py-3 sm:text-sm"
                >
                  {t.viewProjects}
                  <ArrowUpRight className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
                </a>
                <CopyEmailButton />
                <CvPreviewButton />
              </div>
            </div>
          </div>

          <div className="relative mx-auto flex aspect-square w-[min(66vw,270px)] translate-y-1 items-end justify-center self-center sm:w-[min(58vw,430px)] sm:translate-y-0 md:w-[min(78vw,68vh,610px)] md:translate-y-3 lg:w-[min(50vw,78vh,740px)] lg:translate-y-5 2xl:-translate-x-16">
            <div className="absolute bottom-8 h-[82%] w-[82%] rounded-full bg-[linear-gradient(138deg,#754bff_0%,#263d89_46%,#ff8a5b_100%)] shadow-2xl shadow-black/45" />
            <div className="absolute bottom-16 h-[68%] w-[86%] rounded-full border border-white/10 bg-white/[0.04] blur-[1px]" />
            <div className="pointer-events-none absolute inset-0 z-20">
              {skills.map((skill, index) => (
                <span
                  key={skill}
                  className="skill-orbit absolute whitespace-nowrap rounded-full border border-white/16 bg-[radial-gradient(circle_at_35%_22%,rgba(255,255,255,0.24),rgba(108,246,255,0.12)_42%,rgba(117,75,255,0.08)_100%)] px-2.5 py-1 text-[0.5rem] font-black text-white/64 shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_0_18px_rgba(108,246,255,0.14)] backdrop-blur-md sm:px-3 sm:py-1.5 sm:text-[0.62rem]"
                  style={{
                    left: skillPositions[index].left,
                    top: skillPositions[index].top,
                    animationDelay: skillPositions[index].delay,
                    "--skill-float-x": skillPositions[index].floatX,
                  } as CSSProperties}
                >
                  {skill}
                </span>
              ))}
            </div>
            <Image
              src="/hero-avatar.png"
              alt="Avatar 3D de Eduardo com notebook"
              width={1024}
              height={1536}
              priority
              className="relative z-10 h-auto w-[72%] max-w-[455px] drop-shadow-[0_38px_60px_rgba(0,0,0,0.45)]"
            />
          </div>
        </div>
      </section>
      <section id="blog" className="relative z-10 flex h-[100dvh] w-screen shrink-0 snap-start items-stretch overflow-y-auto px-4 pb-10 pt-24 text-white sm:px-8 md:overflow-hidden md:py-8 lg:px-16 2xl:px-16 2xl:py-10">
        <div className="mx-auto flex min-h-0 w-full max-w-7xl flex-col justify-start md:justify-center 2xl:max-w-[1640px]">
          <div className="mb-5 flex shrink-0 flex-col justify-between gap-1 text-center md:mb-3 md:flex-row md:items-end md:gap-3 md:text-left 2xl:mb-5">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#6cf6ff] sm:text-sm sm:tracking-[0.24em]">{t.galleryKicker}</p>
              <h2 className="mt-1 text-2xl font-black tracking-normal sm:mt-2 sm:text-4xl md:text-[2.6rem] 2xl:text-[3.25rem]">{t.galleryTitle}</h2>
            </div>
            <p className="mx-auto max-w-lg whitespace-nowrap text-[0.6rem] leading-4 text-white/72 sm:whitespace-normal sm:text-base sm:leading-7 md:mx-0 2xl:max-w-xl 2xl:text-lg 2xl:leading-8">
              {t.gallerySubtitle}
            </p>
          </div>
          <DashboardGallery />
        </div>
      </section>
    </main>
  )
}
