import {Link} from "react-router-dom"
import { useModal } from "../../../context/ModalContext";
function UserMenu(){
      const user = {
    name: "Hiba",
    email: "hibaexp@gmail.com",
  };

  const { openLogoutModal } = useModal();
    return (
                 <div className="absolute right-0 top-full py-4 px-4 mt-4 w-64 bg-surface border rounded-xl border-border/70 p-2 z-50 backdrop-blur-xl ring-1 ring-black/5 shadow-lg">
                  <div className="min-w-0 border-b border-border py-3 px-2 select-none">
                    <p className="truncate text-xm text-text-muted">
                      {user.name}
                    </p>
                    <p className="truncate text-xs text-text-disabled">
                      {user.email}
                    </p>
                  </div>
                  <nav className=" flex flex-col justify-center items-start py-2">
                    <Link
                      to="/profile"
                      className="text-text-muted text-sm  hover:bg-primary-light p-2 rounded-xl w-full hover:text-text"
                    >
                      Profile
                    </Link>
                    <button onClick={openLogoutModal} className="text-text-muted text-sm  hover:bg-primary-light p-2  rounded-xl w-full text-start hover:text-text">
                      Logout
                    </button>
                  </nav>
                </div>
    );
}

export default UserMenu