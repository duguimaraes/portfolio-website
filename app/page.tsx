import Image from "next/image"
import {
  ArrowUpRight,
  Database,
  FileText,
  Github,
  HomeIcon,
  Linkedin,
  Mail,
  RotateCcw,
  Sparkles,
  Terminal,
} from "lucide-react"
import { HorizontalScrollControls } from "@/components/horizontal-scroll-controls"

const navItems = [
  { label: "Início", href: "#inicio", icon: HomeIcon },
  { label: "Terminal", href: "#sobre", icon: Terminal },
  { label: "Dados", href: "#projetos", icon: Database },
  { label: "Avatar", href: "#inicio", avatar: true },
  { label: "Blog", href: "#blog", icon: FileText },
  { label: "GitHub", href: "https://github.com/", icon: Github },
  { label: "Contato", href: "#contato", icon: RotateCcw },
]

const projects = [
  {
    title: "Análise de Receita",
    type: "SQL / BI",
    code: `WITH receita_mensal AS (
  SELECT
    DATE_TRUNC('month', data_venda) AS mes,
    canal,
    SUM(valor_total) AS receita,
    COUNT(DISTINCT pedido_id) AS pedidos,
    COUNT(DISTINCT cliente_id) AS clientes
  FROM fato_vendas
  WHERE status = 'concluido'
  GROUP BY 1, 2
),
comparativo AS (
  SELECT
    mes,
    canal,
    receita,
    pedidos,
    clientes,
    LAG(receita) OVER (
      PARTITION BY canal
      ORDER BY mes
    ) AS receita_mes_anterior
  FROM receita_mensal
)
SELECT
  mes,
  canal,
  receita,
  pedidos,
  clientes,
  ROUND(
    100.0 * (receita - receita_mes_anterior)
    / NULLIF(receita_mes_anterior, 0),
    2
  ) AS crescimento_pct
FROM comparativo
ORDER BY mes DESC, receita DESC;`,
  },
  {
    title: "Qualidade de Dados",
    type: "SQL / Data Quality",
    code: `WITH base_clientes AS (
  SELECT
    cliente_id,
    email,
    cpf,
    data_cadastro,
    ultima_compra
  FROM dim_clientes
),
validacao AS (
  SELECT
    cliente_id,
    CASE WHEN email IS NULL THEN 1 ELSE 0 END AS email_vazio,
    CASE WHEN cpf IS NULL THEN 1 ELSE 0 END AS cpf_vazio,
    CASE
      WHEN ultima_compra < data_cadastro THEN 1
      ELSE 0
    END AS data_inconsistente
  FROM base_clientes
)
SELECT
  COUNT(*) AS total_clientes,
  SUM(email_vazio) AS emails_vazios,
  SUM(cpf_vazio) AS cpfs_vazios,
  SUM(data_inconsistente) AS datas_inconsistentes,
  ROUND(
    100.0 * SUM(
      email_vazio + cpf_vazio + data_inconsistente
    ) / NULLIF(COUNT(*), 0),
    2
  ) AS taxa_inconsistencia
FROM validacao;`,
  },
  {
    title: "Pipeline Comercial",
    type: "SQL / Analytics",
    code: `WITH oportunidades AS (
  SELECT
    vendedor_id,
    etapa_funil,
    valor_estimado,
    data_abertura,
    data_fechamento
  FROM crm_oportunidades
  WHERE data_abertura >= CURRENT_DATE - INTERVAL '180 days'
),
funil AS (
  SELECT
    vendedor_id,
    etapa_funil,
    COUNT(*) AS qtd_oportunidades,
    SUM(valor_estimado) AS valor_pipeline,
    AVG(
      DATE_PART('day', COALESCE(data_fechamento, CURRENT_DATE) - data_abertura)
    ) AS ciclo_medio_dias
  FROM oportunidades
  GROUP BY 1, 2
)
SELECT
  vendedor_id,
  etapa_funil,
  qtd_oportunidades,
  valor_pipeline,
  ROUND(ciclo_medio_dias, 1) AS ciclo_medio_dias,
  RANK() OVER (
    PARTITION BY etapa_funil
    ORDER BY valor_pipeline DESC
  ) AS ranking_etapa
FROM funil
ORDER BY etapa_funil, ranking_etapa;`,
  },
]

const skills = ["Next.js", "React", "TypeScript", "Tailwind", "SQL", "Power BI", "Automação", "APIs"]

