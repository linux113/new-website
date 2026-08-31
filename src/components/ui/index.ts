/**
 * SRIYAAN METALS — UI primitives barrel.
 *
 * Layer rules (docs/COMPONENT-ARCHITECTURE.md §1):
 * primitives are dumb, token-driven, and content-free. They never
 * hardcode colors/spacing — design tokens only (globals.css @theme).
 *
 * Buttons, badges, cards and form primitives live in their own modules.
 */
export { Container } from "./Container";
export { Section } from "./Section";
export type { SectionSurface } from "./Section";
export { Hairline } from "./Hairline";
export { Eyebrow } from "./Eyebrow";
export { IndexNumber } from "./IndexNumber";
export { SectionHeading } from "./SectionHeading";
export { Icon } from "./Icon";
export { Skeleton } from "./Skeleton";
export { EmptyState } from "./EmptyState";
export { ButtonLink } from "./ButtonLink";
