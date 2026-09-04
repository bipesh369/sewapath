import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getServiceById } from "../../api/services.api";
import {
  getDocumentRequirements,
  createDocumentRequirement,
  deleteDocumentRequirement,
} from "../../api/documents.api";
import {
  getEligibilityQuestions,
  createEligibilityQuestion,
} from "../../api/eligibility.api";
import { getJourneySteps, createJourneyStep } from "../../api/journey.api";
import { getOffices } from "../../api/offices.api";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

const TABS = ["Documents", "Eligibility", "Journey"];

function AdminServiceDetail() {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [tab, setTab] = useState("Documents");

  const [docs, setDocs] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [steps, setSteps] = useState([]);
  const [offices, setOffices] = useState([]);
  const [error, setError] = useState("");

  const loadAll = () => {
    getServiceById(id).then((r) => setService(r.data)).catch(() => {});
    getDocumentRequirements(id).then((r) => setDocs(r.data)).catch(() => {});
    getEligibilityQuestions(id).then((r) => setQuestions(r.data)).catch(() => {});
    getJourneySteps(id).then((r) => setSteps(r.data)).catch(() => {});
    getOffices().then((r) => setOffices(r.data)).catch(() => {});
  };

  useEffect(loadAll, [id]);

  // ---- Document form ----
  const [docForm, setDocForm] = useState({ labelEn: "", labelNe: "", order: 1, mandatory: true, notesEn: "" });
  const submitDoc = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await createDocumentRequirement(id, {
        label: { en: docForm.labelEn, ne: docForm.labelNe || docForm.labelEn },
        order: Number(docForm.order),
        mandatory: docForm.mandatory,
        notes: docForm.notesEn ? { en: docForm.notesEn, ne: docForm.notesEn } : undefined,
      });
      setDocForm({ labelEn: "", labelNe: "", order: docs.length + 2, mandatory: true, notesEn: "" });
      loadAll();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add document");
    }
  };
  const removeDoc = async (docId) => {
    setDocs((d) => d.filter((x) => x._id !== docId));
    try {
      await deleteDocumentRequirement(docId);
    } catch {
      loadAll();
    }
  };

  // ---- Eligibility question form ----
  const [qForm, setQForm] = useState({
    order: 1,
    textEn: "",
    textNe: "",
    isTerminal: false,
    options: [{ value: "yes", labelEn: "Yes", labelNe: "", resultsInEligible: true, nextQuestionOrder: "" }],
  });
  const updateOption = (i, field, value) =>
    setQForm((f) => ({
      ...f,
      options: f.options.map((o, idx) => (idx === i ? { ...o, [field]: value } : o)),
    }));
  const addOption = () =>
    setQForm((f) => ({
      ...f,
      options: [...f.options, { value: "", labelEn: "", labelNe: "", resultsInEligible: true, nextQuestionOrder: "" }],
    }));
  const removeOption = (i) =>
    setQForm((f) => ({ ...f, options: f.options.filter((_, idx) => idx !== i) }));

  const submitQuestion = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await createEligibilityQuestion(id, {
        order: Number(qForm.order),
        questionText: { en: qForm.textEn, ne: qForm.textNe || qForm.textEn },
        isTerminal: qForm.isTerminal,
        options: qForm.options.map((o) => ({
          value: o.value,
          label: { en: o.labelEn, ne: o.labelNe || o.labelEn },
          resultsInEligible: o.resultsInEligible,
          nextQuestionOrder: o.nextQuestionOrder ? Number(o.nextQuestionOrder) : undefined,
        })),
      });
      setQForm({
        order: questions.length + 2,
        textEn: "",
        textNe: "",
        isTerminal: false,
        options: [{ value: "yes", labelEn: "Yes", labelNe: "", resultsInEligible: true, nextQuestionOrder: "" }],
      });
      loadAll();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add question");
    }
  };

  // ---- Journey step form ----
  const [stepForm, setStepForm] = useState({
    order: 1,
    titleEn: "",
    titleNe: "",
    instructionsEn: "",
    instructionsNe: "",
    responsibleOffice: "",
    estimatedTimeEn: "",
  });
  const submitStep = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await createJourneyStep(id, {
        order: Number(stepForm.order),
        title: { en: stepForm.titleEn, ne: stepForm.titleNe || stepForm.titleEn },
        instructions: { en: stepForm.instructionsEn, ne: stepForm.instructionsNe || stepForm.instructionsEn },
        responsibleOffice: stepForm.responsibleOffice || null,
        estimatedTime: stepForm.estimatedTimeEn ? { en: stepForm.estimatedTimeEn, ne: stepForm.estimatedTimeEn } : undefined,
      });
      setStepForm({ order: steps.length + 2, titleEn: "", titleNe: "", instructionsEn: "", instructionsNe: "", responsibleOffice: "", estimatedTimeEn: "" });
      loadAll();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add journey step");
    }
  };

  return (
    <div>
      <Link to="/admin" className="mb-3 block text-[13px] font-mono text-ink/60">
        ← All services
      </Link>
      <h1 className="mb-1 text-[22px]">{service?.title || "Loading…"}</h1>
      <p className="mb-6 text-[13.5px] text-ink/60">
        Manage the documents, eligibility questions, and journey steps citizens see for this service.
      </p>

      <div className="mb-6 flex gap-1 rounded-xl bg-paper-dim p-1 w-fit">
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

      {tab === "Documents" && (
        <div>
          <div className="mb-3 flex flex-col gap-2">
            {docs.map((d) => (
              <Card key={d._id} className="flex items-center justify-between">
                <div>
                  <div className="text-[14px] font-semibold">{d.label?.en}</div>
                  <div className="text-[12px] text-ink/60">
                    order {d.order} {d.mandatory ? "· required" : "· optional"}
                  </div>
                </div>
                <Button size="sm" variant="ghost" onClick={() => removeDoc(d._id)}>
                  Delete
                </Button>
              </Card>
            ))}
          </div>
          <Card>
            <h3 className="mb-3 text-[15px]">Add document requirement</h3>
            <form onSubmit={submitDoc}>
              <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
                <Input id="labelEn" label="Label (English)" required value={docForm.labelEn} onChange={(e) => setDocForm((f) => ({ ...f, labelEn: e.target.value }))} />
                <Input id="labelNe" label="Label (Nepali)" value={docForm.labelNe} onChange={(e) => setDocForm((f) => ({ ...f, labelNe: e.target.value }))} />
                <Input id="order" label="Order" type="number" min="1" required value={docForm.order} onChange={(e) => setDocForm((f) => ({ ...f, order: e.target.value }))} />
                <label className="mb-5 mt-7 flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={docForm.mandatory} onChange={(e) => setDocForm((f) => ({ ...f, mandatory: e.target.checked }))} className="accent-crimson" />
                  Required document
                </label>
              </div>
              <Input id="notesEn" label="Notes (optional)" value={docForm.notesEn} onChange={(e) => setDocForm((f) => ({ ...f, notesEn: e.target.value }))} />
              <Button type="submit" size="sm">Add document</Button>
            </form>
          </Card>
        </div>
      )}

      {tab === "Eligibility" && (
        <div>
          <div className="mb-3 flex flex-col gap-2">
            {questions.map((q) => (
              <Card key={q._id}>
                <div className="text-[14px] font-semibold">
                  #{q.order} {q.questionText?.en} {q.isTerminal && "(terminal)"}
                </div>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {q.options.map((o) => (
                    <span key={o.value} className="rounded-lg bg-paper-dim px-2 py-1 text-[11.5px] text-ink/60">
                      {o.label?.en} → {o.resultsInEligible ? `eligible / q${o.nextQuestionOrder ?? "end"}` : "not eligible"}
                    </span>
                  ))}
                </div>
              </Card>
            ))}
          </div>
          <Card>
            <h3 className="mb-3 text-[15px]">Add eligibility question</h3>
            <form onSubmit={submitQuestion}>
              <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
                <Input id="qorder" label="Order" type="number" min="1" required value={qForm.order} onChange={(e) => setQForm((f) => ({ ...f, order: e.target.value }))} />
                <label className="mb-5 mt-7 flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={qForm.isTerminal} onChange={(e) => setQForm((f) => ({ ...f, isTerminal: e.target.checked }))} className="accent-crimson" />
                  Terminal question (last step)
                </label>
              </div>
              <Input id="qtextEn" label="Question (English)" required value={qForm.textEn} onChange={(e) => setQForm((f) => ({ ...f, textEn: e.target.value }))} />
              <Input id="qtextNe" label="Question (Nepali)" value={qForm.textNe} onChange={(e) => setQForm((f) => ({ ...f, textNe: e.target.value }))} />

              <label className="mb-2 block text-[13px] font-semibold text-ink">Options</label>
              {qForm.options.map((o, i) => (
                <div key={i} className="mb-3 rounded-lg border border-ink/15 p-3">
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    <input placeholder="value (e.g. yes)" value={o.value} onChange={(e) => updateOption(i, "value", e.target.value)} className="rounded-md border border-ink/15 px-2 py-1.5 text-[13px]" />
                    <input placeholder="label (English)" value={o.labelEn} onChange={(e) => updateOption(i, "labelEn", e.target.value)} className="rounded-md border border-ink/15 px-2 py-1.5 text-[13px]" />
                    <input placeholder="next question order" type="number" value={o.nextQuestionOrder} onChange={(e) => updateOption(i, "nextQuestionOrder", e.target.value)} className="rounded-md border border-ink/15 px-2 py-1.5 text-[13px]" />
                    <label className="flex items-center gap-1.5 text-[12.5px]">
                      <input type="checkbox" checked={o.resultsInEligible} onChange={(e) => updateOption(i, "resultsInEligible", e.target.checked)} className="accent-crimson" />
                      Leads to eligible
                    </label>
                  </div>
                  {qForm.options.length > 1 && (
                    <button type="button" onClick={() => removeOption(i)} className="mt-2 text-[12px] text-clay">
                      Remove option
                    </button>
                  )}
                </div>
              ))}
              <Button type="button" size="sm" variant="ghost" onClick={addOption} className="mb-4">
                + Add option
              </Button>
              <div>
                <Button type="submit" size="sm">Add question</Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {tab === "Journey" && (
        <div>
          <div className="mb-3 flex flex-col gap-2">
            {steps.map((s) => (
              <Card key={s._id}>
                <div className="text-[14px] font-semibold">
                  #{s.order} {s.title?.en}
                </div>
                <p className="mt-1 text-[13px] text-ink/60">{s.instructions?.en}</p>
              </Card>
            ))}
          </div>
          <Card>
            <h3 className="mb-3 text-[15px]">Add journey step</h3>
            <form onSubmit={submitStep}>
              <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
                <Input id="sorder" label="Order" type="number" min="1" required value={stepForm.order} onChange={(e) => setStepForm((f) => ({ ...f, order: e.target.value }))} />
                <div className="mb-5">
                  <label className="mb-7px block text-[13px] font-semibold text-ink">Responsible office</label>
                  <select
                    value={stepForm.responsibleOffice}
                    onChange={(e) => setStepForm((f) => ({ ...f, responsibleOffice: e.target.value }))}
                    className="w-full rounded-[9px] border-[1.5px]border-ink/15 px-14px py-13px text-[14.5px] outline-none focus:border-crimson"
                  >
                    <option value="">None</option>
                    {offices.map((o) => (
                      <option key={o._id} value={o._id}>{o.name?.en}</option>
                    ))}
                  </select>
                </div>
              </div>
              <Input id="stitleEn" label="Title (English)" required value={stepForm.titleEn} onChange={(e) => setStepForm((f) => ({ ...f, titleEn: e.target.value }))} />
              <Input id="stitleNe" label="Title (Nepali)" value={stepForm.titleNe} onChange={(e) => setStepForm((f) => ({ ...f, titleNe: e.target.value }))} />
              <div className="mb-5">
                <label className="mb-7px block text-[13px] font-semibold text-ink">Instructions (English)</label>
                <textarea required rows={2} value={stepForm.instructionsEn} onChange={(e) => setStepForm((f) => ({ ...f, instructionsEn: e.target.value }))} className="w-full rounded-[9px] border-[1.5px] border-ink/15 px-14px py-13px text-[14.5px] outline-none focus:border-crimson" />
              </div>
              <Input id="etime" label="Estimated time (optional)" value={stepForm.estimatedTimeEn} onChange={(e) => setStepForm((f) => ({ ...f, estimatedTimeEn: e.target.value }))} placeholder="15 minutes" />
              <Button type="submit" size="sm">Add step</Button>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}

export default AdminServiceDetail;
