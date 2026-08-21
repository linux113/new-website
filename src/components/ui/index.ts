/**
 * SRIYAAN METALS — UI primitives barrel (FORGE/01).
 *
 * Layer rules (docs/COMPONENT-ARCHITECTURE.md §1):
 * primitives are dumb, token-driven, and content-free. They never
 * hardcode colors/spacing — design tokens only (globals.css @theme).
 *
 * Phase 1–3 exports. Later phases add: Button, Badge, Card, RowItem,
 * form primitives, Spinner, Alert, Toast.
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
