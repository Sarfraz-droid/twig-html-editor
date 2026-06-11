import { useEffect, useRef } from "react";
import {
    AlertCircle,
    AlertTriangle,
    CheckCircle2,
    ChevronDown,
    ChevronUp,
    CircleDot,
    Trash2
} from "lucide-react";
import { useStore, type ConsoleSeverity } from "@/store/store";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

const severityConfig: Record<
    ConsoleSeverity,
    { icon: typeof CircleDot; className: string }
> = {
    info: { icon: CircleDot, className: "text-sky-400" },
    warning: { icon: AlertTriangle, className: "text-amber-400" },
    error: { icon: AlertCircle, className: "text-rose-400" }
};

export const RenderConsole = () => {
    const {
        consoleEntries,
        renderStatus,
        isConsoleOpen,
        setConsoleOpen,
        clearConsole
    } = useStore();
    const listRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isConsoleOpen) {
            listRef.current?.scrollTo({
                top: listRef.current.scrollHeight,
                behavior: "smooth"
            });
        }
    }, [consoleEntries, isConsoleOpen]);

    const errorCount = consoleEntries.filter(
        (entry) => entry.severity === "error"
    ).length;
    const warningCount = consoleEntries.filter(
        (entry) => entry.severity === "warning"
    ).length;

    return (
        <section className="overflow-hidden rounded-xl border border-white/10 bg-[#101521] shadow-2xl shadow-black/20">
            <div className="flex min-h-11 items-center justify-between gap-3 px-3 sm:px-4">
                <button
                    type="button"
                    className="flex min-w-0 flex-1 items-center gap-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                    onClick={() => setConsoleOpen(!isConsoleOpen)}
                    aria-expanded={isConsoleOpen}
                >
                    {renderStatus === "error" ? (
                        <AlertCircle className="size-4 shrink-0 text-rose-400" />
                    ) : renderStatus === "warning" ? (
                        <AlertTriangle className="size-4 shrink-0 text-amber-400" />
                    ) : renderStatus === "success" ? (
                        <CheckCircle2 className="size-4 shrink-0 text-emerald-400" />
                    ) : (
                        <CircleDot className="size-4 shrink-0 text-slate-400" />
                    )}
                    <span className="text-sm font-semibold text-slate-100">
                        Console
                    </span>
                    {errorCount > 0 && (
                        <span className="rounded-full bg-rose-500/15 px-2 py-0.5 text-xs text-rose-300">
                            {errorCount} error{errorCount === 1 ? "" : "s"}
                        </span>
                    )}
                    {warningCount > 0 && (
                        <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-xs text-amber-300">
                            {warningCount} warning
                            {warningCount === 1 ? "" : "s"}
                        </span>
                    )}
                </button>
                <div className="flex items-center gap-1">
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 text-slate-400 hover:bg-white/5 hover:text-white"
                        onClick={clearConsole}
                        disabled={consoleEntries.length === 0}
                        aria-label="Clear console"
                    >
                        <Trash2 className="size-3.5" />
                        <span className="hidden sm:inline">Clear</span>
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-8 text-slate-400 hover:bg-white/5 hover:text-white"
                        onClick={() => setConsoleOpen(!isConsoleOpen)}
                        aria-label={
                            isConsoleOpen ? "Collapse console" : "Expand console"
                        }
                    >
                        {isConsoleOpen ? (
                            <ChevronDown className="size-4" />
                        ) : (
                            <ChevronUp className="size-4" />
                        )}
                    </Button>
                </div>
            </div>

            <div
                className={cn(
                    "grid transition-[grid-template-rows] duration-200",
                    isConsoleOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                )}
            >
                <div className="min-h-0 overflow-hidden">
                    <div
                        ref={listRef}
                        className="max-h-40 min-h-24 overflow-y-auto border-t border-white/10 bg-[#090d16] p-2 font-mono text-xs sm:p-3"
                    >
                        {consoleEntries.length === 0 ? (
                            <div className="flex h-16 items-center justify-center text-slate-600">
                                Render diagnostics will appear here.
                            </div>
                        ) : (
                            <div className="space-y-1.5">
                                {consoleEntries.map((entry) => {
                                    const config =
                                        severityConfig[entry.severity];
                                    const Icon = config.icon;
                                    return (
                                        <div
                                            key={entry.id}
                                            className="grid grid-cols-[auto_auto_1fr] items-start gap-2 rounded-md px-2 py-1.5 hover:bg-white/[0.03]"
                                        >
                                            <Icon
                                                className={cn(
                                                    "mt-0.5 size-3.5",
                                                    config.className
                                                )}
                                            />
                                            <time className="text-slate-600">
                                                {new Date(
                                                    entry.timestamp
                                                ).toLocaleTimeString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                    second: "2-digit"
                                                })}
                                            </time>
                                            <div className="min-w-0">
                                                <div className="break-words text-slate-300">
                                                    {entry.message}
                                                </div>
                                                {entry.details && (
                                                    <div className="mt-1 whitespace-pre-wrap break-words text-slate-500">
                                                        {entry.details}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};
