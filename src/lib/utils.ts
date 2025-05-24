import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function normalizeTwigTemplate(template: string) {
    return (
        template
            // Normalize whitespace inside Twig tags
            .replace(/\{%\s+/g, "{% ")
            .replace(/\s+%\}/g, " %}")
            .replace(/\{\{\s+/g, "{{ ")
            .replace(/\s+\}\}/g, " }}")
            .replace(/\{#\s+/g, "{# ")
            .replace(/\s+#\}/g, " #}")
            // Clean up excessive whitespace within Twig expressions
            .replace(/(\{%[^%]*?)\s{10,}([^%]*?%\})/g, (match) => {
                const cleaned = match.replace(/\s{2,}/g, " ");
                return cleaned;
            })
            .replace(/(\{\{[^}]*?)\s{10,}([^}]*?\}\})/g, (match) => {
                const cleaned = match.replace(/\s{2,}/g, " ");
                return cleaned;
            })
    );
} 