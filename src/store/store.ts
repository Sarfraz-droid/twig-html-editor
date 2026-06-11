import { create } from 'zustand'

export interface HtmlHeadElements {
    title: string;
    metaDescription: string;
    metaKeywords: string;
    viewport: string;
    customHead: string;
}

export type RenderStatus = "idle" | "rendering" | "success" | "warning" | "error";
export type ConsoleSeverity = "info" | "warning" | "error";

export interface ConsoleEntry {
    id: string;
    severity: ConsoleSeverity;
    message: string;
    details?: string;
    timestamp: number;
}

type Store = {
    activeTab: "code" | "serializer";
    twigExtension: string;
    html: string;
    json: string;
    renderedHtml: string;
    htmlHead: HtmlHeadElements;
    renderStatus: RenderStatus;
    consoleEntries: ConsoleEntry[];
    isConsoleOpen: boolean;
    setHtml: (html: string) => void;
    setJson: (json: string) => void;
    setRenderedHtml: (renderedHtml: string) => void;
    setHtmlHead: (htmlHead: Partial<HtmlHeadElements>) => void;
    setTwigExtension: (twigExtension: string) => void;
    setActiveTab: (tab: "code" | "serializer") => void;
    setRenderStatus: (status: RenderStatus) => void;
    addConsoleEntry: (entry: Omit<ConsoleEntry, "id" | "timestamp">) => void;
    clearConsole: () => void;
    setConsoleOpen: (isOpen: boolean) => void;
};

export const useStore = create<Store>((set) => ({
    activeTab: "code",
    twigExtension: "(Twig) => {}",
    html: `<header>
    <h1>Welcome to {{name}}</h1>
    <p>Today is: {{now() | dateFormat}}</p>
</header>
<main>
    <div class="content">
        <h2>About {{name}}</h2>
        <p>This page demonstrates the HTML head integration with Twig templating.</p>
        <p>The page title, meta description, and other head elements are now configurable!</p>
        <p><a href="https://example.com">This link will open in a new tab</a></p>
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
    renderStatus: "idle",
    consoleEntries: [],
    isConsoleOpen: true,
    setHtml: (html: string) => set({ html }),
    setJson: (json: string) => set({ json }),
    setRenderedHtml: (renderedHtml: string) => set({ renderedHtml }),
    setHtmlHead: (htmlHead: Partial<HtmlHeadElements>) =>
        set((state) => ({
            htmlHead: { ...state.htmlHead, ...htmlHead }
        })),
    setTwigExtension: (twigExtension: string) => set({ twigExtension }),
    setActiveTab: (tab: "code" | "serializer") => set({ activeTab: tab }),
    setRenderStatus: (renderStatus: RenderStatus) => set({ renderStatus }),
    addConsoleEntry: (entry) =>
        set((state) => ({
            consoleEntries: [
                ...state.consoleEntries,
                {
                    ...entry,
                    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
                    timestamp: Date.now()
                }
            ],
            isConsoleOpen:
                entry.severity === "error" ? true : state.isConsoleOpen
        })),
    clearConsole: () => set({ consoleEntries: [] }),
    setConsoleOpen: (isConsoleOpen: boolean) => set({ isConsoleOpen })
}));
