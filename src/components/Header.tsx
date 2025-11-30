import { useState, useEffect } from "react";
import { Moon, Sun, Search, Box, Menu } from "lucide-react";
import { useDarkMode } from "../hooks/useDarkMode";
import { useSidebar } from "../hooks/useSidebar";
import GlobalSearch from "../ui/GlobalSearch";
import { useSearch } from "../hooks/useSearch";
import DesktopSearchInput from "../ui/DesktopSearchInput";
import { useUser } from "../hooks/useUser";

function Header() {
  const { openSearch, setOpenSearch } = useSearch();
  const {isDarkMode, toggleDarkMode} = useDarkMode();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
const { toggleSidebar } = useSidebar();
  const [user] = useUser();
   const {  name, profileImg } = user || {};
 
   const initials = (name || "User")
     .split(" ")
     .map((n: string) => n[0])
     .slice(0, 2)
     .join("")
     .toUpperCase();
useEffect(() => {
  const handleScroll = () => {
    // Only enable scroll-hide for mobile/tablet screens
    if (window.innerWidth >= 768) {
      setIsVisible(true);
      return;
    }

    const currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY && currentScrollY > 50) {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }

    setLastScrollY(currentScrollY);
  };

  window.addEventListener("scroll", handleScroll);
  window.addEventListener("resize", handleScroll); // Re-evaluate when resizing

  return () => {
    window.removeEventListener("scroll", handleScroll);
    window.removeEventListener("resize", handleScroll);
  };
}, [lastScrollY]);
 <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold cursor-pointer">
          S
        </div>
  return (
    <header
      className={`flex items-center justify-between px-6 py-3 bg-white dark:bg-[#0B1120] border-b border-gray-200 dark:border-gray-700 fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      {/* Logo / App Name */}
      <div className="flex items-center gap-2">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md hidden md:block hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <Menu size={20} className="dark:*:text-white" />
        </button>
        <Box className="w-8 h-8 rounded-xl bg-blue-500 text-gray-800 dark:text-gray-100 tracking-wide" />
        <h1 className="font-bold text-lg text-gray-800 dark:text-gray-100 tracking-wide">
          Chronova
        </h1>
      </div>

      {/* Search bar */}
      <DesktopSearchInput />

      {openSearch && <GlobalSearch onClose={() => setOpenSearch(false)} />}
      {/* Right side controls */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setOpenSearch(true)}
          className="p-2 rounded-lg sm:hidden hover:bg-gray-500/20 transition text-gray-950 dark:text-white"
        >
          <Search className="w-5 h-5" />
        </button>
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 dark:bg-gray-800 transition"
        >
          {isDarkMode ? (
            <Sun size={18} className="text-yellow-400" />
          ) : (
            <Moon size={18} className="text-gray-600 dark:text-gray-300" />
          )}
        </button>

       
         <div className=" flex flex-col md:flex-row items-center gap-6 ">
        <div className="">
          {profileImg ? (
            <img
              src={profileImg}
              alt="Profile"
              className="w-9 h-9 rounded-full object-cover border shadow-sm"
            />
          ) : (
            <div
              className="w-9 h-9 rounded-full bg-linear-to-tr from-blue-600 to-blue-500 text-white 
            flex items-center justify-center  font-semibold shadow-sm"
            >
              {initials}
            </div>
          )}
          </div>
          </div>
      </div>
    </header>
  );
}

export default Header;
