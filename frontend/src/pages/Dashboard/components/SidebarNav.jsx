import { useState } from "react";
import { sidebarItems } from "../data/sidebarItems.js";
import { NavLink } from "react-router-dom";
import { Plus } from "../../../icons/icons.jsx";
import { Link } from "react-router-dom";
import { useSidebar } from "../../../context/SidebarContext.jsx";

function SidebarNav({ showNavTitle }) {
  const { collapsed, drawerOpen, setDrawerOpen } = useSidebar();

  return (
    <div className="mt-6">
      <Link
        to={`/notes/new`}
        className="flex items-center w-full py-2 px-3 gap-2 rounded-lg transition-all duration-300 bg-primary"
      >
        <Plus size={20} strokeWidth={1.25} className="shrink-0 text-surface" />
        <span
          className={`whitespace-nowrap text-surface overflow-hidden transition-all duration-300 text-[14px] ${collapsed ? "opacity-100 w-auto ml-2" : "md:opacity-0 md:w-0"}`}
        >
          New Note
        </span>
      </Link>
      <nav className="py-4">
        <ul className="space-y-3">
          {sidebarItems.map((item) => {
            const Icon = item.icon;

            return (
              <li key={item.id} className="mb-2">
                <NavLink
                  onClick={() => {
                    if (drawerOpen) {
                      setDrawerOpen(false);
                    }
                  }}
                  to={item.path}
                  end={item.path === "/dashboard"}
                  className={({ isActive }) =>
                    `flex items-center w-full py-2 px-3 rounded-lg transition-all duration-300 hover:bg-primary-light ${
                      isActive ? "bg-primary-light" : ""
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        size={24}
                        strokeWidth={1.25}
                        className={` shrink-0 ${isActive ? "text-text" : "text-text-muted"}`}
                      />
                      <span
                        className={`whitespace-nowrap overflow-hidden transition-all duration-300 text-[14px] ${isActive ? "text-text" : "text-text-muted"} ${showNavTitle ? "opacity-100 w-auto ml-2" : "opacity-0 w-0"}`}
                      >
                        {item.title}
                      </span>
                    </>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

export default SidebarNav;
