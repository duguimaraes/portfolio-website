"use client"

import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { Download, Eye, Maximize2, X, ZoomIn, ZoomOut } from "lucide-react"
import { useLanguage } from "@/components/language-provider"

const cvPreviewRatio = 1840 / 2580

export function CvPreviewButton() {
  const [isOpen, setIsOpen] = useState(false)
  const { t } = useLanguage()

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex min-w-0 items-center justify-center gap-1 whitespace-nowrap rounded-lg border border-white/16 px-2.5 py-2.5 text-[0.62rem] font-bold text-white/78 transition hover:border-white/34 hover:text-white sm:gap-1.5 sm:px-3.5 sm:py-3 sm:text-sm"
        aria-label={t.openResume}
      >
        <Eye className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
        {t.openResume}
      </button>

      <CvPreviewModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}

export function CvPreviewModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [mounted, setMounted] = useState(false)
  const [zoom, setZoom] = useState(70)
  const previewAreaRef = useRef<HTMLDivElement>(null)
  const [fitSize, setFitSize] = useState({ width: 0, height: 0 })
  const appliedZoom = zoom + 22

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    setZoom(70)

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

  useEffect(() => {
    if (!isOpen || !previewAreaRef.current) {
      return
    }

    const updateFitSize = () => {
      const area = previewAreaRef.current

      if (!area) {
        return
      }

      const rect = area.getBoundingClientRect()
      const widthFromHeight = rect.height * cvPreviewRatio
      const width = Math.min(rect.width, widthFromHeight)

      setFitSize({
        width,
        height: width / cvPreviewRatio,
      })
    }

    updateFitSize()

    const observer = new ResizeObserver(updateFitSize)
    observer.observe(previewAreaRef.current)
    window.addEventListener("resize", updateFitSize)

    return () => {
      observer.disconnect()
      window.removeEventListener("resize", updateFitSize)
    }
  }, [isOpen])

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
            className="relative flex h-[min(92vh,900px)] w-[min(94vw,980px)] flex-col overflow-hidden rounded-lg border border-[#6cf6ff]/36 bg-[#050617] shadow-[0_0_0_1px_rgba(108,246,255,0.14),0_0_34px_rgba(108,246,255,0.22)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="z-20 flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-white/10 bg-black/82 px-3 py-2.5 backdrop-blur sm:gap-3 sm:px-4 sm:py-3">
              <div className="order-2 min-w-0 flex-1 sm:order-none">
                <p className="font-mono text-[0.62rem] font-bold uppercase tracking-[0.2em] text-[#6cf6ff]">Currículo</p>
                <h1 className="whitespace-nowrap text-[0.78rem] font-black text-white/88 sm:text-sm">Eduardo Ladeira Guimarães</h1>
              </div>
              <div className="order-1 flex w-full items-center gap-2 sm:order-none sm:w-auto sm:min-w-[340px] sm:flex-1 sm:justify-end">
                  <button
                    type="button"
                    onClick={() => setZoom(70)}
                    className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg border border-[#6cf6ff]/50 bg-[#6cf6ff]/12 px-2.5 text-[0.72rem] font-bold text-white transition hover:border-[#6cf6ff]/70 hover:bg-[#6cf6ff]/18 sm:text-sm"
                    title="Exibir a pagina inteira"
                  >
                    <Maximize2 className="h-3.5 w-3.5" />
                    Ajustar
                  </button>
                  <div className="flex min-w-0 flex-1 items-center gap-1.5 rounded-lg border border-white/12 bg-white/[0.04] px-2 py-1.5 sm:max-w-[260px]">
                    <ZoomOut className="h-3.5 w-3.5 shrink-0 text-white/52" />
                    <input
                      type="range"
                      min="70"
                      max="170"
                      step="5"
                      value={zoom}
                      onChange={(event) => setZoom(Number(event.target.value))}
                      aria-label="Zoom do curriculo"
                      className="h-1.5 min-w-0 flex-1 accent-[#6cf6ff]"
                    />
                    <ZoomIn className="h-3.5 w-3.5 shrink-0 text-white/52" />
                    <span className="w-8 shrink-0 text-right font-mono text-[0.62rem] font-bold text-white/58">{zoom}%</span>
                  </div>
              </div>
              <div className="order-3 ml-auto flex items-center gap-2 sm:order-none sm:ml-0">
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
            <div ref={previewAreaRef} className="min-h-0 flex-1 overflow-auto bg-[#303030] p-4">
              <div
                className="relative mx-auto transition-[width,height] duration-150"
                style={{
                  width: fitSize.width ? `${(fitSize.width * appliedZoom) / 100}px` : undefined,
                  height: fitSize.height ? `${(fitSize.height * appliedZoom) / 100}px` : undefined,
                }}
              >
                <img
                  src="/curriculo-preview.png"
                  alt="Previa do curriculo de Eduardo Ladeira Guimaraes"
                  className="block h-full w-full bg-white object-contain shadow-2xl shadow-black/40"
                />
              </div>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </>
  )
}
