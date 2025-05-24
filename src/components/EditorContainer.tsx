import React from 'react'
import { MonacoEditorComponent } from './MonacoEditorComponent'
import { HTMLPreview } from './HTMLPreview'
import { useElementSize } from '@mantine/hooks';
import { useStore } from '@/store/store';


export const EditorContainer = () => {
    const { ref, height } = useElementSize();

    const { html, json, setHtml, setJson } = useStore();

    const handleEditorChange = (editorId: string, value: string | undefined) => {
        console.log(editorId, value);
        if (editorId === 'html') {
            setHtml(value || '');
        } else if (editorId === 'json') {
            setJson(value || '');
        }
    };




    return (
        <div className='flex p-5 gap-5 h-[90vh]'
            ref={ref}
            style={{
                flex: 1
            }}
        >
            {/* Editor Section */}
            <div className='w-1/2 flex flex-col gap-2 h-full'>

                <div
                    className="flex-1 rounded-lg overflow-hidden"
                >
                    {height > 0 && <MonacoEditorComponent
                        language={'html'}
                        title={'HTML'}
                        value={html}
                        onChange={(value) => handleEditorChange('html', value)}
                        onTopBarClick={() => { }}
                        isOpen={true}
                    />}

                </div>
                <div
                    className="flex-1 rounded-lg overflow-hidden"
                >
                    {height > 0 && <MonacoEditorComponent
                        language={'json'}
                        title={'JSON'}
                        value={json}
                        onChange={(value) => handleEditorChange('json', value)}
                        onTopBarClick={() => { }}
                        isOpen={true}
                    />}

                </div>


            </div>

            {/* HTML Preview Section */}
            <div className='w-1/2'>
                <HTMLPreview />
            </div>
        </div>
    )
}
