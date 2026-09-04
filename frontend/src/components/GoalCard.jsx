import { Link } from "react-router-dom";

import PathRail from "./PathRail";
import StatusPill from "./ui/StatusPill";
import { statusMeta } from "../utils/applicationStatus";

/**
 * One row in "Your goals".
 * Used on both the Dashboard and the full Goals list.
 */
function GoalCard({ application }) {
  const meta = statusMeta(application.status);

  const total = application.steps?.length || 1;

  let currentIndex = application.steps?.findIndex(
    (step) => step.status === "current"
  );

  if (currentIndex === -1 || currentIndex == null) {
    currentIndex =
      application.status === "completed" ? total : 0;
  }

  return (
    <Link
      to={`/applications/${application._id}`}
      className="block rounded-xl border-[1.5px] border-ink/15 bg-white px-6 py-5 no-underline transition-all hover:-translate-y-0.5 hover:border-ink/30 hover:shadow-[0_8px_24px_rgba(34,48,63,0.06)]"
    >
      <div className="mb-3.5 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="mb-1 truncate text-[16px] font-semibold text-ink">
            {application.serviceId?.title || "Government service"}
          </h3>

          <div className="font-mono text-[12px] text-ink/60">
            REF · {application.reference || "N/A"}
          </div>
        </div>

        <StatusPill status={meta.pill}>
          {meta.label}
        </StatusPill>
      </div>

      <PathRail
        total={total}
        currentIndex={currentIndex}
      />
    </Link>
  );
}

export default GoalCard;