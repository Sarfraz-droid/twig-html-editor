import {
    useTwigFunctionsStore,
    type ITwigFunctions
} from "@/store/functionStore";
import { toast } from "sonner";

export const useFunction = () => {
    const {
        twigFunctions,
        setTwigFunctions,
        selectedFunction,
        setSelectedFunction
    } = useTwigFunctionsStore();

    const addFunction = (functionItem: ITwigFunctions) => {
        setTwigFunctions([...twigFunctions, functionItem]);
    };

    const updateSelectedFunctionTitle = (title: string) => {
        if (selectedFunction) {
            setSelectedFunction({
                ...selectedFunction,
                name: title
            });
        }
    };

    const updateSelectedFunctionFunction = (functionText: string) => {
        if (selectedFunction) {
            setSelectedFunction({
                ...selectedFunction,
                function: functionText
            });
        }
    };

    const saveSelectedFunction = () => {
        if (selectedFunction) {
            setTwigFunctions(
                twigFunctions.map((functionItem) =>
                    functionItem.id === selectedFunction.id
                        ? selectedFunction
                        : functionItem
                )
            );
            toast("Function saved");
        }
    };

    const removeFunction = (functionId: string) => {
        setTwigFunctions(
            twigFunctions.filter(
                (functionItem) => functionItem.id !== functionId
            )
        );
    };

    const selectFunctionByFunctionId = (functionId: string) => {
        setSelectedFunction(
            twigFunctions.find(
                (functionItem) => functionItem.id === functionId
            ) || null
        );
    };

    return {
        twigFunctions,
        setTwigFunctions,
        selectedFunction,
        setSelectedFunction,
        addFunction,
        removeFunction,
        selectFunctionByFunctionId,
        updateSelectedFunctionTitle,
        updateSelectedFunctionFunction,
        saveSelectedFunction
    };
};
