import { useEffect, useRef, useState } from 'react'
import { MonacoEditorComponent } from './MonacoEditorComponent'
import { HTMLPreview } from './HTMLPreview'
import { useElementSize } from '@mantine/hooks';
import { useStore } from '@/store/store';
import { useUrlState } from '@/hook/useUrlState';
import { useTwigService } from '@/hook/useTwigService';
import clsx from 'clsx';
import { motion } from 'motion/react'

type LeftTabState = 'html' | 'json'

export const EditorContainer = () => {
    const { ref, height } = useElementSize();
    const { html, json, htmlHead, setHtml, setJson } = useStore();
    const { updateUrlWithState } = useUrlState();
    const debounceTimer = useRef<number | undefined>(undefined);
    const { renderHtml } = useTwigService();
    const [leftTabState, setLeftTabState] = useState<LeftTabState>('html');
    const handleEditorChange = (editorId: string, value: string | undefined) => {
        console.log({editorId, value});
        if (editorId === 'html') {
            console.log("setHtml", value);
            setHtml(value || '');
        } else if (editorId === 'json') {
            console.log("setJson", value);
            setJson(value || '');
        }
    };

    const renderHtmlHandler = () => {
        renderHtml();
    }

    // Debounced URL update when state changes
    useEffect(() => {
        // Clear existing timer
        if (debounceTimer.current) {
            window.clearTimeout(debounceTimer.current);
        }

        // Set new timer to update URL after 1 second of no changes
        debounceTimer.current = window.setTimeout(() => {
            updateUrlWithState();
        }, 1000);

        // Cleanup function
        return () => {
            if (debounceTimer.current) {
                window.clearTimeout(debounceTimer.current);
            }
        };
    }, [html, json, htmlHead, updateUrlWithState]);

    return (
        <div className='flex p-5 gap-5 h-[90vh]'
            ref={ref}
            style={{
                flex: 1
            }}
        >
            {/* Editor Section */}
            <div className='w-1/2 flex flex-col gap-2 h-full'>

                <motion.div
                    layout
                    transition={{ duration: 0.25, ease: [0.2, 0.65, 0.3, 0.9] }}
                    className={clsx("rounded-lg overflow-hidden", {
                        "flex-1": leftTabState === 'html'
                    })}
                >
                    {height > 0 && <MonacoEditorComponent
                        language={'html'}
                        title={'HTML'}
                        value={html}
                        onChange={(value) => handleEditorChange('html', value)}
                        onTopBarClick={() => setLeftTabState((v) => v === 'html' ? 'json' : 'html')}
                        onRun={renderHtmlHandler}
                        isOpen={leftTabState === 'html'}
                    />}

                </motion.div>
                <motion.div
                    layout
                    transition={{ duration: 0.25, ease: [0.2, 0.65, 0.3, 0.9] }}
                    className={clsx("rounded-lg overflow-hidden", {
                        "flex-1": leftTabState === 'json'
                    })}
                >
                    {height > 0 && <MonacoEditorComponent
                        language={'json'}
                        title={'JSON'}
                        value={json}
                        onChange={(value) => handleEditorChange('json', value)}
                        onTopBarClick={() => setLeftTabState((v) => v === 'json' ? 'html' : 'json')}
                        onRun={renderHtmlHandler}
                        isOpen={leftTabState === 'json'}
                    />}

                </motion.div>


            </div>

            {/* HTML Preview Section */}
            <div className='w-1/2'>
                <HTMLPreview />
            </div>
        </div>
    )
}
