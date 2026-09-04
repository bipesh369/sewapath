import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getApplicationById, updateApplicationDelivery } from "../api/applications.api";
import { getOffices } from "../api/offices.api";
import Brand from "../components/Brand";
import Button from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";

function ApplicationJourney() {
  const { id } = useParams();
  const { isAdmin } = useAuth();

  const [application, setApplication] = useState(null);
  const [offices, setOffices] = useState([]);
  const [selectedOffice, setSelectedOffice] = useState("");
  const [showOfficePicker, setShowOfficePicker] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = () => {
    getApplicationById(id)
      .then((res) => setApplication(res.data))
      .catch((err) => setError(err.response?.data?.message || "Failed to load this goal"))
      .finally(() => setLoading(false));
  };

  useEffect(load, [id]);
  useEffect(() => {
    getOffices().then((res) => setOffices(res.data)).catch(() => {});
  }, []);

  const chooseDelivery = async (deliveryChoice, officeId) => {
    setSaving(true);
    setError("");
    try {
      const res = await updateApplicationDelivery(id, {
        deliveryChoice,
        chosenOffice: officeId || null,
      });
      setApplication(res.data);
      setShowOfficePicker(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save your choice");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-ink/60">
        Loading your goal…
      </div>
    );
  }

  if (error && !application) {
    return (
      <div className="flex min-h-screen items-center justify-center text-clay">{error}</div>
    );
  }

  const currentStep = application.steps.find((s) => s.status === "current");
  const service = application.serviceId;

  return (
    <div className="min-h-screen bg-paper">
      <nav className="flex items-center justify-between border-b border-ink/15 px-6 py-[18px] md:px-12">
        <Link to="/">
          <Brand />
        </Link>
        <div className="hidden gap-[26px] text-[14.5px] font-medium text-ink/70 md:flex">
          <Link to="/goals" className="hover:text-ink">My goals</Link>
          <Link to="/messages" className="hover:text-ink">Messages</Link>
        </div>
        <Button as={Link} to={isAdmin ? "/admin" : "/dashboard"} variant="ghost" size="sm">
          {isAdmin ? "Admin" : "Dashboard"}
        </Button>
      </nav>

      <div className="mx-auto max-w-[760px] px-6 pt-11 pb-24 md:px-12">
        <div className="mb-1.5 font-mono text-xs font-semibold tracking-[0.08em] text-crimson uppercase">
          Your personalized journey
        </div>
        <h1 className="mb-2 text-[26px] md:text-[29px]">{service?.title}</h1>
        <p className="mb-10 font-mono text-[13px] text-ink/60">
          Reference · {application.reference}
        </p>

        {error && <p className="mb-6 text-sm text-clay">{error}</p>}

        <div className="relative">
          {application.steps.map((step, i) => {
            const isLast = i === application.steps.length - 1;
            return (
              <div key={step.key} className="relative flex gap-5 pb-9 last:pb-0">
                {!isLast && (
                  <div
                    className={`absolute top-9 left-[17px] h-full w-0.5 ${
                      step.status === "done" ? "rail-seg done" : "rail-seg"
                    }`}
                  />
                )}
                <div
                  className={`z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 font-mono text-[13px] font-bold ${
                    step.status === "done"
                      ? "border-moss bg-moss text-white"
                      : step.status === "current"
                      ? "border-marigold bg-marigold text-ink"
                      : "border-ink/15 bg-paper-dim text-ink/40"
                  }`}
                >
                  {step.status === "done" ? "✓" : step.status === "current" ? "●" : ""}
                </div>
                <div className="flex-1 pt-0.5">
                  <h3 className="mb-1 text-[16px] text-ink">{step.title?.en}</h3>
                  {step.completedAt && (
                    <div className="mb-1.5 font-mono text-[12px] text-ink/50">
                      {new Date(step.completedAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                  )}
                  {step.status === "current" && (
                    <div className="mb-1.5 font-mono text-[12px] text-ink/50">Action needed</div>
                  )}
                  <p className="text-[14px] leading-[1.6] text-ink-light">
                    {step.description?.en}
                  </p>

                  {step.key === "delivery" && step.status === "current" && (
                    <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                      <button
                        type="button"
                        disabled={saving}
                        onClick={() => setShowOfficePicker((s) => !s)}
                        className="rounded-xl border-2 border-marigold bg-marigold-light/40 p-4 text-left disabled:opacity-60"
                      >
                        <div className="mb-1 text-[14px] font-semibold text-ink">
                          🏢 Physical office
                        </div>
                        <div className="text-[12.5px] text-ink-light">
                          Visit an office to complete this step
                        </div>
                      </button>
                      <button
                        type="button"
                        disabled={saving}
                        onClick={() => chooseDelivery("online")}
                        className="rounded-xl border-[1.5px] border-ink/15 p-4 text-left disabled:opacity-60"
                      >
                        <div className="mb-1 text-[14px] font-semibold text-ink">🖥 Online</div>
                        <div className="text-[12.5px] text-ink-light">
                          Complete this step through the online portal
                        </div>
                      </button>
                    </div>
                  )}

                  {step.key === "delivery" && step.status === "current" && showOfficePicker && (
                    <div className="mt-3 flex flex-wrap items-center gap-2.5 rounded-xl bg-paper-dim p-4">
                      <select
                        value={selectedOffice}
                        onChange={(e) => setSelectedOffice(e.target.value)}
                        className="rounded-lg border-[1.5px] border-ink/15 px-3 py-2 text-[13.5px]"
                      >
                        <option value="">Choose an office…</option>
                        {offices.map((o) => (
                          <option key={o._id} value={o._id}>
                            {o.name?.en} — {o.municipality}, {o.district}
                          </option>
                        ))}
                      </select>
                      <Button
                        size="sm"
                        disabled={!selectedOffice || saving}
                        onClick={() => chooseDelivery("office", selectedOffice)}
                      >
                        {saving ? "Saving…" : "Confirm office"}
                      </Button>
                    </div>
                  )}

                  {step.key === "delivery" && step.status === "done" && (
                    <p className="mt-1.5 text-[13px] font-medium text-moss">
                      {application.deliveryChoice === "office"
                        ? `Chosen: visit ${application.chosenOffice?.name?.en || "your selected office"}`
                        : "Chosen: complete online"}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {currentStep && (
          <div className="mt-8 rounded-2xl bg-ink p-7 text-paper">
            <div className="mb-1.5 font-mono text-xs tracking-[0.08em] text-marigold uppercase">
              Next action needed
            </div>
            <h3 className="mb-2 text-[19px] text-paper">{currentStep.title?.en}</h3>
            <p className="text-[13.5px] leading-[1.6] text-paper/70">
              {currentStep.description?.en}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ApplicationJourney;
