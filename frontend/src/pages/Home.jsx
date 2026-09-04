import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Chip from "../components/ui/Chip";
import getServices from "../api/services.api";

const CATEGORIES = [
  {
    icon: "🪪",
    title: "Citizenship & national ID",
    desc: "Citizenship certificate, national ID card, and duplicate copies.",
    query: "citizenship",
  },
  {
    icon: "📘",
    title: "Passport",
    desc: "New passport, renewal, and lost-document replacement.",
    query: "passport",
  },
  {
    icon: "🚘",
    title: "Driving licence",
    desc: "New licence, renewal, and category upgrades.",
    query: "driving licence",
  },
  {
    icon: "🏡",
    title: "Land & property",
    desc: "Land registration, ownership transfer, and record correction.",
    query: "land",
  },
  {
    icon: "🏢",
    title: "Business registration",
    desc: "Company registration, PAN, and renewal of trade licences.",
    query: "business",
  },
  {
    icon: "👵",
    title: "Social security",
    desc: "Senior citizen allowance, widow allowance, and disability support.",
    query: "social security",
  },
];

const FLOW = [
  { icon: "💬", label: "What do you need?" },
  { icon: "🔍", label: "Service matching" },
  { icon: "✅", label: "Eligibility check" },
  { icon: "📋", label: "Document checklist" },
  { icon: "🎯", label: "Personalized journey" },
  { icon: "🗂️", label: "Online or office" },
];

