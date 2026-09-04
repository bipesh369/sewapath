import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { getServiceById } from "../api/services.api";
import { saveService } from "../api/savedServices.api";

import Button from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";

function ServiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saveState, setSaveState] = useState("idle");

  useEffect(() => {
    let cancelled = false;

    const loadService = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await getServiceById(id);

        if (!cancelled) {
          setService(response.data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.message ||
              "Failed to load service"
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadService();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleSave = async () => {
    if (!isAuthenticated) {
      navigate("/login", {
        state: {
          from: {
            pathname: `/services/${id}`,
          },
        },
      });

      return;
    }

    setSaveState("saving");

    try {
      await saveService(id);
      setSaveState("saved");
    } catch (err) {
      setSaveState(
        err.response?.status === 409
          ? "saved"
          : "error"
      );
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <div className="text-sm text-ink/60">
          Loading service…
        </div>
      </main>
    );
  }

  if (error || !service) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center px-6">
        <div className="text-center">
          <h1 className="mb-2 text-xl font-bold">
            Service not found
          </h1>

          <p className="text-sm text-ink/60">
            {error || "This service could not be found."}
          </p>

          <button
            type="button"
            onClick={() => navigate("/services")}
            className="mt-5 rounded-lg bg-crimson px-5 py-3 text-sm font-semibold text-white"
          >
            Back to services
          </button>
        </div>
      </main>
    );
  }

  const mode = (service.deliveryMode || "").toLowerCase();

  const isOffice =
    mode.includes("office") ||
    mode.includes("in-person") ||
    mode.includes("person");

  const isOnline = mode.includes("online");

  const requiredDocs = service.requiredDocuments || [];

  return (
    <main>
      <div className="mx-auto max-w-[900px] px-6 pb-[90px] pt-9 md:px-12">

        {/* BACK */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-[22px] cursor-pointer font-mono text-[13px] text-ink/60 hover:text-ink"
        >
          ← Back to results
        </button>

        {/* SERVICE HEADER */}
        <div className="mb-8 flex flex-col gap-6 border-b border-ink/15 pb-7 md:flex-row md:items-start md:justify-between">

          {/* LEFT */}
          <div>

            <div className="font-mono text-xs font-bold uppercase tracking-[0.08em] text-crimson">
              {service.category || "Government service"}
            </div>

            <h1 className="my-1.5 text-[26px] font-bold md:text-[31px]">
              {service.title}
            </h1>

            {/* OFFICIAL URL */}
            <div className="text-sm text-ink/60">
              {service.officialUrl ? (
                <a
                  href={service.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-ink"
                >
                  Official service page ↗
                </a>
              ) : (
                "Administered by a government office"
              )}
            </div>

            {/* DELIVERY MODE */}
            <div className="mt-3.5 flex flex-wrap gap-2.5">

              {isOffice && (
                <div className="flex items-center gap-1.5 rounded-lg bg-crimson-bg px-[13px] py-[7px] text-[12.5px] font-semibold text-crimson">
                  🏢 Office visit required
                </div>
              )}

              {isOnline && (
                <div className="flex items-center gap-1.5 rounded-lg bg-paper-dim px-[13px] py-[7px] text-[12.5px] font-semibold text-ink">
                  🖥 Apply online
                </div>
              )}

              {!isOffice && !isOnline && service.deliveryMode && (
                <div className="rounded-lg bg-paper-dim px-[13px] py-[7px] text-[12.5px] font-semibold text-ink">
                  {service.deliveryMode}
                </div>
              )}

            </div>
          </div>

          {/* RIGHT */}
          <div className="shrink-0 text-left md:text-right">

            {/* FEE */}
            <div className="font-display text-2xl font-extrabold md:text-[26px]">
              {service.fee > 0
                ? `₹ ${service.fee}`
                : "Free"}
            </div>

            <div className="text-xs text-ink/60">
              standard fee · {service.processingTime}
            </div>

            {/* ACTIONS */}
            <div className="mt-3.5 flex gap-3 md:justify-end">

              <Button
                variant="ghost"
                size="sm"
                onClick={handleSave}
                disabled={saveState === "saving"}
              >
                {saveState === "saved"
                  ? "Saved ✓"
                  : saveState === "saving"
                    ? "Saving…"
                    : "Save"}
              </Button>

              <Button
                as={Link}
                to={`/services/${id}/eligibility`}
                variant="gold"
                size="sm"
              >
                Check eligibility
              </Button>

            </div>

            {saveState === "error" && (
              <p className="mt-1.5 text-xs text-crimson">
                Couldn’t save — try again.
              </p>
            )}

          </div>
        </div>

        {/* CONTENT */}
        <div className="grid grid-cols-1 gap-11 md:grid-cols-[1.4fr_1fr]">

          {/* LEFT COLUMN */}
          <div>

            {/* ABOUT */}
            <section>
              <h2 className="mb-3.5 text-[16.5px] font-bold">
                About this service
              </h2>

              <p className="text-[14.5px] leading-[1.7] text-ink-light">
                {service.description}
              </p>
            </section>

            {/* SNAPSHOT */}
            <section>
              <h2 className="mt-[34px] mb-3.5 text-[16.5px] font-bold">
                Service snapshot
              </h2>

              <ul className="m-0 list-none p-0">

                <li className="flex gap-2.5 border-b border-paper-dim py-2.5 text-[14.5px] text-ink-light">
                  <span className="font-bold text-ink">
                    ✓
                  </span>

                  <span>
                    Category:{" "}
                    {service.category || "General"}
                  </span>
                </li>

                <li className="flex gap-2.5 border-b border-paper-dim py-2.5 text-[14.5px] text-ink-light">
                  <span className="font-bold text-ink">
                    ✓
                  </span>

                  <span>
                    Processing time:{" "}
                    {service.processingTime || "—"}
                  </span>
                </li>

                <li className="flex gap-2.5 border-b border-paper-dim py-2.5 text-[14.5px] text-ink-light">
                  <span className="font-bold text-ink">
                    ✓
                  </span>

                  <span>
                    Delivery mode:{" "}
                    {service.deliveryMode || "—"}
                  </span>
                </li>

                <li className="flex gap-2.5 py-2.5 text-[14.5px] text-ink-light">
                  <span className="font-bold text-ink">
                    ✓
                  </span>

                  <span>
                    Fee:{" "}
                    {service.fee > 0
                      ? `₹ ${service.fee}`
                      : "Free"}
                  </span>
                </li>

              </ul>
            </section>
          </div>

          {/* RIGHT COLUMN */}
          <div>

            {/* DOCUMENTS */}
            <h2 className="mb-3.5 text-[16.5px] font-bold">
              What you’ll need
            </h2>

            {requiredDocs.length === 0 ? (
              <p className="text-[13.5px] text-ink/60">
                No documents have been listed for this
                service yet.
              </p>
            ) : (
              requiredDocs.map((doc) => (
                <div
                  key={doc._id}
                  className="mb-3.5 rounded-xl bg-paper-dim px-5 py-[18px]"
                >
                  <h3 className="mb-2 flex items-center gap-2 text-[13.5px] font-semibold">

                    {doc.label?.en ||
                      doc.label ||
                      "Required document"}

                    {doc.mandatory && (
                      <span className="rounded-full bg-crimson-bg px-2 py-0.5 text-[10.5px] font-semibold text-crimson">
                        Required
                      </span>
                    )}

                  </h3>

                  {doc.notes?.en && (
                    <p className="m-0 text-[13.5px] leading-[1.6] text-ink-light">
                      {doc.notes.en}
                    </p>
                  )}
                </div>
              ))
            )}

            {/* JOURNEY */}
            <Button
              as={Link}
              to={`/services/${id}/journey`}
              variant="ghost"
              size="sm"
              className="mt-2 w-full"
            >
              View the typical journey
            </Button>

          </div>
        </div>
      </div>
    </main>
  );
}

export default ServiceDetails;