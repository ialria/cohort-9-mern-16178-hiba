import { useNavigate } from "react-router-dom";
import Modal from "./Modal";
import Button from "../Button";
import { LogOut } from "../../icons/icons";
import { useModal } from "../../context/ModalContext";

function LogoutModal() {
  const navigate = useNavigate();

  const {
    showLogoutModal,
    closeLogoutModal,
  } = useModal();

  function handleLogout() {
 localStorage.removeItem("token");
    closeLogoutModal();
    navigate("/login");
  }
// yes -working

  return (
    <Modal
      isOpen={showLogoutModal}
      onClose={closeLogoutModal}
    >
      <div className="flex flex-col items-center ">

        <div className="w-18 h-18 rounded-full bg-delete-bgLight flex items-center justify-center">
          <LogOut
            size={34}
            className="text-error"
            strokeWidth={1.75}
          />
        </div>

    

        <h2 id="logout-title" className="mt-6 text-xl font-semibold text-text">
          Log Out
        </h2>



        <p className="mt-2 text-center text-sm text-text-muted">
          Are you sure you want to sign out?
          <br />
          You'll need to sign in again to access your notes.
        </p>

    

        <div className="flex gap-3 mt-8 w-full">

          <Button
            onClick={closeLogoutModal}
            className="flex-1 bg-primary-light text-text"
          >
            Cancel
          </Button>

          <Button
            onClick={handleLogout}
            className="flex-1 bg-delete-primary text-surface hover:bg-error"
          >
            Log Out
          </Button>

        </div>
      </div>
    </Modal>
  );
}

export default LogoutModal;