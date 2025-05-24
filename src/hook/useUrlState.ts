import { useCallback, useEffect } from "react";
import { useStore } from "@/store/store";
import type { HtmlHeadElements } from "@/store/store";
import LZString from "lz-string";

interface UrlState {
    html: string;
    json: string;
    htmlHead: HtmlHeadElements;
    twigExtension: string;
}

export const useUrlState = () => {
    const {
        twigExtension,
        html,
        json,
        htmlHead,
        setHtml,
        setJson,
        setHtmlHead,
        setTwigExtension
    } = useStore();

    // Optimize state for compression by removing default values
    const optimizeState = useCallback((state: UrlState): Partial<UrlState> => {
        const optimized: Partial<UrlState> = {};

        console.log(state, optimized);

        // Only include HTML if it's different from default
        const defaultHtml = `<header>
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
</footer>`;

        console.log(state.html, defaultHtml);

        if (state.html !== defaultHtml) {
            optimized.html = state.html;
        }

        if (state.twigExtension !== `(Twig) => {}`) {
            optimized.twigExtension = state.twigExtension;
        }

        // Only include JSON if it's different from default
        const defaultJson = '{"name": "Twig HTML Editor"}';
        if (state.json !== defaultJson) {
            optimized.json = state.json;
        }

        // Only include head elements that are different from defaults
        const defaultHead = {
            title: "Twig HTML Editor - Dynamic HTML with Head Elements",
            metaDescription:
                "A powerful HTML editor with Twig templating support and configurable head elements",
            metaKeywords: "twig, html, editor, templating, meta tags",
            viewport: "width=device-width, initial-scale=1.0",
            customHead:
                '<meta charset="UTF-8">\n<style>\n  body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }\n  .content { max-width: 800px; margin: 0 auto; }\n</style>'
        };

        const headDiff: Partial<HtmlHeadElements> = {};
        if (state.htmlHead.title !== defaultHead.title) {
            headDiff.title = state.htmlHead.title;
        }
        if (state.htmlHead.metaDescription !== defaultHead.metaDescription) {
            headDiff.metaDescription = state.htmlHead.metaDescription;
        }
        if (state.htmlHead.metaKeywords !== defaultHead.metaKeywords) {
            headDiff.metaKeywords = state.htmlHead.metaKeywords;
        }
        if (state.htmlHead.viewport !== defaultHead.viewport) {
            headDiff.viewport = state.htmlHead.viewport;
        }
        if (state.htmlHead.customHead !== defaultHead.customHead) {
            headDiff.customHead = state.htmlHead.customHead;
        }

        if (Object.keys(headDiff).length > 0) {
            optimized.htmlHead = headDiff as HtmlHeadElements;
        }

        return optimized;
    }, []);

    // Restore full state from optimized state
    const restoreState = useCallback(
        (optimized: Partial<UrlState>): UrlState => {
            const defaultHtml = `<header>
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
</footer>`;

            const defaultJson = '{"name": "Twig HTML Editor"}';

            const defaultHead = {
                title: "Twig HTML Editor - Dynamic HTML with Head Elements",
                metaDescription:
                    "A powerful HTML editor with Twig templating support and configurable head elements",
                metaKeywords: "twig, html, editor, templating, meta tags",
                viewport: "width=device-width, initial-scale=1.0",
                customHead:
                    '<meta charset="UTF-8">\n<style>\n  body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }\n  .content { max-width: 800px; margin: 0 auto; }\n</style>'
            };

            const defaultTwigExtension = `(Twig) => {}`;

            return {
                html: optimized.html || defaultHtml,
                json: optimized.json || defaultJson,
                htmlHead: {
                    title: optimized.htmlHead?.title || defaultHead.title,
                    metaDescription:
                        optimized.htmlHead?.metaDescription ||
                        defaultHead.metaDescription,
                    metaKeywords:
                        optimized.htmlHead?.metaKeywords ||
                        defaultHead.metaKeywords,
                    viewport:
                        optimized.htmlHead?.viewport || defaultHead.viewport,
                    customHead:
                        optimized.htmlHead?.customHead || defaultHead.customHead
                },
                twigExtension: optimized.twigExtension || defaultTwigExtension
            };
        },
        []
    );

    // Compress and encode state for URL
    const encodeState = useCallback(
        (state: UrlState): string => {
            try {
                // First optimize the state to remove defaults
                const optimizedState = optimizeState(state);

                console.log(optimizedState);

                // Only compress if there's actual data to encode
                if (Object.keys(optimizedState).length === 0) {
                    return ""; // Empty state means default values
                }

                // Compress using LZ-string
                const stateString = JSON.stringify(optimizedState);
                const compressed =
                    LZString.compressToEncodedURIComponent(stateString);

                return compressed;
            } catch (error) {
                console.error("Error encoding state:", error);
                return "";
            }
        },
        [optimizeState]
    );

    // Decode and decompress state from URL
    const decodeState = useCallback(
        (encodedState: string): UrlState | null => {
            try {
                if (!encodedState) {
                    // Return default state if no encoded state
                    return restoreState({});
                }

                // Decompress using LZ-string
                const decompressed =
                    LZString.decompressFromEncodedURIComponent(encodedState);
                if (!decompressed) {
                    throw new Error("Failed to decompress state");
                }

                const optimizedState = JSON.parse(
                    decompressed
                ) as Partial<UrlState>;
                return restoreState(optimizedState);
            } catch (error) {
                console.error("Error decoding state:", error);
                return null;
            }
        },
        [restoreState]
    );

    // Generate shareable URL with current state using hash fragment
    const generateShareableUrl = useCallback((): string => {
        const currentState: UrlState = {
            html,
            json,
            htmlHead,
            twigExtension
        };

        const encodedState = encodeState(currentState);
        const currentUrl = new URL(window.location.href);

        // Clear existing parameters and use hash fragment
        currentUrl.search = "";
        currentUrl.hash = encodedState ? `#state=${encodedState}` : "";

        return currentUrl.toString();
    }, [html, json, htmlHead, encodeState, twigExtension]);

    // Load state from URL hash fragment
    const loadStateFromUrl = useCallback(() => {
        try {
            const hash = window.location.hash;

            if (hash.startsWith("#state=")) {
                const encodedState = hash.substring(7); // Remove '#state='
                const decodedState = decodeState(encodedState);

                console.log("decodedState", decodedState);

                if (decodedState) {
                    setHtml(decodedState.html);
                    setJson(decodedState.json);
                    setHtmlHead(decodedState.htmlHead);
                    setTwigExtension(decodedState.twigExtension);
                    return true;
                }
            }

            return false;
        } catch (error) {
            console.error("Error loading state from URL:", error);
            return false;
        }
    }, [decodeState, setHtml, setJson, setHtmlHead]);

    // Copy shareable URL to clipboard
    const copyShareableUrl = useCallback(async (): Promise<boolean> => {
        try {
            const shareableUrl = generateShareableUrl();
            await navigator.clipboard.writeText(shareableUrl);
            return true;
        } catch (error) {
            console.error("Error copying to clipboard:", error);
            // Fallback for older browsers
            try {
                const shareableUrl = generateShareableUrl();
                const textArea = document.createElement("textarea");
                textArea.value = shareableUrl;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand("copy");
                document.body.removeChild(textArea);
                return true;
            } catch (fallbackError) {
                console.error("Fallback copy failed:", fallbackError);
                return false;
            }
        }
    }, [generateShareableUrl]);

    // Update URL hash with current state (debounced)
    const updateUrlWithState = useCallback(() => {
        const currentState: UrlState = {
            html,
            json,
            htmlHead,
            twigExtension
        };

        const encodedState = encodeState(currentState);
        const newHash = encodedState ? `#state=${encodedState}` : "";

        // Update hash without reloading the page
        if (window.location.hash !== newHash) {
            window.history.replaceState(
                {},
                "",
                window.location.pathname + window.location.search + newHash
            );
        }
    }, [html, json, htmlHead, encodeState, twigExtension]);

    // Initialize: Load state from URL on mount
    useEffect(() => {
        loadStateFromUrl();
    }, [loadStateFromUrl]);

    return {
        generateShareableUrl,
        copyShareableUrl,
        loadStateFromUrl,
        updateUrlWithState,
        encodeState,
        decodeState
    };
};
