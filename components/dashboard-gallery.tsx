"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"

const galleryImages = Array.from({ length: 12 }, (_, index) => ({
  src: `/dashboards/gallery/img${index + 1}.png`,
  alt: `Dashboard ${index + 1}`,
}))

export function DashboardGallery() {
  const [activeImage, setActiveImage] = useState<(typeof galleryImages)[number] | null>(null)

  useEffect(() => {
    if (!activeImage) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveImage(null)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [activeImage])

  return (
    <>
      <div className="grid max-h-[62vh] grid-cols-2 gap-3 overflow-hidden sm:grid-cols-3 lg:grid-cols-4">
        {galleryImages.map((image) => (
          <button
            key={image.src}
            type="button"
            onClick={() => setActiveImage(image)}
            className="group relative aspect-video overflow-hidden rounded-lg border border-[#6cf6ff]/45 bg-[#050617]/86 shadow-[0_0_0_1px_rgba(108,246,255,0.16),0_0_18px_rgba(108,246,255,0.18)] transition duration-300 hover:border-[#6cf6ff]/80 hover:shadow-[0_0_0_1px_rgba(108,246,255,0.34),0_0_24px_rgba(108,246,255,0.32)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6cf6ff]"
            aria-label={`Expandir ${image.alt}`}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="h-full w-full object-cover transition duration-300 ease-out group-hover:scale-[1.04]"
            />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),transparent_28%,rgba(0,0,0,0.18))]" />
          </button>
        ))}
      </div>

      {activeImage && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/78 p-5 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-label={activeImage.alt}
          onClick={() => setActiveImage(null)}
        >
          <div
            className="relative w-[min(94vw,1180px)] overflow-hidden rounded-lg border border-[#6cf6ff]/70 bg-[#050617] shadow-[0_0_0_1px_rgba(108,246,255,0.28),0_0_36px_rgba(108,246,255,0.34)]"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActiveImage(null)}
              className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-lg border border-white/14 bg-black/72 text-white/78 backdrop-blur transition hover:border-white/32 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
              aria-label="Fechar imagem expandida"
            >
              <X className="h-5 w-5" />
            </button>
            <img src={activeImage.src} alt={activeImage.alt} className="max-h-[84vh] w-full object-contain" />
          </div>
        </div>
      )}
    </>
  )
}
