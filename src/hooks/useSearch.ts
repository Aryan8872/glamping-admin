"use client";

import { useState, useCallback, useEffect } from "react";
import { useDebounce } from "@/hooks/useDebounce";

interface UseSearchOptions<T> {
    fetchFn: (params: any) => Promise<{
        data: T[];
        total: number;
        page: number;
        perPage: number;
    }>;
    initialParams?: any;
    perPage?: number;
}

export function useSearch<T>({
    fetchFn,
    initialParams = {},
    perPage = 15,
}: UseSearchOptions<T>) {
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [extraParams, setExtraParams] = useState(initialParams);
    const debouncedQuery = useDebounce(searchQuery, 500);

    const fetchData = useCallback(
        async (currentPage: number, query: string, params: any = {}) => {
            setLoading(true);
            try {
                const response = await fetchFn({
                    q: query,
                    page: currentPage,
                    limit: perPage,
                    ...params,
                });
                setData(response.data);
                setTotal(response.total);
                setPage(response.page);
            } catch (error) {
                console.error("Search failed:", error);
            } finally {
                setLoading(false);
            }
        },
        [fetchFn, perPage]
    );

    useEffect(() => {
        fetchData(1, debouncedQuery, extraParams);
    }, [debouncedQuery, extraParams, fetchData]);

    const handlePageChange = (newPage: number) => {
        fetchData(newPage, debouncedQuery, extraParams);
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    const handleFilterChange = (newParams: any) => {
        setExtraParams((prev: any) => ({ ...prev, ...newParams }));
    };

    const refresh = () => {
        fetchData(page, debouncedQuery, extraParams);
    };

    return {
        data,
        loading,
        total,
        page,
        totalPages: Math.ceil(total / perPage),
        handlePageChange,
        handleSearch,
        handleFilterChange,
        searchQuery,
        extraParams,
        refresh,
    };
}
