"use client";

import {
  ArrowUpRight,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  Clapperboard,
  Code2,
  Gamepad2,
  Headphones,
  MoreHorizontal,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import { type ChangeEvent, useState } from "react";
import { type Category, categories, type Subscription } from "@/lib/types";
import { useI18n } from "./i18n-provider";

const iconByCategory: Record<Category, typeof Clapperboard> = {
  Streaming: Clapperboard,
  Software: Code2,
  Music: Headphones,
  Gaming: Gamepad2,
  Productivity: BriefcaseBusiness,
  Other: MoreHorizontal,
};

type Props = {
  items: Subscription[];
  onUpdate: (id: string, patch: Partial<Subscription>) => void;
  onRemove: (id: string) => void;
};

export function SubscriptionList({ items, onUpdate, onRemove }: Props) {
  const { t, language } = useI18n();
  const [editing, setEditing] = useState<string | null>(null);
  const [details, setDetails] = useState<Subscription | null>(null);
  const [menu, setMenu] = useState<string | null>(null);
  const locale = language === "uk" ? "uk-UA" : "en-US";

  function changePrice(
    item: Subscription,
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const value = Number(event.currentTarget.value);
    if (Number.isFinite(value) && value > 0)
      onUpdate(item.id, { price: value });
  }

  return (
    <div className="subscription-list">
      {items.map((item) => {
        const Icon = iconByCategory[item.category];
        const isEditing = editing === item.id;
        return (
          <article className="subscription-card" key={item.id}>
            <div className="service-icon">
              {item.logoUrl ? (
                <img
                  src={item.logoUrl}
                  alt=""
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                    event.currentTarget.parentElement?.classList.add(
                      "logo-failed",
                    );
                  }}
                />
              ) : null}
              <Icon size={21} aria-hidden="true" />
            </div>
            <div className="subscription-info">
              <h3>{item.name}</h3>
              <p>
                <span className="category-label">{item.category}</span>
                <span className="meta-dot">·</span>
                <span>
                  <CalendarDays size={12} />
                  {item.period === "monthly" ? t.monthly : t.yearly}
                </span>
                {item.url && (
                  <a
                    className="service-link"
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${item.name} website`}
                  >
                    <ArrowUpRight size={13} />
                  </a>
                )}
              </p>
            </div>
            <div className="subscription-price">
              {isEditing ? (
                <label className="inline-price">
                  <span className="sr-only">{t.price}</span>
                  <span>$</span>
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    defaultValue={item.price}
                    autoFocus
                    onBlur={(event) => {
                      changePrice(item, event);
                      setEditing(null);
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.currentTarget.blur();
                      }

                      if (event.key === "Escape") {
                        setEditing(null);
                      }
                    }}
                  />
                </label>
              ) : (
                <>
                  <strong>
                    $
                    {item.price.toLocaleString(locale, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </strong>
                  <span>
                    /
                    {item.period === "monthly"
                      ? language === "uk"
                        ? "міс"
                        : "mo"
                      : language === "uk"
                        ? "рік"
                        : "yr"}
                  </span>
                </>
              )}
            </div>
            <div className="card-menu-wrap">
              <button
                type="button"
                className="icon-button card-menu-button"
                aria-label={`${item.name} actions`}
                aria-expanded={menu === item.id}
                onClick={() => setMenu(menu === item.id ? null : item.id)}
              >
                <MoreHorizontal size={19} />
              </button>
              {menu === item.id && (
                <div className="card-menu">
                  <button
                    type="button"
                    onClick={() => {
                      setDetails({ ...item });
                      setMenu(null);
                    }}
                  >
                    <Pencil size={14} />
                    {t.edit} details
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(item.id);
                      setMenu(null);
                    }}
                  >
                    <Pencil size={14} />
                    {t.edit} price
                  </button>
                  <button
                    type="button"
                    className="danger-action"
                    onClick={() => {
                      onRemove(item.id);
                      setMenu(null);
                    }}
                  >
                    <Trash2 size={14} />
                    {t.delete}
                  </button>
                  <button
                    type="button"
                    className="menu-close"
                    aria-label={t.cancel}
                    onClick={() => setMenu(null)}
                  >
                    <X size={13} />
                  </button>
                </div>
              )}
            </div>
          </article>
        );
      })}
      {details && (
        <div
          className="dialog-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setDetails(null);
            }
          }}
        >
          <section
            className="edit-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-title"
          >
            <button
              type="button"
              className="icon-button dialog-close"
              aria-label={t.cancel}
              onClick={() => setDetails(null)}
            >
              <X size={17} />
            </button>
            <p className="eyebrow">SUBSCRIPTION SETTINGS</p>
            <h2 id="edit-title">
              {t.edit} {details.name}
            </h2>
            <label className="field-label" htmlFor="edit-name">
              {t.name}
            </label>
            <input
              id="edit-name"
              className="field"
              value={details.name}
              minLength={2}
              onChange={(event) =>
                setDetails({ ...details, name: event.currentTarget.value })
              }
            />
            <label className="field-label" htmlFor="edit-category">
              {t.category}
            </label>
            <select
              id="edit-category"
              className="field select-field"
              value={details.category}
              onChange={(event) =>
                setDetails({
                  ...details,
                  category: event.currentTarget.value as Category,
                })
              }
            >
              {categories.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>
            <label className="field-label" htmlFor="edit-period">
              {t.period}
            </label>
            <select
              id="edit-period"
              className="field select-field"
              value={details.period}
              onChange={(event) =>
                setDetails({
                  ...details,
                  period: event.currentTarget.value as "monthly" | "yearly",
                })
              }
            >
              <option value="monthly">{t.monthly}</option>
              <option value="yearly">{t.yearly}</option>
            </select>
            <div className="dialog-actions">
              <button
                type="button"
                className="button button-quiet"
                onClick={() => setDetails(null)}
              >
                {t.cancel}
              </button>
              <button
                type="button"
                className="button button-primary"
                disabled={details.name.trim().length < 2}
                onClick={() => {
                  onUpdate(details.id, {
                    name: details.name.trim(),
                    category: details.category,
                    period: details.period,
                  });
                  setDetails(null);
                }}
              >
                <Check size={15} />
                {t.save}
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
