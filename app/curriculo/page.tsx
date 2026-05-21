import { Download } from "lucide-react"

export default function CurriculoPage() {
  return (
    <main className="min-h-screen bg-[#050617] text-white">
      <div className="fixed left-0 right-0 top-0 z-10 border-b border-[#6cf6ff]/18 bg-[#050617]/90 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          <div>
            <p className="font-mono text-[0.62rem] font-bold uppercase tracking-[0.2em] text-[#6cf6ff]">Curriculo</p>
            <h1 className="text-sm font-black text-white/88">Eduardo Ladeira Guimaraes</h1>
          </div>
          <a
            href="/curriculoelg.pdf"
            download
            className="inline-flex items-center gap-2 rounded-lg border border-white/16 bg-white/[0.05] px-4 py-2.5 text-sm font-bold text-white/78 transition hover:border-white/34 hover:bg-white/10 hover:text-white"
          >
            <Download className="h-4 w-4" />
            Baixar PDF
          </a>
        </div>
      </div>

      <div className="h-screen pt-[73px]">
        <iframe src="/curriculoelg.pdf" title="Curriculo de Eduardo Ladeira Guimaraes" className="h-full w-full border-0" />
      </div>
    </main>
  )
}
