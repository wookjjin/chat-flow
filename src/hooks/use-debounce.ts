import { useEffect, useState } from 'react';

/**
 * useDebounce
 * @param value 디바운스할 값
 * @param delay ms 단위 지연 시간
 * @returns 디바운스된 값
 */
export function useDebounce<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);

      return () => {
        clearTimeout(handler);
      };
    }, delay);
  }, [value, delay]);

  return debouncedValue;
}
