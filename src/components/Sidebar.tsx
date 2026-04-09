

import { NavLink } from "react-router-dom";

import navItems from "../type/navItems";
import { useSidebar } from "../hooks/useSidebar";
import { LogOut } from "lucide-react";
import { useAuth } from "../hooks/useAuth";


function Sidebar() {

  const { isOpen } = useSidebar();
  const { logout } = useAuth();
  return (
    <aside
      className={`${
        isOpen ? "w-[260px]" : "w-[80px]"
      } bg-default border-r top-15 border-t-0 fixed left-0 bottom-0 border-default min-h-screen flex flex-col transition-all duration-300`}
    >
      {/* Navigation */}
      <nav className="flex-1 flex flex-col mt-6">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-4 px-5 py-3 rounded-lg mx-3 my-1 text-primary hover:bg-primary/10 ${
                isActive
                  ? "bg-primary text-white hover:bg-primary"
                  : "text-primary"
              }`
            }
          >
            <item.icon size={20} />
            {isOpen && <span className="text-sm font-medium">{item.name}</span>}
          </NavLink>
        ))}
      </nav>

      <div
        onClick={logout}
        className="p-4 mb-15 flex border-default border-t text-xs text-muted items-center gap-2 cursor-pointer hover:text-red-500"
      >
        <LogOut size={16} className="ml-2" />
       {isOpen && <span>Logout</span>}
      </div>
    </aside>
  );
}

export default Sidebar;
