import { useElementSize } from '@mantine/hooks';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

export const editorContents = [
    {
        id: "html",
        title: "HTML",
        language: "html",
    },
    {
        id: "json",
        title: "Input Json",
        language: "json"
    }
]

export const useEditorElementSize = () => {
  const { ref, height, width } = useElementSize();
  const editorContentRef = useRef<{
    [key: string]: HTMLDivElement
  }>({});
  const [resolvedEditorSize, setResolvedEditorSize] = useState<number>(0);
  const [editorSectionSize, setEditorSectionSize] = useState<number>(0);
  const [activeEditor, setActiveEditor] = useState<string | null>('')

  const updateResolvedEditorSize = useCallback((size: number) => {
    const editorContentSize = editorContents.length;

    const resolvedHeight = height - (size * (editorContentSize + 1)) - (4 * (editorContentSize - 1));


    setEditorSectionSize(size);
    setResolvedEditorSize(resolvedHeight);
  }, [editorContentRef, height])

  
  useEffect(() => {
    setActiveEditor(editorContents[0].id)
  }, [])


  return {
    ref,
    updateResolvedEditorSize,
    resolvedEditorSize,
    activeEditor,
    setActiveEditor,
    editorContentRef
  }

}
