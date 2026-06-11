import { useEffect, useRef, useState } from "react";
import { Braces, Code2, Play } from "lucide-react";
import { MonacoEditorComponent } from "./MonacoEditorComponent";
import { HTMLPreview } from "./HTMLPreview";
import { useStore } from "@/store/store";
import { useUrlState } from "@/hook/useUrlState";
import { useTwigService } from "@/hook/useTwigService";
import { RenderConsole } from "./RenderConsole";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

type EditorTab = "html" | "json";

export const EditorContainer = () => {
    const {
        html,
        json,
        htmlHead,
        twigExtension,
        renderStatus,
        setHtml,
        setJson
    } = useStore();
    const { updateUrlWithState } = useUrlState();
    const { renderHtml } = useTwigService();
    const urlTimer = useRef<number | undefined>(undefined);
    const renderTimer = useRef<number | undefined>(undefined);
    const renderRef = useRef(renderHtml);
    const hasMounted = useRef(false);
    const [editorTab, setEditorTab] = useState<EditorTab>("html");

    renderRef.current = renderHtml;

    const handleEditorChange = (editorId: string, value: string | undefined) => {
        if (editorId === "html") {
            setHtml(value || "");
        } else if (editorId === "json") {
            setJson(value || "");
        }
    };

    const runRender = () => renderRef.current();

    useEffect(() => {
        window.clearTimeout(urlTimer.current);
        urlTimer.current = window.setTimeout(() => {
            updateUrlWithState();
        }, 1000);
        return () => window.clearTimeout(urlTimer.current);
    }, [html, json, htmlHead, twigExtension, updateUrlWithState]);

    useEffect(() => {
        window.clearTimeout(renderTimer.current);
        renderTimer.current = window.setTimeout(
            runRender,
            hasMounted.current ? 600 : 0
        );
        hasMounted.current = true;
        return () => window.clearTimeout(renderTimer.current);
    }, [html, json, htmlHead, twigExtension]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
                event.preventDefault();
                window.clearTimeout(renderTimer.current);
                runRender();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    return (
        <main className="flex min-h-0 flex-1 flex-col gap-3 overflow-auto px-3 pb-3 sm:px-4 sm:pb-4 lg:px-5 lg:pb-5">
            <div className="grid min-h-[680px] flex-1 gap-3 lg:min-h-0 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
                <section className="flex min-h-[420px] flex-col overflow-hidden rounded-xl border border-white/10 bg-[#101521] shadow-2xl shadow-black/20 lg:min-h-0">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 px-2 py-2 sm:px-3">
                        <div
                            className="flex rounded-lg bg-black/20 p-1"
                            role="tablist"
                            aria-label="Editor panels"
                        >
                            <button
                                type="button"
                                role="tab"
                                aria-selected={editorTab === "html"}
                                onClick={() => setEditorTab("html")}
                                className={cn(
                                    "flex h-8 items-center gap-2 rounded-md px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500",
                                    editorTab === "html"
                                        ? "bg-slate-700 text-white shadow"
                                        : "text-slate-400 hover:text-white"
                                )}
                            >
                                <Code2 className="size-4" />
                                Template
                            </button>
                            <button
                                type="button"
                                role="tab"
                                aria-selected={editorTab === "json"}
                                onClick={() => setEditorTab("json")}
                                className={cn(
                                    "flex h-8 items-center gap-2 rounded-md px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500",
                                    editorTab === "json"
                                        ? "bg-slate-700 text-white shadow"
                                        : "text-slate-400 hover:text-white"
                                )}
                            >
                                <Braces className="size-4" />
                                Data
                            </button>
                        </div>
                        <Button
                            type="button"
                            size="sm"
                            onClick={runRender}
                            disabled={renderStatus === "rendering"}
                            className="bg-sky-500 text-slate-950 hover:bg-sky-400"
                            title="Run template (Ctrl/Cmd + Enter)"
                        >
                            <Play className="size-3.5 fill-current" />
                            {renderStatus === "rendering"
                                ? "Rendering"
                                : "Run"}
                            <span className="hidden text-[10px] opacity-60 sm:inline">
                                Ctrl+Enter
                            </span>
                        </Button>
                    </div>
                    <div className="min-h-0 flex-1">
                        <div
                            className={cn(
                                "h-full",
                                editorTab !== "html" && "hidden"
                            )}
                            role="tabpanel"
                        >
                            <MonacoEditorComponent
                                language="html"
                                title="Twig template"
                                value={html}
                                onChange={(value) =>
                                    handleEditorChange("html", value)
                                }
                                onTopBarClick={() => undefined}
                                onRun={runRender}
                                isOpen
                                hideHeader
                            />
                        </div>
                        <div
                            className={cn(
                                "h-full",
                                editorTab !== "json" && "hidden"
                            )}
                            role="tabpanel"
                        >
                            <MonacoEditorComponent
                                language="json"
                                title="JSON data"
                                value={json}
                                onChange={(value) =>
                                    handleEditorChange("json", value)
                                }
                                onTopBarClick={() => undefined}
                                onRun={runRender}
                                isOpen
                                hideHeader
                            />
                        </div>
                    </div>
                </section>
                <div className="min-h-[420px] lg:min-h-0">
                    <HTMLPreview />
                </div>
            </div>
            <RenderConsole />
        </main>
    );
};
