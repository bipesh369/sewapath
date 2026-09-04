// Maps the backend's Application.status enum to the pill style/label used
// throughout the citizen dashboard, journey, and staff Applications table.
export const STATUS_META = {
  action_needed: { pill: "review", label: "Action needed" },
  needs_documents: { pill: "needsdocs", label: "Needs documents" },
  in_review: { pill: "review", label: "In review" },
  completed: { pill: "approved", label: "Completed" },
};

export function statusMeta(status) {
  return STATUS_META[status] ?? STATUS_META.action_needed;
}
