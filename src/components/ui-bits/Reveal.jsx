"use client";
import { motion } from "framer-motion";

export const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
      delay: i * 0.08,
    },
  }),
};

export function Reveal({ children, delay = 0, className = "", as = "div", ...rest }) {
  const Tag = motion[as] || motion.div;
  return (
    <Tag
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      custom={delay}
      variants={fadeUp}
      className={className}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export function SectionLabel({ children, light = false, className = "" }) {
  return (
    <span
      className={`hab-overline ${light ? "text-[#F8F7F4]/70" : ""} ${className}`}
    >
      <span className="inline-block w-8 h-px align-middle mr-3 bg-[#C9A66B]" />
      {children}
    </span>
  );
}
