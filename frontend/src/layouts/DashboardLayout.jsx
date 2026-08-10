import Header from "../pages/Dashboard/components/Header";
import SidebarLayout from "./SidebarLayout.jsx";
function DashboardLayout({children}) {
 
  return (
    
    <div className="h-screen flex bg-background overflow-hidden">
     <SidebarLayout />
      <main className="flex-1 overflow-y-auto">
        <Header />
       {children}
      </main>
    </div>
  );
}

export default DashboardLayout;
