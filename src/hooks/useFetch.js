import { useEffect, useState } from "react";

export function useFetch(fetcher, deps = []) {
  const [state, setState] = useState({
    data: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let isCurrent = true;
    setState({ data: null, isLoading: true, error: null });

    Promise.resolve()
      .then(fetcher)
      .then((data) => {
        if (isCurrent) setState({ data, isLoading: false, error: null });
      })
      .catch((err) => {
        if (isCurrent) {
          setState({ data: null, isLoading: false, error: err.message });
        }
      });

    return () => {
      isCurrent = false;
    };
  }, deps);

  return state;
}
