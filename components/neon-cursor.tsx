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

  return <div className="neon-cursor" aria-hidden="true" />;
}
