function Logo({ size = 28, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      className={`shrink-0 ${className}`}
      aria-hidden="true"
    >
      <rect width="28" height="28" rx="8" fill="#A5243D" />
      <path d="M14 6.5 L19.5 15.5 H8.5 Z" fill="#E0A438" />
      <circle cx="14" cy="20.5" r="2.5" fill="#FBF7F0" />
    </svg>
  );
}

export default Logo;
