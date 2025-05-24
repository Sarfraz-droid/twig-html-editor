import { create } from 'zustand'

export interface HtmlHeadElements {
    title: string;
    metaDescription: string;
    metaKeywords: string;
    viewport: string;
    customHead: string;
}

type Store = {
    html: string;
    json: string;
    renderedHtml: string;
    htmlHead: HtmlHeadElements;
    setHtml: (html: string) => void;
    setJson: (json: string) => void;
    setRenderedHtml: (renderedHtml: string) => void;
    setHtmlHead: (htmlHead: Partial<HtmlHeadElements>) => void;
};

export const useStore = create<Store>((set) => ({
    html: `<header>
    <h1>Welcome to {{name}}</h1>
    <p>Today is: {{now() | dateFormat}}</p>
</header>
<main>
    <div class="content">
        <h2>About {{name}}</h2>
        <p>This page demonstrates the HTML head integration with Twig templating.</p>
        <p>The page title, meta description, and other head elements are now configurable!</p>
    </div>
</main>
<footer>
    <p>&copy; {{now() | year}} - Built with Twig HTML Editor</p>
</footer>`,
    json: '{"name": "Twig HTML Editor"}',
    renderedHtml: "",
    htmlHead: {
        title: "Twig HTML Editor - Dynamic HTML with Head Elements",
        metaDescription:
            "A powerful HTML editor with Twig templating support and configurable head elements",
        metaKeywords: "twig, html, editor, templating, meta tags",
        viewport: "width=device-width, initial-scale=1.0",
        customHead:
            '<meta charset="UTF-8">\n<style>\n  body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }\n  .content { max-width: 800px; margin: 0 auto; }\n</style>'
    },
    setHtml: (html: string) => set({ html }),
    setJson: (json: string) => set({ json }),
    setRenderedHtml: (renderedHtml: string) => set({ renderedHtml }),
    setHtmlHead: (htmlHead: Partial<HtmlHeadElements>) =>
        set((state) => ({
            htmlHead: { ...state.htmlHead, ...htmlHead }
        }))
}));

