type LoadingScreenProps = {
  label?: string;
  compact?: boolean;
  className?: string;
};

export default function LoadingScreen({
  label = "Building your experience",
  compact = false,
  className = "",
}: LoadingScreenProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={[
        "infycrest-loading-shell",
        compact ? "min-h-[280px]" : "min-h-[60vh]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="infycrest-loading-mark" aria-hidden="true">
        <svg
          viewBox="0 0 160 160"
          className="infycrest-loader-svg"
          focusable="false"
        >
          <path
            className="loader-line loader-line--1"
            d="M42 40 L76 28 L108 70 L42 112 L42 40"
          />
          <path
            className="loader-line loader-line--2"
            d="M76 28 L100 80 L42 112"
          />
          <path
            className="loader-line loader-line--3"
            d="M108 70 L76 124 L42 112"
          />
          <circle
            className="loader-node loader-node--1"
            cx="42"
            cy="40"
            r="5"
          />
          <circle
            className="loader-node loader-node--2"
            cx="76"
            cy="28"
            r="5"
          />
          <circle
            className="loader-node loader-node--3"
            cx="108"
            cy="70"
            r="5"
          />
          <circle
            className="loader-node loader-node--4"
            cx="42"
            cy="112"
            r="5"
          />
          <circle
            className="loader-node loader-node--5"
            cx="76"
            cy="124"
            r="5"
          />
          <circle className="loader-signal" r="4" fill="currentColor">
            <animateMotion
              dur="2.8s"
              repeatCount="indefinite"
              path="M42 40 L76 28 L108 70 L42 112 L42 40"
            />
          </circle>
        </svg>
      </div>

      <div className="infycrest-loading-copy">
        <span className="infycrest-loading-kicker">INFYCREST</span>
        <p>{label}</p>
      </div>

      <div className="sr-only">{label}</div>
    </div>
  );
}
