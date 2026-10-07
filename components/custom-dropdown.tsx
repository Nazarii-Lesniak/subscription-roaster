"use client";

import { ChevronDown } from "lucide-react";
import {
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

export type DropdownOption<T extends string> = { value: T; label: string };

type Props<T extends string> = {
  id?: string;
  value: T;
  options: DropdownOption<T>[];
  onChange: (value: T) => void;
  label: string;
  leadingIcon?: ReactNode;
  className?: string;
  compact?: boolean;
};

export function CustomDropdown<T extends string>({
  id: triggerId,
  value,
  options,
  onChange,
  label,
  leadingIcon,
  className = "",
  compact = false,
}: Props<T>) {
  const id = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 180 });

  useEffect(() => setMounted(true), []);

  const placeMenu = useCallback(() => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) {
      return;
    }
    const width = Math.max(rect.width, 172);
    setPosition({
      top: Math.min(rect.bottom + 7, window.innerHeight - 12),
      left: Math.max(8, Math.min(rect.left, window.innerWidth - width - 8)),
      width,
    });
  }, []);

  const dismiss = useCallback((restoreFocus = false) => {
    setOpen(false);
    setLeaving(true);
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
    }
    closeTimer.current = setTimeout(() => setLeaving(false), 170);
    if (restoreFocus) {
      triggerRef.current?.focus();
    }
  }, []);

  const show = useCallback(
    (focusIndex = options.findIndex((option) => option.value === value)) => {
      if (closeTimer.current) {
        clearTimeout(closeTimer.current);
      }
      placeMenu();
      setLeaving(false);
      setOpen(true);
      requestAnimationFrame(() =>
        optionRefs.current[Math.max(0, focusIndex)]?.focus(),
      );
    },
    [options, placeMenu, value],
  );

  useEffect(() => {
    if (!open) {
      return;
    }
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (
        target instanceof Node &&
        !rootRef.current?.contains(target) &&
        !menuRef.current?.contains(target)
      ) {
        dismiss();
      }
    };
    const onViewportChange = () => placeMenu();
    document.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("resize", onViewportChange);
    window.addEventListener("scroll", onViewportChange, true);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("resize", onViewportChange);
      window.removeEventListener("scroll", onViewportChange, true);
    };
  }, [dismiss, open, placeMenu]);

  useEffect(
    () => () => {
      if (closeTimer.current) {
        clearTimeout(closeTimer.current);
      }
    },
    [],
  );

  const currentLabel =
    options.find((option) => option.value === value)?.label ?? "";
  const onTriggerKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      show(
        event.key === "ArrowUp"
          ? options.length - 1
          : options.findIndex((option) => option.value === value),
      );
    }
  };
  const onOptionKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const direction = event.key === "ArrowDown" ? 1 : -1;
      optionRefs.current[
        (index + direction + options.length) % options.length
      ]?.focus();
    } else if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      optionRefs.current[
        event.key === "Home" ? 0 : options.length - 1
      ]?.focus();
    } else if (event.key === "Escape") {
      event.preventDefault();
      dismiss(true);
    } else if (event.key === "Tab") {
      dismiss();
    }
  };

  return (
    <div ref={rootRef} className={`relative min-w-0 ${className}`}>
      <button
        ref={triggerRef}
        id={triggerId}
        type="button"
        className={`group flex min-h-10 w-full items-center justify-between gap-2 rounded-lg border border-border bg-bg text-left text-[12px] text-text outline-none transition-[background-color,border-color,color,box-shadow] duration-150 hover:border-accent/50 hover:bg-panel-raised focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/20 ${compact ? "border-transparent bg-transparent px-1.5" : "px-3"}`}
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => (open ? dismiss() : show())}
        onKeyDown={onTriggerKeyDown}
      >
        <span className="flex min-w-0 items-center gap-2">
          {leadingIcon && (
            <span className="shrink-0 text-muted transition-colors group-hover:text-accent">
              {leadingIcon}
            </span>
          )}
          <span className="truncate">{currentLabel}</span>
        </span>
        <ChevronDown
          size={14}
          aria-hidden="true"
          className={`shrink-0 text-muted transition-transform duration-150 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {mounted &&
        (open || leaving) &&
        createPortal(
          <div
            ref={menuRef}
            id={id}
            role="listbox"
            aria-label={label}
            inert={!open}
            className={`fixed z-12000 overflow-hidden rounded-xl border border-border bg-panel p-1.5 shadow-2xl shadow-black/25 transition-[opacity,transform] duration-150 ${open ? "translate-y-0 scale-100 opacity-100" : "pointer-events-none -translate-y-1 scale-[.98] opacity-0"}`}
            style={{
              top: position.top,
              left: position.left,
              width: position.width,
              transformOrigin: "top center",
            }}
          >
            {options.map((option, index) => (
              <button
                key={option.value}
                ref={(element) => {
                  optionRefs.current[index] = element;
                }}
                type="button"
                role="option"
                aria-selected={option.value === value}
                tabIndex={-1}
                className={`flex min-h-9 w-full items-center justify-between rounded-lg px-2.5 text-left text-[12px] outline-none transition-[background-color,color] duration-150 hover:bg-accent/10 hover:text-accent focus-visible:bg-accent/10 focus-visible:text-accent ${option.value === value ? "font-semibold text-accent" : "text-muted"}`}
                onClick={() => {
                  onChange(option.value);
                  dismiss(true);
                }}
                onKeyDown={(event) => onOptionKeyDown(event, index)}
              >
                <span>{option.label}</span>
                {option.value === value && (
                  <span
                    aria-hidden="true"
                    className="ml-3 size-1.5 rounded-full bg-accent"
                  />
                )}
              </button>
            ))}
          </div>,
          document.body,
        )}
    </div>
  );
}
