"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, LoaderCircle, Plus, Search, X } from "lucide-react";
import {
  type ChangeEvent,
  type RefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { CustomDropdown } from "@/components/custom-dropdown";
import { useTranslation } from "@/components/translation-provider";
import { useDebounce } from "@/hooks/use-debounce";
import { searchWeb } from "@/lib/search";
import { makeLogoUrl } from "@/lib/storage";
import {
  type Category,
  categories,
  type Period,
  type SearchResult,
  type Subscription,
} from "@/lib/types";

const schema = z.object({
  name: z.string().trim().min(2),
  price: z.number().positive(),
  period: z.enum(["monthly", "yearly"]),
  category: z.enum(categories),
});
type FormValues = z.infer<typeof schema>;
type Props = {
  onAdd: (item: Subscription) => void;
  inputRef: RefObject<HTMLInputElement | null>;
  sectionRef: RefObject<HTMLElement | null>;
};

export function SubscriptionForm({ onAdd, inputRef, sectionRef }: Props) {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selected, setSelected] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const searchBoxRef = useRef<HTMLDivElement>(null);
  const priceInputRef = useRef<HTMLInputElement>(null);
  const activeSearchRef = useRef<AbortController | null>(null);
  const debounced = useDebounce(query, 500);
  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      price: 0,
      period: "monthly",
      category: "Streaming",
    },
  });
  const priceField = register("price", { valueAsNumber: true });

  useEffect(() => {
    if (selected || debounced.trim().length < 2) {
      activeSearchRef.current?.abort();
      setResults([]);
      setLoading(false);
      setSearchError(false);
      setHasSearched(false);
      return;
    }
    const controller = new AbortController();
    activeSearchRef.current = controller;
    setLoading(true);
    setSearchError(false);
    setHasSearched(false);
    searchWeb(debounced.trim(), controller.signal)
      .then((found) => {
        if (controller.signal.aborted) {
          return;
        }
        setResults(found);
        setHasSearched(true);
      })
      .catch((error: unknown) => {
        if (error instanceof Error && error.name !== "AbortError") {
          setSearchError(true);
          setHasSearched(true);
          setResults([]);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });
    return () => {
      controller.abort();
      if (activeSearchRef.current === controller) {
        activeSearchRef.current = null;
      }
    };
  }, [debounced, selected]);

  useEffect(() => {
    const closeOnOutsideClick = (event: PointerEvent) => {
      const target = event.target;
      if (target instanceof Node && !searchBoxRef.current?.contains(target)) {
        activeSearchRef.current?.abort();
        activeSearchRef.current = null;
        setResults([]);
        setHasSearched(false);
        setSearchError(false);
        setLoading(false);
      }
    };
    document.addEventListener("pointerdown", closeOnOutsideClick);
    return () =>
      document.removeEventListener("pointerdown", closeOnOutsideClick);
  }, []);

  const onSubmit: SubmitHandler<FormValues> = (values) => {
    onAdd({
      ...values,
      id: crypto.randomUUID(),
      url: selected?.url,
      logoUrl: makeLogoUrl(selected?.url),
      createdAt: new Date().toISOString(),
    });
    reset({ name: "", price: 0, period: "monthly", category: "Streaming" });
    setQuery("");
    setSelected(null);
    setResults([]);
  };

  function chooseResult(result: SearchResult) {
    activeSearchRef.current?.abort();
    activeSearchRef.current = null;
    setSelected(result);
    setValue("name", result.title, { shouldValidate: true });
    try {
      const host = new URL(result.url).hostname;
      let suggestedCategory: Category | undefined;
      if (/netflix|disney|hulu|primevideo|hbo|paramount/i.test(host)) {
        suggestedCategory = "Streaming";
      } else if (/spotify|apple\.com/i.test(host)) {
        suggestedCategory = "Music";
      } else if (/adobe|figma|notion|slack|microsoft/i.test(host)) {
        suggestedCategory = "Software";
      }
      if (suggestedCategory) {
        setValue("category", suggestedCategory);
      }
    } catch {
      /* Keep the chosen result even if its URL cannot be parsed. */
    }
    setQuery(result.title);
    setResults([]);
    setHasSearched(false);
    setSearchError(false);
    setLoading(false);
    requestAnimationFrame(() =>
      priceInputRef.current?.focus({ preventScroll: true }),
    );
  }

  function handleSearchInput(event: ChangeEvent<HTMLInputElement>) {
    activeSearchRef.current?.abort();
    setQuery(event.currentTarget.value);
    setSelected(null);
    setResults([]);
    setHasSearched(false);
    setSearchError(false);
    setLoading(false);
  }

  function clearSearch() {
    activeSearchRef.current?.abort();
    activeSearchRef.current = null;
    setQuery("");
    setSelected(null);
    setResults([]);
    setHasSearched(false);
    setSearchError(false);
    setLoading(false);
  }

  return (
    <section
      ref={sectionRef}
      className="rounded-2xl border border-border bg-panel p-4 sm:p-6"
      aria-labelledby="form-heading"
    >
      <div className="mb-5 flex items-start justify-between">
        <div>
          <p className="mb-1 text-[9px] font-extrabold tracking-[.13em] text-muted">
            {t.form.step}
          </p>
          <h2
            id="form-heading"
            className="m-0 text-lg font-bold tracking-tight text-text"
          >
            {t.form.heading}
          </h2>
        </div>
        <span
          className="rounded-md border border-border px-2 py-1 text-[11px] text-subtle"
          aria-hidden="true"
        >
          01
        </span>
      </div>
      <div ref={searchBoxRef} className="relative z-10">
        <Search
          size={17}
          aria-hidden="true"
          className="pointer-events-none absolute left-3.5 top-3.5 text-muted"
        />
        <input
          ref={inputRef}
          className="h-11 w-full rounded-lg border border-border bg-bg px-10 pr-10 text-base text-text outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-subtle focus:border-accent/70 focus:ring-2 focus:ring-accent/10 sm:text-xs"
          type="search"
          placeholder={t.form.search}
          value={query}
          onChange={handleSearchInput}
          aria-label={t.form.searchLabel}
          aria-controls="search-results"
          aria-busy={loading}
          autoComplete="off"
        />
        {loading && (
          <span className="absolute right-3 top-3.5 text-muted">
            <LoaderCircle
              className="animate-spin"
              size={17}
              aria-label={t.form.loading}
            />
          </span>
        )}
        {!loading && query && (
          <button
            type="button"
            className="absolute right-2 top-2 grid size-7 place-items-center rounded-md text-muted transition-colors hover:bg-panel-raised hover:text-text focus-visible:outline-2 focus-visible:outline-accent"
            aria-label={t.form.clearSearch}
            onClick={clearSearch}
          >
            <X size={15} />
          </button>
        )}
        {(results.length > 0 || searchError || (hasSearched && !loading)) && (
          <div
            id="search-results"
            className="absolute inset-x-0 top-[calc(100%+6px)] max-h-64 overflow-auto rounded-xl border border-border bg-panel-raised p-1.5 shadow-2xl shadow-black/30"
            role="listbox"
            aria-label={t.form.searchResults}
          >
            {searchError ? (
              <div className="px-2.5 py-2 text-[11px] text-muted" role="status">
                {t.form.searchError}
              </div>
            ) : results.length === 0 ? (
              <div className="px-2.5 py-2 text-[11px] text-muted">
                {t.form.noResults}
              </div>
            ) : (
              results.map((result) => (
                <div key={result.url}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={selected?.url === result.url}
                    className="flex w-full flex-col gap-0.5 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-accent/10 focus-visible:bg-accent/10 focus-visible:outline-none"
                    onClick={() => chooseResult(result)}
                  >
                    <span className="text-xs font-semibold text-text">
                      {result.title}
                    </span>
                    <span className="max-w-full truncate text-[10px] text-muted">
                      {result.description}
                    </span>
                    <span className="text-[9px] text-subtle">{result.url}</span>
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
      {selected && (
        <p className="mt-2 flex items-center gap-1.5 text-[10px] text-accent">
          <Check size={14} />
          <span>{t.form.selectedResult}:</span>
          <a
            href={selected.url}
            target="_blank"
            rel="noreferrer"
            className="underline decoration-accent/40 underline-offset-2"
          >
            {new URL(selected.url).hostname}
          </a>
        </p>
      )}

      <form
        className="mt-5 flex flex-col"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <label
          className="mb-1.5 text-[10px] font-semibold text-muted"
          htmlFor="subscription-name"
        >
          {t.form.name}
        </label>
        <input
          id="subscription-name"
          {...register("name")}
          className={`h-11 w-full rounded-lg border bg-bg px-3 text-base text-text outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-subtle focus:ring-2 focus:ring-accent/10 sm:text-xs ${errors.name ? "border-red-400" : "border-border focus:border-accent/70"}`}
          placeholder={t.form.namePlaceholder}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "name-error" : undefined}
        />
        {errors.name && (
          <span className="mb-2 mt-1 text-[10px] text-red-400" id="name-error">
            {t.form.errors.name}
          </span>
        )}
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div>
            <label
              className="mb-1.5 block text-[10px] font-semibold text-muted"
              htmlFor="subscription-price"
            >
              {t.form.price}{" "}
              <span className="font-normal text-subtle">
                ({t.form.currency})
              </span>
            </label>
            <div className="relative">
              <span
                className="absolute left-3 top-3 text-muted"
                aria-hidden="true"
              >
                $
              </span>
              <input
                id="subscription-price"
                type="number"
                min="0.01"
                step="0.01"
                placeholder="9.99"
                {...priceField}
                ref={(element) => {
                  priceField.ref(element);
                  priceInputRef.current = element;
                }}
                className={`h-11 w-full rounded-lg border bg-bg pl-7 pr-3 text-base text-text outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-subtle focus:ring-2 focus:ring-accent/10 sm:text-xs ${errors.price ? "border-red-400" : "border-border focus:border-accent/70"}`}
                aria-invalid={Boolean(errors.price)}
                aria-describedby={errors.price ? "price-error" : undefined}
              />
            </div>
            {errors.price && (
              <span
                className="mt-1 block text-[10px] text-red-400"
                id="price-error"
              >
                {t.form.errors.price}
              </span>
            )}
          </div>
          <div>
            <label
              className="mb-1.5 block text-[10px] font-semibold text-muted"
              htmlFor="subscription-period"
            >
              {t.form.period}
            </label>
            <Controller
              control={control}
              name="period"
              render={({ field }) => (
                <CustomDropdown<Period>
                  id="subscription-period"
                  label={t.form.period}
                  value={field.value}
                  onChange={field.onChange}
                  className="w-full"
                  options={[
                    { value: "monthly", label: t.form.monthly },
                    { value: "yearly", label: t.form.yearly },
                  ]}
                />
              )}
            />
          </div>
        </div>
        <label
          className="mb-1.5 mt-3 text-[10px] font-semibold text-muted"
          htmlFor="subscription-category"
        >
          {t.form.category}
        </label>
        <Controller
          control={control}
          name="category"
          render={({ field }) => (
            <CustomDropdown<Category>
              id="subscription-category"
              label={t.form.category}
              value={field.value}
              onChange={field.onChange}
              options={categories.map((category) => ({
                value: category,
                label: t.categories[category],
              }))}
            />
          )}
        />
        <button
          className="group mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 text-xs font-bold text-accent-ink transition-[transform,filter,box-shadow] duration-150 hover:-translate-y-0.5 hover:brightness-110 hover:shadow-lg hover:shadow-accent/15 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent disabled:cursor-wait disabled:opacity-60"
          type="submit"
          disabled={isSubmitting}
        >
          <Plus
            size={17}
            className="transition-transform group-hover:rotate-90"
          />
          {t.form.add}
        </button>
      </form>
    </section>
  );
}
