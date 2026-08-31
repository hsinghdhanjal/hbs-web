"use client";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { HERO } from "@/data/site";

export default function Hero({ heroMedia }) {
  const mediaUrl = heroMedia?.url || HERO.image;
  const isVideo = !!heroMedia?.mimeType?.startsWith("video/");

  return (
    <section
      data-testid="hero-section"
      className="relative w-full h-[100svh] min-h-[560px] bg-[#1E1E1E] text-[#F8F7F4] overflow-hidden"
    >
      {/* Background — video plays as-is; still images get a slow Ken-Burns motion */}
      <div className="absolute inset-0 overflow-hidden">
        {isVideo ? (
          <video
            src={mediaUrl}
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
            data-testid="hero-video"
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <motion.img
            src={mediaUrl}
            alt="Premium contemporary villa architecture"
            loading="eager"
            data-testid="hero-image"
            className="absolute inset-0 w-full h-full object-cover will-change-transform"
            initial={{ scale: 1.12, x: 0, y: 0, opacity: 0 }}
            animate={{
              scale: [1.12, 1.18, 1.12],
              x: [0, -18, 0],
              y: [0, -10, 0],
              opacity: 1,
            }}
            transition={{
              opacity: { duration: 1.4, ease: [0.22, 1, 0.36, 1] },
              scale: { duration: 24, repeat: Infinity, ease: "easeInOut" },
              x: { duration: 24, repeat: Infinity, ease: "easeInOut" },
              y: { duration: 24, repeat: Infinity, ease: "easeInOut" },
            }}
          />
        )}
        {/* Cinematic gradients */}
        <div className="absolute inset-0 bg-[#1E1E1E]/55" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1E1E1E]/70 via-[#1E1E1E]/30 to-[#1E1E1E]/90" />
        <div className="absolute inset-0 grain opacity-50 pointer-events-none" />
      </div>

      {/* Centered HAB monogram */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="hab-overline text-[#C9A66B] text-[0.65rem] md:text-xs"
          data-testid="hero-overline"
        >
          <span className="inline-block w-10 h-px align-middle mr-3 bg-[#C9A66B]" />
          Est. Punjab
          <span className="inline-block w-10 h-px align-middle ml-3 bg-[#C9A66B]" />
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30, letterSpacing: "0.15em" }}
          animate={{ opacity: 1, y: 0, letterSpacing: "-0.04em" }}
          transition={{ duration: 1.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-[#F8F7F4] leading-none mt-6 md:mt-8"
          data-testid="hero-monogram"
          style={{
            fontSize: "clamp(7rem, 22vw, 22rem)",
            textShadow: "0 6px 40px rgba(0,0,0,0.55)",
          }}
        >
          <span className="italic">H</span>
          <span>A</span>
          <span className="italic text-[#C9A66B]">B</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="mt-6 md:mt-8 hab-overline text-[#F8F7F4]/85 text-[0.7rem] md:text-xs"
        >
          Harsimran Architects <span className="text-[#C9A66B]">&amp;</span> Builders
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-4 text-sm md:text-base text-[#F8F7F4]/70 max-w-md"
        >
          Architecture · Construction · Approvals
        </motion.p>
      </div>

      {/* Scroll indicator */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        onClick={() =>
          window.scrollTo({ top: window.innerHeight, behavior: "smooth" })
        }
        aria-label="Scroll to content"
        data-testid="hero-scroll-cue"
        className="absolute left-1/2 -translate-x-1/2 bottom-6 md:bottom-10 flex flex-col items-center gap-2 text-[#F8F7F4]/75 hover:text-[#C9A66B] transition-colors"
      >
        <span className="hab-overline text-[0.6rem]">Discover</span>
        <ArrowDown size={16} strokeWidth={1.5} className="animate-bounce" />
      </motion.button>
    </section>
  );
}
