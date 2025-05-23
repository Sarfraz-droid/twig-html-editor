import React, { useEffect } from 'react'
import { cn } from '@/lib/utils'
import { useTwigService } from '@/hook/useTwigService';

type HTMLPreviewProps = {
    htmlContent?: string;
    className?: {
        container?: string;
        title?: string;
        iframe?: string;
    }
}

export const HTMLPreview = ({ htmlContent = '', className }: HTMLPreviewProps) => {
    const { renderedHtml, renderHtml } = useTwigService();

    const openInPopup = () => {
        const popup = window.open('', 'htmlPreview', 'width=800,height=600,scrollbars=yes,resizable=yes');
        if (popup) {
            popup.document.write(renderedHtml);
            popup.document.close();
        }
    };

    useEffect(() => {
        renderHtml();
    }, [])




    return (
        <div className={cn("bg-[#1e1e1e] rounded-lg h-full flex flex-col", className?.container)}>
            <div className={cn("font-semibold text-base p-2 flex items-center justify-between border-b border-gray-600", className?.title)}>
                <div className='pl-2 poppins-medium text-white'>
                    HTML Preview
                </div>
                <div className="flex items-center gap-2">
                    <button
                        className="p-1 hover:bg-gray-700 rounded transition-colors"
                        onClick={() => {
                            renderHtml();
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z" />
                        </svg>
                    </button>
                    <button
                        onClick={openInPopup}
                        className="p-1 hover:bg-gray-700 rounded transition-colors"
                        title="Open in popup"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 text-white">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                        </svg>
                    </button>
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-white">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>
                    </div>
                </div>
            </div>
            <div className="flex-1 p-2">
                <iframe
                    className={cn("w-full h-full border-0 rounded-md bg-white", className?.iframe)}
                    srcDoc={renderedHtml}
                    title="HTML Preview"
                    sandbox="allow-scripts allow-same-origin"
                />
            </div>
        </div>
    )
} 