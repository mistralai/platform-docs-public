declare global {
  interface Window {
    SHOW_ALL_COOKBOOKS: boolean;
  }
}

export const ShowAllCookbooksInlineScript = () => {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `(${(() => {
          try {
            const sessionShowAll =
              sessionStorage.getItem('cookbook-showAll') === '1';
            if (sessionShowAll) window.SHOW_ALL_COOKBOOKS = true;
            else window.SHOW_ALL_COOKBOOKS = false;
          } catch (e) {
            console.error(e);
          }
        }).toString()})()`,
      }}
    />
  );
};
