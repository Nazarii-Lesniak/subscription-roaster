"use client";

import { ArrowLeft, Flame } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/components/translation-provider";

export function NotFoundContent() {
  const { t } = useTranslation();
  return (
    <main className="grid min-h-screen place-items-center bg-bg px-6 text-center text-text">
      <div className="max-w-[480px]">
        <span className="mb-5 inline-grid size-14 place-items-center rounded-2xl bg-accent/10 text-accent">
          <Flame size={26} />
        </span>
        <p className="mb-3 text-[10px] font-extrabold tracking-[.13em] text-accent">
          {t.notFound.eyebrow}
        </p>
        <h1 className="m-0 text-[clamp(32px,8vw,46px)] font-bold leading-tight tracking-tighter">
          {t.notFound.title}
        </h1>
        <p className="mx-auto mb-6 mt-4 max-w-[360px] text-sm text-muted">
          {t.notFound.message}
        </p>
        <Link
          className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-accent px-4 text-xs font-bold text-accent-ink transition-[transform,filter] hover:-translate-y-0.5 hover:brightness-110"
          href="/"
        >
          <ArrowLeft size={16} />
          {t.notFound.back}
        </Link>
      </div>
    </main>
  );
}
