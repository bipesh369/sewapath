import { useEffect, useState } from "react";
import { getOffices, createOffice, deleteOffice } from "../../api/offices.api";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

const EMPTY = {
  nameEn: "",
  nameNe: "",
  address: "",
  province: "",
  district: "",
  municipality: "",
  ward: 1,
  phone: "",
  email: "",
  hours: "",
};

function AdminOffices() {
  const [offices, setOffices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState(EMPTY);
  const [showForm, setShowForm] = useState(false);

  const load = () => {
    getOffices()
      .then((res) => setOffices(res.data))
      .catch((err) => setError(err.response?.data?.message || "Failed to load offices"))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const update = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: field === "ward" ? Number(e.target.value) : e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await createOffice({
        name: { en: form.nameEn, ne: form.nameNe || form.nameEn },
        address: form.address,
        province: form.province,
        district: form.district,
        municipality: form.municipality,
        ward: form.ward,
        phone: form.phone || undefined,
        email: form.email || undefined,
        hours: form.hours || undefined,
      });
      setForm(EMPTY);
      setShowForm(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create office");
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this office?")) return;
    setOffices((list) => list.filter((o) => o._id !== id));
    try {
      await deleteOffice(id);
    } catch {
      load();
    }
  };

  return (
    <div>
      <div className="mb-7 flex items-center justify-between">
        <div>
          <h1 className="text-[22px]">Offices</h1>
          <p className="text-[13.5px] text-ink/60">
            Offices are linked to journey steps so citizens know exactly where to go.
          </p>
        </div>
        <Button size="sm" onClick={() => setShowForm((s) => !s)}>
          {showForm ? "Cancel" : "+ New office"}
        </Button>
      </div>

      {showForm && (
        <Card className="mb-8">
          <form onSubmit={submit}>
            <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
              <Input id="nameEn" label="Name (English)" required value={form.nameEn} onChange={update("nameEn")} />
              <Input id="nameNe" label="Name (Nepali)" value={form.nameNe} onChange={update("nameNe")} />
              <Input id="province" label="Province" required value={form.province} onChange={update("province")} />
              <Input id="district" label="District" required value={form.district} onChange={update("district")} />
              <Input id="municipality" label="Municipality" required value={form.municipality} onChange={update("municipality")} />
              <Input id="ward" label="Ward" type="number" min="1" required value={form.ward} onChange={update("ward")} />
              <Input id="phone" label="Phone (optional)" value={form.phone} onChange={update("phone")} />
              <Input id="email" label="Email (optional)" value={form.email} onChange={update("email")} />
              <Input id="hours" label="Office hours (optional)" value={form.hours} onChange={update("hours")} placeholder="Sun–Fri 10am–5pm" />
            </div>
            <Input id="address" label="Full address" required value={form.address} onChange={update("address")} />

            {error && <p className="mb-4 text-[13px] text-clay">{error}</p>}
            <Button type="submit" size="sm">Save office</Button>
          </form>
        </Card>
      )}

      {loading && <p className="text-ink/60">Loading…</p>}
      {error && !showForm && <p className="text-clay">{error}</p>}

      <div className="flex flex-col gap-2.5">
        {offices.map((o) => (
          <Card key={o._id} className="flex items-center justify-between">
            <div>
              <div className="text-[14.5px] font-semibold">{o.name?.en}</div>
              <div className="mt-0.5 text-[12.5px] text-ink/60">
                {o.address}, {o.municipality}, {o.district}, {o.province} — Ward {o.ward}
              </div>
            </div>
            <Button size="sm" variant="ghost" onClick={() => remove(o._id)}>
              Delete
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default AdminOffices;
