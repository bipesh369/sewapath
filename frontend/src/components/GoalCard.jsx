import { Link } from "react-router-dom";
import PathRail from "./PathRail";
import StatusPill from "./ui/StatusPill";
import { statusMeta } from "../utils/applicationStatus";

/** One row in "Your goals" — used on both the Dashboard and the full Goals list. */
function GoalCard({ application }) {
  const meta = statusMeta(application.status);
  const total = application.steps?.length || 1;
  let currentIndex = application.steps?.findIndex((s) => s.status === "current");
  if (currentIndex === -1 || currentIndex == null) {
    currentIndex = application.status === "completed" ? total : 0;
  }

  return (
    <Link
      to={`/applications/${application._id}`}
      className="block rounded-xl border-[1.5px] border-ink/15 bg-white px-6 py-5 no-underline transition-colors hover:border-ink/30"
    >
      <div className="mb-3.5 flex items-start justify-between gap-3">
        <div>
          <h3 className="mb-1 text-[16px] text-ink">{application.serviceId?.title}</h3>
          <div className="font-mono text-[12px] text-ink/60">
            REF · {application.reference}
          </div>
        </div>
        <StatusPill status={meta.pill}>{meta.label}</StatusPill>
      </div>
      <PathRail total={total} currentIndex={currentIndex} />
    </Link>
  );
}

export default GoalCard;
