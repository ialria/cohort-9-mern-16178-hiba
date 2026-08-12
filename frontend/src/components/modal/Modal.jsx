import { useEffect, useRef } from "react";
function Modal({ isOpen, onClose, children }) {

  const dialogReference = useRef(null);
  const previousFocusElement = useRef(null);
useEffect(() => {
  if (!isOpen || !dialogReference.current) {
    if (!isOpen) {
      previousFocusElement.current?.focus();
    }
    return;
  }

  previousFocusElement.current = document.activeElement;

  const dialog = dialogReference.current;

  const focusableElements = dialog.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  firstElement?.focus();

  function handleTab(e) {
    if (e.key !== "Tab") return;

    if (focusableElements.length === 0) {
      e.preventDefault();
      return;
    }

    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement.focus();
    }

    if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement.focus();
    }
  }

  dialog.addEventListener("keydown", handleTab);

  return () => {
    dialog.removeEventListener("keydown", handleTab);
  };
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
        ref={dialogReference}
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
