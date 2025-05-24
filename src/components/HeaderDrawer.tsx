import React from "react";
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger
} from "./ui/drawer";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useStore } from "@/store/store";
import { MonacoEditorComponent } from "./MonacoEditorComponent";

export const HeaderDrawer = () => {
    const { htmlHead, setHtmlHead } = useStore();

    const handleInputChange = (field: keyof typeof htmlHead, value: string) => {
        setHtmlHead({ [field]: value });
    };

    return (
        <Drawer shouldScaleBackground={true}>
            <DrawerTrigger>
                <Button variant={"outline"}>📄 HTML Head</Button>
            </DrawerTrigger>
            <DrawerContent className="h-[100vh] min-h-[600px]">
                <DrawerHeader>
                    <DrawerTitle>Edit HTML Head Elements</DrawerTitle>
                </DrawerHeader>
                <DrawerDescription className="px-4 h-full pb-4 flex flex-col">
                    <div className="w-full flex flex-1 gap-6">
                        {/* Form Section */}
                        <div className="w-1/2 flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-white">Page Title</label>
                                <Input
                                    value={htmlHead.title}
                                    onChange={(e) => handleInputChange('title', e.target.value)}
                                    placeholder="Enter page title..."
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-white">Meta Description</label>
                                <textarea
                                    value={htmlHead.metaDescription}
                                    onChange={(e) => handleInputChange('metaDescription', e.target.value)}
                                    placeholder="Enter meta description..."
                                    className="flex h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                                    maxLength={160}
                                />
                                <small className="text-xs text-gray-400">
                                    {htmlHead.metaDescription.length}/160 characters
                                </small>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-white">Meta Keywords</label>
                                <Input
                                    value={htmlHead.metaKeywords}
                                    onChange={(e) => handleInputChange('metaKeywords', e.target.value)}
                                    placeholder="keyword1, keyword2, keyword3..."
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-white">Viewport</label>
                                <Input
                                    value={htmlHead.viewport}
                                    onChange={(e) => handleInputChange('viewport', e.target.value)}
                                    placeholder="width=device-width, initial-scale=1.0"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <h3 className="text-lg font-medium text-white">Common Meta Tags</h3>
                                <div className="grid grid-cols-1 gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            const newCustomHead = htmlHead.customHead + 
                                                (htmlHead.customHead ? '\n' : '') + 
                                                '<meta charset="UTF-8">';
                                            handleInputChange('customHead', newCustomHead);
                                        }}
                                    >
                                        + UTF-8 Charset
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            const newCustomHead = htmlHead.customHead + 
                                                (htmlHead.customHead ? '\n' : '') + 
                                                '<meta name="robots" content="index, follow">';
                                            handleInputChange('customHead', newCustomHead);
                                        }}
                                    >
                                        + Robots Meta
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            const newCustomHead = htmlHead.customHead + 
                                                (htmlHead.customHead ? '\n' : '') + 
                                                '<meta name="author" content="Your Name">';
                                            handleInputChange('customHead', newCustomHead);
                                        }}
                                    >
                                        + Author Meta
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Custom Head Content Editor */}
                        <div className="w-1/2 flex flex-col gap-2">
                            <label className="text-sm font-medium text-white">Custom Head Content</label>
                            <div className="flex-1">
                                <MonacoEditorComponent
                                    language="html"
                                    value={htmlHead.customHead}
                                    title="Custom Head HTML"
                                    isOpen={true}
                                    onChange={(value) => handleInputChange('customHead', value || '')}
                                    className={{
                                        container: "w-full h-full",
                                    }}
                                    onTopBarClick={() => {}}
                                />
                            </div>
                        </div>
                    </div>
                </DrawerDescription>
            </DrawerContent>
        </Drawer>
    );
}; 