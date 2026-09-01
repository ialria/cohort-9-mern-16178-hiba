import {useState, useContext,createContext, useMemo} from "react";


const SidebarContext=createContext();
export function SidebarProvider({children}){
    const [collapsed, setCollapsed] = useState(false);
    const [activeItem, setActiveItem] = useState("notes");
    const [drawerOpen, setDrawerOpen] = useState(false);
const sidebarContextValue = useMemo(
  () => ({
    collapsed,
    setCollapsed,
    activeItem,
    setActiveItem,
    drawerOpen,
    setDrawerOpen,
  }),
  [collapsed, activeItem, drawerOpen]
);
    return (
          <SidebarContext.Provider value={sidebarContextValue}>
    {children}
        </SidebarContext.Provider>
    );
}

export function useSidebar(){return useContext(SidebarContext)}