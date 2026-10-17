const NODES: [number, number][] = [
  [40, 60], [140, 40], [250, 90], [360, 50], [470, 110], [590, 70], [700, 120], [820, 60], [930, 100],
  [70, 180], [190, 210], [310, 170], [430, 230], [550, 190], [670, 250], [790, 200], [910, 240],
  [120, 320], [260, 360], [400, 320], [540, 370], [660, 330], [800, 380], [920, 340],
];

const EDGES: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8],
  [9, 10], [10, 11], [11, 12], [12, 13], [13, 14], [14, 15], [15, 16],
  [17, 18], [18, 19], [19, 20], [20, 21], [21, 22], [22, 23],
  [0, 9], [1, 9], [2, 10], [3, 11], [4, 12], [5, 13], [6, 14], [7, 15], [8, 16],
  [9, 17], [10, 18], [11, 19], [12, 20], [13, 21], [14, 22], [15, 23],
  [2, 11], [5, 14],
];

const ACCENT = [3, 12, 20];

const MASK = "radial-gradient(125% 110% at 50% 45%, #000 35%, transparent 100%)";

export default function MeshBackdrop({ className = "" }: { className?: string }) {
  return (
    <div className={className} aria-hidden>
      <div
        className="h-full w-full"
        style={{ maskImage: MASK, WebkitMaskImage: MASK }}
      >
        <div className="mesh-breathe h-full w-full">
          <div className="mesh-drift h-full w-full">
            <svg className="h-full w-full" viewBox="0 0 1000 420" preserveAspectRatio="xMidYMid slice" fill="none">
              {EDGES.map(([a, b], i) => (
                <line
                  key={`e${i}`}
                  x1={NODES[a][0]}
                  y1={NODES[a][1]}
                  x2={NODES[b][0]}
                  y2={NODES[b][1]}
                  stroke="#1e1e22"
                  strokeWidth="1"
                />
              ))}
              {NODES.map(([x, y], i) => {
                const accent = ACCENT.includes(i);
                return (
                  <circle
                    key={`n${i}`}
                    cx={x}
                    cy={y}
                    r={accent ? 2.6 : 1.7}
                    fill={accent ? "#b8f050" : "#2a2a30"}
                    opacity={accent ? 0.55 : 1}
                  />
                );
              })}
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
