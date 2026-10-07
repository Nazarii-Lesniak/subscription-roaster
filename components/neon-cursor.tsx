"use client";

import { useEffect } from "react";

export function NeonCursor() {
  useEffect(() => {
    const move = (event: PointerEvent) => {
      document.documentElement.style.setProperty(
        "--pointer-x",
        `${event.clientX}px`,
      );
      document.documentElement.style.setProperty(
        "--pointer-y",
        `${event.clientY}px`,
      );
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 opacity-90 motion-reduce:hidden"
      aria-hidden="true"
      style={{
        backgroundImage:
          "radial-gradient(460px circle at var(--pointer-x) var(--pointer-y), var(--cursor-glow), transparent 72%)",
      }}
    />
  );
}
