import { createContext, useContext, useState, useCallback, useMemo } from "react";

const ModalContext = createContext();

export function ModalProvider({ children }) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

const openLogoutModal = useCallback(() => {
  setShowLogoutModal(true);
}, []);

const closeLogoutModal = useCallback(() => {
  setShowLogoutModal(false);
}, []);

const modalContextValue = useMemo(
  () => ({
    showLogoutModal,
    openLogoutModal,
    closeLogoutModal,
  }),
  [showLogoutModal, openLogoutModal, closeLogoutModal]
);

  return (
<ModalContext.Provider value={modalContextValue}>
    {children}
  </ModalContext.Provider>
  );
}

export function useModal() {
  return useContext(ModalContext);
}