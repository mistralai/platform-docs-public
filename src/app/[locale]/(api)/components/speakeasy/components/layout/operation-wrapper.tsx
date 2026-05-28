export function OperationWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div
      data-type="operation"
      className="operation-grid first:api-desktop:*:pt-0 api-desktop:*:pt-16 pt-12 api-desktop:pt-0 self-stretch"
    >
      {children}
    </div>
  );
}
