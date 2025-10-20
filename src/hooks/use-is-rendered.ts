import * as React from 'react';

export function useIsRendered() {
  const [isRendered, setIsRendered] = React.useState(false);
  React.useEffect(() => {
    setIsRendered(true);

    return () => {
      setIsRendered(false);
    };
  }, []);
  return isRendered;
}
