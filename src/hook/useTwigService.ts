import { normalizeTwigTemplate } from "@/lib/utils";
import { useStore } from "@/store/store";
import { toast } from "sonner";
import Twig from "twig";

export const useTwigService = () => {
    const {
        twigExtension,
        html,
        json,
        renderedHtml,
        setRenderedHtml,
        htmlHead
    } = useStore();

    const buildErrorHtml = (
        title: string,
        message: string,
        extra?: {
            detailsHtml?: string;
        }
    ) => {
        const details = extra?.detailsHtml || "";
        return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Render Error</title>
  <style>
    :root { color-scheme: light dark; }
    body { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, Noto Sans, Apple Color Emoji, Segoe UI Emoji; margin: 0; padding: 16px; background: #fff; color: #111; }
    .wrap { max-width: 960px; margin: 0 auto; }
    .card { border: 1px solid #fca5a5; background: #fff1f2; color: #7f1d1d; padding: 16px; border-radius: 8px; }
    h1 { font-size: 18px; margin: 0 0 8px; }
    pre { background: #0f172a; color: #f8fafc; padding: 12px; border-radius: 6px; overflow: auto; }
    code { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; font-size: 12px; }
    .muted { color: #334155; }
    .hint { margin-top: 8px; font-size: 12px; }
  </style>
  <base target="_blank" rel="noopener noreferrer" />
  <meta http-equiv="Content-Security-Policy" content="default-src 'self'; style-src 'unsafe-inline' 'self'; img-src data: *;" />
  <meta name="referrer" content="no-referrer" />
  <meta name="robots" content="noindex" />
  <script>document.addEventListener('click', e => { const a = e.target.closest('a'); if (a) { a.setAttribute('target','_blank'); a.setAttribute('rel','noopener noreferrer'); } });</script>
  <style media="(prefers-color-scheme: dark)">
    body { background: #0b0f19; color: #e5e7eb; }
    .card { border-color: #7f1d1d; background: #1c1917; color: #fecaca; }
    .muted { color: #94a3b8; }
  </style>
  <style>@media (max-width: 640px){ pre{ white-space: pre-wrap; word-wrap: break-word; } }</style>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body>
  <div class="wrap">
    <div class="card">
      <h1>Template Render Failed</h1>
      <div class="muted">${title}</div>
      <pre><code>${message.replace(/</g, "&lt;")}</code></pre>
      ${details}
      <div class="hint">Fix the error above and click Render again.</div>
    </div>
  </div>
</body>
</html>`;
    };

    const extractMissingFromError = (
        err: unknown
    ): { functions: string[]; filters: string[]; tests: string[] } => {
        const message = (err as Error)?.message || String(err);
        const functions: string[] = [];
        const filters: string[] = [];
        const tests: string[] = [];

        const candidates: Array<{
            type: "function" | "filter" | "test";
            regexes: RegExp[];
        }> = [
            {
                type: "function",
                regexes: [
                    /unknown function\s+"([a-zA-Z_][\w]*)"/i,
                    /function\s+'?([a-zA-Z_][\w]*)'?\s+(?:is|not|does)/i,
                    /function\s+"?([a-zA-Z_][\w]*)"?\s+is\s+undefined/i
                ]
            },
            {
                type: "filter",
                regexes: [
                    /unknown filter\s+"([a-zA-Z_][\w]*)"/i,
                    /filter\s+'?([a-zA-Z_][\w]*)'?\s+(?:is|not|does)/i,
                    /filter\s+"?([a-zA-Z_][\w]*)"?\s+is\s+undefined/i
                ]
            },
            {
                type: "test",
                regexes: [
                    /unknown test\s+"([a-zA-Z_][\w]*)"/i,
                    /test\s+'?([a-zA-Z_][\w]*)'?\s+(?:is|not|does)/i,
                    /test\s+"?([a-zA-Z_][\w]*)"?\s+is\s+undefined/i
                ]
            }
        ];

        for (const { type, regexes } of candidates) {
            for (const rx of regexes) {
                const m = message.match(rx);
                if (m && m[1]) {
                    if (type === "function" && !functions.includes(m[1]))
                        functions.push(m[1]);
                    if (type === "filter" && !filters.includes(m[1]))
                        filters.push(m[1]);
                    if (type === "test" && !tests.includes(m[1]))
                        tests.push(m[1]);
                }
            }
        }

        return { functions, filters, tests };
    };

    const registerDefaultHelpers = () => {
        // No-op functions commonly used in Twig environments
        const safeFunctions: Record<string, (...args: unknown[]) => string> = {
            asset: (...args: unknown[]) => {
                const path = args[0];
                return typeof path === "string" ? path : String(path ?? "");
            },
            path: (...args: unknown[]) => {
                void args;
                return "#";
            },
            url: (...args: unknown[]) => {
                void args;
                return "#";
            },
            dump: (...args: unknown[]) => JSON.stringify(args, null, 2),
            trans: (...args: unknown[]) => {
                const key = args[0];
                return typeof key === "string" ? key : String(key ?? "");
            },
            translate: (...args: unknown[]) => {
                const key = args[0];
                return typeof key === "string" ? key : String(key ?? "");
            }
        };
        Object.entries(safeFunctions).forEach(([name, fn]) => {
            try {
                Twig.extendFunction(name, fn);
            } catch {
                /* ignore */
            }
        });

        // Lightweight filters (identity or simple transforms)
        const safeFilters: Record<
            string,
            (left: unknown, params: false | unknown[]) => string
        > = {
            json_encode: (value: unknown) => JSON.stringify(value),
            lower: (v: unknown) =>
                typeof v === "string" ? v.toLowerCase() : String(v ?? ""),
            upper: (v: unknown) =>
                typeof v === "string" ? v.toUpperCase() : String(v ?? ""),
            trim: (v: unknown) =>
                typeof v === "string" ? v.trim() : String(v ?? "")
        };
        Object.entries(safeFilters).forEach(([name, fn]) => {
            try {
                Twig.extendFilter(name, fn);
            } catch {
                /* ignore */
            }
        });
    };

    const registerStubs = (missing: {
        functions: string[];
        filters: string[];
        tests: string[];
    }) => {
        missing.functions.forEach((name) => {
            try {
                Twig.extendFunction(name, (...args: unknown[]) => {
                    console.warn(`[Twig] Called stub function "${name}"`, args);
                    return "";
                });
            } catch {
                /* ignore */
            }
        });
        missing.filters.forEach((name) => {
            try {
                const identity = (value: unknown): string => {
                    if (value === null || value === undefined) return "";
                    return typeof value === "string" ? value : String(value);
                };
                const identityCompat = (left: unknown): string =>
                    identity(left);
                Twig.extendFilter(
                    name,
                    identityCompat as unknown as (
                        left: unknown,
                        params: false | unknown[]
                    ) => string
                );
            } catch {
                /* ignore */
            }
        });
        missing.tests.forEach((name) => {
            try {
                // twig.js supports tests via extendTest
                const twigAny = Twig as unknown as {
                    extendTest?: (
                        n: string,
                        fn: (v: unknown) => boolean
                    ) => void;
                };
                if (typeof twigAny.extendTest === "function") {
                    twigAny.extendTest(name, (value: unknown) =>
                        Boolean(value)
                    );
                }
            } catch {
                /* ignore */
            }
        });
    };

    const buildHtmlHead = () => {
        let headContent = "";

        // Add title
        if (htmlHead.title) {
            headContent += `<title>${htmlHead.title}</title>\n`;
        }

        // Add viewport meta tag
        if (htmlHead.viewport) {
            headContent += `<meta name="viewport" content="${htmlHead.viewport}">\n`;
        }

        // Add meta description
        if (htmlHead.metaDescription) {
            headContent += `<meta name="description" content="${htmlHead.metaDescription}">\n`;
        }

        // Add meta keywords
        if (htmlHead.metaKeywords) {
            headContent += `<meta name="keywords" content="${htmlHead.metaKeywords}">\n`;
        }

        // Add custom head content
        if (htmlHead.customHead) {
            headContent += htmlHead.customHead + "\n";
        }

        return headContent;
    };

    // Function to make all links open in new tabs
    const processLinksForNewTab = (htmlContent: string): string => {
        try {
            // Create a temporary DOM parser
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlContent, "text/html");

            // Find all anchor tags
            const links = doc.querySelectorAll("a[href]");

            // Add target="_blank" and security attributes to all links
            links.forEach((link) => {
                link.setAttribute("target", "_blank");
                link.setAttribute("rel", "noopener noreferrer");
            });

            // Return the processed HTML
            return doc.body.innerHTML;
        } catch (error) {
            console.warn("Error processing links for new tab:", error);
            // Fallback: use regex replacement if DOM parsing fails
            return htmlContent.replace(
                /<a\s+([^>]*href\s*=\s*["|'][^"|']+["|'][^>]*)>/gi,
                (match, attributes) => {
                    // Only add target if it's not already present
                    if (!attributes.includes("target=")) {
                        return `<a ${attributes} target="_blank" rel="noopener noreferrer">`;
                    }
                    return match;
                }
            );
        }
    };

    const renderHtml = () => {
        try {
            // Register built-in helpers on each run (idempotent)
            Twig.extendFunction("now", function () {
                return new Date().toISOString();
            });

            // Add simple year filter
            Twig.extendFilter("year", function (date) {
                if (!date) date = new Date();
                if (!(date instanceof Date)) date = new Date(date);
                return date.getFullYear();
            });

            // Add simple date filter for basic formatting
            Twig.extendFilter("dateFormat", function (date, format) {
                if (!date) date = new Date();
                if (!(date instanceof Date)) date = new Date(date);

                if (
                    typeof format === "string" &&
                    (format === "YYYY" || format === "Y")
                ) {
                    return date.getFullYear();
                }

                return date.toISOString().split("T")[0]; // Default to YYYY-MM-DD
            });

            try {
                eval(twigExtension)(Twig);
            } catch (error) {
                console.error(error);
            }

            // Add other commonly used functions
            Twig.extendFunction("range", function (start, end, step = 1) {
                const result = [];
                if (step > 0) {
                    for (let i = start; i <= end; i += step) {
                        result.push(i.toString());
                    }
                } else {
                    for (let i = start; i >= end; i += step) {
                        result.push(i);
                    }
                }
                return result.join(",");
            });

            // Register safe defaults
            registerDefaultHelpers();

            const sanitizedHtml = normalizeTwigTemplate(html);

            const twig = Twig.twig({
                data: sanitizedHtml
            });

            console.log(html);

            // Parse JSON safely to surface JSON errors distinctly
            let context: Record<string, unknown> = {};
            try {
                context = JSON.parse(json);
            } catch (jsonError) {
                const errorDoc = buildErrorHtml(
                    "Invalid JSON context",
                    (jsonError as Error).message,
                    {
                        detailsHtml: `<div class="muted">Provided JSON could not be parsed. Please fix the JSON and try again.</div>`
                    }
                );
                setRenderedHtml(errorDoc);
                toast.error("Invalid JSON context");
                return;
            }

            let renderedBodyHtml: string = "";
            try {
                renderedBodyHtml = twig.render(context);
            } catch (err) {
                // Attempt to auto-stub missing items and retry once
                const missing = extractMissingFromError(err);
                if (
                    missing.functions.length ||
                    missing.filters.length ||
                    missing.tests.length
                ) {
                    console.warn("Auto-stubbing missing Twig items:", missing);
                    registerStubs(missing);
                    try {
                        renderedBodyHtml = twig.render(context);
                    } catch (err2) {
                        const errorDoc = buildErrorHtml(
                            "Twig render error after auto-stub",
                            (err2 as Error).message,
                            {
                                detailsHtml: `<div class="muted">Missing items that were stubbed: ${[
                                    ...missing.functions.map(
                                        (n) => `function:${n}`
                                    ),
                                    ...missing.filters.map(
                                        (n) => `filter:${n}`
                                    ),
                                    ...missing.tests.map((n) => `test:${n}`)
                                ].join(", ")}</div>`
                            }
                        );
                        setRenderedHtml(errorDoc);
                        console.error(err2);
                        toast.error("Error rendering HTML");
                        return;
                    }
                } else {
                    const errorDoc = buildErrorHtml(
                        "Twig render error",
                        (err as Error).message
                    );
                    setRenderedHtml(errorDoc);
                    console.error(err);
                    toast.error("Error rendering HTML");
                    return;
                }
            }

            // Process the body HTML to make links open in new tabs
            const processedBodyHtml = processLinksForNewTab(renderedBodyHtml);

            // Build complete HTML document with head elements
            const headContent = buildHtmlHead();
            const completeHtml = `<!DOCTYPE html>
<html lang="en">
<head>
${headContent}</head>
<body>
${processedBodyHtml}
</body>
</html>`;

            setRenderedHtml(completeHtml);
        } catch (error) {
            console.error(error);
            const errorDoc = buildErrorHtml(
                "Unexpected error",
                (error as Error)?.message || String(error)
            );
            setRenderedHtml(errorDoc);
            toast.error("Error rendering HTML");
        }
    };

    return {
        renderHtml,
        renderedHtml
    };
};
