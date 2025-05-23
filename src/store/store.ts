import { create } from 'zustand'

type Store = {
    html: string;
    json: string;
    renderedHtml: string;
    setHtml: (html: string) => void;
    setJson: (json: string) => void;
    setRenderedHtml: (renderedHtml: string) => void;
}

export const useStore = create<Store>((set) => ({
    html: '<div>{{name}}</div>',
    json: '{"name": "John"}',
    renderedHtml: '',
    setHtml: (html: string) => set({ html }),
    setJson: (json: string) => set({ json }),
    setRenderedHtml: (renderedHtml: string) => set({ renderedHtml }),
}))

