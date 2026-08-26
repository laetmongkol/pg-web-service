"use client";

import { create } from "zustand";

interface LoadingStore {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

const loadingStore = create<LoadingStore>((set) => ({
  isLoading: false,

  setIsLoading: (isLoading) => {
    set({ isLoading });
  },
}));

export const useLoadingStore = loadingStore;
