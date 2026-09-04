function Card({ hoverable = false, className = "", children, ...props }) {
  return (
    <div
      className={`rounded-var(--radius-card) border-[1.5px] border-ink/15 bg-white p-22px transition-all ${
        hoverable
          ? "cursor-pointer hover:-translate-y-0.5 hover:border-marigold hover:shadow-[0_10px_24px_rgba(34,48,63,0.08)]"
          : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;
