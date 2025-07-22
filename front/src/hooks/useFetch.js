import { useEffect, useState, useCallback, useRef } from "react";
import { getErrorMessage, retryWithBackoff } from '../utils/errorHandling';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function useFetch(endpoint) {
  const [data, setData] = useState(null);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);

  // We keep a ref so that when component unmounts we ignore setting state
  const isMounted = useRef(true);

  // The actual fetch logic as a function that returns a Promise
  const fetchData = useCallback(() => {
    setIsPending(true);
    setError(null);

    return retryWithBackoff(() => fetch(`${API_URL}/api/${endpoint}`))
      .then(async (res) => {
        if (!res.ok) {
          let errMsg = res.statusText;
          try {
            const errJson = await res.json();
            if (errJson && errJson.message) errMsg = errJson.message;
          } catch {}
          throw new Error(errMsg || `Request failed with status ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (!isMounted.current) return;
        setData(data);
        setIsPending(false);
        setError(null);
        return data;  // resolve with data
      })
      .catch((err) => {
        if (!isMounted.current) return;
        setIsPending(false);
        setError(getErrorMessage(err));
        throw err; // re-throw to allow caller to catch
      });
  }, [endpoint]);

  // Initial fetch on mount or endpoint change
  useEffect(() => {
    isMounted.current = true;
    fetchData();
    return () => {
      isMounted.current = false;
    };
  }, [fetchData]);

  // refetch function exposed to caller, returns Promise!
  const refetch = useCallback(() => {
    return fetchData();
  }, [fetchData]);

  return { data, isPending, error, refetch };
}
