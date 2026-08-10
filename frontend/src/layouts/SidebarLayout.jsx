import AppSidebar from "../pages/Dashboard/components/AppSidebar";
import Drawer from "../pages/Dashboard/components/Drawer";
function SidebarLayout({ children }) {
  return (
    <div className="h-screen flex bg-background overflow-hidden">
      <AppSidebar />
      <Drawer />
   
    </div>
  );

}
  export default SidebarLayout
