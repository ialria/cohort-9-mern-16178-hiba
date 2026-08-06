import { ModalProvider } from "../../context/ModalContext";
function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
    
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />


      <div className="relative bg-surface rounded-3xl shadow-xl w-[90%] max-w-md p-8">
        {children}
      </div>
    </div>
  );
}

export default Modal;