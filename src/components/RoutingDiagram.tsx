const PROJECTS = ["hr-ai-review", "ruang-resepsi", "structur-md", "dropdeploy"];

type Node = { x: number; y: number; w: number; h: number };

function NodeBox({
  node,
  label,
  sub,
  delay,
  live,
}: {
  node: Node;
  label: string;
  sub?: string;
  delay: number;
  live?: boolean;
}) {
  const cx = node.x + node.w / 2;
  const cy = node.y + node.h / 2;
  return (
    <g>
      <rect className="route-node" x={node.x} y={node.y} width={node.w} height={node.h} rx={4} style={{ animationDelay: `${delay}s` }} />
      <text
        x={cx}
        y={sub ? cy - 7 : cy}
        textAnchor="middle"
        dominantBaseline="middle"
        className="mono"
        fontSize="13"
        fill="#e8e8ee"
      >
        {label}
      </text>
      {sub ? (
        <text x={cx} y={cy + 11} textAnchor="middle" dominantBaseline="middle" className="mono" fontSize="9" fill="#8a8a94">
          {sub}
        </text>
      ) : null}
      {live ? <circle cx={node.x + node.w - 13} cy={node.y + 13} r={3} fill="#b8f050" /> : null}
    </g>
  );
}

export default function RoutingDiagram() {
  /* Desktop: left to right */
  const left = { x: 16, y: 126, w: 110, h: 48 };
  const mid = { x: 250, y: 112, w: 168, h: 76 };
  const outX = 566;
  const outW = 178;
  const outH = 44;
  const outYs = [18, 96, 174, 252];

  /* Mobile: top to bottom tree */
  const mLeft = { x: 110, y: 8, w: 140, h: 44 };
  const mMid = { x: 95, y: 104, w: 170, h: 64 };
  const mOutX = 72;
  const mOutW = 248;
  const mOutH = 40;
  const mOutYs = [246, 302, 358, 414];
  const mTrunkX = 36;
  const mTrunkBottom = mOutYs[mOutYs.length - 1] + mOutH / 2;

  const midOut = { x: mid.x + mid.w, y: mid.y + mid.h / 2 };
  const midBottom = { x: mMid.x + mMid.w / 2, y: mMid.y + mMid.h };

  return (
    <div className="w-full">
      {/* Desktop */}
      <svg className="hidden w-full lg:block" viewBox="0 0 760 300" role="img" aria-label="Alur: KHAMIMZAR lewat TERMINAL, keluar jadi empat project live">
        <path className="route-rail" d={`M ${left.x + left.w} ${left.y + left.h / 2} H ${mid.x}`} />
        <path className="route-pulse" d={`M ${left.x + left.w} ${left.y + left.h / 2} H ${mid.x}`} />

        {PROJECTS.map((name, i) => {
          const oy = outYs[i] + outH / 2;
          const d = `M ${midOut.x} ${midOut.y} C ${midOut.x + 68} ${midOut.y} ${outX - 68} ${oy} ${outX} ${oy}`;
          const delay = 0.35 + i * 0.3;
          return (
            <g key={name}>
              <path className="route-rail" d={d} />
              <path className="route-pulse" d={d} style={{ animationDelay: `${delay}s` }} />
              <NodeBox node={{ x: outX, y: outYs[i], w: outW, h: outH }} label={name} delay={delay} live />
            </g>
          );
        })}

        <NodeBox node={left} label="KHAMIMZAR" delay={0} />
        <NodeBox node={mid} label="TERMINAL" sub="vibes coding" delay={0.35} />
      </svg>

      {/* Mobile */}
      <svg className="w-full lg:hidden" viewBox="0 0 360 470" role="img" aria-label="Alur: KHAMIMZAR lewat TERMINAL, keluar jadi empat project live">
        <path className="route-rail" d={`M ${mLeft.x + mLeft.w / 2} ${mLeft.y + mLeft.h} V ${mMid.y}`} />
        <path className="route-pulse" d={`M ${mLeft.x + mLeft.w / 2} ${mLeft.y + mLeft.h} V ${mMid.y}`} />

        <path className="route-rail" d={`M ${midBottom.x} ${midBottom.y} L ${midBottom.x} 196 L ${mTrunkX} 196 L ${mTrunkX} ${mTrunkBottom}`} />
        <path className="route-pulse" d={`M ${midBottom.x} ${midBottom.y} L ${midBottom.x} 196 L ${mTrunkX} 196 L ${mTrunkX} ${mTrunkBottom}`} style={{ animationDelay: "0.35s" }} />

        {PROJECTS.map((name, i) => {
          const oy = mOutYs[i] + mOutH / 2;
          const d = `M ${mTrunkX} ${oy} L ${mOutX} ${oy}`;
          const delay = 0.7 + i * 0.3;
          return (
            <g key={name}>
              <path className="route-rail" d={d} />
              <path className="route-pulse" d={d} style={{ animationDelay: `${delay}s` }} />
              <NodeBox node={{ x: mOutX, y: mOutYs[i], w: mOutW, h: mOutH }} label={name} delay={delay} live />
            </g>
          );
        })}

        <NodeBox node={mLeft} label="KHAMIMZAR" delay={0} />
        <NodeBox node={mMid} label="TERMINAL" sub="vibes coding" delay={0.35} />
      </svg>
    </div>
  );
}
