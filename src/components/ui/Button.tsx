import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "ghost" | "ghost-light" | "dark";
type Size = "md" | "sm";

type Common = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};
type AnchorProps = Common &
  Omit<ComponentPropsWithoutRef<"a">, keyof Common> & { href: string };
type ButtonProps = Common &
  Omit<ComponentPropsWithoutRef<"button">, keyof Common> & { href?: undefined };

const base =
  "inline-flex cursor-pointer items-center gap-2 rounded-full border-2 font-semibold no-underline transition-[transform,background-color,border-color,color,box-shadow] duration-150 ease-out hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.985] motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:active:scale-100";

const variants: Record<Variant, string> = {
  primary:
    "border-transparent bg-primary text-white shadow-[0_8px_20px_rgb(194_103_69/0.32)] hover:bg-primary-600 hover:shadow-[0_10px_24px_rgb(194_103_69/0.38)] active:shadow-[0_4px_12px_rgb(194_103_69/0.3)]",
  ghost: "border-secondary text-secondary hover:bg-secondary hover:text-cream",
  "ghost-light": "border-cream/60 text-cream hover:bg-cream hover:text-secondary",
  dark: "border-transparent bg-secondary text-cream hover:bg-[#071729]",
};

const sizes: Record<Size, string> = {
  md: "px-[26px] py-[14px] text-base",
  sm: "px-5 py-2.5 text-sm",
};

/** Botón de VentuUI. Con `href` renderiza un <a>; sin `href`, un <button>. */
export function Button(props: AnchorProps | ButtonProps) {
  const { variant = "primary", size = "md", className, children, ...rest } = props;
  const cls = cn(base, variants[variant], sizes[size], className);

  if (rest.href !== undefined) {
    return (
      <a className={cls} {...(rest as Omit<AnchorProps, keyof Common>)}>
        {children}
      </a>
    );
  }
  const { type = "button", ...buttonRest } = rest as Omit<ButtonProps, keyof Common>;
  return (
    <button className={cls} type={type} {...buttonRest}>
      {children}
    </button>
  );
}
