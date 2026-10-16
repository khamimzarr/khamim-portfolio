export default function FeaturePill({ label, accent, className = "" }:
  { label: string; accent?: string; className?: string }) {
  return (
    <span className={`feature-pill ${className}`}>
      {accent ? <span aria-hidden="true" className="feature-pill-dot" style={{ background: accent }} /> : null}
      {label}
    </span>
  );
}
