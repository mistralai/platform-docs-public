export const SectionWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-[5000px] [&>.section]:mb-16 [&>.section]:last:mb-0">
      {children}
    </div>
  );
};

export const Section = ({ children }: { children: React.ReactNode }) => {
  return <div className="section">{children}</div>;
};
