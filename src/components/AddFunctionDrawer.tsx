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
import { useFunction } from "@/hook/useFunction";
import { nanoid } from "nanoid";
import type { ITwigFunctions } from "@/store/functionStore";
import { Input } from "./ui/input";
import { MonacoEditorComponent } from "./MonacoEditorComponent";

export const AddFunctionDrawer = () => {
    const { twigFunctions, addFunction, selectFunctionByFunctionId, selectedFunction, updateSelectedFunctionTitle, updateSelectedFunctionFunction, saveSelectedFunction } = useFunction();

    const addNewFunction = () => {
        const newFunction: ITwigFunctions = {
            id: nanoid(),
            name: "New Function",
            function: `function () {
    return 'Hello World';
}
            `
        }

        addFunction(newFunction);
        selectFunctionByFunctionId(newFunction.id);
    }

    return (
        <Drawer shouldScaleBackground={true}>
            <DrawerTrigger>
                <Button variant={"outline"}>+ Function</Button>
            </DrawerTrigger>
            <DrawerContent className="h-[100vh] min-h-[600px]">
                <DrawerHeader>
                    <DrawerTitle>Add Function</DrawerTitle>
                </DrawerHeader>
                <DrawerDescription className="px-4 h-full pb-4 flex flex-col">
                    <div className="w-full flex flex-1">
                        <div className="w-1/5 flex flex-col gap-4">
                            {twigFunctions.map((functionItem, index) => (
                                <Button
                                    key={index}
                                    variant={
                                        selectedFunction?.id === functionItem.id
                                            ? "default"
                                            : "outline"
                                    }
                                    onClick={() => selectFunctionByFunctionId(functionItem.id)}
                                >
                                    {selectedFunction?.id === functionItem.id ? selectedFunction.name : functionItem.name}
                                </Button>
                            ))}
                            <div 
                                className="border-b-2 border-gray-200/25"
                            />
                            <Button
                                variant={"outline"}
                                onClick={addNewFunction}
                            >
                                + Add Function
                            </Button>
                            <div className="flex items-center gap-2 w-full justify-end">
                                    <Button variant={"secondary"} className="w-full" onClick={saveSelectedFunction}>Save</Button>
                            </div>
                        </div>
                        <div className="w-4/5"
                            style={{
                                display: selectedFunction ? "flexx" : "none"
                            }}
                            key={selectedFunction?.id}
                        >
                            <div className="flex flex-col gap-4 px-5 h-full mb-[24px]">
                                <div className="flex items-center gap-2">
                                    <Input
                                        value={selectedFunction?.name}
                                        onChange={(e) => {
                                            updateSelectedFunctionTitle(e.target.value);                                            
                                        }}
                                        placeholder="Function Name"
                                    />
                                </div>
                                <div className="flex items-center gap-2 w-full flex-1">
                                    <MonacoEditorComponent
                                        language="javascript"
                                        value={selectedFunction?.function || ""}
                                        title="Function"
                                        isOpen={true}
                                        onChange={(value) => {
                                            updateSelectedFunctionFunction(value || "");
                                        }}
                                        className={{
                                            container: "w-full",
                                        }}
                                        onTopBarClick={() => { }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </DrawerDescription>
            </DrawerContent>
        </Drawer>
    );
};
