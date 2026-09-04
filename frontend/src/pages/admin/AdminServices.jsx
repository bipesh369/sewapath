import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import getServices, {
  createService,
  updateService,
  deleteService,
} from "../../api/services.api";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Card from "../../components/ui/Card";

const EMPTY_FORM = {
  title: "",
  slug: "",
  description: "",
  category: "",
  fee: 0,
  processingTime: "",
  deliveryMode: "In-person",
  officialUrl: "",
  status: "published",
};

const TABS = ["All", "Draft", "Published", "Archived"];

function AdminServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("All");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const load = () => {
    setLoading(true);
    getServices(1, 50)
      .then((res) => setServices(res.data))
      .catch((err) => setError(err.response?.data?.message || "Failed to load services"))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const stats = useMemo(() => {
    const total = services.length;
    const published = services.filter((s) => s.status === "published").length;
    const draft = services.filter((s) => s.status === "draft").length;
    const categories = new Set(services.map((s) => s.category).filter(Boolean)).size;
    return { total, published, draft, categories };
  }, [services]);

  const filtered = useMemo(() => {
    if (tab === "All") return services;
    return services.filter((s) => s.status === tab.toLowerCase());
  }, [services, tab]);

  const startCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setShowForm(true);
  };

  const startEdit = (svc) => {
    setEditingId(svc._id);
    setForm({
      title: svc.title || "",
      slug: svc.slug || "",
      description: svc.description || "",
      category: svc.category || "",
      fee: svc.fee ?? 0,
      processingTime: svc.processingTime || "",
      deliveryMode: svc.deliveryMode || "",
      officialUrl: svc.officialUrl || "",
      status: svc.status || "published",
    });
    setFormError("");
    setShowForm(true);
  };

  const update = (field) => (e) =>
    setForm((f) => ({
      ...f,
      [field]: field === "fee" ? Number(e.target.value) : e.target.value,
    }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormError("");

    const payload = { ...form };
    if (!payload.officialUrl) delete payload.officialUrl;

    try {
      if (editingId) {
        await updateService(editingId, payload);
      } else {
        await createService(payload);
      }
      setShowForm(false);
      load();
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to save service");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this service? This cannot be undone.")) return;
    setServices((list) => list.filter((s) => s._id !== id));
    try {
      await deleteService(id);
    } catch {
      load();
    }
  };

  const STATUS_STYLES = {
    published: "bg-moss-bg text-moss",
    draft: "bg-marigold-light text-[#8a6410]",
    archived: "bg-clay-bg text-clay",
  };

  return (
    <div>
      <div className="mb-7 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-[22px]">Services</h1>
          <p className="text-[13.5px] text-ink/60">
            Manage the services citizens can search, check eligibility for, and follow a journey through.
          </p>
        </div>
        <Button size="sm" onClick={startCreate}>
          + Add service
        </Button>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card>
          <div className="font-display text-2xl font-extrabold">{loading ? "…" : stats.total}</div>
          <div className="mt-1 text-[13px] text-ink/60">Total services</div>
        </Card>
        <Card>
          <div className="font-display text-2xl font-extrabold">{loading ? "…" : stats.published}</div>
          <div className="mt-1 text-[13px] text-ink/60">Published</div>
        </Card>
        <Card>
          <div className="font-display text-2xl font-extrabold">{loading ? "…" : stats.draft}</div>
          <div className="mt-1 text-[13px] text-ink/60">Draft</div>
        </Card>
        <Card>
          <div className="font-display text-2xl font-extrabold">{loading ? "…" : stats.categories}</div>
          <div className="mt-1 text-[13px] text-ink/60">Categories</div>
        </Card>
      </div>

      {showForm && (
        <Card className="mb-8">
          <h2 className="mb-4 text-[16px]">
            {editingId ? "Edit service" : "New service"}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
              <Input id="title" label="Title" required value={form.title} onChange={update("title")} />
              <Input id="slug" label="Slug" required value={form.slug} onChange={update("slug")} placeholder="birth-registration" />
              <Input id="category" label="Category" required value={form.category} onChange={update("category")} />
              <Input id="fee" label="Fee (₹)" type="number" min="0" required value={form.fee} onChange={update("fee")} />
              <Input id="processingTime" label="Processing time" required value={form.processingTime} onChange={update("processingTime")} placeholder="3-5 working days" />
              <Input id="deliveryMode" label="Delivery mode" required value={form.deliveryMode} onChange={update("deliveryMode")} placeholder="In-person / Online" />
              <Input id="officialUrl" label="Official URL (optional)" value={form.officialUrl} onChange={update("officialUrl")} />
              <div className="mb-5">
                <label className="mb-7px block text-[13px] font-semibold text-ink">Status</label>
                <select
                  value={form.status}
                  onChange={update("status")}
                  className="w-full rounded-[9px] border-[1.5px] border-ink/15 px-14px py-13px text-[14.5px] outline-none focus:border-crimson"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
            <div className="mb-5">
              <label className="mb-7px block text-[13px] font-semibold text-ink">Description</label>
              <textarea
                required
                rows={3}
                value={form.description}
                onChange={update("description")}
                className="w-full rounded-[9px] border-[1.5px] border-ink/15 px-14px py-13px text-[14.5px] outline-none focus:border-crimson"
              />
            </div>

            {formError && <p className="mb-4 text-[13px] text-clay">{formError}</p>}

            <div className="flex gap-2.5">
              <Button type="submit" size="sm" disabled={saving}>
                {saving ? "Saving…" : "Save"}
              </Button>
              <Button type="button" size="sm" variant="ghost" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="mb-5 flex w-fit gap-1 rounded-xl bg-paper-dim p-1">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`rounded-lg px-4 py-2 text-[13.5px] font-semibold ${
              tab === t ? "bg-white text-ink shadow-sm" : "text-ink/50"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {error && <p className="mb-4 text-clay">{error}</p>}
      {loading && <p className="text-ink/60">Loading…</p>}

      {!loading && (
        <div className="overflow-hidden rounded-xl border-[1.5px] border-ink/15 bg-white">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-paper-dim">
                <th className="px-5 py-3 text-[11px] font-bold tracking-[0.06em] text-ink/60 uppercase">Title</th>
                <th className="px-5 py-3 text-[11px] font-bold tracking-[0.06em] text-ink/60 uppercase">Category</th>
                <th className="px-5 py-3 text-[11px] font-bold tracking-[0.06em] text-ink/60 uppercase">Fee</th>
                <th className="px-5 py-3 text-[11px] font-bold tracking-[0.06em] text-ink/60 uppercase">Status</th>
                <th className="px-5 py-3 text-[11px] font-bold tracking-[0.06em] text-ink/60 uppercase"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((svc) => (
                <tr key={svc._id} className="border-t border-paper-dim">
                  <td className="px-5 py-3.5 text-[14px] font-medium">{svc.title}</td>
                  <td className="px-5 py-3.5 font-mono text-[12.5px] text-ink/60">{svc.category}</td>
                  <td className="px-5 py-3.5 font-mono text-[12.5px] text-ink/60">
                    {svc.fee > 0 ? `₹ ${svc.fee}` : "Free"}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`rounded-[14px] px-3 py-5px font-mono text-[11px] font-semibold uppercase ${STATUS_STYLES[svc.status] ?? ""}`}>
                      {svc.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex justify-end gap-1.5">
                      <Button as={Link} to={`/admin/services/${svc._id}`} size="sm" variant="ghost">
                        Manage content
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => startEdit(svc)}>
                        Edit
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleDelete(svc._id)}>
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-[13.5px] text-ink/50">
                    No services in this view yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminServices;
