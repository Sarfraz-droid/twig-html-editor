// Utility to deserialize: convert escaped HTML string back to HTML
export function deserialize(htmlString: string): string {
    // Preserve Twig blocks {% %}, {{ }}, and {# #} before general unescaping
    const twigBlocks: string[] = [];
    const twigPlaceholderPrefix = "___TWIG_BLOCK_";
    const twigPlaceholderSuffix = "___";

    // Extract {% %}
    let working = htmlString.replace(/\{%[\s\S]*?%\}/g, (m) => {
        const placeholder = `${twigPlaceholderPrefix}${twigBlocks.length}${twigPlaceholderSuffix}`;
        twigBlocks.push(m);
        return placeholder;
    });

    // Extract {{ }}
    working = working.replace(/\{\{[\s\S]*?\}\}/g, (m) => {
        const placeholder = `${twigPlaceholderPrefix}${twigBlocks.length}${twigPlaceholderSuffix}`;
        twigBlocks.push(m);
        return placeholder;
    });

    // Extract {# #}
    working = working.replace(/\{#[\s\S]*?#\}/g, (m) => {
        const placeholder = `${twigPlaceholderPrefix}${twigBlocks.length}${twigPlaceholderSuffix}`;
        twigBlocks.push(m);
        return placeholder;
    });

    // Now unescape common sequences in the non-Twig HTML
    const unescaped = working
        // Normalize line endings
        .replace(/\r\n/g, "\n")
        .replace(/\n/g, "\n")
        .replace(/\r/g, "\r")
        // Forward slashes in closing tags
        .replace(/\\\//g, "/")
        // Quotes
        .replace(/\\"/g, '"')
        .replace(/\\'/g, "'")
        // Unicode sequences (handle each code unit)
        .replace(/\\u([0-9a-fA-F]{4})/g, (_m, hex) =>
            String.fromCharCode(parseInt(hex, 16))
        )
        // Backslashes last
        .replace(/\\\\/g, "\\");

    // Restore Twig blocks
    const restored = unescaped.replace(
        new RegExp(
            `${twigPlaceholderPrefix}(\\d+)${twigPlaceholderSuffix}`,
            "g"
        ),
        (_m, index) => twigBlocks[parseInt(index)]
    );

    return restored;
}

// Utility to serialize: convert HTML into an escaped string for storage/transmission
export function serialize(html: string, showStats: boolean = false): string {
    const originalSize = html.length;

    if (showStats) {
        console.log(`📊 Serialization stats:`);
        console.log(`   Original size: ${originalSize.toLocaleString()} chars`);
    }

    // Preserve Twig blocks {% %}, {{ }}, and {# #} from serialization
    const twigBlocks: string[] = [];
    const twigPlaceholderPrefix = "___TWIG_BLOCK_";
    const twigPlaceholderSuffix = "___";

    // Extract and preserve {% %} blocks (Twig statements)
    let processedHtml = html.replace(/\{%[\s\S]*?%\}/g, (m) => {
        const placeholder = `${twigPlaceholderPrefix}${twigBlocks.length}${twigPlaceholderSuffix}`;
        twigBlocks.push(m);
        return placeholder;
    });

    // Extract and preserve {{ }} blocks (Twig expressions)
    processedHtml = processedHtml.replace(/\{\{[\s\S]*?\}\}/g, (m) => {
        const placeholder = `${twigPlaceholderPrefix}${twigBlocks.length}${twigPlaceholderSuffix}`;
        twigBlocks.push(m);
        return placeholder;
    });

    // Extract and preserve {# #} blocks (Twig comments)
    processedHtml = processedHtml.replace(/\{#[\s\S]*?#\}/g, (m) => {
        const placeholder = `${twigPlaceholderPrefix}${twigBlocks.length}${twigPlaceholderSuffix}`;
        twigBlocks.push(m);
        return placeholder;
    });

    // Minify non-Twig HTML before escaping
    const minifiedHtml = processedHtml
        // remove newlines and tabs
        .replace(/\r?\n|\r|\t/g, "")
        // remove spaces between tags
        .replace(/>\s+</g, "><")
        // collapse multiple spaces to one
        .replace(/\s{2,}/g, " ")
        .trim();

    // Apply serialization to the minified HTML (without Twig blocks)
    const serialized = minifiedHtml
        // Handle backslashes first, but preserve Unicode escape sequences
        .replace(/\\/g, "\\\\")
        // Convert Unicode characters to escape sequences if needed
        .replace(/[\u0080-\uFFFF]/g, (m) => {
            return "\\u" + ("0000" + m.charCodeAt(0).toString(16)).substr(-4);
        })
        .replace(/"/g, '\\"')
        .replace(/\//g, "\\/")
        .replace(/\n/g, "\\r\\n");

    // Restore the original Twig blocks (unescaped)
    const finalResult = serialized.replace(
        new RegExp(
            `${twigPlaceholderPrefix}(\\d+)${twigPlaceholderSuffix}`,
            "g"
        ),
        (_m, index) => {
            return twigBlocks[parseInt(index)];
        }
    );

    if (showStats) {
        const minifiedSize = minifiedHtml.length;
        const finalSize = finalResult.length;
        console.log(
            `   Minified size:   ${minifiedSize.toLocaleString()} chars`
        );
        console.log(`   Serialized size: ${finalSize.toLocaleString()} chars`);
        console.log(
            `   Protected ${twigBlocks.length} Twig blocks from escaping`
        );
    }

    return finalResult;
}
