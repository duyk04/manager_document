"use client"

import { useState, useEffect } from 'react';

function useFetchApi(url: string, options = {}) {
    const [data, setData] = useState(null); // Lưu trữ dữ liệu
    const [loading, setLoading] = useState(true); // Trạng thái loading

    useEffect(() => {
        let isMounted = true; // Dùng để tránh update state khi component unmount

        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch(url, options);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const result = await response.json();
                if (isMounted) {
                    setData(result);
                }
            } catch (e) {
                if (isMounted) {
                   console.error(e);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchData();

        // Cleanup function
        return () => {
            isMounted = false;
        };
    }, [url, options]);

    return { data, loading };
}

export default useFetchApi;
