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
  return (
    <main
      id="portfolio-scroll-root"
      className="no-scrollbar relative flex h-[100dvh] snap-y snap-proximity flex-col overflow-x-hidden overflow-y-auto overscroll-contain scroll-smooth bg-[#07072a] text-white md:snap-x md:snap-mandatory md:flex-row md:overflow-x-auto md:overflow-y-hidden"
    >
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_52%_42%,rgba(124,80,255,0.38),transparent_32%),radial-gradient(circle_at_82%_82%,rgba(255,109,77,0.26),transparent_26%),linear-gradient(135deg,#08082f_0%,#12124b_54%,#05051e_100%)]" />
      <div className="data-bg-pan pointer-events-none fixed -inset-8 z-0">
        <Image
          src="/hero-data-background.png"
          alt=""
          fill
          priority
          aria-hidden="true"
          className="object-cover opacity-[0.44] mix-blend-screen"
        />
      </div>
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_50%_52%,rgba(7,7,42,0.12),rgba(7,7,42,0.5)_62%,rgba(7,7,42,0.78)_100%)]" />
      <HorizontalScrollControls />
      <PortfolioNav />

      <section
        id="inicio"
        className="relative flex min-h-[100dvh] w-full shrink-0 snap-start flex-col overflow-hidden px-5 pb-12 pt-24 sm:px-8 md:h-[100dvh] md:w-screen md:py-5 lg:px-16 lg:py-6"
      >
        <div className="absolute bottom-16 left-10 h-32 w-32 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute right-8 top-32 h-28 w-28 rounded-full bg-rose-400/10 blur-3xl" />

        <div className="relative z-10 grid min-h-0 flex-1 items-center gap-8 md:pb-16 md:pt-6 lg:grid-cols-[0.95fr_1.05fr] lg:gap-12 lg:pb-14 lg:pt-4">
          <div className="max-w-2xl self-center md:translate-x-16 lg:translate-x-28">
            <div>
              <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.06] px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-white/70">
                <Sparkles className="h-4 w-4 text-[#ffcf7a]" />
                Analista de Dados e BI
              </p>
              <h1 className="text-[2rem] font-black leading-[1.05] tracking-normal sm:text-[2.4rem] md:whitespace-nowrap md:text-[1.6rem] lg:text-[2.1rem]">
                Eduardo Ladeira Guimarães
              </h1>
              <p className="mt-5 max-w-lg text-justify text-base leading-7 text-white/72 sm:text-lg sm:leading-8">
                Atuo com Business Intelligence e análise de dados, criando dashboards completos em Power BI com SQL, DAX, Power Query e modelagem de dados. Meu trabalho conecta operações, finanças, logística e TI em indicadores que ajudam equipes a acompanhar desempenho, encontrar desvios e tomar decisões com mais segurança.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-2.5">
                <a
                  href="#blog"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3.5 py-3 text-sm font-black text-[#0a0a2d] transition hover:bg-[#ffe2dd]"
                >
                  Ver projetos
                  <ArrowUpRight className="h-4 w-4" />
                </a>
                <CopyEmailButton />
                <CvPreviewButton />
              </div>
            </div>
          </div>

          <div className="relative mx-auto flex aspect-square w-[min(78vw,360px)] translate-y-0 items-end justify-center self-center sm:w-[min(58vw,430px)] md:w-[min(78vw,68vh,610px)] md:translate-y-3 lg:w-[min(50vw,78vh,740px)] lg:translate-y-5">
            <div className="absolute bottom-8 h-[82%] w-[82%] rounded-full bg-[linear-gradient(138deg,#754bff_0%,#263d89_46%,#ff8a5b_100%)] shadow-2xl shadow-black/45" />
            <div className="absolute bottom-16 h-[68%] w-[86%] rounded-full border border-white/10 bg-white/[0.04] blur-[1px]" />
            <div className="pointer-events-none absolute inset-0 z-20">
              {skills.map((skill, index) => (
                <span
                  key={skill}
                  className="skill-orbit absolute rounded-full border border-white/16 bg-[radial-gradient(circle_at_35%_22%,rgba(255,255,255,0.24),rgba(108,246,255,0.12)_42%,rgba(117,75,255,0.08)_100%)] px-3 py-1.5 text-[0.62rem] font-black text-white/64 shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_0_18px_rgba(108,246,255,0.14)] backdrop-blur-md"
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
      <section id="blog" className="relative z-10 flex min-h-[100dvh] w-full shrink-0 snap-start items-stretch px-5 pb-14 pt-28 text-white sm:px-8 md:h-[100dvh] md:w-screen md:py-12 lg:px-16">
        <div className="mx-auto flex min-h-0 w-full max-w-7xl flex-col justify-start md:justify-center">
          <div className="mb-4 flex shrink-0 flex-col justify-between gap-3 md:flex-row md:items-end lg:mb-5">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.24em] text-[#6cf6ff]">Trabalhos Selecionados</p>
              <h2 className="mt-2 text-4xl font-black tracking-normal md:text-5xl">Dashboards & Dados</h2>
            </div>
            <p className="max-w-lg text-base leading-7 text-white/72">
              Projetos que conectam dashboards e consultas em cada análise.
            </p>
          </div>
          <DashboardGallery />
        </div>
      </section>
    </main>
  )
}
