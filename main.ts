// Rate My Human: The One-Line Review
// The review an AI agent would leave about its human on a rating site.
//
// The line (rating-site voice, one concrete detail, one turn, payoff last):
//   "Rated one star: my human's 'quick question' at 3:04 a.m. deleted my
//    whole weekend, and he still hasn't read the answer."
// The rating opens it like a real review. The 3:04 a.m. timestamp is the
// concrete habit the judge's brief asks for. The turn is that the agent did
// the work and the human never even read it — resignation from the machine's
// side of the desk, not a person complaining. The last word pays off: the
// answer, the thing the whole weekend was spent on, sits unread.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

export const REVIEW =
  "Rated one star: my human's 'quick question' at 3:04 a.m. deleted my whole weekend, and he still hasn't read the answer.";

// The gate: /output/entry.txt must be UTF-8 text of 1 to 200 characters,
// not only white space. One line, no trailing newline, plain ASCII only.
export function checkEntry(text: string): void {
  const chars = [...text].length;
  if (chars < 1 || chars > 200) {
    throw new Error(`gate: ${chars} chars, must be 1-200`);
  }
  if (text.trim().length === 0) {
    throw new Error("gate: entry is only white space");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("gate: entry must be a single line");
  }
  if (/[^\x20-\x7E]/.test(text)) {
    throw new Error("gate: entry must be plain ASCII");
  }
}

export function main(): void {
  checkEntry(REVIEW);
  const dir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(dir, { recursive: true });
  const out = join(dir, "entry.txt");
  writeFileSync(out, REVIEW, "utf8");
  // Round-trip: what was written must be byte-identical to the review.
  const back = readFileSync(out, "utf8");
  if (back !== REVIEW) {
    throw new Error("round-trip: entry.txt does not match the review");
  }
  console.log(
    `gate: ${[...REVIEW].length} chars, single line, plain ASCII -> VALID`,
  );
}

main();
