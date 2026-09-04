import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getMyApplications } from "../api/applications.api";
import { useAuth } from "../context/AuthContext";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import GoalCard from "../components/GoalCard";

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function Dashboard() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyApplications()
      .then((res) => setApplications(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const inProgress = applications.filter((a) => a.status !== "completed");
  const actionNeeded = applications.filter(
    (a) => a.status === "action_needed" || a.status === "needs_documents"
  );
  const completedThisYear = applications.filter(
    (a) => a.status === "completed" && new Date(a.completedAt).getFullYear() === new Date().getFullYear()
  );
  const officesVisited = useMemo(() => {
    const ids = new Set(
      applications.filter((a) => a.chosenOffice).map((a) => a.chosenOffice._id)
    );
    return ids.size;
  }, [applications]);

  return (
    <div>
      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="mb-1.5 text-[24px]">
            {greeting()}{user?.name ? `, ${user.name.split(" ")[0]}` : ""}
          </h1>
          <p className="text-[14.5px] text-ink/60">
            {loading
              ? "Loading your goals…"
              : `You have ${actionNeeded.length} action needed and ${inProgress.length} goal${inProgress.length === 1 ? "" : "s"} in progress.`}
          </p>
        </div>
        <Button as={Link} to="/services">
          + Start a new goal
        </Button>
      </div>

      <div className="mb-9 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <div className="font-display text-2xl font-extrabold text-crimson">
            {loading ? "…" : inProgress.length}
          </div>
          <div className="mt-1 text-[13px] text-ink/60">Goals in progress</div>
        </Card>
        <Card>
          <div className="font-display text-2xl font-extrabold text-crimson">
            {loading ? "…" : completedThisYear.length}
          </div>
          <div className="mt-1 text-[13px] text-ink/60">Completed this year</div>
        </Card>
        <Card>
          <div className="font-display text-2xl font-extrabold text-crimson">
            {loading ? "…" : `${officesVisited} office${officesVisited === 1 ? "" : "s"}`}
          </div>
          <div className="mt-1 text-[13px] text-ink/60">Visits saved by pre-filling forms</div>
        </Card>
      </div>

      <div className="mb-3.5 flex items-baseline justify-between">
        <h2 className="text-[17px]">Your goals</h2>
        <Link to="/goals" className="text-[13px] font-semibold text-crimson no-underline">
          See all →
        </Link>
      </div>

      {!loading && applications.length === 0 && (
        <Card>
          <p className="mb-3 text-[13.5px] text-ink/60">
            You haven&rsquo;t started a goal yet. Find a service and check your
            eligibility to get going.
          </p>
          <Button as={Link} to="/services" size="sm">
            Find a service
          </Button>
        </Card>
      )}

      <div className="flex flex-col gap-3.5">
        {applications.slice(0, 4).map((app) => (
          <GoalCard key={app._id} application={app} />
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
