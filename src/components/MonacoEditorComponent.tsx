import React, { useEffect, useRef } from 'react'
// import Editor from '@monaco-editor/react';
import { cn } from '@/lib/utils';
import { motion } from "motion/react"
import { editor } from 'monaco-editor';
import { useResizeObserver } from '@mantine/hooks';

type MonacoEditorComponentProps = {
  language: string;
  title: string;
  value: string;
  onChange: (value: string | undefined) => void;
  onTopBarClick: () => void;
  className?: {
    container?: string;
    title?: string;
    editor?: string;
  }

  isOpen: boolean;
}

export const MonacoEditorComponent = ({ language, title, value, onTopBarClick, onChange, className, isOpen }: MonacoEditorComponentProps) => {
  const [editorContainerRef] = useResizeObserver();
  const editorRef = useRef<editor.IEditor>(null);

  useEffect(() => {
    if (editorContainerRef.current) {
      editorContainerRef.current.innerHTML = "";
      editorRef.current = editor.create(editorContainerRef.current, {
        language,
        value,
        theme: 'vs-dark',
        minimap: {
          enabled: false
        }
      })
    }

    return () => {
      if (editorRef.current) {
        editorRef.current.dispose();
      }
    }

  }, [])

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.layout({
        height: editorContainerRef.current?.getBoundingClientRect().height,
        width: editorContainerRef.current?.getBoundingClientRect().width
      });
    }
  }, [editorContainerRef, editorRef])

  useEffect(() => {
    if (editorRef.current) {
      const model = editorRef.current.getModel() as editor.ITextModel;
      if (model) {
        
        model.onDidChangeContent(() => {
          onChange(model.getValue());
        });
      }
    }
  }, [onChange])


  return (
    <motion.div className={cn("bg-[#1e1e1e] rounded-lg h-full overflow-hidden flex flex-col", className?.container)}>
      <div className={cn("font-semibold text-base p-2 flex items-center justify-between", className?.title)}
        onClick={onTopBarClick}
      >
        <div className='pl-2'>
          {title}
        </div>
      </div>
      <div
        className='flex-1'
        ref={editorContainerRef}
      >
      </div>
    </motion.div>
  )
}
