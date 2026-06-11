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
import { FunctionSquare } from "lucide-react";


export const AddFunctionDrawer = () => {
    const { twigExtension, setTwigExtension } = useStore();

    return (
        <Drawer shouldScaleBackground={true}>
            <DrawerTrigger asChild>
                <Button variant="outline" size="sm" title="Edit Twig extension">
                    <FunctionSquare className="size-4" />
                    <span className="hidden lg:inline">Extension</span>
                </Button>
            </DrawerTrigger>
            <DrawerContent className="h-[92dvh]">
                <DrawerHeader>
                    <DrawerTitle>Edit Twig Extension</DrawerTitle>
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
