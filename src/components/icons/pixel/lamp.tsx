import * as React from 'react';

const LampIcon = (props: React.SVGProps<SVGSVGElement>) => {
  const id = React.useId();
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <g fill="currentColor" clipPath={`url(#${id})`}>
        <path d="M16.8.5H7.2v3.286h9.6V.5ZM7.2 3.785H4v9.857h3.2V3.785ZM10.4 20.214V23.5h3.2v-3.286h3.2v-6.571H13.6v-3.286H10.4v3.286H7.2v6.571h3.2ZM20 3.785h-3.2v9.857H20V3.785Z" />
      </g>
      <defs>
        <clipPath id={id}>
          <path fill="#fff" d="M4 .5h16v23H4z" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default LampIcon;
