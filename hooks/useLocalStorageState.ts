"use client";

import { useEffect, useState } from "react";

export default function useLocalStorageState<T>(
  key: string,
  defaultValue: T,
): [T, (value: T) => void] {
  const [state, setState] = useState<T>(defaultValue);

  useEffect(() => {
    const value = window.localStorage.getItem(key);

    if (value) setState(JSON.parse(value));
  }, []);

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(state));
  }, [state]);

  return [state, setState];
}
