import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getJourneySteps } from "../api/journey.api";
import { getServiceById } from "../api/services.api";
import Button from "../components/ui/Button";

function Journey() {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getServiceById(id), getJourneySteps(id)])
      .then(([svcRes, stepsRes]) => {
        setService(svcRes.data);
        setSteps(stepsRes.data);
      })
      .catch((err) =>
        setError(err.response?.data?.message || "Failed to load the journey")
      )
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-ink/60">
        Mapping out the journey…
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-clay">
        {error}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-760px px-6 pt-11 pb-24 md:px-12">
      <div className="mb-1.5 font-mono text-xs font-semibold tracking-[0.08em] text-crimson uppercase">
        Your journey
      </div>
      <h1 className="mb-2 text-[26px] md:text-[29px]">
        {service?.title || "Service journey"}
      </h1>
      <p className="mb-10 text-[15px] text-ink/60">
        {steps.length} step{steps.length === 1 ? "" : "s"} · this is the
        typical path most applicants follow for this service.
      </p>

      {steps.length === 0 && (
        <p className="text-ink/60">
          No journey steps have been mapped for this service yet.
        </p>
      )}

      <div className="relative">
        {steps.map((step, i) => (
          <div key={step._id} className="relative flex gap-5 pb-9 last:pb-0">
            {i < steps.length - 1 && (
              <div className="absolute top-9 left-17px h-full w-0.5 bg-moss/30" />
            )}
            <div className="z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-moss bg-moss font-mono text-[13px] font-bold text-white">
              ✓
            </div>
            <div className="flex-1 pt-0.5">
              <h3 className="mb-1 text-[16px]">{step.title?.en}</h3>
              <p className="mb-3.5 text-[14px] leading-[1.6] text-ink-light">
                {step.instructions?.en}
              </p>
              <div className="flex flex-wrap gap-2">
                {step.estimatedTime?.en && (
                  <span className="rounded-xl bg-paper-dim px-2.5 py-1 text-[11.5px] text-ink/60">
                    ⏱ {step.estimatedTime.en}
                  </span>
                )}
                {step.responsibleOffice && (
                  <span className="rounded-xl bg-crimson-bg px-2.5 py-1 text-[11.5px] font-semibold text-crimson-dark">
                    🏢 {step.responsibleOffice.name?.en}
                  </span>
                )}
              </div>
              {step.responsibleOffice?.address && (
                <p className="mt-3 text-[12.5px] text-ink/60">
                  {step.responsibleOffice.address}, {step.responsibleOffice.municipality},{" "}
                  {step.responsibleOffice.district}
                  {step.responsibleOffice.hours && ` · ${step.responsibleOffice.hours}`}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex gap-3">
        <Button as={Link} to={`/services/${id}`} variant="ghost" size="sm">
          Back to service
        </Button>
        <Button as={Link} to="/services" size="sm">
          Find another service
        </Button>
      </div>
    </div>
  );
}

export default Journey;
