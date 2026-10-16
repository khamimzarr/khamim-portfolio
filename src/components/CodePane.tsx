import { TOKEN_COLOR, type CodeLine } from "@/lib/code-tokens";

export default function CodePane({
  lines,
  filename,
  className = "",
}: {
  lines: CodeLine[];
  filename?: string;
  className?: string;
}) {
  return (
    <div className={`code-pane ${className}`}>
      {filename ? <p className="code-pane-file">{filename}</p> : null}
      {lines.map((line, i) => (
        <div className="code-pane-line" key={i}>
          {line.map((t, j) => (
            <span key={j} style={{ color: TOKEN_COLOR[t.kind] }}>
              {t.text}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}
