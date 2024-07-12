"use client";

import { useState } from "react";

function shuffle(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * i);
    let aux = array[i];
    array[i] = array[j];
    array[j] = aux;
  }

  return array;
}

const generateHistory = (length: number) =>
  shuffle(Array.from(new Array(length)).map((_, i) => i))

export default function useShuffled<T>(arr: T[]) {
  const [history, setHistory] = useState<number[]>(
    generateHistory(arr.length)
  );
  const [currentIndex, setCurrentIndex] = useState(0);

  return {
    item: arr[history[currentIndex]],
    next: () => {
      if (currentIndex + 1 >= history.length) {
        let insert = generateHistory(arr.length);
        if (insert[0] === history[history.length - 1])
          insert = insert.reverse();
        setHistory([...history, ...insert]);
      }
      setCurrentIndex(currentIndex + 1);
    },
    prev: () => {
      if (currentIndex > 0)
        setCurrentIndex(currentIndex - 1);
    },
    canPrev: () => currentIndex > 0
  };
}