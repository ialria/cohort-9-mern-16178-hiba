import { Search, Menu } from "./../../../icons/icons.jsx";
import { useState , useRef, useEffect} from "react";
import { useNotes } from "../../../context/NotesContext.jsx";
import UserMenu from "./UserMenu.jsx";
import { sidebarItems } from "../data/sidebarItems.js";
import { useLocation } from "react-router-dom";
import { useSidebar } from "../../../context/SidebarContext.jsx";
import { useProfile } from "../../../context/ProfileContext.jsx";
import NotesSearchResults from "./NotesSearchResults.jsx";
function Header() {
  const { profile , getInitials} = useProfile();
  const userMenuRef = useRef(null);
  const location=useLocation();
  const [isOpen, setIsOpen] = useState(false);
const { searchTerm, setSearchTerm } = useNotes();
  const currentItem =
  sidebarItems.find((item) => item.path === location.pathname) ??
  (location.pathname.startsWith("/notes/")
    ? sidebarItems.find((item) => item.id === "notes")
    : undefined) ??  sidebarItems.find((item) => item.id === "notes");
  const { drawerOpen,setDrawerOpen } = useSidebar();
  const showSearch = currentItem.id === "notes";
  useEffect(() => {
  const handleClickOutside = (event) => {
    if (
      userMenuRef.current &&
      !userMenuRef.current.contains(event.target)
    ) {
      setIsOpen(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);
  return (
    <header className="sticky top-0 z-20  ">
      <div
        className="relative bg-background md:pt-4 pt-3 pb-3 px-8 flex justify-between items-center backdrop-blur-md w-full"
      >
      <div className="flex items-center gap-4">
        <h1 className="text-text md:block hidden text-3xl font-semibold">
          {currentItem.title}
        </h1>
        <button  aria-label="Toggle sidebar"
          aria-expanded={drawerOpen}
          onClick={() => setDrawerOpen(true)}
          className="focus-visible:outline-none
focus-visible:ring-2
focus-visible:ring-primary hover:bg-primary-light p-3 transition-all duration-150 rounded-full block md:hidden"
        >
          <Menu size={22} className="text-text"/>
        </button>
            {!showSearch && (
          <h1 className="text-text text-2xl font-semibold md:hidden">
            {currentItem.title}
          </h1>
        )}
</div>
    
        

        <div className="flex gap-4 items-center">
          <div className={`relative ${showSearch ? "block" : "hidden"}`}>
            <input
             type="text"
            value={searchTerm}
   onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search notes"
              aria-label="Search notes"
              className="text-text w-full md:w-96 border border-border h-10 md:h-11 pl-4 pr-10 bg-surface rounded-full"
            />
            <button
              type="button"
              aria-label="Search notes"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted cursor-pointer"
            >
              <Search />
            </button>
  <NotesSearchResults />

          </div>
          {showSearch && (
  <div ref={userMenuRef} className="relative">
    <button
      aria-label="User menu"
      aria-expanded={isOpen}
      className="shrink-0 w-14 h-14 rounded-full bg-primary flex justify-center items-center text-surface text-md md:text-xl font-semibold overflow-hidden cursor-pointer"
      type="button"
      onClick={() => setIsOpen((prev) => !prev)}
    >
      {profile?.avatarUrl ? (
        <img
          src={profile.avatarUrl}
          alt="Profile"
          className="w-full h-full object-cover"
        />
      ) : (
        getInitials(profile?.username || "U")
      )}
    </button>

    {isOpen && <UserMenu />}
  </div>
)}
        </div>
      </div>
      {showSearch && (
        <div className="block md:hidden px-10 bg-background">
          <h1 className="text-text text-2xl font-semibold">
            {currentItem.title}
          </h1>
        </div>
      )}
      <div className="h-8 w-full bg-gradient-to-b from-background to-transparent pointer-events-none" />
    </header>
  );
}

export default Header;
