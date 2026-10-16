"use client";

const ITEMS = [
  "KHAMIMZAR",
  "FOLIO NO. 01",
  "SLATE #1C1E21",
  "LIME #A8FF53",
  "GEIST MONO 14PX",
  "RADIUS 4PX",
  "HAIRLINE 1PX",
  "FOTO",
  "SEPEDA",
  "TANAMAN",
  "AQUARIUM",
  "VIBES CODING",
  "NGOPI",
];

function Track({ ariaHidden }: { ariaHidden: boolean }) {
  return (
    <div className="ticker-track" aria-hidden={ariaHidden}>
      {ITEMS.map((t, i) => (
        <span key={`${t}-${i}`} className="font-mono text-[14px] tracking-[0.04em] uppercase text-fog-text">
          {t}
          <span className="ml-[2.5rem] text-graphite-hairline">{"//"}</span>
        </span>
      ))}
    </div>
  );
}

export default function Ticker() {
  return (
    <div className="ticker w-full bg-slate-canvas border-y border-steel-border py-3 overflow-hidden">
      <Track ariaHidden={false} />
      <Track ariaHidden={true} />
    </div>
  );
}
