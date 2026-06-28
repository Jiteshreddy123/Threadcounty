"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function ThreadCursor() {
  const [visible, setVisible] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 280, damping: 22 });
  const springY = useSpring(mouseY, { stiffness: 280, damping: 22 });
  const trailX = useSpring(mouseX, { stiffness: 120, damping: 18 });
  const trailY = useSpring(mouseY, { stiffness: 120, damping: 18 });

  useEffect(() => {
    const prefersFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (!prefersFinePointer) return;

    setVisible(true);

    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      document.documentElement.style.setProperty("--mouse-x", `${e.clientX}px`);
      document.documentElement.style.setProperty("--mouse-y", `${e.clientY}px`);
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    window.addEventListener("mousemove", onMove);
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
    };
  }, [mouseX, mouseY]);

  if (!visible) return null;

  return (
    <>
      {/* Warp thread — fast follower */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[200] hidden md:block"
        style={{ x: springX, y: springY }}
      >
        <div className="relative -translate-x-1/2 -translate-y-1/2">
          <div className="size-3 rounded-full bg-primary shadow-[0_0_12px_4px] shadow-primary/40" />
          <div className="absolute inset-0 size-3 rounded-full border border-primary/60 animate-ping" />
        </div>
      </motion.div>

      {/* Weft thread — lagging trail */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[199] hidden md:block"
        style={{ x: trailX, y: trailY }}
      >
        <div className="-translate-x-1/2 -translate-y-1/2 size-8 rounded-full border-2 border-chart-3/50 bg-chart-3/10 backdrop-blur-sm" />
      </motion.div>

      {/* Crosshair weave lines */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[198] hidden md:block"
        style={{ x: springX, y: springY }}
      >
        <div className="absolute -translate-x-1/2 -translate-y-1/2 w-px h-8 bg-primary/30 -top-4 left-1/2" />
        <div className="absolute -translate-x-1/2 -translate-y-1/2 w-8 h-px bg-chart-3/30 -left-4 top-1/2" />
      </motion.div>
    </>
  );
}
