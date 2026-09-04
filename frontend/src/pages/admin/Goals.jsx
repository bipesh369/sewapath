import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyApplications } from "../api/applications.api";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import GoalCard from "../components/GoalCard";

function Goals() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    getMyApplications()
      .then((res) => setApplications(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    filter === "all"
      ? applications
      : filter === "in_progress"
      ? applications.filter((a) => a.status !== "completed")
      : applications.filter((a) => a.status === "completed");

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-[22px]">Your goals</h1>
        <Button as={Link} to="/services" size="sm">
          + Start a new goal
        </Button>
      </div>

      <div className="mb-6 flex gap-1 rounded-xl bg-paper-dim p-1 w-fit">
        {[
          ["all", "All"],
          ["in_progress", "In progress"],
          ["completed", "Completed"],
        ].map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setFilter(value)}
            className={`rounded-lg px-4 py-2 text-[13.5px] font-semibold ${
              filter === value ? "bg-white text-ink shadow-sm" : "text-ink/50"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading && <p className="text-ink/60">Loading…</p>}

      {!loading && filtered.length === 0 && (
        <Card>
          <p className="text-[13.5px] text-ink/60">No goals here yet.</p>
        </Card>
      )}

      <div className="flex flex-col gap-3.5">
        {filtered.map((app) => (
          <GoalCard key={app._id} application={app} />
        ))}
      </div>
    </div>
  );
}

export default Goals;
