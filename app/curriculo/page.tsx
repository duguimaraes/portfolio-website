import { ResumeDownloadButton } from "@/components/resume-download-button"

export default function CurriculoPage() {
  return (
    <main className="min-h-screen bg-[#050617] text-white">
      <div className="fixed left-0 right-0 top-0 z-10 border-b border-[#6cf6ff]/18 bg-[#050617]/90 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          <div>
            <p className="font-mono text-[0.62rem] font-bold uppercase tracking-[0.2em] text-[#6cf6ff]">Curriculo</p>
            <h1 className="text-sm font-black text-white/88">Eduardo Ladeira Guimaraes</h1>
          </div>
          <ResumeDownloadButton />
        </div>
      </div>

      <div className="mx-auto flex max-w-[850px] flex-col gap-6 px-3 pb-8 pt-[85px] sm:px-6">
        {["/curriculo-preview-1.png", "/curriculo-preview-2.png"].map((src, index) => (
          <img
            key={src}
            src={src}
            alt={`Pagina ${index + 1} do curriculo de Eduardo Ladeira Guimaraes`}
            className="block h-auto w-full bg-white shadow-2xl shadow-black/40"
          />
        ))}
      </div>
    </main>
  )
}
