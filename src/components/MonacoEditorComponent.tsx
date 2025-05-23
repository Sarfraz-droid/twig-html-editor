import React, { useEffect, useRef } from 'react'
import Editor from '@monaco-editor/react';
import { cn } from '@/lib/utils';
import { motion } from "motion/react"
import { editor } from 'monaco-editor';

type MonacoEditorComponentProps = {
  language: string;
  title: string;
  value: string;
  height: string;
  onChange: (value: string | undefined) => void;
  onTopBarClick: () => void;
  className?: {
    container?: string;
    title?: string;
    editor?: string;
  }

  isOpen: boolean;
}

export const MonacoEditorComponent = ({ language, title, value, height, onTopBarClick, onChange, className, isOpen }: MonacoEditorComponentProps) => {
  // const editorContainerRef = useRef<HTMLDivElement>(null);
  // const editorRef = useRef<editor.IEditor>(null);

  // useEffect(() => {
  //   if (editorContainerRef.current) {
  //     editorRef.current = editor.create(editorContainerRef.current, {
  //       language,
  //       value,
  //       theme: 'vs-dark',
  //       minimap: {
  //         enabled: false
  //       }
  //     })
  //   }
  // }, [])

  // useEffect(() => {
  //   if (editorContainerRef.current) {
  //     editorContainerRef.current.style.height = height;
  //     editorRef.current?.layout();
  //   }
  // }, [])

  return (
    <motion.div className={cn("bg-[#1e1e1e] rounded-lg", className?.container)}>
      <div className={cn("font-semibold text-base p-2 flex items-center justify-between", className?.title)}
        onClick={onTopBarClick}
      >
        <div className='pl-2'>
          {title}
        </div>
      </div>
      <motion.div
        animate={{
          height: isOpen ? height : 0
        }}
        className='overflow-hidden'
      >
        <Editor
          language={language}
          value={value}
          theme='vs-dark'
          options={{
            minimap: {
              enabled: false
            }
          }}
          onChange={onChange}

        />
      </motion.div>
    </motion.div>
  )
}
