import { create } from "zustand";

export interface ITwigFunctions {
    id: string;
    name: string;
    function: string;
}

export interface ITwigFunctionsStore {
    twigFunctions: ITwigFunctions[];
    selectedFunction: ITwigFunctions | null;
    setTwigFunctions: (twigFunctions: ITwigFunctions[]) => void;
    setSelectedFunction: (selectedFunction: ITwigFunctions | null) => void;
}

export const useTwigFunctionsStore = create<ITwigFunctionsStore>((set) => ({
    twigFunctions: [],
    selectedFunction: null,
    setTwigFunctions: (twigFunctions: ITwigFunctions[]) =>
        set({ twigFunctions }),
    setSelectedFunction: (selectedFunction: ITwigFunctions | null) =>
        set({ selectedFunction })
}));
