import { useEffect, useMemo, useState } from "react";
import {
  Link,
  useLocation,
  useSearchParams,
} from "react-router-dom";

import getServices, { matchServices } from "../api/services.api";

function initials(title = "") {
  return title
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 3)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function Services() {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const q = searchParams.get("q") || "";

  // Result passed from Home → Describe your goal
  const goal = location.state?.goal || "";
  const matchedServices = location.state?.matchedServices;

  const [allServices, setAllServices] = useState([]);
  const [matches, setMatches] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [inputValue, setInputValue] = useState(q);

  useEffect(() => {
    setInputValue(q);
  }, [q]);

  useEffect(() => {
    let cancelled = false;

    const loadServices = async () => {
      setLoading(true);
      setError("");

      try {
        /*
         * Home already called /services/match.
         * Use the result passed through router state.
         */
        if (matchedServices && !q) {
          if (!cancelled) {
            setMatches(matchedServices);
            setAllServices([]);
          }

          return;
        }

        /*
         * Search:
         * /services?q=passport
         */
        if (q) {
          const response = await matchServices(q);

          if (!cancelled) {
            setMatches(response.data || []);
            setAllServices([]);
          }

          return;
        }

        /*
         * All services:
         * /services
         */
        const response = await getServices(1, 50);

        if (!cancelled) {
          setMatches(null);
          setAllServices(response.data || []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.message ||
              "Failed to load services."
          );

          setMatches(null);
          setAllServices([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadServices();

    return () => {
      cancelled = true;
    };
  }, [q, matchedServices]);

  /*
   * Convert match response:
   *
   * {
   *   service: {...},
   *   score: 2
   * }
   *
   * into a normal service object.
   */
  const services = useMemo(() => {
    if (matches) {
      return matches
        .map((item) => {
          if (item?.service) {
            return {
              ...item.service,
              _score: item.score,
            };
          }

          return item;
        })
        .filter(Boolean);
    }

    return allServices;
  }, [matches, allServices]);

  const categories = useMemo(() => {
    return [
      ...new Set(
        services
          .map((service) => service.category)
          .filter(Boolean)
      ),
    ];
  }, [services]);

  const [selectedCategory, setSelectedCategory] =
    useState("all");

  const filteredServices = useMemo(() => {
    if (selectedCategory === "all") {
      return services;
    }

    return services.filter(
      (service) => service.category === selectedCategory
    );
  }, [services, selectedCategory]);

  const submitSearch = (e) => {
    e.preventDefault();

    const value = inputValue.trim();

    if (value) {
      setSearchParams({ q: value });
    } else {
      setSearchParams({});
    }
  };

  const clearSearch = () => {
    setInputValue("");
    setSearchParams({});
  };

  const isGoalResult =
    Boolean(goal && !q && matchedServices);

  return (
    <main className="min-h-screen">

      {/* HEADER */}
      <section className="border-b border-ink/15">
        <div className="mx-auto max-w-[1180px] px-6 pb-[30px] pt-[42px] md:px-12">

          <div className="max-w-[760px]">

            <div className="mb-[11px] font-mono text-[11px] uppercase tracking-[0.1em] text-crimson">
              {isGoalResult
                ? "Your results"
                : "Service directory"}
            </div>

            <h1 className="mb-[18px] text-[36px] font-bold leading-tight md:text-[48px]">
              {isGoalResult
                ? "Services that match your goal"
                : "Find a government service"}
            </h1>

            {isGoalResult ? (
              <div className="rounded-xl border border-crimson/20 bg-crimson-bg px-5 py-4">

                <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.1em] text-crimson">
                  You told us
                </div>

                <p className="text-[15px] leading-6 text-ink">
                  “{goal}”
                </p>

              </div>
            ) : (
              <p className="text-[15px] leading-6 text-ink-light">
                Search by service name or describe what you
                need. We’ll help you find the right government
                service.
              </p>
            )}
          </div>

          {/* SEARCH */}
          <form
            onSubmit={submitSearch}
            className="mt-[22px] max-w-[760px]"
          >
            <div className="flex overflow-hidden rounded-xl border border-ink/20 bg-white shadow-sm focus-within:border-crimson">

              <input
                type="text"
                value={inputValue}
                onChange={(e) =>
                  setInputValue(e.target.value)
                }
                placeholder="Search services..."
                className="min-w-0 flex-1 bg-transparent px-5 py-3.5 text-[14px] outline-none placeholder:text-ink/40"
              />

              {inputValue && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="px-3 text-sm text-ink/40 hover:text-ink"
                >
                  ×
                </button>
              )}

              <button
                type="submit"
                className="m-1 rounded-lg bg-crimson px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
              >
                Search
              </button>

            </div>
          </form>

        </div>
      </section>

      {/* SERVICE DIRECTORY */}
      <section>
        <div className="mx-auto max-w-[1180px] px-6 py-[30px] md:px-12">

          {/* FILTERS */}
          {!loading &&
            !error &&
            services.length > 0 && (
              <div className="mb-[22px] flex flex-wrap items-center gap-2">

                <button
                  type="button"
                  onClick={() =>
                    setSelectedCategory("all")
                  }
                  className={`rounded-full border px-4 py-2 text-[12px] font-medium transition ${
                    selectedCategory === "all"
                      ? "border-crimson bg-crimson text-white"
                      : "border-ink/15 bg-white text-ink-light hover:border-crimson/40"
                  }`}
                >
                  All services
                </button>

                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() =>
                      setSelectedCategory(category)
                    }
                    className={`rounded-full border px-4 py-2 text-[12px] font-medium transition ${
                      selectedCategory === category
                        ? "border-crimson bg-crimson text-white"
                        : "border-ink/15 bg-white text-ink-light hover:border-crimson/40"
                    }`}
                  >
                    {category}
                  </button>
                ))}

              </div>
            )}

          {/* RESULT COUNT */}
          {!loading && !error && (
            <div className="mb-[18px] flex items-center justify-between">

              <div>
                <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink/50">
                  {filteredServices.length}{" "}
                  {filteredServices.length === 1
                    ? "service"
                    : "services"}
                </span>

                {q && (
                  <span className="ml-2 text-sm text-ink-light">
                    matching “{q}”
                  </span>
                )}
              </div>

              {(q || isGoalResult) && (
                <Link
                  to="/services"
                  className="text-sm font-semibold text-crimson hover:underline"
                >
                  View all
                </Link>
              )}

            </div>
          )}

          {/* LOADING */}
          {loading && (
            <div className="grid gap-4 md:grid-cols-2">

              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="animate-pulse rounded-xl border border-ink/10 bg-white p-[22px]"
                >
                  <div className="mb-4 h-[42px] w-[42px] rounded-lg bg-paper-dim" />

                  <div className="mb-3 h-5 w-2/3 rounded bg-paper-dim" />

                  <div className="h-4 w-full rounded bg-paper-dim" />

                  <div className="mt-2 h-4 w-4/5 rounded bg-paper-dim" />

                  <div className="mt-5 h-3 w-1/2 rounded bg-paper-dim" />
                </div>
              ))}

            </div>
          )}

          {/* ERROR */}
          {!loading && error && (
            <div className="rounded-xl border border-crimson/20 bg-crimson-bg p-[22px]">

              <h2 className="mb-2 text-lg font-bold text-crimson">
                Something went wrong
              </h2>

              <p className="text-sm text-ink-light">
                {error}
              </p>

              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-4 rounded-lg bg-crimson px-4 py-2 text-sm font-semibold text-white"
              >
                Try again
              </button>

            </div>
          )}

          {/* EMPTY */}
          {!loading &&
            !error &&
            filteredServices.length === 0 && (
              <div className="rounded-xl border border-ink/15 bg-white px-6 py-[50px] text-center">

                <div className="mb-3 text-3xl">
                  🔎
                </div>

                <h2 className="mb-2 text-xl font-bold">
                  No services found
                </h2>

                <p className="mx-auto max-w-[500px] text-sm leading-6 text-ink-light">
                  We couldn't find a matching government
                  service. Try using different words or browse
                  all available services.
                </p>

                <Link
                  to="/services"
                  className="mt-5 inline-block rounded-lg bg-crimson px-5 py-3 text-sm font-semibold text-white"
                >
                  Browse all services
                </Link>

              </div>
            )}

          {/* SERVICE CARDS */}
          {!loading &&
            !error &&
            filteredServices.length > 0 && (
              <div className="grid gap-4 md:grid-cols-2">

                {filteredServices.map((service) => (
                  <Link
                    key={service._id}
                    to={`/services/${service._id}`}
                    className="group rounded-xl border border-ink/15 bg-white p-[22px] transition hover:-translate-y-0.5 hover:border-crimson/40 hover:shadow-sm"
                  >

                    {/* TOP */}
                    <div className="flex items-start justify-between gap-4">

                      <div className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-lg bg-crimson-bg font-mono text-[12px] font-semibold text-crimson">
                        {initials(service.title)}
                      </div>

                      {service._score !== undefined && (
                        <span className="font-mono text-[10px] text-ink/40">
                          Match {service._score}
                        </span>
                      )}

                    </div>

                    {/* TITLE */}
                    <h2 className="mt-[18px] mb-2 text-[19px] font-bold leading-snug group-hover:text-crimson">
                      {service.title}
                    </h2>

                    {/* DESCRIPTION */}
                    <p className="mb-4 line-clamp-3 text-[13px] leading-5 text-ink-light">
                      {service.description}
                    </p>

                    {/* CATEGORY */}
                    {service.category && (
                      <div className="mb-4">
                        <span className="rounded-full bg-paper-dim px-3 py-1 font-mono text-[10px] uppercase tracking-[0.05em] text-ink/60">
                          {service.category}
                        </span>
                      </div>
                    )}

                    {/* SERVICE INFO */}
                    <div className="grid grid-cols-2 gap-3 border-t border-ink/10 pt-4">

                      <div>
                        <div className="font-mono text-[9px] uppercase tracking-[0.08em] text-ink/40">
                          Fee
                        </div>

                        <div className="mt-1 text-[12px] font-semibold text-ink">
                          {service.fee === 0
                            ? "Free"
                            : `Rs. ${service.fee}`}
                        </div>
                      </div>

                      <div>
                        <div className="font-mono text-[9px] uppercase tracking-[0.08em] text-ink/40">
                          Processing
                        </div>

                        <div className="mt-1 text-[12px] font-semibold text-ink">
                          {service.processingTime ||
                            "—"}
                        </div>
                      </div>

                      <div>
                        <div className="font-mono text-[9px] uppercase tracking-[0.08em] text-ink/40">
                          Delivery
                        </div>

                        <div className="mt-1 text-[12px] font-semibold text-ink">
                          {service.deliveryMode ||
                            "—"}
                        </div>
                      </div>

                      <div className="flex items-end justify-end">
                        <span className="text-sm font-semibold text-crimson">
                          View details →
                        </span>
                      </div>

                    </div>

                  </Link>
                ))}

              </div>
            )}

        </div>
      </section>
    </main>
  );
}

export default Services;