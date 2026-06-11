import { Braces, Code2 } from "lucide-react";
import { AddFunctionDrawer } from "./AddFunctionDrawer";
import { HeaderDrawer } from "./HeaderDrawer";
import { ShareButton } from "./ShareButton";
import { Button } from "./ui/button";
import { useStore } from "@/store/store";

export const Navbar = () => {
    const { activeTab, setActiveTab } = useStore();
    return (
        <header className="flex flex-wrap items-center gap-3 px-3 py-3 sm:px-4 lg:px-5">
            <div className="mr-auto min-w-0">
                <h1 className="truncate text-lg font-bold tracking-tight text-slate-100 sm:text-xl">
                    Twig Workbench
                </h1>
                <p className="hidden text-xs text-slate-500 sm:block">
                    Build and preview Twig templates safely
                </p>
            </div>
            <nav className="order-3 flex w-full rounded-lg bg-white/5 p-1 sm:order-none sm:w-auto" aria-label="Primary">
                <Button
                    variant="ghost"
                    size="sm"
                    className={activeTab === "code" ? "flex-1 bg-white/10 text-white sm:flex-none" : "flex-1 text-slate-400 sm:flex-none"}
                    onClick={() => setActiveTab("code")}
                >
                    <Code2 className="size-4" />
                    Workbench
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    className={activeTab === "serializer" ? "flex-1 bg-white/10 text-white sm:flex-none" : "flex-1 text-slate-400 sm:flex-none"}
                    onClick={() => setActiveTab("serializer")}
                >
                    <Braces className="size-4" />
                    Serializer
                </Button>
            </nav>
            <div className="flex items-center gap-1.5 sm:gap-2">
                <ShareButton />
                <HeaderDrawer />
                <AddFunctionDrawer />
            </div>
        </header>
    );
};
