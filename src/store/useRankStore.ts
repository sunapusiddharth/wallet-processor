// store/useRankStore.ts
import { create } from 'zustand';
import { RankEntry } from '../interfaces';

type SortOrder = 'asc' | 'desc';

interface RankStore {
    filter: string;
    sortBy: keyof RankEntry;
    sortOrder: SortOrder;
    setFilter: (filter: string) => void;
    setSort: (field: keyof RankEntry, order: SortOrder) => void;
}

export const useRankStore = create<RankStore>((set) => ({
    filter: '',
    sortBy: 'realized_profit',
    sortOrder: 'desc',
    setFilter: (filter) => set({ filter }),
    setSort: (field, order) => set({ sortBy: field, sortOrder: order }),
}));
