import { Fragment } from "react";

/**
 * Renders content text with one piece of markup: `_Name_` → italic.
 * Scientific names are italic by convention (ICZN), and marking them in the
 * content keeps that decision with the author rather than guessing at render time.
 */
export function RichText({ text }: { text: string }) {
  const parts = text.split(/_([^_]+)_/);
  return parts.map((part, i) => (i % 2 === 1 ? <i key={i}>{part}</i> : <Fragment key={i}>{part}</Fragment>));
}

/** Plain text for places that cannot hold markup (meta descriptions, alt text, React keys). */
export const plainText = (text: string) => text.replace(/_([^_]+)_/g, "$1");
