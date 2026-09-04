import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import getServices, { matchServices } from "../api/services.api";

function initials(title = "") {
  return title
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 3)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

const JURISDICTIONS = ["Federal office", "Provincial office", "Ward / local office"];

function Services() {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get("q") || "";

  const [allServices, setAllServices] = useState([]);
  const [matches, setMatches] = useState(null); // [{service, score}] when a search term is active
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [modeFilter, setModeFilter] = useState({ online: true, office: true });
  const [jurisdiction, setJurisdiction] = useState(JURISDICTIONS[0]);
  const [inputValue, setInputValue] = useState(q);

  useEffect(() => {
    setLoading(true);
    setError("");

    if (q) {
      matchServices(q)
        .then((res) => setMatches(res.data))
        .catch((err) =>
          setError(err.response?.data?.message || "Failed to match services")
        )
        .finally(() => setLoading(false));
    } else {
      setMatches(null);
      getServices(1, 50)
        .then((res) => setAllServices(res.data))
        .catch((err) =>
          setError(err.response?.data?.message || "Failed to load services")
        )
        .finally(() => setLoading(false));
    }
  }, [q]);

  const baseList = useMemo(
    () => (matches ? matches.map((m) => ({ ...m.service, _score: m.score })) : allServices),
    [matches, allServices]
  );

  const categories = useMemo(() => {
    const set = new Set(baseList.map((s) => s.category).filter(Boolean));
    return Array.from(set);
  }, [baseList]);

  const toggleCategory = (cat) =>
    setSelectedCategories((list) =>
      list.includes(cat) ? list.filter((c) => c !== cat) : [...list, cat]
    );

  const results = useMemo(() => {
    let list = baseList;

    if (selectedCategories.length > 0) {
      list = list.filter((s) => selectedCategories.includes(s.category));
    }

    list = list.filter((s) => {
      const mode = (s.deliveryMode || "").toLowerCase();
      const isOnline = mode.includes("online");
      const isOffice =
        mode.includes("office") || mode.includes("in-person") || mode.includes("person");
      if (isOnline && !modeFilter.online && !isOffice) return false;
      if (isOffice && !modeFilter.office && !isOnline) return false;
      return true;
    });

    if (matches) {
      list = [...list].sort((a, b) => (b._score ?? 0) - (a._score ?? 0));
    }

    return list;
  }, [baseList, selectedCategories, modeFilter, matches]);

  const headline = q
    ? `${results.length} services match "${q}"`
    : `${results.length} services available`;

  const submitSearch = (e) => {
    e.preventDefault();
    setSearchParams(inputValue.trim() ? { q: inputValue.trim() } : {});
  };

  return (
    <div>
      <div className="flex flex-col items-center gap-3 border-b border-ink/15 px-6 py-4 md:flex-row md:justify-center md:gap-6 md:px-12">
        <form onSubmit={submitSearch} className="flex w-full max-w-560px gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder='"renew my passport" or "citizenship certificate"'
            className="flex-1 rounded-[9px] border-[1.5px] border-ink/15 px-4 py-2.5 text-sm outline-none focus:border-crimson"
          />
          <button type="submit" className="rounded-[9px] bg-ink px-5 text-[13px] font-semibold text-paper">
            Search
          </button>
        </form>
      </div>

      <div className="mx-auto grid max-w-1180px grid-cols-1 gap-8 px-6 py-8 md:grid-cols-[220px_1fr] md:px-12">
        <aside className="border-ink/15 pr-0 md:border-r md:pr-8">
          <h3 className="mt-0 mb-3 text-[11.5px] font-bold tracking-[0.08em] text-ink/60 uppercase">
            Category
          </h3>
          {categories.length === 0 && (
            <p className="text-[12.5px] text-ink/50">No categories yet</p>
          )}
          {categories.map((cat) => (
            <label key={cat} className="mb-2.5 flex items-center gap-2 text-sm text-ink-light">
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat)}
                onChange={() => toggleCategory(cat)}
                className="accent-crimson"
              />
              {cat}
            </label>
          ))}

          <h3 className="mt-22px mb-3 text-[11.5px] font-bold tracking-[0.08em] text-ink/60 uppercase">
            Delivery mode
          </h3>
          <label className="mb-2.5 flex items-center gap-2 text-sm text-ink-light">
            <input
              type="checkbox"
              checked={modeFilter.online}
              onChange={() => setModeFilter((m) => ({ ...m, online: !m.online }))}
              className="accent-crimson"
            />
            Online (Nagarik App / portal)
          </label>
          <label className="mb-2.5 flex items-center gap-2 text-sm text-ink-light">
            <input
              type="checkbox"
              checked={modeFilter.office}
              onChange={() => setModeFilter((m) => ({ ...m, office: !m.office }))}
              className="accent-crimson"
            />
            Physical office visit
          </label>

          <h3 className="mt-22px mb-3 text-[11.5px] font-bold tracking-[0.08em] text-ink/60 uppercase">
            Jurisdiction
          </h3>
          {JURISDICTIONS.map((j) => (
            <label key={j} className="mb-2.5 flex items-center gap-2 text-sm text-ink-light">
              <input
                type="radio"
                name="jurisdiction"
                checked={jurisdiction === j}
                onChange={() => setJurisdiction(j)}
                className="accent-crimson"
              />
              {j}
            </label>
          ))}
        </aside>

        <div className="md:pl-8">
          <div className="mb-18px flex items-baseline justify-between">
            <h2 className="text-[19px]">{loading ? "Searching…" : headline}</h2>
            {matches && (
              <span className="font-mono text-[12.5px] text-ink/60">SORTED BY MATCH %</span>
            )}
          </div>

          {error && <p className="text-clay">{error}</p>}

          {!loading && results.length === 0 && !error && (
            <p className="text-ink/60">No services matched. Try a different search term.</p>
          )}

          <div className="flex flex-col gap-13px">
            {results.map((service) => {
              const mode = (service.deliveryMode || "").toLowerCase();
              const isOffice =
                mode.includes("office") || mode.includes("in-person") || mode.includes("person");
              const matchPct =
                matches && service._score != null
                  ? Math.max(35, Math.min(99, 50 + service._score * 12))
                  : null;

              return (
                <Link
                  key={service._id}
                  to={`/services/${service._id}`}
                  className="flex cursor-pointer gap-18px rounded-xl border-[1.5px] border-ink/15 bg-white p-5 no-underline transition-colors hover:border-ink/40"
                >
                  <div className="flex h-42px w-42px shrink-0 items-center justify-center rounded-[9px] bg-ink font-display text-[16px] font-bold text-marigold-light">
                    {initials(service.title)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="mb-1 text-base">{service.title}</h3>
                        <div className="mb-7px font-mono text-[12.5px] text-ink/60">
                          {service.category || "Government service"}
                        </div>
                      </div>
                      {matchPct && (
                        <span className="shrink-0 whitespace-nowrap rounded-[20px] bg-moss-bg px-3 py-1.5 font-mono text-xs font-semibold text-moss">
                          {matchPct}% match
                        </span>
                      )}
                    </div>
                    <p className="mb-11px max-w-500px text-[13.5px] leading-[1.55] text-ink-light">
                      {service.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span
                        className={`rounded-xl px-2.5 py-1 text-[11.5px] ${
                          isOffice
                            ? "bg-crimson-bg font-semibold text-crimson-dark"
                            : "bg-moss-bg font-semibold text-moss"
                        }`}
                      >
                        {isOffice ? "🏢 Office visit required" : "🖥 Apply online"}
                      </span>
                      <span className="rounded-xl bg-paper-dim px-2.5 py-1 text-[11.5px] text-ink/60">
                        {service.processingTime}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Services;
