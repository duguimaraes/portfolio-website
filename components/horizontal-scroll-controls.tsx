"use client"

import { useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

const SCROLL_THRESHOLD = 820
const CIRCLE_LENGTH = 113
const SECTION_IDS = ["inicio", "blog", "clima"]

export function HorizontalScrollControls() {
  const [canGoBack, setCanGoBack] = useState(false)
  const [canGoForward, setCanGoForward] = useState(true)
  const [direction, setDirection] = useState<"previous" | "next" | null>(null)
  const [progress, setProgress] = useState(0)
  const accumulatedRef = useRef(0)
  const decayFrameRef = useRef<number | null>(null)
  const decayTimeoutRef = useRef<number | null>(null)

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
      setDirection(null)
    }

    const updateState = () => {
      const maxScroll = root.scrollWidth - root.clientWidth
      setCanGoBack(root.scrollLeft > 8)
      setCanGoForward(root.scrollLeft < maxScroll - 8)
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
            setDirection(null)
          }
        }

        decayFrameRef.current = window.requestAnimationFrame(decay)
      }, 520)
    }

    const move = (nextDirection: "previous" | "next") => {
      root.scrollBy({
        left: nextDirection === "next" ? root.clientWidth : -root.clientWidth,
        behavior: "smooth",
      })
      window.setTimeout(resetProgress, 850)
    }

    const advance = (amount: number, nextDirection: "previous" | "next") => {
      if ((nextDirection === "previous" && !canGoBack) || (nextDirection === "next" && !canGoForward)) {
        resetProgress()
        return
      }

      stopDecay()

      if (direction && direction !== nextDirection) {
        accumulatedRef.current = 0
      }

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

    updateState()
    root.addEventListener("scroll", updateState, { passive: true })
    root.addEventListener("wheel", onWheel, { passive: false })
    window.addEventListener("resize", updateState)

    return () => {
      stopDecay()
      root.removeEventListener("scroll", updateState)
      root.removeEventListener("wheel", onWheel)
      window.removeEventListener("resize", updateState)
    }
  }, [canGoBack, canGoForward, direction])

  const moveWithButton = (nextDirection: "previous" | "next") => {
    const root = document.getElementById("portfolio-scroll-root")

    if (!root) {
      return
    }

    const currentIndex = SECTION_IDS.map((id) => document.getElementById(id))
      .map((section, index) => ({
        index,
        offset: section?.offsetLeft ?? 0,
      }))
      .sort((a, b) => Math.abs(a.offset - root.scrollLeft) - Math.abs(b.offset - root.scrollLeft))[0]?.index ?? 0

    const nextIndex = Math.max(0, Math.min(SECTION_IDS.length - 1, currentIndex + (nextDirection === "next" ? 1 : -1)))
    const nextSection = document.getElementById(SECTION_IDS[nextIndex])

    root.scrollTo({
      left: nextSection?.offsetLeft ?? root.clientWidth * nextIndex,
      top: 0,
      behavior: "smooth",
    })
  }

  const progressFor = (side: "previous" | "next") => (direction === side ? progress : 0)

  return (
    <>
      <ProgressButton
        side="left"
        label="Voltar seção"
        disabled={!canGoBack}
        progress={progressFor("previous")}
        onClick={() => moveWithButton("previous")}
      />
      <ProgressButton
        side="right"
        label="Avançar seção"
        disabled={!canGoForward}
        progress={progressFor("next")}
        onClick={() => moveWithButton("next")}
      />
    </>
  )
}

function ProgressButton({
  side,
  label,
  disabled,
  progress,
  onClick,
}: {
  side: "left" | "right"
  label: string
  disabled: boolean
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
      disabled={disabled}
      className={`fixed top-[26px] z-[60] hidden h-9 w-9 items-center justify-center rounded-full border border-white/12 bg-black/44 text-white/70 shadow-2xl shadow-black/40 backdrop-blur transition hover:border-white/28 hover:bg-black/55 hover:text-white disabled:pointer-events-none disabled:opacity-0 md:top-1/2 md:flex md:h-12 md:w-12 md:-translate-y-1/2 ${
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
