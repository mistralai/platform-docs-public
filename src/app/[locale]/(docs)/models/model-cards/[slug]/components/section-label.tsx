interface SectionLabelProps extends React.HTMLAttributes<HTMLSpanElement> {
  icon?: React.ElementType;
}

export function SectionLabel({ icon, children, ...props }: SectionLabelProps) {
  const Icon = icon;

  return (
    <span
      className="inline-flex items-center gap-1 leading-none text-xs font-semibold font-mono uppercase text-foreground/50"
      {...props}
    >
      {Icon && <Icon className="size-3.5 opacity-50 text-foreground" />}
      {children}
    </span>
  );
}
