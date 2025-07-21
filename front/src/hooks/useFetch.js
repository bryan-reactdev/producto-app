import { useEffect, useState, useCallback } from "react"
import { getErrorMessage, retryWithBackoff } from '../utils/errorHandling'

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function useFetch(endpoint){
    const [data, setData] = useState(null);
    const [isPending, setIsPending] = useState(true);
    const [error, setError] = useState(null);
    const [reloadFlag, setReloadFlag] = useState(0);

    const refetch = useCallback(() => {
        setReloadFlag(flag => flag + 1);
    }, []);
    
    useEffect(() =>{
        let isMounted = true;
        setIsPending(true);
        retryWithBackoff(() => fetch(`${API_URL}/api/${endpoint}`))
        .then(async res => {
            if (!res.ok){
                // Try to parse error message from backend
                let errMsg = res.statusText;
                try {
                    const errJson = await res.json();
                    if (errJson && errJson.message) errMsg = errJson.message;
                } catch {}
                throw new Error(errMsg || `Request failed with status ${res.status}`);
            }
            return res.json();
        })
        .then(data =>{
            if (!isMounted) return;
            setData(data);
            setIsPending(false);
            setError(null);
        })
        .catch(err =>{
            if (!isMounted) return;
            setIsPending(false);
            setError(getErrorMessage(err));
        })
        return () => { isMounted = false; };
    }, [endpoint, reloadFlag]);

    return {data, isPending, error, refetch}
}