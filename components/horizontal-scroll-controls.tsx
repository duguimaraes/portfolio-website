"use client"

import { useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

const SCROLL_THRESHOLD = 820
const CIRCLE_LENGTH = 113
const SECTION_IDS = ["inicio", "blog", "clima"]

function getCurrentIndex(root: HTMLElement) {
  return SECTION_IDS.map((id, index) => ({
    index,
    offset: document.getElementById(id)?.offsetLeft ?? root.clientWidth * index,
  })).sort((a, b) => Math.abs(a.offset - root.scrollLeft) - Math.abs(b.offset - root.scrollLeft))[0]?.index ?? 0
}

function moveToNeighbor(root: HTMLElement, direction: "previous" | "next") {
  const nextIndex = (getCurrentIndex(root) + (direction === "next" ? 1 : -1) + SECTION_IDS.length) % SECTION_IDS.length
  const section = document.getElementById(SECTION_IDS[nextIndex])
  root.scrollTo({ left: section?.offsetLeft ?? root.clientWidth * nextIndex, top: 0, behavior: "smooth" })
}

export function HorizontalScrollControls() {
  const [direction, setDirection] = useState<"previous" | "next" | null>(null)
  const [progress, setProgress] = useState(0)
  const directionRef = useRef<"previous" | "next" | null>(null)
  const accumulatedRef = useRef(0)
  const decayFrameRef = useRef<number | null>(null)
  const decayTimeoutRef = useRef<number | null>(null)
  const moveTimeoutRef = useRef<number | null>(null)
  const movingRef = useRef(false)

  useEffect(() => {
    const root = document.getElementById("portfolio-scroll-root")

    if (!root) {
      return
    }

    const stopDecay = () => {
      if (decayFrameRef.current) {
        window.cancelAnimationFrame(decayFrameRef.current)
        decayFrameRef.current = null
      }

      if (decayTimeoutRef.current) {
        window.clearTimeout(decayTimeoutRef.current)
        decayTimeoutRef.current = null
      }
    }

    const resetProgress = () => {
      accumulatedRef.current = 0
      setProgress(0)
      directionRef.current = null
      setDirection(null)
    }

    const startDecay = () => {
      stopDecay()

      decayTimeoutRef.current = window.setTimeout(() => {
        const decay = () => {
          accumulatedRef.current = Math.max(0, accumulatedRef.current - SCROLL_THRESHOLD * 0.035)
          setProgress(accumulatedRef.current / SCROLL_THRESHOLD)

          if (accumulatedRef.current > 0) {
            decayFrameRef.current = window.requestAnimationFrame(decay)
          } else {
            directionRef.current = null
            setDirection(null)
          }
        }

        decayFrameRef.current = window.requestAnimationFrame(decay)
      }, 520)
    }

    const move = (nextDirection: "previous" | "next") => {
      if (movingRef.current) return
      movingRef.current = true
      moveToNeighbor(root, nextDirection)
      moveTimeoutRef.current = window.setTimeout(() => {
        movingRef.current = false
        resetProgress()
      }, 850)
    }

    const advance = (amount: number, nextDirection: "previous" | "next") => {
      if (movingRef.current) return

      stopDecay()

      if (directionRef.current && directionRef.current !== nextDirection) {
        accumulatedRef.current = 0
      }

      directionRef.current = nextDirection
      setDirection(nextDirection)
      accumulatedRef.current = Math.min(SCROLL_THRESHOLD, accumulatedRef.current + Math.abs(amount))
      const nextProgress = accumulatedRef.current / SCROLL_THRESHOLD
      setProgress(nextProgress)

      if (nextProgress >= 1) {
        move(nextDirection)
      } else {
        startDecay()
      }
    }

    const onWheel = (event: WheelEvent) => {
      if (event.target instanceof Element && event.target.closest("[data-code-scroll]")) {
        return
      }

      const mainDelta = Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX

      if (Math.abs(mainDelta) < 1) {
        return
      }

      event.preventDefault()
      advance(mainDelta, mainDelta > 0 ? "next" : "previous")
    }

    let touchStart: { x: number; y: number; index: number } | null = null
    const onTouchStart = (event: TouchEvent) => {
      if (event.target instanceof Element && event.target.closest("[data-code-scroll]")) return
      const touch = event.touches[0]
      touchStart = { x: touch.clientX, y: touch.clientY, index: getCurrentIndex(root) }
    }
    const onTouchEnd = (event: TouchEvent) => {
      if (!touchStart || movingRef.current) return
      const touch = event.changedTouches[0]
      const deltaX = touchStart.x - touch.clientX
      const deltaY = touchStart.y - touch.clientY
      const startIndex = touchStart.index
      touchStart = null
      if (Math.abs(deltaX) < 50 || Math.abs(deltaX) < Math.abs(deltaY) * 1.2) return
      const nextDirection = deltaX > 0 ? "next" : "previous"
      const targetIndex = (startIndex + (nextDirection === "next" ? 1 : -1) + SECTION_IDS.length) % SECTION_IDS.length
      const target = document.getElementById(SECTION_IDS[targetIndex])
      root.scrollTo({ left: target?.offsetLeft ?? root.clientWidth * targetIndex, behavior: "smooth" })
    }

    root.addEventListener("wheel", onWheel, { passive: false })
    root.addEventListener("touchstart", onTouchStart, { passive: true })
    root.addEventListener("touchend", onTouchEnd, { passive: true })

    return () => {
      stopDecay()
      if (moveTimeoutRef.current) window.clearTimeout(moveTimeoutRef.current)
      root.removeEventListener("wheel", onWheel)
      root.removeEventListener("touchstart", onTouchStart)
      root.removeEventListener("touchend", onTouchEnd)
    }
  }, [])

  const moveWithButton = (nextDirection: "previous" | "next") => {
    const root = document.getElementById("portfolio-scroll-root")

    if (!root) {
      return
    }

    moveToNeighbor(root, nextDirection)
  }

  const progressFor = (side: "previous" | "next") => (direction === side ? progress : 0)

  return (
    <>
      <ProgressButton
        side="left"
        label="Voltar seção"
        progress={progressFor("previous")}
        onClick={() => moveWithButton("previous")}
      />
      <ProgressButton
        side="right"
        label="Avançar seção"
        progress={progressFor("next")}
        onClick={() => moveWithButton("next")}
      />
    </>
  )
}

function ProgressButton({
  side,
  label,
  progress,
  onClick,
}: {
  side: "left" | "right"
  label: string
  progress: number
  onClick: () => void
}) {
  const dashOffset = CIRCLE_LENGTH - CIRCLE_LENGTH * progress
  const Icon = side === "left" ? ChevronLeft : ChevronRight

  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`fixed top-[26px] z-[60] hidden h-9 w-9 items-center justify-center rounded-full border border-white/12 bg-black/44 text-white/70 shadow-2xl shadow-black/40 backdrop-blur transition hover:border-white/28 hover:bg-black/55 hover:text-white md:top-1/2 md:flex md:h-12 md:w-12 md:-translate-y-1/2 ${
        side === "left" ? "left-[calc(50%-178px)] md:left-5" : "right-[calc(50%-178px)] md:right-5"
      }`}
    >
      <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 44 44" aria-hidden="true">
        <circle cx="22" cy="22" r="18" fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="2" />
        <circle
          cx="22"
          cy="22"
          r="18"
          fill="none"
          stroke="rgba(255,255,255,0.72)"
          strokeDasharray={CIRCLE_LENGTH}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          strokeWidth="2"
        />
      </svg>
      <Icon className="h-5 w-5 md:h-6 md:w-6" />
    </button>
  )
}
