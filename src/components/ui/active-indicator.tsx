export const ActiveIndicator = ({
  className,
  ...props
}: { className?: string } & React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={className} {...props}>
      <div className="size-[7px] bg-primary" />
    </div>
  );
};
