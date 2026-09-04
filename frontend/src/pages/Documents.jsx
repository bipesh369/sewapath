import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyApplications } from "../api/applications.api";
import Card from "../components/ui/Card";

function Documents() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyApplications()
      .then((res) => setApplications(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="mb-1.5 text-[22px]">Documents</h1>
      <p className="mb-7 text-[13.5px] text-ink/60">
        Your document checklist status for every goal you&rsquo;ve started.
      </p>

      {loading && <p className="text-ink/60">Loading…</p>}

      {!loading && applications.length === 0 && (
        <Card>
          <p className="text-[13.5px] text-ink/60">
            Start a goal to see its document checklist here.
          </p>
        </Card>
      )}

      <div className="flex flex-col gap-3">
        {applications.map((app) => (
          <Card key={app._id} className="flex items-center justify-between gap-4">
            <div>
              <Link
                to={`/applications/${app._id}`}
                className="text-[15px] font-semibold text-ink no-underline"
              >
                {app.serviceId?.title}
              </Link>
              <div className="mt-1 font-mono text-[12px] text-ink/60">
                REF · {app.reference}
              </div>
            </div>
            <div className="shrink-0 text-right">
              <div className="text-[14px] font-semibold text-moss">
                {app.documentsConfirmed} of {app.documentsTotal}
              </div>
              <div className="text-[11.5px] text-ink/60">documents confirmed</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default Documents;