function Home() {
  const navigate = useNavigate();

  const [tab, setTab] = useState("search");
  const [searchText, setSearchText] = useState("");
  const [goalText, setGoalText] = useState("");
  const [totalServices, setTotalServices] = useState(null);

  useEffect(() => {
    getServices(1, 1)
      .then((res) => {
        setTotalServices(res.pagination?.total ?? null);
      })
      .catch(() => {
        setTotalServices(null);
      });
  }, []);

  const submitSearch = (e) => {
    e.preventDefault();

    if (searchText.trim()) {
      navigate(
        `/services?q=${encodeURIComponent(searchText.trim())}`
      );
    } else {
      navigate("/services");
    }
  };

  const submitGoal = (e) => {
    e.preventDefault();

    if (goalText.trim()) {
      navigate(
        `/services?goal=${encodeURIComponent(goalText.trim())}`
      );
    } else {
      navigate("/services");
    }
  };

  return (
    <>
      {/* Hero */}
      <div className="mx-auto max-w-[1180px] px-6 pt-16 pb-10 text-center md:px-12 md:pt-[72px]">
        <div className="mb-4 font-mono text-[12.5px] font-semibold uppercase tracking-[0.12em] text-crimson">
          {totalServices ?? "312"} government services · All 7 provinces
        </div>

        <h1 className="mx-auto mb-[18px] max-w-[760px] text-[32px] leading-[1.15] md:text-[46px]">
          Tell us what you want to accomplish.
          <br />
          We&rsquo;ll show you how to do it.
        </h1>

        <p className="mx-auto mb-9 max-w-[540px] text-[17px] leading-[1.6] text-ink/60">
          SewaPath turns any government office visit, passport,
          citizenship, land, license, into a clear, personal,
          step-by-step journey.
        </p>

        {/* Search box */}
        <div className="mx-auto mb-6 max-w-[660px] overflow-hidden rounded-2xl border-[1.5px] border-ink/15 bg-white shadow-[0_10px_28px_rgba(34,48,63,0.08)]">
          <div className="flex border-b border-ink/15">
            <button
              type="button"
              onClick={() => setTab("search")}
              className={`flex-1 border-b-2 py-3.5 text-[13.5px] font-semibold ${
                tab === "search"
                  ? "border-crimson bg-crimson-bg text-crimson"
                  : "border-transparent text-ink/60"
              }`}
            >
              🔍 Search a service
            </button>

            <button
              type="button"
              onClick={() => setTab("describe")}
              className={`flex-1 border-b-2 py-3.5 text-[13.5px] font-semibold ${
                tab === "describe"
                  ? "border-crimson bg-crimson-bg text-crimson"
                  : "border-transparent text-ink/60"
              }`}
            >
              💬 Describe your goal
            </button>
          </div>

          {tab === "search" ? (
            <form onSubmit={submitSearch} className="flex gap-2 p-2">
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder='Try "renew my passport" or "citizenship certificate"'
                className="min-w-0 flex-1 border-none bg-transparent px-4 py-3.5 text-[15px] outline-none"
              />

              <button
                type="submit"
                className="rounded-[9px] bg-ink px-6 text-[14px] font-semibold text-paper"
              >
                Search
              </button>
            </form>
          ) : (
            <form onSubmit={submitGoal} className="flex gap-2 p-2">
              <input
                type="text"
                value={goalText}
                onChange={(e) => setGoalText(e.target.value)}
                placeholder='e.g. "I lost my citizenship certificate and need a new one"'
                className="min-w-0 flex-1 border-none bg-transparent px-4 py-3.5 text-[15px] outline-none"
              />

              <button
                type="submit"
                className="rounded-[9px] bg-ink px-6 text-[14px] font-semibold text-paper"
              >
                Find my path
              </button>
            </form>
          )}
        </div>

        {/* Category chips */}
        <div className="mb-12 flex flex-wrap justify-center gap-2.5 md:mb-[52px]">
          {CATEGORIES.map((category) => (
            <Chip
              key={category.title}
              onClick={() =>
                navigate(
                  `/services?q=${encodeURIComponent(category.query)}`
                )
              }
            >
              {category.icon} {category.title}
            </Chip>
          ))}
        </div>
      </div>

      {/* How SewaPath works */}
      <div className="mx-auto max-w-[1000px] px-6 pb-16 md:px-12 md:pb-[90px]">
        <div className="mb-7 text-center font-mono text-xs uppercase tracking-[0.1em] text-ink/60">
          How SewaPath works
        </div>

        <div className="flex flex-wrap items-center justify-between gap-1">
          {FLOW.map((step, index) => (
            <div
              key={step.label}
              className="flex flex-1 items-center"
            >
              <div className="flex flex-1 flex-col items-center gap-2">
                <div
                  className={`flex h-[34px] w-[34px] items-center justify-center rounded-[10px] border-[1.5px] text-[15px] ${
                    index === 0
                      ? "border-crimson bg-crimson text-paper"
                      : "border-ink/15 bg-paper-dim"
                  }`}
                >
                  {step.icon}
                </div>

                <div className="max-w-[90px] text-center text-xs font-semibold leading-[1.3] text-ink-light">
                  {step.label}
                </div>
              </div>

              {index < FLOW.length - 1 && (
                <div className="mx-1 mb-[26px] h-0.5 w-7 shrink-0 bg-ink/15" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="mx-auto mb-16 grid max-w-[880px] grid-cols-1 gap-px overflow-hidden rounded-[14px] bg-ink/15 md:mb-[90px] md:grid-cols-3">
        <div className="bg-white p-[30px] text-center">
          <div className="font-display text-[32px] font-extrabold text-crimson">
            {totalServices ?? "312"}
          </div>

          <div className="mt-1.5 text-[13px] text-ink/60">
            services across federal, provincial & local offices
          </div>
        </div>

        <div className="bg-white p-[30px] text-center">
          <div className="font-display text-[32px] font-extrabold text-crimson">
            4 min
          </div>

          <div className="mt-1.5 text-[13px] text-ink/60">
            average eligibility check
          </div>
        </div>

        <div className="bg-white p-[30px] text-center">
          <div className="font-display text-[32px] font-extrabold text-crimson">
            निःशुल्क
          </div>

          <div className="mt-1.5 text-[13px] text-ink/60">
            SewaPath itself is always free to use
          </div>
        </div>
      </div>

      {/* Browse by category */}
      <div className="mx-auto max-w-[1080px] px-6 pb-16 md:px-12 md:pb-[90px]">
        <h2 className="mb-2 text-[27px]">
          Browse by category
        </h2>

        <p className="mb-8 text-[15px] text-ink/60">
          Every service is verified against current office rules
          and updated monthly.
        </p>

        <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((category) => (
            <button
              key={category.title}
              type="button"
              onClick={() =>
                navigate(
                  `/services?q=${encodeURIComponent(category.query)}`
                )
              }
              className="rounded-xl border-[1.5px] border-ink/15 bg-white p-[22px] text-left transition-all hover:-translate-y-0.5 hover:border-marigold hover:shadow-[0_10px_24px_rgba(34,48,63,0.08)]"
            >
              <div className="mb-3.5 flex h-[38px] w-[38px] items-center justify-center rounded-[9px] bg-paper-dim text-lg">
                {category.icon}
              </div>

              <h3 className="mb-1.5 text-[15.5px]">
                {category.title}
              </h3>

              <p className="text-[13.5px] leading-[1.5] text-ink/60">
                {category.desc}
              </p>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

export default Home;