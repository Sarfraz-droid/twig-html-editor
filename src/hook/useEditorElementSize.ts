import { useElementSize } from '@mantine/hooks';
import { useCallback, useEffect, useRef, useState } from 'react'

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
  const { ref, height } = useElementSize();
  const editorContentRef = useRef<{
    [key: string]: HTMLDivElement
  }>({});
  const [resolvedEditorSize, setResolvedEditorSize] = useState<number>(0);
  const [activeEditor, setActiveEditor] = useState<string | null>('')

  const updateResolvedEditorSize = useCallback((size: number) => {
    const editorContentSize = editorContents.length;

    const resolvedHeight = height - (size * (editorContentSize + 1)) - (4 * (editorContentSize - 1));


    setResolvedEditorSize(resolvedHeight);
  }, [height])

  
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
