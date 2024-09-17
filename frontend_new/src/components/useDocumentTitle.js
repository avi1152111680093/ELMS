import { useRef, useEffect } from "react";

function useDocumentTitle(title, prevailOnUnmount = false) {
  const defaultTitle = useRef(document.title);

  useEffect(
    (prevailOnUnmount) => (prevailOnUnmount) => {
      if (!prevailOnUnmount) {
        document.title = defaultTitle.current;
      }
    },
    []
  );
  useEffect(() => {
    document.title = title;
  }, [title]);
}

export default useDocumentTitle;
