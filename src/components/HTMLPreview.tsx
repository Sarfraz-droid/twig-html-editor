import { useEffect, useRef, useState } from "react";
import {
    ExternalLink,
    GripVertical,
    LoaderCircle,
    Monitor,
    Play,
    Smartphone,
    TriangleAlert
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTwigService } from "@/hook/useTwigService";
import { useStore } from "@/store/store";
import { Button } from "./ui/button";

type PreviewMode = "mobile" | "desktop" | "custom";

type HTMLPreviewProps = {
    htmlContent?: string;
    className?: {
        container?: string;
        title?: string;
        iframe?: string;
    }
}

export const HTMLPreview = ({ className }: HTMLPreviewProps) => {
    const { renderedHtml, renderHtml } = useTwigService();
    const { renderStatus, addConsoleEntry } = useStore();
    const previewAreaRef = useRef<HTMLDivElement>(null);
    const [previewMode, setPreviewMode] = useState<PreviewMode>("desktop");
    const [previewWidth, setPreviewWidth] = useState(390);
    const [availableWidth, setAvailableWidth] = useState(0);

    useEffect(() => {
        const previewArea = previewAreaRef.current;
        if (!previewArea) return;

        const observer = new ResizeObserver(([entry]) => {
            setAvailableWidth(Math.floor(entry.contentRect.width));
        });
        observer.observe(previewArea);
        return () => observer.disconnect();
    }, []);

    const selectMobilePreview = () => {
        setPreviewMode("mobile");
        setPreviewWidth(Math.min(390, availableWidth || 390));
    };

    const selectDesktopPreview = () => {
        setPreviewMode("desktop");
    };

    const startResize = (event: React.PointerEvent<HTMLButtonElement>) => {
        event.preventDefault();
        const startX = event.clientX;
        const startWidth =
            previewMode === "desktop" ? availableWidth : previewWidth;

        const handlePointerMove = (moveEvent: PointerEvent) => {
            const nextWidth = Math.min(
                Math.max(320, startWidth + (moveEvent.clientX - startX) * 2),
                availableWidth
            );
            setPreviewMode("custom");
            setPreviewWidth(nextWidth);
        };

        const stopResize = () => {
            window.removeEventListener("pointermove", handlePointerMove);
            window.removeEventListener("pointerup", stopResize);
        };

        window.addEventListener("pointermove", handlePointerMove);
        window.addEventListener("pointerup", stopResize);
    };

    const resolvedPreviewWidth =
        previewMode === "desktop"
            ? availableWidth
            : Math.min(previewWidth, availableWidth || previewWidth);

    const openInPopup = () => {
        const popupWidth =
            previewMode === "desktop" ? 1200 : Math.round(previewWidth);
        const popup = window.open(
            "",
            "htmlPreview",
            `width=${popupWidth},height=700,scrollbars=yes,resizable=yes`
        );
        if (popup) {
            popup.document.write(renderedHtml);
            popup.document.close();
        } else {
            addConsoleEntry({
                severity: "error",
                message: "Preview popup was blocked",
                details: "Allow popups for this page and try again."
            });
        }
    };

    return (
        <section className={cn("h-full overflow-hidden rounded-xl border border-white/10 bg-[#101521] shadow-2xl shadow-black/20 flex flex-col", className?.container)}>
            <div className={cn("min-h-12 px-3 py-2 flex flex-wrap items-center justify-between gap-2 border-b border-white/10", className?.title)}>
                <div className="flex min-w-0 items-center gap-2">
                    <div className="font-semibold text-slate-100">
                        Preview
                    </div>
                    <div
                        className={cn(
                            "flex items-center gap-1.5 rounded-full px-2 py-1 text-[11px] font-medium",
                            renderStatus === "error" &&
                                "bg-rose-500/15 text-rose-300",
                            renderStatus === "warning" &&
                                "bg-amber-500/15 text-amber-300",
                            renderStatus === "success" &&
                                "bg-emerald-500/15 text-emerald-300",
                            (renderStatus === "idle" ||
                                renderStatus === "rendering") &&
                                "bg-slate-500/15 text-slate-400"
                        )}
                    >
                        {renderStatus === "rendering" && (
                            <LoaderCircle className="size-3 animate-spin" />
                        )}
                        {renderStatus === "error" && (
                            <TriangleAlert className="size-3" />
                        )}
                        <span className="capitalize">{renderStatus}</span>
                    </div>
                </div>
                <div className="flex flex-wrap items-center justify-end gap-2">
                    <div
                        className="flex rounded-lg bg-black/20 p-1"
                        role="group"
                        aria-label="Preview viewport"
                    >
                        <button
                            type="button"
                            onClick={selectMobilePreview}
                            className={cn(
                                "flex h-7 items-center gap-1.5 rounded-md px-2 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500",
                                previewMode === "mobile"
                                    ? "bg-slate-700 text-white shadow"
                                    : "text-slate-400 hover:text-white"
                            )}
                            aria-pressed={previewMode === "mobile"}
                            title="Mobile preview (390px)"
                        >
                            <Smartphone className="size-3.5" />
                            <span className="hidden sm:inline">Mobile</span>
                        </button>
                        <button
                            type="button"
                            onClick={selectDesktopPreview}
                            className={cn(
                                "flex h-7 items-center gap-1.5 rounded-md px-2 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500",
                                previewMode === "desktop"
                                    ? "bg-slate-700 text-white shadow"
                                    : "text-slate-400 hover:text-white"
                            )}
                            aria-pressed={previewMode === "desktop"}
                            title="Desktop preview"
                        >
                            <Monitor className="size-3.5" />
                            <span className="hidden sm:inline">Desktop</span>
                        </button>
                    </div>
                    <span
                        className="min-w-12 text-right text-[11px] tabular-nums text-slate-500"
                        aria-live="polite"
                    >
                        {resolvedPreviewWidth
                            ? `${Math.round(resolvedPreviewWidth)}px`
                            : "Fit"}
                    </span>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 text-slate-300 hover:bg-white/5 hover:text-white"
                        onClick={renderHtml}
                        aria-label="Render preview"
                    >
                        <Play className="size-3.5 fill-current" />
                        <span className="hidden sm:inline">Render</span>
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={openInPopup}
                        disabled={!renderedHtml}
                        className="size-8 text-slate-300 hover:bg-white/5 hover:text-white"
                        title="Open in popup"
                        aria-label="Open preview in popup"
                    >
                        <ExternalLink className="size-4" />
                    </Button>
                </div>
            </div>
            <div
                ref={previewAreaRef}
                className="relative flex min-w-0 flex-1 justify-center overflow-hidden bg-[#090d16] p-2 sm:p-3"
            >
                {renderedHtml ? (
                    <div
                        className="group/preview relative h-full max-w-full shrink-0 transition-[width] duration-200 ease-out"
                        style={{ width: resolvedPreviewWidth || "100%" }}
                    >
                        <iframe
                            className={cn("h-full w-full border-0 rounded-lg bg-white shadow-inner", className?.iframe)}
                            srcDoc={renderedHtml}
                            title={`Rendered HTML preview at ${Math.round(resolvedPreviewWidth)} pixels wide`}
                            sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
                        />
                        <button
                            type="button"
                            onPointerDown={startResize}
                            className="absolute right-0 top-1/2 z-10 flex h-16 w-5 -translate-y-1/2 translate-x-1/2 touch-none items-center justify-center rounded-full border border-white/15 bg-slate-800 text-slate-400 opacity-60 shadow-lg transition-opacity hover:bg-slate-700 hover:text-white hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-sky-500 group-hover/preview:opacity-100"
                            aria-label="Resize preview width"
                            title="Drag to resize preview"
                        >
                            <GripVertical className="size-3.5" />
                        </button>
                    </div>
                ) : (
                    <div className="flex h-full min-h-72 flex-col items-center justify-center rounded-lg border border-dashed border-white/10 bg-white/[0.02] px-6 text-center">
                        <Play className="mb-3 size-8 text-slate-600" />
                        <div className="font-medium text-slate-300">
                            Your preview will appear here
                        </div>
                        <p className="mt-1 max-w-sm text-sm text-slate-500">
                            Run the template or begin editing to start live
                            rendering.
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
};
