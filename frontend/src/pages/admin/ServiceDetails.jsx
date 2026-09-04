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
  const [saveState, setSaveState] = useState("idle"); // idle | saving | saved | error

  useEffect(() => {
    getServiceById(id)
      .then((res) => setService(res.data))
      .catch((err) =>
        setError(err.response?.data?.message || "Failed to load service")
      )
      .finally(() => setLoading(false));
  }, [id]);

  const handleSave = async () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: { pathname: `/services/${id}` } } });
      return;
    }
    setSaveState("saving");
    try {
      await saveService(id);
      setSaveState("saved");
    } catch (err) {
      // Already-saved isn't really an error from the user's perspective.
      setSaveState(err.response?.status === 409 ? "saved" : "error");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-ink/60">
        Loading service…
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-clay">
        {error || "Service not found"}
      </div>
    );
  }

  const mode = (service.deliveryMode || "").toLowerCase();
  const isOffice =
    mode.includes("office") || mode.includes("in-person") || mode.includes("person");
  const isOnline = mode.includes("online");

  // A generic, sensible eligibility summary derived from what the backend
  // actually stores (services don't have a free-text eligibility blurb).
  const requiredDocs = service.requiredDocuments || [];

  return (
    <div className="mx-auto max-w-900px px-6 pt-9 pb-90px md:px-12">
      <div
        onClick={() => navigate(-1)}
        className="mb-22px cursor-pointer font-mono text-[13px] text-ink/60"
      >
        ← Back to results
      </div>

      <div className="mb-8 flex flex-col gap-6 border-b border-ink/15 pb-7 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="font-mono text-xs font-bold tracking-[0.08em] text-crimson uppercase">
            {service.category || "Government service"}
          </div>
          <h1 className="my-1.5 text-[26px] md:text-[31px]">{service.title}</h1>
          <div className="text-sm text-ink/60">
            {service.officialUrl ? (
              <a href={service.officialUrl} target="_blank" rel="noopener noreferrer" className="underline">
                Official service page ↗
              </a>
            ) : (
              "Administered by a government office"
            )}
          </div>
          <div className="mt-3.5 flex gap-2.5">
            {isOffice && (
              <div className="flex items-center gap-1.5 rounded-lg bg-crimson-bg px-13px py-7px text-[12.5px] font-semibold text-crimson-dark">
                🏢 Office visit required
              </div>
            )}
            {isOnline && (
              <div className="flex items-center gap-1.5 rounded-lg bg-moss-bg px-13px py-7px text-[12.5px] font-semibold text-moss">
                🖥 Apply online
              </div>
            )}
          </div>
        </div>

        <div className="shrink-0 text-left md:text-right">
          <div className="font-display text-2xl font-extrabold md:text-[26px]">
            {service.fee > 0 ? `₹ ${service.fee}` : "Free"}
          </div>
          <div className="text-xs text-ink/60">
            standard fee · {service.processingTime}
          </div>
          <div className="mt-3.5 flex gap-3 md:justify-end">
            <Button variant="ghost" size="sm" onClick={handleSave} disabled={saveState === "saving"}>
              {saveState === "saved" ? "Saved ✓" : saveState === "saving" ? "Saving…" : "Save"}
            </Button>
            <Button as={Link} to={`/services/${id}/eligibility`} variant="gold" size="sm">
              Check eligibility
            </Button>
          </div>
          {saveState === "error" && (
            <p className="mt-1.5 text-xs text-clay">Couldn&rsquo;t save — try again.</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-11 md:grid-cols-[1.4fr_1fr]">
        <div>
          <h3 className="mb-3.5 text-[16.5px]">About this service</h3>
          <p className="text-[14.5px] leading-[1.7] text-ink-light">{service.description}</p>

          <h3 className="mt-34px mb-3.5 text-[16.5px]">Service snapshot</h3>
          <ul className="m-0 list-none p-0">
            <li className="flex gap-2.5 border-b border-paper-dim py-2.5 text-[14.5px] text-ink-light before:font-bold before:text-moss before:content-['✓']">
              Category: {service.category || "General"}
            </li>
            <li className="flex gap-2.5 border-b border-paper-dim py-2.5 text-[14.5px] text-ink-light before:font-bold before:text-moss before:content-['✓']">
              Processing time: {service.processingTime}
            </li>
            <li className="flex gap-2.5 border-b border-paper-dim py-2.5 text-[14.5px] text-ink-light before:font-bold before:text-moss before:content-['✓']">
              Delivery mode: {service.deliveryMode}
            </li>
            <li className="flex gap-2.5 py-2.5 text-[14.5px] text-ink-light before:font-bold before:text-moss before:content-['✓']">
              Fee: {service.fee > 0 ? `₹ ${service.fee}` : "Free"}
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3.5 text-[16.5px]">What you&rsquo;ll need</h3>
          {requiredDocs.length === 0 && (
            <p className="text-[13.5px] text-ink/60">
              No documents have been listed for this service yet.
            </p>
          )}
          {requiredDocs.map((doc) => (
            <div key={doc._id} className="mb-3.5 rounded-xl bg-paper-dim px-5 py-18px]">
              <h4 className="mb-2 flex items-center gap-2 text-[13.5px]">
                {doc.label?.en}
                {doc.mandatory && (
                  <span className="rounded-full bg-crimson-bg px-2 py-0.5 text-[10.5px] font-semibold text-crimson-dark">
                    Required
                  </span>
                )}
              </h4>
              {doc.notes?.en && (
                <p className="m-0 text-[13.5px] leading-[1.6] text-ink-light">{doc.notes.en}</p>
              )}
            </div>
          ))}

          <Button as={Link} to={`/services/${id}/journey`} variant="ghost" size="sm" className="mt-2 w-full">
            View the typical journey
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ServiceDetails;
