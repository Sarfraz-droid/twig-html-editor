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
import { useStore } from "@/store/store";
import { MonacoEditorComponent } from "./MonacoEditorComponent";


export const AddFunctionDrawer = () => {
    const { twigExtension, setTwigExtension } = useStore();

    return (
        <Drawer shouldScaleBackground={true}>
            <DrawerTrigger>
                <Button variant={"outline"}>Twig Extension</Button>
            </DrawerTrigger>
            <DrawerContent className="h-[100vh] min-h-[600px]">
                <DrawerHeader>
                    <DrawerTitle>Add Function</DrawerTitle>
                </DrawerHeader>
                <DrawerDescription className="px-4 h-full pb-4 flex flex-col">
                    <MonacoEditorComponent
                        language="javascript"
                        value={twigExtension}
                        onChange={(value) => setTwigExtension(value || "")}
                        title="Twig Extension"
                        onTopBarClick={() => {}}
                        isOpen={true}
                    />
                </DrawerDescription>
            </DrawerContent>
        </Drawer>
    );
};
