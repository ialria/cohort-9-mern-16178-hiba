import { createContext, useContext, useState } from "react";

const ModalContext = createContext();

export function ModalProvider({ children }) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);

  function openLogoutModal() {
    setShowLogoutModal(true);
  }

  function closeLogoutModal() {
    setShowLogoutModal(false);
  }
   function openDeleteModal(note) {
    setNoteToDelete(note);
  }

  function closeDeleteModal() {
    setShowDeleteModal(false);
  }

  return (
    <ModalContext.Provider
      value={{
        showLogoutModal,
        openLogoutModal,
        closeLogoutModal,
        noteToDelete,
        openDeleteModal,
        closeDeleteModal
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  return useContext(ModalContext);
}