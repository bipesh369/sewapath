import { Sparkles } from "lucide-react";

function Logo({ showStaffLabel = false }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-primary)]">
        <Sparkles
          size={18}
          strokeWidth={2.5}
          className="text-white"
        />
      </div>

      <div className="flex items-center gap-2">
        <span className="text-lg font-bold tracking-tight text-white">
          SewaPath
        </span>

        {showStaffLabel && (
          <span className="text-xs font-bold text-[#e8d49b]">
            STAFF
          </span>
        )}
      </div>
    </div>
  );
}

export default Logo;