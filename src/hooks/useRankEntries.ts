// hooks/useRankEntries.ts
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useRankStore } from '../store/useRankStore';
import { kols_whales } from '../server/kols_whales';

const PAGE_SIZE = 20;

const fetchRankEntries = async ({ pageParam = 0 }) => {
    const { filter, sortBy, sortOrder } = useRankStore.getState();

    // Filter
    let filtered = kols_whales;
    if (filter) {
        const lower = filter.toLowerCase();
        filtered = filtered.filter((entry) =>
            entry.wallet_address.toLowerCase().includes(lower) ||
            entry.address.toLowerCase().includes(lower)
        );
    }

    // Sort
    filtered.sort((a, b) => {
        const aVal = a[sortBy];
        const bVal = b[sortBy];
        if (typeof aVal === 'number' && typeof bVal === 'number') {
            return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
        }
        if (typeof aVal === 'string' && typeof bVal === 'string') {
            return sortOrder === 'asc'
                ? aVal.localeCompare(bVal)
                : bVal.localeCompare(aVal);
        }
        return 0;
    });

    // Paginate
    const start = pageParam * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    const items = filtered.slice(start, end);
    const nextPage = end < filtered.length ? pageParam + 1 : undefined;

    return { items, nextPage };
};

export const useRankEntries = () =>
    useInfiniteQuery(['rank-entries'], fetchRankEntries, {
        getNextPageParam: (lastPage) => lastPage.nextPage,
    });
