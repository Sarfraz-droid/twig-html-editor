import React, { useState } from 'react';
import { Button } from './ui/button';
import { useUrlState } from '@/hook/useUrlState';
import { toast } from 'sonner';

export const ShareButton = () => {
    const { copyShareableUrl, generateShareableUrl } = useUrlState();
    const [isLoading, setIsLoading] = useState(false);

    const handleShare = async () => {
        setIsLoading(true);
        try {
            const success = await copyShareableUrl();
            if (success) {
                toast.success('Shareable URL copied to clipboard!', {
                    description: 'You can now share this link to restore the current state.',
                });
            } else {
                // Fallback: show the URL in a prompt
                const shareableUrl = generateShareableUrl();
                prompt('Copy this shareable URL:', shareableUrl);
                toast.info('URL generated - please copy manually');
            }
        } catch (error) {
            console.error('Error sharing:', error);
            toast.error('Failed to copy URL to clipboard');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button 
            variant="outline" 
            onClick={handleShare}
            disabled={isLoading}
            size="sm"
        >
            {isLoading ? (
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    Sharing...
                </div>
            ) : (
                <div className="flex items-center gap-2">
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        strokeWidth={1.5} 
                        stroke="currentColor" 
                        className="w-4 h-4"
                    >
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314a2.25 2.25 0 1 1 .434 3.938l-9.566 5.313a2.25 2.25 0 0 1-.434 3.938Z" 
                        />
                    </svg>
                    Share
                </div>
            )}
        </Button>
    );
}; 