"use client";

import { useEffect, useState } from "react";

export default function useLocalStorageState<T>(
  key: string,
  defaultValue: T,
): [T, (value: T) => void, boolean] {
  const [state, setState] = useState<T>(defaultValue);
  const [loading, setLoading] = useState(true);
  const setLocalStorageState = (value: T) => {
    window.localStorage.setItem(key, JSON.stringify(value));
    setState(value);
  };

  useEffect(() => {
    const localStorageValue = window.localStorage.getItem(key);
    const value =
      (localStorageValue ? JSON.parse(localStorageValue) : null) ||
      defaultValue;

    setLocalStorageState(value);
    setLoading(false);
  }, []);

  return [state, setLocalStorageState, loading];
}
