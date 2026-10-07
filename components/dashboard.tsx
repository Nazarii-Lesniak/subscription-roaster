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
import { useRef, useState } from "react";
import { useSubscriptions } from "@/hooks/use-subscriptions";
import { getRoast } from "@/lib/roast";
import { I18nProvider, useI18n } from "./i18n-provider";
import { NeonCursor } from "./neon-cursor";
import { SiteHeader } from "./site-header";
import { SubscriptionForm } from "./subscription-form";
import { SubscriptionList } from "./subscription-list";
import { ThemeProvider } from "./theme-provider";

function DashboardContent() {
  const { t, language } = useI18n();
  const { items, ready, monthlyTotal, add, update, remove, clear } =
    useSubscriptions();
  const inputRef = useRef<HTMLInputElement>(null);
  const [roast, setRoast] = useState("");

  const money = (value: number) =>
    new Intl.NumberFormat(language === "uk" ? "uk-UA" : "en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(value);

  function clearList() {
    if (window.confirm(t.clearConfirm)) {
      clear();
      setRoast("");
    }
  }

  return (
    <>
      <NeonCursor />
      <div className="page-shell" id="top">
        <SiteHeader onGetStarted={() => inputRef.current?.focus()} />
        <main>
          <section className="hero" aria-labelledby="hero-title">
            <div className="hero-copy">
              <p className="eyebrow">
                <span className="live-dot" />
                {t.kicker}
              </p>
              <h1 id="hero-title">
                {t.title}
                <br />
                <span>{t.accent}</span>
              </h1>
              <p className="hero-subtitle">{t.subtitle}</p>
              <div className="hero-meta">
                <span>
                  <span className="meta-check">✓</span> No bank connection
                </span>
                <span>
                  <span className="meta-check">✓</span> 100% private
                </span>
              </div>
            </div>
            <div className="hero-art" aria-hidden="true">
              <div className="orbit orbit-one" />
              <div className="orbit orbit-two" />
              <div className="orbit-core">
                <Flame size={43} fill="currentColor" />
              </div>
              <span className="orbit-chip chip-one">
                <WalletCards size={15} /> recurring
              </span>
              <span className="orbit-chip chip-two">
                <span className="mini-pulse" /> due today
              </span>
              <span className="orbit-chip chip-three">
                $ {money(monthlyTotal).replace("$", "")}
              </span>
            </div>
          </section>
          <section className="workspace" aria-label="Subscription dashboard">
            <div className="form-column">
              <SubscriptionForm onAdd={add} inputRef={inputRef} />
              <div className="privacy-note">
                <span className="privacy-dot" />
                <p>
                  Your data stays in this browser. We never ask for your bank
                  login.
                </p>
              </div>
            </div>
            <section
              className="list-panel"
              aria-labelledby="subscriptions-heading"
            >
              <div className="section-heading list-heading">
                <div>
                  <p className="eyebrow">02 / THE DAMAGE</p>
                  <h2 id="subscriptions-heading">
                    Your lineup{" "}
                    <span className="count-badge">{items.length}</span>
                  </h2>
                </div>
                {items.length > 0 && (
                  <button
                    type="button"
                    className="text-button"
                    onClick={clearList}
                  >
                    <RotateCcw size={13} />
                    {t.clear}
                  </button>
                )}
              </div>
              <div className="summary-card">
                <div className="summary-main">
                  <span className="summary-label">{t.total}</span>
                  <strong>{money(monthlyTotal)}</strong>
                  <span className="summary-foot">
                    <span className="summary-trend">
                      <ArrowDownRight size={13} />
                    </span>
                    {t.count}
                  </span>
                </div>
                <div className="summary-divider" />
                <div className="summary-secondary">
                  <span className="summary-label">{t.yearlyTotal}</span>
                  <strong>{money(monthlyTotal * 12)}</strong>
                  <span className="summary-foot">
                    {language === "uk"
                      ? "якщо нічого не скасовувати"
                      : "if nothing gets cancelled"}
                  </span>
                </div>
                <span className="summary-sparkle">
                  <Sparkles size={18} />
                </span>
              </div>

              {ready && items.length > 0 ? (
                <SubscriptionList
                  items={items}
                  onUpdate={update}
                  onRemove={remove}
                />
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">
                    <WalletCards size={21} />
                  </div>
                  <h3>{ready ? t.empty : "Loading your subscriptions…"}</h3>
                  <p>{ready ? t.emptyHint : ""}</p>
                  {ready && <ArrowUpRight size={16} className="empty-arrow" />}
                </div>
              )}

              {items.length > 0 && (
                <div className="roast-area">
                  <button
                    type="button"
                    className="button button-roast"
                    onClick={() => setRoast(getRoast(monthlyTotal))}
                  >
                    <Flame size={17} fill="currentColor" />
                    {t.roast}
                    <ArrowUpRight size={15} />
                  </button>

                  {roast && (
                    <div className="roast-result" role="status">
                      <span className="roast-label">
                        <Sparkles size={13} />
                        {t.roastIntro}
                      </span>
                      <p>“{roast}”</p>
                    </div>
                  )}
                </div>
              )}
            </section>
          </section>
        </main>
        <footer className="site-footer">
          <a href="https://github.com" target="_blank" rel="noreferrer">
            <Github size={14} /> GitHub
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer">
            <Linkedin size={14} /> LinkedIn
          </a>
          <span className="copyright">
            © {new Date().getFullYear()} Subscription Roaster. Built for your
            financial awakening.
          </span>
          <span className="footer-made">
            Made with <Flame size={12} fill="currentColor" />
          </span>
        </footer>
      </div>
    </>
  );
}

export function Dashboard() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <DashboardContent />
      </I18nProvider>
    </ThemeProvider>
  );
}
