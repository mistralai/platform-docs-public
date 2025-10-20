'use client';

export default function CookieTrigger({ title }: { title?: string | null }) {
  interface CookieEvent extends React.MouseEvent<HTMLButtonElement> {
    preventDefault: () => void;
  }

  const callCookies = (e: CookieEvent): void => {
    e.preventDefault(); // Prevent the default anchor behavior
    if (typeof window !== 'undefined' && window.openAxeptioCookies) {
      window.openAxeptioCookies(); // Call the global function
    } else {
      console.error('openAxeptioCookies function is not defined');
    }
  };
  return (
    <button
      className="text-sm text-foreground/70 hover:text-foreground transition-colors duration-200 flex items-center gap-1"
      onClick={callCookies}
    >
      {title || 'Manage Cookies'}
    </button>
  );
}
