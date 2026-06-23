"use client"

import { useState } from "react"
import { ArrowUpRight, BarChart3, ChevronDown, CloudSun, Database, Workflow } from "lucide-react"

const dashboardUrl =
  "https://app.powerbi.com/view?r=eyJrIjoiYmNiMGNjNzktZDk0MS00MWY2LThhODEtYzFiZWJlODc2ZDlmIiwidCI6IjMzYTVjODcwLWM5MjItNGU5MS05ZTk5LTA1MzEzNWM3YTY1NyJ9"

const flow = [
  {
    label: "Open-Meteo API",
    detail: "Previsões de 27 capitais",
    icon: CloudSun,
    summary: "A coleta consulta a previsão diária de cada capital brasileira a partir de latitude e longitude.",
    items: [
      "Temperaturas máxima e mínima",
      "Precipitação prevista",
      "Resposta original preservada em JSON",
    ],
  },
  {
    label: "Python + Airflow",
    detail: "Extração e transformação",
    icon: Workflow,
    summary: "Scripts Python tratam a resposta da API e o Apache Airflow organiza as etapas em uma DAG reproduzível.",
    items: [
      "Extração, transformação, Gold e carga",
      "Execução por tasks encadeadas",
      "Pipeline também executável localmente",
    ],
  },
  {
    label: "S3 + Athena",
    detail: "Camadas Bronze, Silver e Gold",
    icon: Database,
    summary: "O Amazon S3 funciona como data lake; o Athena disponibiliza a camada Gold para consultas SQL.",
    items: [
      "Bronze: JSON bruto da API",
      "Silver: dados tabulares tratados",
      "Gold: indicadores e previsões analíticas",
    ],
  },
  {
    label: "Power BI",
    detail: "Camada analítica interativa",
    icon: BarChart3,
    summary: "O dashboard consome a Gold consultada no Athena e permite analisar a previsão por capital e por dia.",
    items: [
      "Filtro por capital brasileira",
      "Temperaturas, chuva e amplitude térmica",
      "Relatório publicado para consulta pública",
    ],
  },
]

