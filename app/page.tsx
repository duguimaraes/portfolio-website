import Image from "next/image"
import { ArrowUpRight, Github, Linkedin, Mail, Sparkles } from "lucide-react"

const navItems = ["Início", "Projetos", "Blog", "Sobre"]

const projects = [
  {
    title: "Automação Operacional",
    type: "Workflow",
    description: "Rotinas para reduzir tarefas manuais, organizar dados e acelerar decisões do time.",
  },
  {
    title: "Dashboards de Indicadores",
    type: "Data",
    description: "Painéis objetivos para leitura diária de performance, desvios e oportunidades.",
  },
  {
    title: "Experiências Web",
    type: "Front-end",
    description: "Interfaces leves, responsivas e pensadas para transformar processos em produto.",
  },
]

const skills = ["Next.js", "React", "TypeScript", "Tailwind", "SQL", "Power BI", "Automação", "APIs"]

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#07072a] text-white">
      <section
        id="inicio"
        className="relative flex min-h-screen flex-col px-5 py-6 sm:px-8 lg:px-16"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_52%_42%,rgba(124,80,255,0.38),transparent_32%),radial-gradient(circle_at_82%_82%,rgba(255,109,77,0.26),transparent_26%),linear-gradient(135deg,#08082f_0%,#12124b_54%,#05051e_100%)]" />
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.18]"
          viewBox="0 0 1440 900"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <pattern id="data-grid" width="72" height="72" patternUnits="userSpaceOnUse">
              <path d="M 72 0 L 0 0 0 72" fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="1440" height="900" fill="url(#data-grid)" opacity="0.24" />

          <g fill="none" stroke="rgba(255,255,255,0.38)" strokeWidth="2">
            <rect x="82" y="144" width="198" height="118" rx="8" />
            <path d="M112 226h140M112 198h140M112 170h140" opacity="0.32" />
            <path d="M120 226v-28M148 226v-46M176 226v-34M204 226v-68M232 226v-54" stroke="#ffcf7a" />

            <rect x="1114" y="140" width="214" height="126" rx="8" />
            <path d="M1144 224c24-48 48-16 72-48s48 10 82-36" stroke="#6cb5ff" strokeWidth="3" />
            <path d="M1144 230h150M1144 166h150" opacity="0.28" />

            <rect x="70" y="610" width="250" height="130" rx="8" />
            <path d="M100 710h170M100 678h92M100 646h132" opacity="0.42" />
            <path d="M112 710l38-54 40 28 36-52 48 64" stroke="#ff6b5d" strokeWidth="3" />

            <rect x="1086" y="604" width="260" height="140" rx="8" />
            <path d="M1126 674h54m76 0h54M1180 674h76M1210 640v68" />
            <rect x="1124" y="646" width="58" height="54" rx="6" />
            <rect x="1252" y="646" width="58" height="54" rx="6" />
            <rect x="1182" y="716" width="88" height="42" rx="6" />
            <path d="M1210 700v16" />
          </g>

          <g fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.42)" strokeWidth="2">
            <rect x="424" y="118" width="90" height="34" rx="6" />
            <rect x="600" y="118" width="104" height="34" rx="6" />
            <rect x="784" y="118" width="94" height="34" rx="6" />
            <path d="M514 135h86M704 135h80" fill="none" />
            <path d="M469 152v74h184v-42h178v-32" fill="none" strokeDasharray="8 10" />
            <rect x="604" y="226" width="98" height="36" rx="6" />
            <rect x="784" y="194" width="98" height="36" rx="6" />
          </g>

          <g fill="none" stroke="rgba(108,181,255,0.46)" strokeLinecap="round" strokeWidth="2">
            <path d="M420 718c76-72 152 34 232-28s154-36 240-110" strokeDasharray="10 14" />
            <path d="M454 746h378" opacity="0.34" />
            <path d="M454 676h378" opacity="0.34" />
          </g>
        </svg>
        <div className="absolute bottom-16 left-10 h-32 w-32 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute right-8 top-32 h-28 w-28 rounded-full bg-rose-400/10 blur-3xl" />

        <header className="relative z-20 flex items-center justify-between gap-5">
          <a href="#inicio" className="flex items-center gap-3" aria-label="Ir para o início">
            <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/10 text-sm font-bold shadow-2xl shadow-violet-950/40 backdrop-blur">
              EG
            </span>
            <span className="hidden text-sm font-medium text-white/70 sm:block">Portfolio</span>
          </a>

          <nav className="hidden items-center gap-5 rounded-full border border-white/10 bg-white/[0.06] px-5 py-3 text-sm font-semibold text-white/76 backdrop-blur md:flex">
            {navItems.map((item, index) => (
              <a
                key={item}
                href={index === 0 ? "#inicio" : `#${item.toLowerCase()}`}
                className={index === 0 ? "text-[#ff6b5d]" : "transition hover:text-white"}
              >
                {item}
              </a>
            ))}
          </nav>

          <a
            href="#contato"
            className="inline-flex items-center gap-2 rounded-lg bg-[#5d55c9] px-4 py-3 text-sm font-bold shadow-xl shadow-violet-950/35 transition hover:bg-[#7168e6]"
          >
            <Mail className="h-4 w-4" />
            Falar comigo
          </a>
        </header>

        <div className="relative z-10 grid flex-1 items-center gap-10 py-10 lg:grid-cols-[0.86fr_1.05fr_0.62fr] lg:py-6">
          <div className="max-w-xl self-center">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.06] px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-white/70">
              <Sparkles className="h-4 w-4 text-[#ffcf7a]" />
              Dados, automação e web
            </p>
            <h1 className="whitespace-nowrap text-[1.35rem] font-black leading-[1.12] tracking-normal sm:text-[1.6rem] lg:text-[2.1rem]">
              Olá, sou Eduardo Guimarães
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
            </div>
          </div>

          <div className="relative mx-auto flex min-h-[420px] w-full max-w-[620px] items-end justify-center self-center lg:min-h-[620px]">
            <div className="absolute bottom-8 h-[82%] w-[82%] rounded-full bg-[linear-gradient(138deg,#754bff_0%,#263d89_46%,#ff8a5b_100%)] shadow-2xl shadow-black/45" />
            <div className="absolute bottom-16 h-[68%] w-[86%] rounded-full border border-white/10 bg-white/[0.04] blur-[1px]" />
            <Image
              src="/hero-avatar.png"
              alt="Avatar 3D de Eduardo com notebook"
              width={1024}
              height={1536}
              priority
              className="relative z-10 h-auto w-[66%] max-w-[420px] drop-shadow-[0_38px_60px_rgba(0,0,0,0.45)] sm:w-[70%] lg:w-[72%] lg:max-w-[455px]"
            />
          </div>

          <aside className="self-center text-white/72">
            <p className="mb-5 text-sm font-black text-white">Nota:</p>
            <div className="mb-6 grid grid-cols-[1fr_auto] overflow-hidden rounded-lg border border-white/10 bg-black/70 text-sm">
              <span className="bg-[#6cb5ff] px-4 py-3 font-black text-white">Disponível</span>
              <span className="flex items-center gap-2 px-4 py-3 text-white/80">
                remoto
                <ArrowUpRight className="h-4 w-4 text-[#ff6b5d]" />
              </span>
            </div>
            <p className="max-w-xs text-sm leading-7">
              Este portfolio está nascendo com uma pegada visual forte, mas pensado para ser direto:
              apresentar o que faço, como penso e onde gero resultado.
            </p>
            <div className="mt-7 flex gap-3">
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
          </aside>
        </div>
      </section>

      <section id="projetos" className="bg-[#f6f1e8] px-5 py-20 text-[#11112a] sm:px-8 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.24em] text-[#ff624f]">Projetos</p>
              <h2 className="mt-3 text-4xl font-black tracking-normal md:text-5xl">Trabalhos em destaque</h2>
            </div>
            <p className="max-w-lg text-base leading-7 text-[#4e4a5a]">
              Uma seleção inicial para organizar o portfolio. Depois trocamos estes exemplos pelos seus
              cases reais, métricas e links.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {projects.map((project) => (
              <article key={project.title} className="rounded-lg border border-[#ded4c7] bg-white p-6 shadow-sm">
                <div className="mb-10 flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-[0.18em] text-[#6b63d9]">
                    {project.type}
                  </span>
                  <ArrowUpRight className="h-5 w-5 text-[#ff624f]" />
                </div>
                <h3 className="text-2xl font-black tracking-normal">{project.title}</h3>
                <p className="mt-4 text-sm leading-7 text-[#5c5865]">{project.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="blog" className="bg-[#f6f1e8] px-5 pb-20 text-[#11112a] sm:px-8 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-[0.7fr_1.3fr] md:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.24em] text-[#6b63d9]">Blog</p>
            <h2 className="mt-3 text-4xl font-black tracking-normal">Ideias em construção</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <article className="rounded-lg border border-[#ded4c7] bg-[#11112a] p-6 text-white">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#ffcf7a]">Processos</p>
              <h3 className="mt-5 text-2xl font-black tracking-normal">Como transformar rotina em sistema</h3>
            </article>
            <article className="rounded-lg border border-[#ded4c7] bg-white p-6">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#ff624f]">Dados</p>
              <h3 className="mt-5 text-2xl font-black tracking-normal">Indicadores que ajudam a decidir</h3>
            </article>
          </div>
        </div>
      </section>

      <section id="sobre" className="bg-[#08082f] px-5 py-20 text-white sm:px-8 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-start">
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

      <section id="contato" className="bg-[#05051e] px-5 py-16 text-white sm:px-8 lg:px-16">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 md:flex-row md:items-center">
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
