// import Editor from '@monaco-editor/react';
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
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
};



export const MonacoEditorComponent = ({
    language,
    title,
    value,
    onTopBarClick,
    onChange,
    onRun,
    className,
    isOpen
}: MonacoEditorComponentProps) => {
    const [editorContainerRef] = useResizeObserver();
    const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

    const debouncedOnChange = useDebouncedCallback(onChange, 1000);

    useEffect(() => {
        if (editorContainerRef.current) {
            editorContainerRef.current.innerHTML = "";
            editorRef.current = editor.create(editorContainerRef.current, {
                language,
                value,
                theme: "vs-dark",
                minimap: {
                    enabled: false
                }
            });

        }

        return () => {
            if (editorRef.current) {
                editorRef.current.dispose();
            }
        };
    }, []);

    // Keep Monaco sized during container transitions
    useEffect(() => {
        let raf = 0;
        const relayout = () => {
            if (editorRef.current && editorContainerRef.current) {
                const rect = editorContainerRef.current.getBoundingClientRect();
                editorRef.current.layout({ height: rect.height, width: rect.width });
            }
            raf = requestAnimationFrame(relayout);
        };
        raf = requestAnimationFrame(relayout);
        return () => cancelAnimationFrame(raf);
    }, [editorContainerRef]);

    useEffect(() => {
        if (editorRef.current) {
            const model = editorRef.current.getModel() as editor.ITextModel;
            if (model) {
                model.onDidChangeContent(() => {
                    console.log("onDidChangeContent", model.getValue());
                    debouncedOnChange(model.getValue());
                });
            }
        }
    }, []);

    useEffect(() => {
        if (!editorRef.current) return;
        const model = editorRef.current.getModel();
        if (!model) return;
        if (model.getValue() !== value) {
            model.setValue(value);
        }
    }, [value]);

    return (
        <motion.div
            className={cn(
                "bg-[#1e1e1e] rounded-lg  overflow-hidden flex flex-col h-full",
                className?.container
            )}
            layout
            transition={{ duration: 0.25, ease: [0.2, 0.65, 0.3, 0.9] }}
        >
            <div className="p-1">
                <div
                    className={cn(
                        "font-semibold text-base p-2 hover:bg-[#151515] bg-[#1e1e1e] rounded-md transition-all duration-300 flex items-center justify-between",
                        className?.title
                    )}
                    onClick={onTopBarClick}
                >
                    <div className="pl-2">{title}</div>
                </div>
            </div>
            <div
                className={clsx(
                    "transition-[height] duration-300",
                    isOpen ? "flex-1" : "h-0 overflow-hidden"
                )}
                ref={editorContainerRef}
            ></div>
        </motion.div>
    );
};
