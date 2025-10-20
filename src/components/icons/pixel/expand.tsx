import { cn } from '@/lib/utils';

export const ExpandIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      className={cn('w-4 h-4', className)}
      width="23"
      height="23"
      viewBox="0 0 23 23"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.0633 6.12739V5.00317L10.939 5.00317V6.12739H12.0633Z"
        fill="currentColor"
      />
      <path
        d="M13.1875 7.2516V6.12739H12.0633V7.2516H13.1875Z"
        fill="currentColor"
      />
      <path
        d="M10.939 7.2516L10.939 6.12739L9.81483 6.12739L9.81483 7.2516H10.939Z"
        fill="currentColor"
      />
      <path
        d="M9.81483 8.37582L9.81483 7.2516L8.69062 7.2516L8.69062 8.37582L9.81483 8.37582Z"
        fill="currentColor"
      />
      <path
        d="M8.69062 9.50003L8.69062 8.37582H7.56641L7.56641 9.50003H8.69062Z"
        fill="currentColor"
      />
      <path
        d="M14.3117 8.37582V7.2516H13.1875V8.37582H14.3117Z"
        fill="currentColor"
      />
      <path
        d="M15.4359 9.50003V8.37582H14.3117V9.50003H15.4359Z"
        fill="currentColor"
      />
      <path
        d="M10.939 16.8726V17.9969H12.0633V16.8726H10.939Z"
        fill="currentColor"
      />
      <path
        d="M9.81483 15.7484V16.8726L10.939 16.8726V15.7484L9.81483 15.7484Z"
        fill="currentColor"
      />
      <path
        d="M12.0633 15.7484V16.8726H13.1875V15.7484L12.0633 15.7484Z"
        fill="currentColor"
      />
      <path
        d="M13.1875 14.6242V15.7484H14.3117V14.6242L13.1875 14.6242Z"
        fill="currentColor"
      />
      <path
        d="M14.3117 13.5V14.6242L15.4359 14.6242V13.5L14.3117 13.5Z"
        fill="currentColor"
      />
      <path
        d="M8.69062 14.6242L8.69062 15.7484L9.81483 15.7484L9.81483 14.6242H8.69062Z"
        fill="currentColor"
      />
      <path
        d="M7.56641 13.5L7.56641 14.6242L8.69062 14.6242V13.5L7.56641 13.5Z"
        fill="currentColor"
      />
    </svg>
  );
};
