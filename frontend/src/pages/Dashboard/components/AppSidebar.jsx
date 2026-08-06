import SidebarNav from "./SidebarNav.jsx";
import LeafletLogo from "../../../icons/leaflet_logo.jsx";
import {
  SidebarProvider,
  useSidebar,
} from "../../../context/SidebarContext.jsx";
function AppSidebar() {
  const { collapsed, setCollapsed } = useSidebar();

  // console.log("Sidebar:", activeItem);
  return (
    <aside
      className={`sticky hidden md:block top-0 h-screen bg-surface py-6 px-4 ${collapsed ? "lg:w-64 md:w-52" : "w-20"} transition-all duration-300`}
    >

   <div className="flex items-center gap-2">
        <button
          onClick={() => setCollapsed((prev) => !prev)}
          className="bg-primary p-2 rounded-2xl cursor-pointer outline-none"
        >
          <LeafletLogo className="w-8 h-8 text-surface" />
        </button>
        <span
          className={`text-muted font-medium ${collapsed ? "block" : "hidden"}`}
        >
          leaflet
        </span>
      </div>

   
   
      <SidebarNav showNavTitle={collapsed} />
    </aside>
  );
}

export default AppSidebar;
