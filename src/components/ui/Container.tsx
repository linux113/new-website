import { cn } from "@/lib/cn";

type ContainerProps<T extends React.ElementType> = {
  /** Render as a different element (e.g. "nav", "footer"). Default: "div". */
  as?: T;
  className?: string;
  children?: React.ReactNode;
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "className" | "children">;

/**
 * The single page container (DS §18).
 * Max-width 1360px (--container-content), standard responsive gutters:
 * 20px mobile / 32px ≥ md / 48px ≥ xl. No ad-hoc max-widths elsewhere.
 */
export function Container<T extends React.ElementType = "div">({
  as,
  className,
  children,
  ...rest
}: ContainerProps<T>) {
  const Tag = (as ?? "div") as React.ElementType;

  return (
    <Tag
      className={cn(
        "mx-auto w-full max-w-(--container-content) px-5 md:px-8 xl:px-12",
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}
