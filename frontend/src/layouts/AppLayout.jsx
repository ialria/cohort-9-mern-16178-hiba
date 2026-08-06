import { SidebarProvider } from "../context/SidebarContext";
import { NotesProvider } from "../context/NotesContext";
import { Outlet } from "react-router-dom";
import { ModalProvider } from "../context/ModalContext";
import LogoutModal from "../components/modal/LogoutModal";
function AppLayout() {
  return (
    <SidebarProvider>
      <NotesProvider>
        <ModalProvider>
        <Outlet />
        <LogoutModal />
        </ModalProvider>
      </NotesProvider>
    </SidebarProvider>
  );
}

export default AppLayout