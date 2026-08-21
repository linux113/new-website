/**
 * SRIYAAN METALS — UI primitives barrel (FORGE/01).
 *
 * Layer rules (docs/COMPONENT-ARCHITECTURE.md §1):
 * primitives are dumb, token-driven, and content-free. They never
 * hardcode colors/spacing — design tokens only (globals.css @theme).
 *
 * Phase 1 exports. Later phases add: Button, Badge, Card, RowItem,
 * Icon, form primitives, Skeleton, Spinner, EmptyState, Alert, Toast.
 */
export { Container } from "./Container";
export { Section } from "./Section";
export type { SectionSurface } from "./Section";
export { Hairline } from "./Hairline";
export { Eyebrow } from "./Eyebrow";
export { IndexNumber } from "./IndexNumber";
export { SectionHeading } from "./SectionHeading";
