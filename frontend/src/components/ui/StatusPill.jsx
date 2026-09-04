const STYLES = {
  review: "bg-marigold-light text-[#8a6410]",
  approved: "bg-moss-bg text-moss",
  needsdocs: "bg-clay-bg text-clay",
};

/** status: "review" | "approved" | "needsdocs" */
function StatusPill({ status, children }) {
  return (
    <span
      className={`rounded-[14px] px-3 py-5px font-mono text-[11.5px] font-semibold tracking-[0.03em] uppercase ${
        STYLES[status] ?? STYLES.review
      }`}
    >
      {children}
    </span>
  );
}

export default StatusPill;
