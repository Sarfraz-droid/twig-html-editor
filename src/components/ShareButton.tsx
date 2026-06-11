import { useState } from "react";
import { LoaderCircle, Share2 } from "lucide-react";
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
        } catch {
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
            aria-label="Share workbench"
        >
            {isLoading ? (
                <>
                    <LoaderCircle className="size-4 animate-spin" />
                    <span className="hidden sm:inline">Sharing...</span>
                </>
            ) : (
                <>
                    <Share2 className="size-4" />
                    <span className="hidden sm:inline">Share</span>
                </>
            )}
        </Button>
    );
};