export function ClimateProjectPanel() {
  const [activeStage, setActiveStage] = useState(0)
  const [mobilePanel, setMobilePanel] = useState<"pipeline" | "dashboard">("pipeline")
  const stage = flow[activeStage]
  const ActiveIcon = stage.icon

  return (
    <section
      id="clima"
      className="relative z-10 flex h-[100dvh] w-screen shrink-0 snap-start overflow-hidden px-4 pb-4 pt-24 text-white sm:px-8 sm:pb-6 md:px-12 md:pb-16 md:pt-28 lg:px-16"
    >
      <div className="mx-auto flex min-h-0 w-full max-w-7xl flex-1 flex-col gap-4 2xl:max-w-[1640px]">
        <header className="flex shrink-0 items-end justify-between gap-4">
          <div className="w-full text-center sm:w-auto sm:text-left">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#6cf6ff] sm:text-sm sm:tracking-[0.24em]">
              Engenharia de dados
            </p>
            <h2 className="mt-1 text-2xl font-black tracking-normal sm:mt-2 sm:text-4xl">
              Previsões climáticas
            </h2>
          </div>
          <a
            href="https://github.com/duguimaraes/portfolio-clima-airflow"
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-1.5 text-sm font-medium text-white/70 transition hover:text-[#6cf6ff] sm:inline-flex"
          >
            Repositório
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </header>

        <div className="flex min-h-0 flex-1 flex-col gap-3 lg:grid lg:grid-cols-[minmax(260px,0.34fr)_minmax(0,0.66fr)] lg:gap-4">
          <aside
            className={`flex min-h-0 flex-col overflow-hidden rounded-lg border border-white/10 bg-[#0b0b31]/85 shadow-2xl shadow-black/20 backdrop-blur transition-[flex,height] duration-300 ${
              mobilePanel === "pipeline" ? "flex-1" : "h-12 shrink-0"
            } lg:h-full lg:flex-none`}
          >
            <button
              type="button"
              onClick={() => setMobilePanel("pipeline")}
              aria-expanded={mobilePanel === "pipeline"}
              className="flex h-12 shrink-0 items-center justify-between px-4 text-left lg:hidden"
            >
              <span className="inline-flex items-center gap-2 text-sm font-bold text-white">
                <Workflow className="h-4 w-4 text-[#6cf6ff]" aria-hidden="true" />
                Pipeline de dados
              </span>
              <ChevronDown
                className={`h-4 w-4 text-white/60 transition-transform ${mobilePanel === "pipeline" ? "rotate-180" : ""}`}
                aria-hidden="true"
              />
            </button>

            <div className={`min-h-0 flex-1 flex-col ${mobilePanel === "pipeline" ? "flex" : "hidden"} lg:flex`}>
              <div className="shrink-0 border-b border-white/10 p-4 sm:p-5">
              <p className="text-sm leading-6 text-white/72 sm:text-base sm:leading-7">
                Pipeline que transforma dados da API Open-Meteo em previsões analíticas para as capitais brasileiras.
              </p>
              <div className="mt-4 grid grid-cols-2 gap-2 lg:grid-cols-1" role="list">
                {flow.map((item, index) => {
                  const Icon = item.icon
                  const isActive = index === activeStage

                  return (
                    <button
                      type="button"
                      key={item.label}
                      onClick={() => setActiveStage(index)}
                      aria-pressed={isActive}
                      className={`flex min-w-0 items-center gap-2 rounded-md border px-2.5 py-2 text-left transition sm:px-3 ${
                        isActive
                          ? "border-[#6cf6ff]/60 bg-[#6cf6ff]/10 text-white shadow-[0_0_18px_rgba(108,246,255,0.08)]"
                          : "border-white/8 bg-white/[0.02] text-white/62 hover:border-white/20 hover:bg-white/[0.05] hover:text-white"
                      }`}
                      >
                      <Icon className={`h-3.5 w-3.5 shrink-0 ${isActive ? "text-[#6cf6ff]" : "text-white/50"}`} aria-hidden="true" />
                      <span className="min-w-0 truncate text-[0.68rem] font-bold sm:text-xs">{item.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

              <div className="flex min-h-0 flex-1 flex-col p-4 sm:p-5">
              <div className="flex items-center gap-2.5">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md border border-[#6cf6ff]/20 bg-[#6cf6ff]/10 text-[#6cf6ff]">
                  <ActiveIcon className="h-4 w-4" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-white">{stage.label}</p>
                  <p className="mt-0.5 text-xs text-white/50">{stage.detail}</p>
                </div>
              </div>

              <p className="mt-4 text-sm leading-6 text-white/72">{stage.summary}</p>

              <ul className="mt-4 space-y-2.5 text-xs leading-5 text-white/58 sm:text-sm">
                {stage.items.map((item) => (
                  <li className="flex gap-2" key={item}>
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#6cf6ff]" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              </div>
            </div>
          </aside>

          <div
            className={`flex min-h-0 flex-col overflow-hidden rounded-lg border border-white/10 bg-[#080829] shadow-2xl shadow-black/30 transition-[flex,height] duration-300 ${
              mobilePanel === "dashboard" ? "flex-1" : "h-12 shrink-0"
            } lg:h-full lg:flex-none`}
          >
            <button
              type="button"
              onClick={() => setMobilePanel("dashboard")}
              aria-expanded={mobilePanel === "dashboard"}
              className="flex h-12 shrink-0 items-center justify-between px-4 text-left lg:hidden"
            >
              <span className="inline-flex items-center gap-2 text-sm font-bold text-white">
                <BarChart3 className="h-4 w-4 text-[#6cf6ff]" aria-hidden="true" />
                Dashboard Power BI
              </span>
              <ChevronDown
                className={`h-4 w-4 text-white/60 transition-transform ${mobilePanel === "dashboard" ? "rotate-180" : ""}`}
                aria-hidden="true"
              />
            </button>

            <div className={`min-h-0 flex-1 flex-col ${mobilePanel === "dashboard" ? "flex" : "hidden"} lg:flex`}>
              <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-3 py-2 sm:px-4">
                <span className="hidden text-xs font-bold uppercase tracking-[0.13em] text-white/55 lg:inline">Dashboard Power BI</span>
                <a
                  href={dashboardUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="ml-auto inline-flex items-center gap-1 text-xs font-medium text-[#6cf6ff] transition hover:text-white"
                >
                  Abrir
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </div>
              <iframe
                title="Dashboard de previsões climáticas das capitais brasileiras"
                src={dashboardUrl}
                className="min-h-0 w-full flex-1"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
