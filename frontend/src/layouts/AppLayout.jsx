import { SidebarProvider } from "../context/SidebarContext";
import { NotesProvider } from "../context/NotesContext";
import { Outlet } from "react-router-dom";
import { ModalProvider } from "../context/ModalContext";
import LogoutModal from "../components/modal/LogoutModal";
import { ProfileProvider } from "../context/ProfileContext";
function AppLayout() {
  return (
    <SidebarProvider>
      <NotesProvider>
        <ProfileProvider>
          <ModalProvider>
            <Outlet />
            <LogoutModal />
          </ModalProvider>
        </ProfileProvider>
      </NotesProvider>
    </SidebarProvider>
  );
}

export default AppLayout;
