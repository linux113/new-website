import { cn } from "@/lib/cn";

type ContainerProps<T extends React.ElementType> = {
  /** Render as a different element (e.g. "nav", "footer"). Default: "div". */
  as?: T;
  className?: string;
  children?: React.ReactNode;
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "className" | "children">;

/**
 * The single page container (DS §18).
 * Full-width (fills the viewport) with responsive gutters:
 * 20px mobile / 32px ≥ md / 48px ≥ xl / 64px ≥ 2xl.
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
        "mx-auto w-full max-w-none px-5 md:px-8 xl:px-12 2xl:px-16",
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}
