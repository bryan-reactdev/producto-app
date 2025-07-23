import { useEffect, useState, useCallback, useRef } from "react";
import { getErrorMessage, retryWithBackoff } from '../utils/errorHandling';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function useFetch(endpoint) {
  const [data, setData] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);

  const isMounted = useRef(true);

  const fetchData = useCallback(async () => {
    if (!endpoint || endpoint.includes('undefined')) {
      setData(null);
      setIsPending(false);
      setError(null);
      return;
    }

    setIsPending(true);
    setError(null);

    try {
      const res = await retryWithBackoff(() => fetch(`${API_URL}/api/${endpoint}`));
      if (!res.ok) {
        let errMsg = res.statusText || `Request failed with status ${res.status}`;
        try {
          const errJson = await res.json();
          if (errJson?.message) errMsg = errJson.message;
        } catch {
          // ignore JSON parse error
        }
        console.warn(`[useFetch] Fetch error: ${errMsg}`);
        throw new Error(errMsg);
      }

      const responseData = await res.json();

      if (!isMounted.current) return;
      setData(responseData);
      setIsPending(false);
      setError(null);

      return responseData;
    } catch (err) {
      if (!isMounted.current) return;
      setIsPending(false);
      setError(getErrorMessage(err));
      console.error('[useFetch] Fetch error:', err);
      throw err;
    }
  }, [endpoint]);

  useEffect(() => {
    isMounted.current = true;
    fetchData();
    return () => {
      isMounted.current = false;
    };
  }, [fetchData]);

  const refetch = useCallback(() => fetchData(), [fetchData]);

  return { data, isPending, error, refetch };
}
