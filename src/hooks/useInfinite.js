import { useEffect, useRef, useState } from "react";

export function useInfiniteList(total, pageSize = 24) {
  const [count, setCount] = useState(pageSize);
  const sentinelRef = useRef(null);

  // Reset the window whenever the filtered result set changes.
  useEffect(() => {
    setCount(pageSize);
  }, [total, pageSize]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCount((current) => Math.min(current + pageSize, total));
        }
      },
      { rootMargin: "500px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [total, pageSize]);

  return { count, sentinelRef, hasMore: count < total };
}
