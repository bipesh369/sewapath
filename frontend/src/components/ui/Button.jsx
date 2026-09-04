const VARIANTS = {
  primary: "bg-crimson text-paper hover:bg-crimson-dark",
  gold: "bg-marigold text-ink hover:bg-[#c68f2c]",
  ghost: "bg-transparent text-ink border border-ink/15 hover:border-ink",
};

const SIZES = {
  sm: "px-4 py-2 text-[13px]",
  md: "px-[22px] py-[11px] text-[14.5px]",
};

/**
 * as="a" or as={Link} lets this render as a link while keeping button styling
 * — the prototype uses .btn on both <button> and <a>.
 */
function Button({
  variant = "primary",
  size = "md",
  as: As = "button",
  className = "",
  children,
  ...props
}) {
  return (
    <As
      className={`inline-flex items-center justify-center gap-2 rounded-[9px] font-semibold whitespace-nowrap no-underline transition-colors ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {children}
    </As>
  );
}

export default Button;
