"use client";

import {
  ArrowDownRight,
  ArrowUpRight,
  Flame,
  Github,
  Linkedin,
  RotateCcw,
  Sparkles,
  WalletCards,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { NeonCursor } from "@/components/neon-cursor";
import { SiteHeader } from "@/components/site-header";
import { SubscriptionForm } from "@/components/subscription-form";
import { SubscriptionList } from "@/components/subscription-list";
import { ThemeProvider } from "@/components/theme-provider";
import {
  TranslationProvider,
  useTranslation,
} from "@/components/translation-provider";
import { useSubscriptions } from "@/hooks/use-subscriptions";
import { getRoast } from "@/lib/roast";

function DashboardContent() {
  const { language, t } = useTranslation();
  const { items, ready, monthlyTotal, add, update, remove, clear } =
    useSubscriptions();
  const inputRef = useRef<HTMLInputElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [roast, setRoast] = useState("");
  const previousLanguage = useRef(language);
  const money = (value: number) =>
    new Intl.NumberFormat(language === "uk" ? "uk-UA" : "en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(value);

  useEffect(() => {
    if (previousLanguage.current !== language && roast) {
      setRoast(getRoast(monthlyTotal, t.roast));
    }
    previousLanguage.current = language;
  }, [language, monthlyTotal, roast, t.roast]);

  function focusSearch() {
    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    requestAnimationFrame(() =>
      inputRef.current?.focus({ preventScroll: true }),
    );
  }

  function clearList() {
    if (window.confirm(t.list.clearConfirm)) {
      clear();
      setRoast("");
    }
  }

  return (
    <>
      <NeonCursor />
      <SiteHeader onGetStarted={focusSearch} />
      <div
        id="top"
        className="relative z-10 mx-auto min-h-screen w-[calc(100%-28px)] max-w-305 sm:w-[calc(100%-56px)] 2xl:max-w-345"
      >
        <main className="pb-10">
          <section className="grid min-h-75 grid-cols-1 items-center gap-2 py-11 sm:min-h-82.5 sm:grid-cols-[1fr_330px] sm:py-17 lg:grid-cols-[1fr_410px] lg:px-2">
            <div>
              <p className="mb-3 text-[10px] font-extrabold tracking-[.13em] text-muted">
                <span className="mr-2 inline-block size-1.5 rounded-full bg-accent shadow-[0_0_12px_var(--color-accent)]" />
                {t.hero.kicker}
              </p>
              <h1 className="m-0 text-[clamp(39px,10vw,63px)] font-bold leading-[1.03] tracking-[-.055em] text-text">
                {t.hero.title}
                <br />
                <span className="text-accent">{t.hero.accent}</span>
              </h1>
              <p className="mb-4 mt-4 max-w-127.5 text-xs leading-7 text-muted sm:mb-5 sm:mt-5 sm:text-sm">
                {t.hero.subtitle}
              </p>
              <div className="flex flex-wrap gap-x-5 gap-y-1 text-[10px] text-muted sm:text-[11px]">
                <span>
                  <span className="mr-1.5 text-accent">✓</span>
                  {t.hero.noBank}
                </span>
                <span>
                  <span className="mr-1.5 text-accent">✓</span>
                  {t.hero.private}
                </span>
              </div>
            </div>
            <div
              className="relative hidden h-55 place-items-center sm:grid"
              aria-hidden="true"
            >
              <div className="absolute h-22.5 w-60 rotate-[-21deg] rounded-[50%] border border-accent/15" />
              <div className="absolute h-32.5 w-77.5 rotate-29 rounded-[50%] border border-border opacity-80" />
              <div className="grid size-24 rotate-[-8deg] place-items-center rounded-[28px] border border-accent/30 bg-[radial-gradient(circle_at_30%_25%,color-mix(in_srgb,var(--color-accent)_22%,var(--color-panel)),var(--color-panel))] text-accent shadow-[0_0_80px_color-mix(in_srgb,var(--color-accent)_12%,transparent)]">
                <Flame size={43} fill="currentColor" />
              </div>
              <span className="absolute left-5 top-6 inline-flex items-center gap-2 rounded-lg border border-border bg-panel-raised px-3 py-2 text-[10px] text-muted shadow-lg">
                <WalletCards size={15} />
                {t.hero.recurring}
              </span>
              <span className="absolute right-0 top-16 inline-flex items-center gap-2 rounded-lg border border-border bg-panel-raised px-3 py-2 text-[10px] text-muted shadow-lg">
                <span className="size-1.5 rounded-full bg-accent" />
                {t.hero.dueToday}
              </span>
              <span className="absolute bottom-5 left-14 rounded-lg border border-border bg-panel-raised px-3 py-2 text-[10px] font-bold text-accent shadow-lg">
                {money(monthlyTotal)}
              </span>
            </div>
          </section>

          <section
            className="grid items-start gap-3 sm:gap-5 lg:grid-cols-[minmax(300px,.86fr)_minmax(0,1.14fr)]"
            aria-label={t.list.heading}
          >
            <div className="contents lg:block">
              <SubscriptionForm
                onAdd={add}
                inputRef={inputRef}
                sectionRef={sectionRef}
              />
              <div className="order-2 flex items-start gap-2 px-1 py-1 text-[10px] leading-relaxed text-subtle lg:order-0">
                <span className="mt-1 size-1.5 shrink-0 rounded-full bg-accent/75" />
                <p className="m-0">{t.privacy.note}</p>
              </div>
            </div>
            <section
              className="order-3 rounded-2xl border border-border bg-panel p-4 sm:p-6 lg:order-0"
              aria-labelledby="subscriptions-heading"
            >
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="mb-1 text-[9px] font-extrabold tracking-[.13em] text-muted">
                    {t.list.step}
                  </p>
                  <h2
                    id="subscriptions-heading"
                    className="m-0 flex items-center gap-2 text-lg font-bold tracking-tight text-text"
                  >
                    {t.list.heading}
                    <span className="grid size-5 place-items-center rounded-md bg-panel-raised text-[10px] font-semibold text-muted">
                      {items.length}
                    </span>
                  </h2>
                </div>
                {items.length > 0 && (
                  <button
                    type="button"
                    className="group inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-[10px] text-muted transition-[background-color,color,transform] duration-150 hover:-translate-y-px hover:bg-red-500/10 hover:text-red-400 focus-visible:outline-2 focus-visible:outline-accent"
                    onClick={clearList}
                  >
                    <RotateCcw
                      size={13}
                      className="transition-transform duration-200 group-hover:rotate-[-35deg]"
                    />
                    {t.list.clear}
                  </button>
                )}
              </div>
              <div className="relative grid min-h-28.5 grid-cols-2 items-center overflow-hidden rounded-xl border border-accent/20 bg-[radial-gradient(320px_circle_at_0%_0%,color-mix(in_srgb,var(--color-accent)_8%,transparent),transparent_75%)] bg-panel-raised px-3.5 py-4 sm:px-5">
                <div className="flex flex-col items-start">
                  <span className="mb-1 text-[9px] text-muted sm:text-[10px]">
                    {t.list.monthlySpend}
                  </span>
                  <strong className="text-2xl font-bold leading-tight tracking-[-.055em] tabular-nums text-text">
                    {money(monthlyTotal)}
                  </strong>
                  <span className="mt-1 inline-flex items-center gap-1 text-[9px] text-subtle">
                    <ArrowDownRight size={13} className="text-accent" />
                    {t.list.tracked}
                  </span>
                </div>
                <div className="absolute left-[52%] top-1/2 h-11 w-px -translate-y-1/2 bg-border" />
                <div className="flex flex-col items-start pl-3 sm:pl-5">
                  <span className="mb-1 text-[9px] text-muted sm:text-[10px]">
                    {t.list.yearlyProjection}
                  </span>
                  <strong className="text-lg font-bold leading-tight tracking-tighter tabular-nums text-text">
                    {money(monthlyTotal * 12)}
                  </strong>
                  <span className="mt-1 text-[8px] text-subtle sm:text-[9px]">
                    {t.list.ifUnchanged}
                  </span>
                </div>
                <Sparkles
                  size={17}
                  className="absolute right-3 top-3 text-accent/70"
                  aria-hidden="true"
                />
              </div>
              {ready && items.length > 0 ? (
                <SubscriptionList
                  items={items}
                  onUpdate={update}
                  onRemove={remove}
                />
              ) : (
                <div className="relative mt-3 flex min-h-47.5 flex-col items-center justify-center rounded-xl border border-dashed border-border text-center">
                  <span className="mb-2 grid size-10 place-items-center rounded-xl bg-panel-raised text-muted">
                    <WalletCards size={21} />
                  </span>
                  <h3 className="m-0 mb-1 text-[13px] font-bold text-text">
                    {ready ? t.list.empty : t.list.loading}
                  </h3>
                  {ready && (
                    <p className="m-0 max-w-55 text-[10px] text-muted">
                      {t.list.emptyHint}
                    </p>
                  )}
                  <ArrowUpRight
                    size={16}
                    className="absolute left-5 top-5 rotate-180 text-accent/75"
                    aria-hidden="true"
                  />
                </div>
              )}
              {items.length > 0 && (
                <div className="mt-3">
                  <button
                    type="button"
                    className="group flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-[linear-gradient(105deg,#d9a5ff,#a679f8_55%,#8a66e8)] px-4 text-xs font-bold text-[#20172a] shadow-lg shadow-purple-500/10 transition-[transform,filter,box-shadow] duration-150 hover:-translate-y-0.5 hover:brightness-110 hover:shadow-purple-500/20 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent"
                    onClick={() => setRoast(getRoast(monthlyTotal, t.roast))}
                  >
                    <Flame
                      size={17}
                      fill="currentColor"
                      className="transition-transform group-hover:-rotate-12"
                    />
                    {t.roast.button}
                    <ArrowUpRight
                      size={15}
                      className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </button>
                  {roast && (
                    <div
                      className="mt-2.5 animate-[appear_180ms_ease-out] rounded-xl border border-purple-400/30 bg-purple-400/8 p-3.5"
                      role="status"
                    >
                      <span className="flex items-center gap-1.5 text-[9px] font-extrabold uppercase tracking-widest text-purple-300">
                        <Sparkles size={13} />
                        {t.roast.verdict}
                      </span>
                      <p className="mb-0 mt-2 text-xs leading-relaxed text-text">
                        “{roast}”
                      </p>
                    </div>
                  )}
                </div>
              )}
            </section>
          </section>
        </main>
        <footer className="flex min-h-17.5 flex-wrap items-center gap-x-5 gap-y-2 border-t border-border py-4 text-[10px] text-muted sm:py-0">
          <a
            className="group inline-flex items-center gap-1.5 rounded transition-[color,transform] duration-150 hover:-translate-y-px hover:text-accent focus-visible:outline-2 focus-visible:outline-accent"
            href="https://github.com/Nazarii-Lesniak/subscription-roaster"
            target="_blank"
            rel="noreferrer"
          >
            <Github
              size={14}
              className="transition-transform group-hover:scale-110"
            />
            {t.footer.github}
          </a>
          <a
            className="group inline-flex items-center gap-1.5 rounded transition-[color,transform] duration-150 hover:-translate-y-px hover:text-accent focus-visible:outline-2 focus-visible:outline-accent"
            href="https://www.linkedin.com/in/nazarii-lesniak"
            target="_blank"
            rel="noreferrer"
          >
            <Linkedin
              size={14}
              className="transition-transform group-hover:scale-110"
            />
            {t.footer.linkedin}
          </a>
          <span className="order-3 w-full text-subtle sm:order-0 sm:ml-auto sm:w-auto">
            © {new Date().getFullYear()} {t.footer.copyright}
          </span>
          <span className="ml-auto inline-flex items-center gap-1.5 text-subtle sm:ml-0">
            {t.footer.madeWith}
            <Flame size={12} fill="currentColor" className="text-accent" />
          </span>
        </footer>
      </div>
    </>
  );
}

export function Dashboard() {
  return (
    <ThemeProvider>
      <TranslationProvider>
        <DashboardContent />
      </TranslationProvider>
    </ThemeProvider>
  );
}
