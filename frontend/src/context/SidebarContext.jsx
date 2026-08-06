import {useState, useContext,createContext} from "react";

const SidebarContext=createContext();
export function SidebarProvider({children}){
    const [collapsed, setCollapsed] = useState(false);
    const [activeItem, setActiveItem] = useState("notes");
    const [drawerOpen, setDrawerOpen] = useState(false);

    return (
        <SidebarContext.Provider value={{ collapsed, setCollapsed,activeItem,setActiveItem,drawerOpen,setDrawerOpen }}>
            {children}
        </SidebarContext.Provider>
    );
}

export function useSidebar(){return useContext(SidebarContext)}