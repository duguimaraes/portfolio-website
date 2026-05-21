"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { Download, X } from "lucide-react"

export function CvPreviewButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-lg border border-white/16 px-3.5 py-3 text-sm font-bold text-white/78 transition hover:border-white/34 hover:text-white"
      >
        <Download className="h-4 w-4" />
        Abrir curriculo
      </button>

      <CvPreviewModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}

export function CvPreviewModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", handleKeyDown)

    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen, onClose])

  return (
    <>
      {mounted &&
        isOpen &&
        createPortal(
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/78 p-4 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-label="Visualizacao do curriculo"
          onClick={onClose}
        >
          <div
            className="relative h-[min(92vh,900px)] w-[min(94vw,980px)] overflow-hidden rounded-lg border border-[#6cf6ff]/36 bg-[#050617] shadow-[0_0_0_1px_rgba(108,246,255,0.14),0_0_34px_rgba(108,246,255,0.22)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="absolute left-0 right-0 top-0 z-20 flex h-[66px] items-center justify-between gap-3 border-b border-white/10 bg-black/82 px-4 py-3 backdrop-blur">
              <div>
                <p className="font-mono text-[0.62rem] font-bold uppercase tracking-[0.2em] text-[#6cf6ff]">Curriculo</p>
                <h2 className="text-sm font-black text-white/88">Eduardo Ladeira Guimaraes</h2>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href="/curriculoelg.pdf"
                  download
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-white/16 bg-white/[0.05] px-3.5 py-2.5 text-sm font-bold text-white/78 transition hover:border-white/34 hover:bg-white/10 hover:text-white"
                >
                  <Download className="h-4 w-4" />
                  Baixar
                </a>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/14 bg-white/[0.04] text-white/72 transition hover:border-white/32 hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                  aria-label="Fechar curriculo"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <iframe
              src="/curriculoelg.pdf#toolbar=0&navpanes=0"
              title="Curriculo de Eduardo Ladeira Guimaraes"
              className="absolute bottom-0 left-0 right-0 top-[66px] z-0 h-[calc(100%-66px)] w-full border-0 bg-white"
            />
          </div>
        </div>,
        document.body,
      )}
    </>
  )
}
