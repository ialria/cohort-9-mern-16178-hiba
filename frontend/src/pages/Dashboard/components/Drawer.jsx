import { useSidebar } from "../../../context/SidebarContext"
import LeafletLogo from "../../../icons/leaflet_logo.jsx";
import SidebarNav from "./SidebarNav.jsx";
function Drawer(){
const {drawerOpen, setDrawerOpen}=useSidebar();
return (
    <div className="block md:hidden">
         <div
                onClick={() => setDrawerOpen(false)}
                className={`
                    fixed inset-0
                    bg-black/50
                    z-40
                    transition-opacity
                    duration-300
                    ${drawerOpen ? "opacity-100" : "opacity-0 pointer-events-none"}
                `}
            />
    <aside className={`fixed inset-y-0 top-0 py-4 px-8 left-0 z-50 w-80 bg-surface shadow-lg flex flex-col gap-8 transform transition-transform duration-300 ease-in-out ${drawerOpen ? "translate-x-0" : "-translate-x-full"}`} hidden={!drawerOpen}>
      <div className="flex items-center gap-2 select-none">
          <div
            className="bg-primary p-2 rounded-2xl cursor-pointer outline-none"
          >
            <LeafletLogo className="w-8 h-8 text-surface" />
          </div>
          <span
            className="text-muted font-medium "
          >
            leaflet
          </span>
        </div>
        <SidebarNav showNavTitle={true}/>
    </aside>
    </div>
);
}

export default Drawer