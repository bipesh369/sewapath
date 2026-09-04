import Logo from "./Logo";

function Brand({ staff = false, dark = false, className = "" }) {
  return (
    <div
      className={`flex items-center gap-2.5 font-display text-xl font-extrabold ${
        dark ? "text-paper" : "text-ink"
      } ${className}`}
    >
      <Logo />
      <span>SewaPath</span>
      {staff && (
        <span className="ml-0.5 font-mono text-[11px] font-normal text-marigold-light">
          STAFF
        </span>
      )}
    </div>
  );
}

export default Brand;
