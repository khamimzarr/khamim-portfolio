"use client";

const ITEMS = [
  "KHAMIMZAR",
  "PUTTY #C4C3B6",
  "INK #000000",
  "RENAISSANCE ON PUTTY PAPER",
  "DAVINCI 374px",
  "HELVETICA NOW 12px",
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
        <span key={`${t}-${i}`} className="font-[Inter] text-[11px] tracking-[0.2em] uppercase text-[#595855]">
          {t}
          <span className="ml-[2.5rem] text-black opacity-30">◆</span>
        </span>
      ))}
    </div>
  );
}

export default function Ticker() {
  return (
    <div className="ticker w-full bg-[#e7e5e4] border-y border-[#dfdcd5] py-3 overflow-hidden">
      <Track ariaHidden={false} />
      <Track ariaHidden={true} />
    </div>
  );
}