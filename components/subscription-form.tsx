"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Check,
  ChevronDown,
  LoaderCircle,
  Plus,
  Search,
  X,
} from "lucide-react";
import { type FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
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
import { useI18n } from "./i18n-provider";

const schema = z.object({
  name: z.string().trim().min(2),
  price: z.number().positive(),
  period: z.enum(["monthly", "yearly"]),
  category: z.enum(categories),
});

type FormValues = z.infer<typeof schema>;

type Props = {
  onAdd: (item: Subscription) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
};

export function SubscriptionForm({ onAdd, inputRef }: Props) {
  const { t } = useI18n();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selected, setSelected] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState(false);
  const debounced = useDebounce(query, 500);
  const controllerRef = useRef<AbortController | null>(null);

  const {
    register,
    handleSubmit,
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

  const nameField = useMemo(() => register("name"), [register]);

  useEffect(() => {
    if (debounced.trim().length < 2) {
      setResults([]);
      setLoading(false);
      setSearchError(false);

      return;
    }

    const controller = new AbortController();

    controllerRef.current?.abort();
    controllerRef.current = controller;

    setLoading(true);
    setSearchError(false);
    searchWeb(debounced.trim(), controller.signal)
      .then(setResults)
      .catch((error: unknown) => {
        if (error instanceof Error && error.name !== "AbortError") {
          setSearchError(true);
          setResults([]);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [debounced]);

  const onSubmit: SubmitHandler<FormValues> = (values) => {
    onAdd({
      ...values,
      id: crypto.randomUUID(),
      category: values.category as Category,
      period: values.period as Period,
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
    setSelected(result);
    setValue("name", result.title, { shouldValidate: true });

    try {
      const host = new URL(result.url).hostname;
      if (/netflix|disney|hulu|primevideo|hbo|paramount/i.test(host)) {
        setValue("category", "Streaming");
      } else if (/spotify|apple\.com/i.test(host)) {
        setValue("category", "Music");
      } else if (/adobe|figma|notion|slack|microsoft/i.test(host)) {
        setValue("category", "Software");
      }
    } catch {}

    setQuery(result.title);
    setResults([]);
  }

  function handleSearchInput(event: FormEvent<HTMLInputElement>) {
    setQuery(event.currentTarget.value);
    setSelected(null);
  }

  return (
    <section className="form-panel" aria-labelledby="form-heading">
      <div className="section-heading">
        <div>
          <p className="eyebrow">01 / ADD A CHARGE</p>
          <h2 id="form-heading">{t.search}</h2>
        </div>
        <span className="step-number">01</span>
      </div>
      <div className="search-wrap">
        <Search size={17} aria-hidden="true" className="input-icon" />
        <input
          ref={inputRef}
          className="field search-field"
          type="search"
          placeholder={t.searchHint}
          value={query}
          onInput={handleSearchInput}
          aria-label={t.search}
          aria-controls="search-results"
          aria-expanded={results.length > 0}
          autoComplete="off"
        />
        {loading && (
          <LoaderCircle
            className="spin input-trailing"
            size={17}
            aria-label="Loading"
          />
        )}
        {query && (
          <button
            type="button"
            className="icon-button clear-search"
            aria-label={t.cancel}
            onClick={() => {
              setQuery("");
              setSelected(null);
              setResults([]);
            }}
          >
            <X size={15} />
          </button>
        )}
        {(results.length > 0 || searchError) && (
          <ul
            id="search-results"
            className="search-results"
            role="listbox"
            aria-label={t.found}
          >
            {searchError ? (
              <li className="result-empty">Search is unavailable right now.</li>
            ) : (
              results.map((result) => (
                <li key={result.url}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={selected?.url === result.url}
                    className="search-result"
                    onClick={() => chooseResult(result)}
                  >
                    <span className="result-title">{result.title}</span>
                    <span className="result-description">
                      {result.description}
                    </span>
                    <span className="result-url">{result.url}</span>
                  </button>
                </li>
              ))
            )}
          </ul>
        )}
      </div>
      {selected && (
        <p className="selected-result">
          <Check size={14} /> {t.chooseResult}:{" "}
          <a href={selected.url} target="_blank" rel="noreferrer">
            {new URL(selected.url).hostname}
          </a>
        </p>
      )}
      <form
        className="subscription-form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <label className="field-label" htmlFor="subscription-name">
          {t.name}
        </label>
        <input
          id="subscription-name"
          {...nameField}
          className={`field${errors.name ? " field-error" : ""}`}
          placeholder="e.g. Netflix"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "name-error" : undefined}
        />
        {errors.name && (
          <span className="error-text" id="name-error">
            {t.errors.name}
          </span>
        )}
        <div className="form-grid">
          <div>
            <label className="field-label" htmlFor="subscription-price">
              {t.price} <span className="muted">(USD)</span>
            </label>
            <div className="price-field">
              <span aria-hidden="true">$</span>
              <input
                id="subscription-price"
                type="number"
                min="0.01"
                step="0.01"
                placeholder="9.99"
                {...register("price", { valueAsNumber: true })}
                className={`field${errors.price ? " field-error" : ""}`}
                aria-invalid={Boolean(errors.price)}
                aria-describedby={errors.price ? "price-error" : undefined}
              />
            </div>
            {errors.price && (
              <span className="error-text" id="price-error">
                {t.errors.price}
              </span>
            )}
          </div>
          <div>
            <label className="field-label" htmlFor="subscription-period">
              {t.period}
            </label>
            <div className="select-wrap">
              <select
                id="subscription-period"
                {...register("period")}
                className="field select-field"
              >
                <option value="monthly">{t.monthly}</option>
                <option value="yearly">{t.yearly}</option>
              </select>
              <ChevronDown size={15} />
            </div>
          </div>
        </div>
        <label className="field-label" htmlFor="subscription-category">
          {t.category}
        </label>
        <div className="select-wrap">
          <select
            id="subscription-category"
            {...register("category")}
            className="field select-field"
          >
            {categories.map((category) => (
              <option value={category} key={category}>
                {category}
              </option>
            ))}
          </select>
          <ChevronDown size={15} />
        </div>
        <button
          className="button button-primary submit-button"
          type="submit"
          disabled={isSubmitting}
        >
          <Plus size={17} />
          {t.add}
        </button>
      </form>
    </section>
  );
}
