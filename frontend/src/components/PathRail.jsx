const DONE_GRADIENT = "linear-gradient(to right, #3B7A57 50%, transparent 0%)";
const PENDING_GRADIENT =
  "linear-gradient(to right, rgba(34,48,63,0.14) 50%, transparent 0%)";

/**
 * The dotted "trail" motif used throughout SewaPath to show progress
 * through a multi-step process (homepage flow, dashboard goal cards,
 * eligibility stepper, journey timeline).
 *
 * total: number of steps
 * currentIndex: 0-based index of the step in progress (its dot is gold).
 *   Steps before it are marked done (moss green); steps after are pending.
 *   Pass currentIndex === total to mark every step done (e.g. a completed
 *   application).
 */
function PathRail({ total, currentIndex, className = "" }) {
  return (
    <div className={`flex items-center ${className}`}>
      {Array.from({ length: total }).map((_, i) => {
        const isDone = i < currentIndex;
        const isCurrent = i === currentIndex;

        return (
          <div key={i} className="flex flex-1 items-center last:flex-none">
            <span
              className={[
                "h-2.5 w-2.5 shrink-0 rounded-full",
                isDone && "bg-moss",
                isCurrent &&
                  "bg-marigold shadow-[0_0_0_4px_rgba(224,164,56,0.28)]",
                !isDone && !isCurrent && "bg-ink/15",
              ]
                .filter(Boolean)
                .join(" ")}
            />
            {i < total - 1 && (
              <span
                className="h-0.5 flex-1 bg-repeat-x"
                style={{
                  backgroundImage: isDone ? DONE_GRADIENT : PENDING_GRADIENT,
                  backgroundSize: "6px 2px",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default PathRail;
