import { ExternalLink, LoaderCircle, Play, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTwigService } from "@/hook/useTwigService";
import { useStore } from "@/store/store";
import { Button } from "./ui/button";

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

    const openInPopup = () => {
        const popup = window.open('', 'htmlPreview', 'width=800,height=600,scrollbars=yes,resizable=yes');
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
            <div className={cn("min-h-12 px-3 flex items-center justify-between gap-3 border-b border-white/10", className?.title)}>
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
                <div className="flex items-center gap-2">
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
            <div className="relative flex-1 bg-[#090d16] p-2 sm:p-3">
                {renderedHtml ? (
                    <iframe
                        className={cn("w-full h-full border-0 rounded-lg bg-white shadow-inner", className?.iframe)}
                        srcDoc={renderedHtml}
                        title="Rendered HTML preview"
                        sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
                    />
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
