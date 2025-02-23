import { useEffect, useState } from 'react';

export function useChunkedData<T>(data: T[], itemsPerSlide: number, chunkMultiplier: number = 2): T[][] {
  const [chunkedData, setChunkedData] = useState<T[][]>([]);

  useEffect(() => {
    const chunkSize = itemsPerSlide * chunkMultiplier;
    const chunks: T[][] = [];
    for (let i = 0; i < data.length; i += chunkSize) {
      chunks.push(data.slice(i, i + chunkSize));
    }
    setChunkedData(chunks);
  }, [itemsPerSlide, data, chunkMultiplier]);

  return chunkedData;
}
