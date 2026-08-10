import { createContext, useContext, useState } from "react";

const ModalContext = createContext();

export function ModalProvider({ children }) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  function openLogoutModal() {
    setShowLogoutModal(true);
  }

  function closeLogoutModal() {
    setShowLogoutModal(false);
  }

  return (
    <ModalContext.Provider
      value={{
        showLogoutModal,
        openLogoutModal,
        closeLogoutModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  return useContext(ModalContext);
}