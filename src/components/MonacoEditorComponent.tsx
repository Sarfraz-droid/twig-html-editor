// import Editor from '@monaco-editor/react';
import { cn } from "@/lib/utils";
import { editor, KeyCode, KeyMod } from "monaco-editor";
import { useResizeObserver } from "@mantine/hooks";
import { useEffect, useRef } from "react";
import clsx from "clsx";
import { useDebouncedCallback } from "@mantine/hooks";

type MonacoEditorComponentProps = {
    language: string;
    title: string;
    value: string;
    onChange: (value: string | undefined) => void;
    onTopBarClick: () => void;
    onRun?: () => void;
    className?: {
        container?: string;
        title?: string;
        editor?: string;
    };

    isOpen: boolean;
    hideHeader?: boolean;
};



export const MonacoEditorComponent = ({
    language,
    title,
    value,
    onTopBarClick,
    onChange,
    onRun,
    className,
    isOpen,
    hideHeader = false
}: MonacoEditorComponentProps) => {
    const [editorContainerRef] = useResizeObserver();
    const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
    const onRunRef = useRef(onRun);
    const initialValueRef = useRef(value);

    const debouncedOnChange = useDebouncedCallback(onChange, 250);
    onRunRef.current = onRun;

    useEffect(() => {
        if (editorContainerRef.current) {
            editorContainerRef.current.innerHTML = "";
            editorRef.current = editor.create(editorContainerRef.current, {
                language,
                value: initialValueRef.current,
                theme: "vs-dark",
                minimap: {
                    enabled: false
                },
                automaticLayout: true,
                fontSize: 13,
                lineHeight: 21,
                padding: { top: 14, bottom: 14 },
                scrollBeyondLastLine: false,
                wordWrap: "on",
                renderLineHighlight: "gutter",
                overviewRulerBorder: false
            });
            editorRef.current.addCommand(
                KeyMod.CtrlCmd | KeyCode.Enter,
                () => onRunRef.current?.()
            );
        }

        return () => {
            if (editorRef.current) {
                editorRef.current.dispose();
            }
        };
    }, [editorContainerRef, language]);

    useEffect(() => {
        if (editorRef.current) {
            const model = editorRef.current.getModel() as editor.ITextModel;
            if (model) {
                const disposable = model.onDidChangeContent(() => {
                    debouncedOnChange(model.getValue());
                });
                return () => disposable.dispose();
            }
        }
    }, [debouncedOnChange]);

    useEffect(() => {
        if (!editorRef.current) return;
        const model = editorRef.current.getModel();
        if (!model) return;
        if (model.getValue() !== value) {
            model.setValue(value);
        }
    }, [value]);

    return (
        <div
            className={cn(
                "bg-[#0b101a] overflow-hidden flex flex-col h-full",
                className?.container
            )}
        >
            {!hideHeader && <div className="p-1">
                <div
                    className={cn(
                        "font-semibold text-base p-2 hover:bg-[#151515] bg-[#1e1e1e] rounded-md transition-all duration-300 flex items-center justify-between",
                        className?.title
                    )}
                    onClick={onTopBarClick}
                >
                    <div className="pl-2">{title}</div>
                </div>
            </div>}
            <div
                className={clsx(
                    "transition-[height] duration-300",
                    isOpen ? "flex-1" : "h-0 overflow-hidden"
                )}
                ref={editorContainerRef}
            ></div>
        </div>
    );
};
