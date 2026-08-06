import { useEffect, useRef } from "react";
function Modal({ isOpen, onClose, children }) {

  const dialogRef = useRef(null);
  const previousFocus = useRef(null);
  useEffect(() => {
    if (isOpen) {
      previousFocus.current = document.activeElement;
      dialogRef.current?.focus();
    } else {
      previousFocus.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />

      <div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
     aria-labelledby="logout-title"
        className="relative bg-surface rounded-3xl shadow-xl w-[90%] max-w-md p-8"
      >
        {children}
      </div>
    </div>
  );
}

export default Modal;