export default function Home() {
  return (
    <main
      id="portfolio-scroll-root"
      className="no-scrollbar relative flex h-[100dvh] snap-x snap-mandatory overflow-x-auto overflow-y-hidden overscroll-contain scroll-smooth bg-[#07072a] text-white"
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

      <header className="fixed inset-x-0 top-4 z-50 flex justify-center sm:top-5 lg:top-6">
          <nav className="flex items-center gap-2 rounded-[14px] border border-white/10 bg-black/78 p-2 shadow-2xl shadow-black/45 backdrop-blur-xl">
            {navItems.map((item) => {
              const Icon = item.icon

              return (
              <a
                key={item.label}
                href={item.href}
                aria-label={item.label}
                title={item.label}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.06] text-white/76 transition hover:border-white/24 hover:bg-white/[0.12] hover:text-white"
              >
                {item.avatar ? (
                  <span className="relative h-8 w-8 overflow-hidden rounded-full bg-[#6cb5ff]">
                    <Image
                      src="/hero-avatar.png"
                      alt=""
                      fill
                      sizes="32px"
                      className="object-cover object-top"
                    />
                  </span>
                ) : (
                  Icon && <Icon className="h-[18px] w-[18px]" />
                )}
              </a>
              )
            })}
          </nav>
        </header>

      <section
        id="inicio"
        className="relative flex h-[100dvh] w-screen shrink-0 snap-start flex-col overflow-hidden px-5 py-4 sm:px-8 sm:py-5 lg:px-16 lg:py-6"
      >
        <div className="absolute bottom-16 left-10 h-32 w-32 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute right-8 top-32 h-28 w-28 rounded-full bg-rose-400/10 blur-3xl" />

        <div className="relative z-10 grid min-h-0 flex-1 items-center gap-8 pb-16 pt-6 lg:grid-cols-[0.95fr_1.05fr] lg:gap-12 lg:pb-14 lg:pt-4">
          <div className="max-w-2xl translate-x-8 self-center sm:translate-x-16 lg:translate-x-28">
            <div>
              <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.06] px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-white/70">
                <Sparkles className="h-4 w-4 text-[#ffcf7a]" />
                Analista de Dados e BI
              </p>
              <h1 className="whitespace-nowrap text-[1.35rem] font-black leading-[1.12] tracking-normal sm:text-[1.6rem] lg:text-[2.1rem]">
                Eduardo Ladeira Guimarães
              </h1>
              <p className="mt-5 max-w-lg text-lg leading-8 text-white/72">
                Transformo processos, dados e ideias em experiências digitais claras. Meu foco é criar
                soluções úteis, bonitas e fáceis de evoluir.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href="#projetos"
                  className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-black text-[#0a0a2d] transition hover:bg-[#ffe2dd]"
                >
                  Ver projetos
                  <ArrowUpRight className="h-4 w-4" />
                </a>
                <a
                  href="mailto:eduardo.guimaraes@example.com"
                  className="inline-flex items-center gap-2 rounded-lg border border-white/16 px-5 py-3 text-sm font-bold text-white/78 transition hover:border-white/34 hover:text-white"
                >
                  <Mail className="h-4 w-4" />
                  Contato
                </a>
                <a
                  href="https://github.com/"
                  aria-label="GitHub"
                  className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/12 bg-white/[0.05] transition hover:border-white/30 hover:bg-white/10"
                >
                  <Github className="h-5 w-5" />
                </a>
                <a
                  href="https://www.linkedin.com/"
                  aria-label="LinkedIn"
                  className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/12 bg-white/[0.05] transition hover:border-white/30 hover:bg-white/10"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>

          <div className="relative mx-auto flex aspect-square w-[min(90vw,64vh,490px)] translate-y-3 items-end justify-center self-center sm:w-[min(78vw,68vh,610px)] lg:w-[min(50vw,78vh,740px)] lg:translate-y-5">
            <div className="absolute bottom-8 h-[82%] w-[82%] rounded-full bg-[linear-gradient(138deg,#754bff_0%,#263d89_46%,#ff8a5b_100%)] shadow-2xl shadow-black/45" />
            <div className="absolute bottom-16 h-[68%] w-[86%] rounded-full border border-white/10 bg-white/[0.04] blur-[1px]" />
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

      <section id="projetos" className="relative z-10 flex h-[100dvh] w-screen shrink-0 snap-start items-center px-5 py-16 text-white sm:px-8 lg:px-16">
        <div className="mx-auto w-full max-w-7xl">
          <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.24em] text-[#ff624f]">Projetos</p>
              <h2 className="mt-3 text-4xl font-black tracking-normal md:text-5xl">Trabalhos em destaque</h2>
            </div>
            <p className="max-w-lg text-base leading-7 text-white/72">
              Uma seleção inicial para organizar o portfolio. Depois trocamos estes exemplos pelos seus
              cases reais, métricas e links.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {projects.map((project) => (
              <article
                key={project.title}
                className="overflow-hidden rounded-lg border border-white/12 bg-[#050617]/88 text-white shadow-2xl shadow-black/30 backdrop-blur"
              >
                <div className="flex items-center justify-between border-b border-white/10 bg-black/45 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-[#ff6b5d]" />
                    <span className="h-3 w-3 rounded-full bg-[#ffcf7a]" />
                    <span className="h-3 w-3 rounded-full bg-[#6cb5ff]" />
                  </div>
                  <span className="font-mono text-xs text-white/45">query.sql</span>
                </div>
                <div className="px-5 pb-5 pt-4">
                  <div className="mb-4 flex items-start justify-between gap-4">
                    <div>
                      <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-[#6cb5ff]">
                        {project.type}
                      </p>
                      <h3 className="mt-2 text-xl font-black tracking-normal text-white">{project.title}</h3>
                    </div>
                    <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-[#ff6b5d]" />
                  </div>
                  <pre
                    data-code-scroll
                    className="code-scrollbar h-[330px] overflow-auto whitespace-pre-wrap break-words rounded-md border border-white/10 bg-black/55 p-4 font-mono text-[0.54rem] leading-3 text-[#d7e7ff] shadow-inner shadow-black/30"
                  >
                    <code>{project.code}</code>
                  </pre>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="blog" className="relative z-10 flex h-[100dvh] w-screen shrink-0 snap-start items-center px-5 py-16 text-white sm:px-8 lg:px-16">
        <div className="mx-auto grid w-full max-w-7xl gap-5 md:grid-cols-[0.7fr_1.3fr] md:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.24em] text-[#6b63d9]">Blog</p>
            <h2 className="mt-3 text-4xl font-black tracking-normal">Ideias em construção</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <article className="rounded-lg border border-white/12 bg-[#11112a]/86 p-6 text-white shadow-2xl shadow-black/20">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#ffcf7a]">Processos</p>
              <h3 className="mt-5 text-2xl font-black tracking-normal">Como transformar rotina em sistema</h3>
            </article>
            <article className="rounded-lg border border-white/12 bg-white p-6 text-[#11112a] shadow-2xl shadow-black/20">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#ff624f]">Dados</p>
              <h3 className="mt-5 text-2xl font-black tracking-normal">Indicadores que ajudam a decidir</h3>
            </article>
          </div>
        </div>
      </section>

      <section id="sobre" className="relative z-10 flex h-[100dvh] w-screen shrink-0 snap-start items-center px-5 py-16 text-white sm:px-8 lg:px-16">
        <div className="mx-auto grid w-full max-w-7xl gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-start">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.24em] text-[#ffcf7a]">Sobre</p>
            <h2 className="mt-3 text-4xl font-black tracking-normal md:text-5xl">
              Construo soluções onde operação encontra produto.
            </h2>
          </div>
          <div>
            <p className="text-lg leading-8 text-white/72">
              Gosto de criar sistemas e automações que deixam o trabalho mais simples, mensurável e
              bonito de usar. Meu repertório mistura análise de dados, desenvolvimento web e visão de
              processo.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-lg border border-white/12 bg-white/[0.06] px-4 py-2 text-sm font-bold text-white/78"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="contato" className="relative z-10 flex h-[100dvh] w-screen shrink-0 snap-start items-center px-5 py-16 text-white sm:px-8 lg:px-16">
        <div className="mx-auto flex w-full max-w-7xl flex-col justify-between gap-8 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.24em] text-[#ff624f]">Contato</p>
            <h2 className="mt-3 text-3xl font-black tracking-normal md:text-5xl">
              Vamos construir algo útil?
            </h2>
          </div>
          <a
            href="mailto:eduardo.guimaraes@example.com"
            className="inline-flex w-fit items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-black text-[#0a0a2d] transition hover:bg-[#ffe2dd]"
          >
            Enviar mensagem
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </section>
    </main>
  )
}
