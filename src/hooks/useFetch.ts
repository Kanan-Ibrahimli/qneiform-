import { useCallback, useEffect, useState } from "react";

export const useFetch = <T, E = unknown>(
  input: RequestInfo | URL,
  options?: RequestInit,
) => {
  const [data, setData] = useState<T>();
  const [error, setError] = useState<E>();
  const [loading, setLoading] = useState(false);

  const fetchFn = useCallback(async () => {
    setLoading(true);

    try {
      const response = await fetch(input, options);
      const result = (await response.json()) as T;

      setData(result);
    } catch (error) {
      setError(error as E);
    } finally {
      setLoading(false);
    }
  }, [input, options]);

  useEffect(() => {
    fetchFn();
  }, [fetchFn]);

  return { data, error, loading };
};
