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

    const renderHtml = () => {
        try {
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

            const sanitizedHtml = normalizeTwigTemplate(html);

            const twig = Twig.twig({
                data: sanitizedHtml
            });

            console.log(html);
            const renderedBodyHtml = twig.render(JSON.parse(json));

            console.log(renderedBodyHtml);

            // Build complete HTML document with head elements
            const headContent = buildHtmlHead();
            const completeHtml = `<!DOCTYPE html>
<html lang="en">
<head>
${headContent}</head>
<body>
${renderedBodyHtml}
</body>
</html>`;

            setRenderedHtml(completeHtml);
        } catch (error) {
            console.error(error);
            setRenderedHtml(`${JSON.stringify(error)}`);
            toast.error("Error rendering HTML");
        }
    };

    return {
        renderHtml,
        renderedHtml
    };
};
