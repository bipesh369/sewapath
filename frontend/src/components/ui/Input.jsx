/** Matches the prototype's `.field input` styling: rounded, ink-15 border, crimson focus ring. */
function Input({ label, error, className = "", id, ...props }) {
  return (
    <div className="mb-5">
      {label && (
        <label
          htmlFor={id}
          className="mb-7px block text-[13px] font-semibold text-ink"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        className={`w-full rounded-[9px] border-[1.5px] border-ink/15 px-14px py-13px text-[14.5px] outline-none transition-colors focus:border-crimson ${className}`}
        {...props}
      />
      {error && <p className="mt-1.5 text-[12.5px] text-clay">{error}</p>}
    </div>
  );
}

export default Input;
