/** Syntax token kinds used inside a code pane. */
export type TokenKind =
  | "default"
  | "keyword"
  | "string"
  | "type"
  | "variable"
  | "property"
  | "comment";

/** One line of code, split into coloured tokens. */
export type CodeLine = Array<{ text: string; kind: TokenKind }>;

/** The single mapping from token kind to its spec colour. */
export const TOKEN_COLOR: Record<TokenKind, string> = {
  default: "#878c99",
  keyword: "#9c9af2",
  string: "#fa3abf",
  type: "#afec73",
  variable: "#d9f07c",
  property: "#e888f8",
  comment: "#878c99",
};
