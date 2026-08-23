/**
 * Minimal class-name combiner (no external dependency — DS brief:
 * "do not add unnecessary dependencies").
 *
 * Joins truthy string arguments with a space. Token-driven components
 * never generate conflicting Tailwind classes, so full tailwind-merge
 * semantics are not required at this layer.
 */
export type ClassValue = string | false | null | undefined;

export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(" ");
}
