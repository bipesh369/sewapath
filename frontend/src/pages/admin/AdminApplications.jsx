import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listApplications, getApplicationStats, updateApplicationStatus } from "../../api/applications.api";
import { statusMeta } from "../../utils/applicationStatus";
import Button from "../../components/ui/Button";

const TABS = [
  { value: "all", label: "All" },
  { value: "action_needed", label: "Needs review" },
  { value: "needs_documents", label: "Needs documents" },
  { value: "completed", label: "Completed" },
];

const STATUS_OPTIONS = ["action_needed", "needs_documents", "in_review", "completed"];

const PILL_BG = {
  review: "bg-marigold-light text-[#8a6410]",
  approved: "bg-moss-bg text-moss",
  needsdocs: "bg-clay-bg text-clay",
};

function AdminApplications() {
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState(null);
  const [tab, setTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    Promise.all([listApplications({ status: tab, limit: 50 }), getApplicationStats()])
      .then(([appsRes, statsRes]) => {
        setApplications(appsRes.data);
        setStats(statsRes.data);
      })
      .catch((err) => setError(err.response?.data?.message || "Failed to load applications"))
      .finally(() => setLoading(false));
  };

  useEffect(load, [tab]);

  const handleStatusChange = async (id, status) => {
    setApplications((list) => list.map((a) => (a._id === id ? { ...a, status } : a)));
    try {
      await updateApplicationStatus(id, status);
    } catch {
      load();
    }
  };

  const exportCsv = () => {
    const header = "Citizen,Service,Reference,Submitted,Status\n";
    const rows = applications
      .map((a) =>
        [
          a.userId?.name,
          a.serviceId?.title,
          a.reference,
          new Date(a.createdAt).toLocaleDateString(),
          a.status,
        ]
          .map((v) => `"${v ?? ""}"`)
          .join(",")
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sewapath-applications.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="mb-7 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-[22px]">Applications</h1>
          <p className="text-[13.5px] text-ink/60">
            Every goal citizens have started, across all services.
          </p>
        </div>
        <Button as={Link} to="/admin/services" size="sm">
          + Add service
        </Button>
      </div>

      <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border-[1.5px] border-ink/15 bg-white p-5">
          <div className="font-display text-2xl font-extrabold">
            {stats ? stats.totalThisMonth : "…"}
          </div>
          <div className="mt-1 text-[13px] text-ink/60">Total this month</div>
        </div>
        <div className="rounded-xl border-[1.5px] border-ink/15 bg-white p-5">
          <div className="font-display text-2xl font-extrabold">
            {stats ? stats.awaitingReview : "…"}
          </div>
          <div className="mt-1 text-[13px] text-ink/60">Awaiting review</div>
        </div>
        <div className="rounded-xl border-[1.5px] border-ink/15 bg-white p-5">
          <div className="font-display text-2xl font-extrabold">
            {stats ? `${stats.avgProcessingDays} days` : "…"}
          </div>
          <div className="mt-1 text-[13px] text-ink/60">Avg. processing time</div>
        </div>
        <div className="rounded-xl border-[1.5px] border-ink/15 bg-white p-5">
          <div className="font-display text-2xl font-extrabold">
            {stats ? `${stats.completionRate}%` : "…"}
          </div>
          <div className="mt-1 text-[13px] text-ink/60">Completion rate</div>
        </div>
      </div>

      <div className="mb-4 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div className="flex gap-1 rounded-xl bg-paper-dim p-1">
          {TABS.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setTab(t.value)}
              className={`rounded-lg px-4 py-2 text-[13.5px] font-semibold whitespace-nowrap ${
                tab === t.value ? "bg-white text-ink shadow-sm" : "text-ink/50"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <Button variant="ghost" size="sm" onClick={exportCsv} disabled={applications.length === 0}>
          Export CSV
        </Button>
      </div>

      {error && <p className="mb-4 text-clay">{error}</p>}

      <div className="overflow-x-auto rounded-xl border-[1.5px] border-ink/15 bg-white">
        <table className="w-full min-w-720px border-collapse text-left text-[13.5px]">
          <thead>
            <tr className="border-b border-ink/15 bg-paper-dim">
              <th className="px-5 py-3 font-mono text-[11px] tracking-[0.06em] text-ink/60 uppercase">Citizen</th>
              <th className="px-5 py-3 font-mono text-[11px] tracking-[0.06em] text-ink/60 uppercase">Service</th>
              <th className="px-5 py-3 font-mono text-[11px] tracking-[0.06em] text-ink/60 uppercase">Reference</th>
              <th className="px-5 py-3 font-mono text-[11px] tracking-[0.06em] text-ink/60 uppercase">Submitted</th>
              <th className="px-5 py-3 font-mono text-[11px] tracking-[0.06em] text-ink/60 uppercase">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={5} className="px-5 py-6 text-center text-ink/60">
                  Loading…
                </td>
              </tr>
            )}
            {!loading && applications.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-6 text-center text-ink/60">
                  No applications yet.
                </td>
              </tr>
            )}
            {applications.map((app) => {
              const meta = statusMeta(app.status);
              return (
                <tr key={app._id} className="border-b border-ink/10 last:border-b-0">
                  <td className="px-5 py-3.5">
                    <Link to={`/applications/${app._id}`} className="font-medium text-ink no-underline hover:underline">
                      {app.userId?.name}
                    </Link>
                  </td>
                  <td className="px-5 py-3.5 text-ink-light">{app.serviceId?.title}</td>
                  <td className="px-5 py-3.5 font-mono text-[12.5px] text-ink/60">{app.reference}</td>
                  <td className="px-5 py-3.5 text-ink-light">
                    {new Date(app.createdAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-5 py-3.5">
                    <select
                      value={app.status}
                      onChange={(e) => handleStatusChange(app._id, e.target.value)}
                      className={`cursor-pointer rounded-[14px] border-none px-3 py-5px font-mono text-[11.5px] font-semibold tracking-[0.03em] uppercase outline-none ${PILL_BG[meta.pill]}`}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {statusMeta(s).label}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminApplications;
