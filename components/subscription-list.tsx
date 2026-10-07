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
import Image from "next/image";
import {
  type ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { CustomDropdown } from "@/components/custom-dropdown";
import { useTranslation } from "@/components/translation-provider";
import { type Category, categories, type Subscription } from "@/lib/types";

const categoryIcon = {
  Streaming: Clapperboard,
  Software: Code2,
  Music: Headphones,
  Gaming: Gamepad2,
  Productivity: BriefcaseBusiness,
  Other: MoreHorizontal,
} satisfies Record<Category, typeof Clapperboard>;
type Props = {
  items: Subscription[];
  onUpdate: (id: string, patch: Partial<Subscription>) => void;
  onRemove: (id: string) => void;
};

function ServiceIcon({ item }: { item: Subscription }) {
  const [failed, setFailed] = useState(false);
  const Icon = categoryIcon[item.category];
  return (
    <span className="relative grid size-9 shrink-0 place-items-center overflow-hidden rounded-lg bg-accent/10 text-accent">
      {item.logoUrl && !failed ? (
        <Image
          src={item.logoUrl}
          alt=""
          width={36}
          height={36}
          unoptimized
          className="absolute inset-0 z-1 size-full bg-panel object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <Icon size={20} aria-hidden="true" />
      )}
    </span>
  );
}

export function SubscriptionList({ items, onUpdate, onRemove }: Props) {
  const { language, t, format } = useTranslation();
  const [editing, setEditing] = useState<string | null>(null);
  const [details, setDetails] = useState<Subscription | null>(null);
  const [menuId, setMenuId] = useState<string | null>(null);
  const [menuLeaving, setMenuLeaving] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const actionButtonRef = useRef<HTMLButtonElement | null>(null);
  const priceInputRef = useRef<HTMLInputElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const menuTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const locale = language === "uk" ? "uk-UA" : "en-US";

  function changePrice(
    item: Subscription,
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const value = Number(event.currentTarget.value);
    if (Number.isFinite(value) && value > 0) {
      onUpdate(item.id, { price: value });
    }
  }

  const closeMenu = useCallback(() => {
    setMenuLeaving(true);
    if (menuTimer.current) {
      clearTimeout(menuTimer.current);
    }
    menuTimer.current = setTimeout(() => {
      setMenuId(null);
      setMenuLeaving(false);
    }, 160);
  }, []);

  function openMenu(id: string, button: HTMLButtonElement) {
    if (menuTimer.current) {
      clearTimeout(menuTimer.current);
    }
    actionButtonRef.current = button;
    const rect = button.getBoundingClientRect();
    setMenuPosition({
      top: rect.bottom + 5,
      left: Math.max(8, Math.min(rect.right - 176, window.innerWidth - 184)),
    });
    setMenuLeaving(false);
    setMenuId(id);
  }

  useEffect(() => {
    if (!menuId) {
      return;
    }
    menuRef.current?.querySelector<HTMLButtonElement>("button")?.focus();
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (
        target instanceof Node &&
        !menuRef.current?.contains(target) &&
        !actionButtonRef.current?.contains(target)
      ) {
        closeMenu();
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu();
        actionButtonRef.current?.focus();
      }
    };
    const onViewportChange = () => {
      const rect = actionButtonRef.current?.getBoundingClientRect();
      if (rect) {
        setMenuPosition({
          top: rect.bottom + 5,
          left: Math.max(
            8,
            Math.min(rect.right - 176, window.innerWidth - 184),
          ),
        });
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onViewportChange);
    window.addEventListener("scroll", onViewportChange, true);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onViewportChange);
      window.removeEventListener("scroll", onViewportChange, true);
    };
  }, [closeMenu, menuId]);

  useEffect(() => {
    if (editing) {
      priceInputRef.current?.focus();
    }
  }, [editing]);

  useEffect(
    () => () => {
      if (menuTimer.current) {
        clearTimeout(menuTimer.current);
      }
    },
    [],
  );

  const activeItem = items.find((item) => item.id === menuId);

  return (
    <div className="mt-3 flex flex-col gap-2">
      {items.map((item) => {
        const isEditingPrice = editing === item.id;
        return (
          <article
            key={item.id}
            className="group relative flex min-h-17 items-center gap-2.5 rounded-xl border border-border bg-bg px-2.5 py-2.5 transition-[border-color,background-color,transform] duration-150 hover:-translate-y-px hover:border-accent/30 hover:bg-panel-raised sm:gap-3 sm:px-3"
          >
            <ServiceIcon item={item} />
            <div className="min-w-0 flex-1">
              <h3 className="m-0 truncate text-xs font-bold text-text">
                {item.name}
              </h3>
              <p className="mt-1 mb-0 flex items-center gap-1.5 text-[9px] text-muted">
                <span className="truncate text-subtle">
                  {t.categories[item.category]}
                </span>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1">
                  <CalendarDays size={11} />
                  {t.form[item.period]}
                </span>
                {item.url && (
                  <a
                    className="rounded-sm text-subtle transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-accent"
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={format(t.list.website, { name: item.name })}
                  >
                    <ArrowUpRight size={13} />
                  </a>
                )}
              </p>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-0.5 whitespace-nowrap">
              {isEditingPrice ? (
                <label className="flex h-7 items-center gap-1 text-accent">
                  <span className="sr-only">{t.form.price}</span>
                  <span>$</span>
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    defaultValue={item.price}
                    ref={(element) => {
                      if (isEditingPrice) {
                        priceInputRef.current = element;
                      }
                    }}
                    className="h-7 w-19 rounded-md border border-accent bg-panel px-1.5 text-xs text-text outline-none"
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
                <div className="flex items-center gap-2">
                  <strong className="text-xs tabular-nums text-text">
                    {new Intl.NumberFormat(locale, {
                      style: "currency",
                      currency: "USD",
                      maximumFractionDigits: 2,
                    }).format(item.price)}
                  </strong>
                  <span className="text-[9px] text-subtle">
                    /
                    {t.list[item.period === "monthly" ? "perMonth" : "perYear"]}
                  </span>
                </div>
              )}
            </div>
            <button
              type="button"
              className="grid size-8 shrink-0 place-items-center rounded-md text-muted opacity-80 transition-[background-color,color,opacity] hover:bg-panel hover:text-text focus-visible:outline-2 focus-visible:outline-accent sm:opacity-60 sm:group-hover:opacity-100"
              aria-label={format(t.list.actions, { name: item.name })}
              aria-expanded={menuId === item.id}
              onClick={(event) =>
                menuId === item.id
                  ? closeMenu()
                  : openMenu(item.id, event.currentTarget)
              }
            >
              <MoreHorizontal size={18} />
            </button>
          </article>
        );
      })}
      {menuId &&
        activeItem &&
        createPortal(
          <div
            ref={menuRef}
            className={`fixed z-10000 w-44 rounded-xl border border-border bg-panel p-1.5 shadow-2xl shadow-black/30 transition-[opacity,transform] duration-150 ${menuLeaving ? "-translate-y-1 scale-[.98] opacity-0" : "translate-y-0 scale-100 opacity-100"}`}
            style={{
              top: menuPosition.top,
              left: menuPosition.left,
              transformOrigin: "top right",
            }}
          >
            <button
              type="button"
              className="flex min-h-9 w-full items-center gap-2 rounded-lg px-2.5 text-left text-[11px] text-muted transition-colors hover:bg-accent/10 hover:text-accent focus-visible:bg-accent/10 focus-visible:outline-none"
              onClick={() => {
                setDetails({ ...activeItem });
                closeMenu();
              }}
            >
              <Pencil size={14} />
              {t.list.editDetails}
            </button>
            <button
              type="button"
              className="flex min-h-9 w-full items-center gap-2 rounded-lg px-2.5 text-left text-[11px] text-muted transition-colors hover:bg-accent/10 hover:text-accent focus-visible:bg-accent/10 focus-visible:outline-none"
              onClick={() => {
                setEditing(activeItem.id);
                closeMenu();
              }}
            >
              <Pencil size={14} />
              {t.list.editPrice}
            </button>
            <button
              type="button"
              className="flex min-h-9 w-full items-center gap-2 rounded-lg px-2.5 text-left text-[11px] text-muted transition-colors hover:bg-red-500/10 hover:text-red-400 focus-visible:bg-red-500/10 focus-visible:outline-none"
              onClick={() => {
                if (window.confirm(t.list.deleteConfirm)) {
                  onRemove(activeItem.id);
                }
                closeMenu();
              }}
            >
              <Trash2 size={14} />
              {t.list.delete}
            </button>
          </div>,
          document.body,
        )}
      {details && (
        <div
          className="fixed inset-0 z-11000 grid place-items-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setDetails(null);
            }
          }}
        >
          <section className="relative flex max-h-[calc(100dvh-2rem)] w-full max-w-sm flex-col overflow-y-auto rounded-2xl border border-border bg-panel p-6 shadow-2xl">
            <button
              type="button"
              className="absolute right-4 top-4 grid size-8 place-items-center rounded-md text-muted transition-colors hover:bg-panel-raised hover:text-text focus-visible:outline-2 focus-visible:outline-accent"
              aria-label={t.edit.cancel}
              onClick={() => setDetails(null)}
            >
              <X size={17} />
            </button>
            <p className="mb-1 text-[9px] font-extrabold tracking-[.13em] text-muted">
              {t.list.settings}
            </p>
            <h2
              id="edit-title"
              className="mb-5 mt-0 text-xl font-bold text-text"
            >
              {format(t.edit.title, { name: details.name })}
            </h2>
            <label
              className="mb-1.5 text-[10px] font-semibold text-muted"
              htmlFor="edit-name"
            >
              {t.form.name}
            </label>
            <input
              id="edit-name"
              className="h-11 rounded-lg border border-border bg-bg px-3 text-base text-text outline-none focus:border-accent sm:text-xs"
              value={details.name}
              minLength={2}
              onChange={(event) =>
                setDetails({ ...details, name: event.currentTarget.value })
              }
            />
            <label
              className="mb-1.5 mt-3 text-[10px] font-semibold text-muted"
              htmlFor="edit-category"
            >
              {t.form.category}
            </label>
            <CustomDropdown<Category>
              id="edit-category"
              label={t.form.category}
              value={details.category}
              onChange={(category) => setDetails({ ...details, category })}
              options={categories.map((category) => ({
                value: category,
                label: t.categories[category],
              }))}
            />
            <label
              className="mb-1.5 mt-3 text-[10px] font-semibold text-muted"
              htmlFor="edit-period"
            >
              {t.form.period}
            </label>
            <CustomDropdown<"monthly" | "yearly">
              id="edit-period"
              label={t.form.period}
              value={details.period}
              onChange={(period) => setDetails({ ...details, period })}
              options={[
                { value: "monthly", label: t.form.monthly },
                { value: "yearly", label: t.form.yearly },
              ]}
            />
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                className="min-h-10 rounded-lg border border-border px-3 text-xs text-muted transition-colors hover:bg-panel-raised hover:text-text"
                onClick={() => setDetails(null)}
              >
                {t.edit.cancel}
              </button>
              <button
                type="button"
                className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-accent px-3 text-xs font-bold text-accent-ink transition-[filter,transform] hover:-translate-y-0.5 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
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
                {t.edit.save}
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
