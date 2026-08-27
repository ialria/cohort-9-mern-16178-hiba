import { SidebarProvider } from "../context/SidebarContext";
import { NotesProvider } from "../context/NotesContext";
import { Outlet } from "react-router-dom";
import { ModalProvider } from "../context/ModalContext";
import LogoutModal from "../components/modal/LogoutModal";
import { ProfileProvider } from "../context/ProfileContext";
import { ThemeProvider } from "../context/ThemeContext";
function AppLayout() {
  return (
    <ThemeProvider>
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
    </ThemeProvider>
  );
}

export default AppLayout;
