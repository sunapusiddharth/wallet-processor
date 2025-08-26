// components/RankTable.tsx
import { useRankEntries } from '../hooks/useRankEntries';
import { RankEntry } from '../interfaces';
import { useRankStore } from '../store/useRankStore';
import { useEffect, useRef } from 'react';

export const RankTable = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useRankEntries();
  const { setFilter, setSort, sortBy, sortOrder } = useRankStore();
  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry && entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    });
    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage]);

  const handleSort = (field: keyof RankEntry) => {
    const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSort(field, newOrder);
  };

  return (
    <div className="p-4">
      <input
        type="text"
        placeholder="Filter by address..."
        className="mb-4 p-2 border rounded w-full"
        onChange={(e) => setFilter(e.target.value)}
      />
      <table className="table-auto w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 cursor-pointer" onClick={() => handleSort('wallet_address')}>Wallet</th>
            <th className="p-2 cursor-pointer" onClick={() => handleSort('realized_profit')}>Profit</th>
            <th className="p-2 cursor-pointer" onClick={() => handleSort('balance')}>Balance</th>
            <th className="p-2">Followers</th>
          </tr>
        </thead>
        <tbody>
          {data?.pages.map((page) =>
            page.items.map((entry: RankEntry) => (
              <tr key={entry.wallet_address} className="border-t">
                <td className="p-2">{entry.wallet_address}</td>
                <td className="p-2">{entry.realized_profit.toFixed(2)}</td>
                <td className="p-2">{entry.balance.toFixed(2)}</td>
                <td className="p-2">{entry.followers_count}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <div ref={observerRef} className="h-10" />
      {isFetchingNextPage && <p className="text-center mt-4">Loading more...</p>}
    </div>
  );
};
