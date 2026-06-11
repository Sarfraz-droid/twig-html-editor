import { normalizeTwigTemplate } from "@/lib/utils";
import { useStore } from "@/store/store";
import Twig from "twig";

export type TwigRenderResult =
    | { status: "success"; fallbackCount: 0 }
    | { status: "warning"; fallbackCount: number }
    | { status: "error"; fallbackCount: number; error: string };

type MissingItems = {
    functions: string[];
    filters: string[];
    tests: string[];
};

type TwigRegistry = Record<string, unknown>;
type TwigApi = {
    functions: TwigRegistry;
    filters: TwigRegistry;
    tests: TwigRegistry;
    extendFunction: (name: string, fn: (...params: unknown[]) => unknown) => void;
    extendFilter: (
        name: string,
        fn: (value: unknown, params: false | unknown[]) => unknown
    ) => void;
    extendTest: (name: string, fn: (value: unknown) => boolean) => void;
};

const escapeHtml = (value: string) =>
    value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");

const unique = (values: string[]) => [...new Set(values)];

export const useTwigService = () => {
    const twigApi = Twig as unknown as TwigApi;
    const {
        twigExtension,
        html,
        json,
        renderedHtml,
        setRenderedHtml,
        htmlHead,
        setRenderStatus,
        addConsoleEntry,
        clearConsole
    } = useStore();

    const addDiagnostic = (
        severity: "info" | "warning" | "error",
        message: string,
        details?: string
    ) => addConsoleEntry({ severity, message, details });

    const buildErrorHtml = (title: string, message: string) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Render error</title>
  <style>
    :root { color-scheme: light dark; }
    * { box-sizing: border-box; }
    body { margin: 0; padding: 32px; background: #f8fafc; color: #172033; font-family: Inter, ui-sans-serif, system-ui, sans-serif; }
    .card { max-width: 760px; margin: 0 auto; border: 1px solid #fecaca; border-radius: 16px; background: #fff; box-shadow: 0 18px 48px rgba(15,23,42,.08); overflow: hidden; }
    .bar { height: 5px; background: #ef4444; }
    .content { padding: 24px; }
    .eyebrow { color: #dc2626; font-size: 12px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; }
    h1 { margin: 8px 0 16px; font-size: 22px; }
    pre { margin: 0; padding: 16px; border-radius: 10px; overflow: auto; white-space: pre-wrap; background: #111827; color: #f9fafb; font: 13px/1.6 ui-monospace, SFMono-Regular, Menlo, monospace; }
    p { margin: 16px 0 0; color: #64748b; font-size: 14px; }
    @media (prefers-color-scheme: dark) {
      body { background: #090d16; color: #f8fafc; }
      .card { background: #121826; border-color: #7f1d1d; }
      p { color: #94a3b8; }
    }
  </style>
</head>
<body>
  <main class="card">
    <div class="bar"></div>
    <div class="content">
      <div class="eyebrow">Template render failed</div>
      <h1>${escapeHtml(title)}</h1>
      <pre>${escapeHtml(message)}</pre>
      <p>Review the Console panel, fix the issue, and run the template again.</p>
    </div>
  </main>
</body>
</html>`;

    const failRender = (
        title: string,
        error: unknown,
        fallbackCount = 0
    ): TwigRenderResult => {
        const message =
            error instanceof Error ? error.message : String(error || title);
        setRenderedHtml(buildErrorHtml(title, message));
        addDiagnostic("error", title, message);
        setRenderStatus("error");
        return { status: "error", fallbackCount, error: message };
    };

    const registerBuiltInHelpers = () => {
        twigApi.extendFunction("now", () => new Date().toISOString());
        twigApi.extendFunction("range", (...params: unknown[]) => {
            const [start, end, rawStep = 1] = params as [
                number,
                number,
                number?
            ];
            const step = rawStep ?? 1;
            const result: number[] = [];
            if (step === 0) return result;
            if (step > 0) {
                for (let value = start; value <= end; value += step) {
                    result.push(value);
                }
            } else {
                for (let value = start; value >= end; value += step) {
                    result.push(value);
                }
            }
            return result;
        });
        twigApi.extendFunction("asset", (path: unknown) => String(path ?? ""));
        twigApi.extendFunction("path", () => "#");
        twigApi.extendFunction("url", () => "#");
        twigApi.extendFunction("dump", (...args: unknown[]) =>
            JSON.stringify(args.length === 1 ? args[0] : args, null, 2)
        );
        twigApi.extendFunction("trans", (key: unknown) => String(key ?? ""));
        twigApi.extendFunction("translate", (key: unknown) => String(key ?? ""));

        twigApi.extendFilter("year", (date: unknown) => {
            const value = date ? new Date(date as string) : new Date();
            return Number.isNaN(value.getTime()) ? "" : value.getFullYear();
        });
        twigApi.extendFilter("dateFormat", (date: unknown, format) => {
            const value = date ? new Date(date as string) : new Date();
            if (Number.isNaN(value.getTime())) return "";
            if (
                Array.isArray(format) &&
                ["YYYY", "Y"].includes(String(format[0]))
            ) {
                return value.getFullYear();
            }
            return value.toISOString().split("T")[0];
        });
    };

    const scanMissingItems = (template: string): MissingItems => {
        const twigSource = [
            ...template.matchAll(/\{\{[\s\S]*?\}\}|\{%[\s\S]*?%\}/g)
        ]
            .map((match) => match[0])
            .join("\n");
        const functionNames = unique(
            [...twigSource.matchAll(/\b([A-Za-z_]\w*)\s*\(/g)].map(
                (match) => match[1]
            )
        );
        const filterNames = unique(
            [...twigSource.matchAll(/\|\s*([A-Za-z_]\w*)/g)].map(
                (match) => match[1]
            )
        );
        const testNames = unique(
            [
                ...twigSource.matchAll(
                    /\bis\s+(?:not\s+)?([A-Za-z_]\w*)/g
                )
            ].map((match) => match[1])
        );

        return {
            functions: functionNames.filter(
                (name) => !(name in twigApi.functions)
            ),
            filters: filterNames.filter(
                (name) => !(name in twigApi.filters)
            ),
            tests: testNames.filter(
                (name) => !(name in twigApi.tests)
            )
        };
    };

    const registerFallbacks = (missing: MissingItems) => {
        missing.functions.forEach((name) => {
            twigApi.extendFunction(name, () => "");
            addDiagnostic(
                "warning",
                `Missing Twig function: ${name}()`,
                "A safe empty-string fallback was used for this render."
            );
        });
        missing.filters.forEach((name) => {
            twigApi.extendFilter(name, (value: unknown) => value);
            addDiagnostic(
                "warning",
                `Missing Twig filter: |${name}`,
                "An identity fallback was used, so the original value was preserved."
            );
        });
        missing.tests.forEach((name) => {
            twigApi.extendTest(name, () => false);
            addDiagnostic(
                "warning",
                `Missing Twig test: is ${name}`,
                "A false fallback was used for this render."
            );
        });
    };

    const buildHtmlHead = () => {
        const tags: string[] = [];
        if (htmlHead.title) {
            tags.push(`<title>${escapeHtml(htmlHead.title)}</title>`);
        }
        if (htmlHead.viewport) {
            tags.push(
                `<meta name="viewport" content="${escapeHtml(htmlHead.viewport)}">`
            );
        }
        if (htmlHead.metaDescription) {
            tags.push(
                `<meta name="description" content="${escapeHtml(htmlHead.metaDescription)}">`
            );
        }
        if (htmlHead.metaKeywords) {
            tags.push(
                `<meta name="keywords" content="${escapeHtml(htmlHead.metaKeywords)}">`
            );
        }
        if (htmlHead.customHead) tags.push(htmlHead.customHead);
        return tags.join("\n");
    };

    const processLinksForNewTab = (htmlContent: string) => {
        const parser = new DOMParser();
        const document = parser.parseFromString(htmlContent, "text/html");
        document.querySelectorAll("a[href]").forEach((link) => {
            link.setAttribute("target", "_blank");
            link.setAttribute("rel", "noopener noreferrer");
        });
        return document.body.innerHTML;
    };

    const renderHtml = (): TwigRenderResult => {
        clearConsole();
        setRenderStatus("rendering");
        addDiagnostic("info", "Rendering template");

        registerBuiltInHelpers();
        let extensionFailed = false;

        if (twigExtension.trim()) {
            try {
                const extensionFactory = new Function(
                    "Twig",
                    `"use strict"; return (${twigExtension})(Twig);`
                );
                extensionFactory(Twig);
            } catch (error) {
                extensionFailed = true;
                addDiagnostic(
                    "error",
                    "Twig extension could not be loaded",
                    error instanceof Error ? error.message : String(error)
                );
            }
        }

        let context: Record<string, unknown>;
        try {
            const parsed = JSON.parse(json);
            if (
                parsed === null ||
                Array.isArray(parsed) ||
                typeof parsed !== "object"
            ) {
                throw new Error("The JSON context must be an object.");
            }
            context = parsed as Record<string, unknown>;
        } catch (error) {
            return failRender("Invalid JSON context", error);
        }

        const sanitizedHtml = normalizeTwigTemplate(html);
        const missing = scanMissingItems(sanitizedHtml);
        registerFallbacks(missing);
        const fallbackCount =
            missing.functions.length +
            missing.filters.length +
            missing.tests.length;

        try {
            const template = Twig.twig({ data: sanitizedHtml });
            const renderedBody = template.render(context);
            const processedBody = processLinksForNewTab(renderedBody);
            const completeHtml = `<!DOCTYPE html>
<html lang="en">
<head>
${buildHtmlHead()}
</head>
<body>
${processedBody}
</body>
</html>`;
            setRenderedHtml(completeHtml);

            if (fallbackCount > 0 || extensionFailed) {
                setRenderStatus("warning");
                addDiagnostic(
                    "info",
                    fallbackCount > 0
                        ? `Rendered with ${fallbackCount} safe fallback${fallbackCount === 1 ? "" : "s"}`
                        : "Template rendered without the custom extension"
                );
                return { status: "warning", fallbackCount };
            }

            setRenderStatus("success");
            addDiagnostic("info", "Template rendered successfully");
            return { status: "success", fallbackCount: 0 };
        } catch (error) {
            return failRender(
                "Twig template could not be rendered",
                error,
                fallbackCount
            );
        }
    };

    return { renderHtml, renderedHtml };
};
