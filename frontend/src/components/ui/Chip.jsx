function Chip({ children, className = "", ...props }) {
  return (
    <button
      type="button"
      className={`rounded-[20px] border-[1.5px] border-ink/15 bg-white px-17px py-9px text-[13.5px] font-medium transition-colors hover:border-marigold hover:bg-marigold-light ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Chip;
