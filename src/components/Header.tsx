import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Moon,
  Sun,
  Search,
  Box,
  Menu,
  X,
  Home,
  MapPin,
  Users,
  BookOpen,
  Compass,
  Settings,
  LogOut,
  User,
  ChevronDown,
  LogIn,
  UserPlus,
} from "lucide-react";
import { useDarkMode } from "../hooks/useDarkMode";
import { useSidebar } from "../hooks/useSidebar";
import GlobalSearch from "../ui/GlobalSearch";
import { useSearch } from "../hooks/useSearch";
import DesktopSearchInput from "../ui/DesktopSearchInput";
import { useAuth } from "../hooks/useAuth";
import { NavLink, useNavigate } from "react-router-dom";

function Header() {
  const { openSearch, setOpenSearch } = useSearch();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { toggleSidebar } = useSidebar();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const isAuthenticated = !!user;
  const { name = "User", email } = user || {};

  const initials = name
    .split(" ")
    .map((n: string) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 20);

      if (window.innerWidth >= 768) {
        setIsVisible(true);
        return;
      }

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false);
        setIsMobileMenuOpen(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [lastScrollY]);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
    setIsProfileMenuOpen(false);
  };

  const navItems = isAuthenticated
    ? [
        { path: "/dashboard", label: "Dashboard", icon: Home },
        { path: "/places", label: "Places", icon: MapPin },
        { path: "/people", label: "People", icon: Users },
        { path: "/notes", label: "Notes", icon: BookOpen },
        { path: "/journeys", label: "Journeys", icon: Compass },
      ]
    : [];

  return (
    <>
      <motion.header
        initial={{ y: 0 }}
        animate={{ y: isVisible ? 0 : -100 }}
        transition={{ duration: 0.3 }}
        className={`
          flex items-center justify-between px-4 sm:px-6 py-2 sm:py-3
          fixed top-0 left-0 right-0 z-50
          transition-all duration-300
          ${
            isScrolled
              ? "bg-default/95 backdrop-blur-md shadow-medium border-b border-default/50"
              : "bg-default border-b border-default"
          }
        `}
      >
        {/* Left section - Logo & Menu */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Mobile menu button - Only show for authenticated users */}
          {isAuthenticated && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-card transition-colors md:hidden"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X size={20} className="text-muted" />
              ) : (
                <Menu size={20} className="text-muted" />
              )}
            </motion.button>
          )}

          {/* Desktop sidebar toggle - Only for authenticated */}
          {isAuthenticated && (
            <button
              onClick={toggleSidebar}
              className="hidden md:block p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-card transition-colors"
              aria-label="Toggle sidebar"
            >
              <Menu size={20} className="text-muted" />
            </button>
          )}

          {/* Logo - Always visible */}
          <NavLink
            to={isAuthenticated ? "/dashboard" : "/"}
            className="flex items-center gap-2 group"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-primary-500 rounded-xl blur-md opacity-60 group-hover:opacity-100 transition-opacity" />
              <Box className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-xl text-white bg-primary-500 p-1.5" />
            </div>
            <span className="font-bold text-base sm:text-lg text-primary">
              Chronovah
            </span>
          </NavLink>
        </div>

        {/* Center - Desktop Search (only for authenticated) */}
        {isAuthenticated && (
          <div className="hidden md:block flex-1 max-w-md mx-4">
            <DesktopSearchInput />
          </div>
        )}

        {/* Right section - Actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Dark mode toggle - Always visible */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={toggleDarkMode}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-card transition-colors"
            aria-label={
              isDarkMode ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            {isDarkMode ? (
              <Sun size={18} className="text-accent-yellow" />
            ) : (
              <Moon size={18} className="text-muted" />
            )}
          </motion.button>

          {isAuthenticated ? (
            /* Authenticated user UI */
            <>
              {/* Mobile search button */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setOpenSearch(true)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-card transition-colors"
                aria-label="Search"
              >
                <Search size={18} className="text-muted" />
              </motion.button>

              {/* Profile dropdown */}
              <div className="relative">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-card transition-colors"
                  aria-label="Profile menu"
                >
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-primary-500 text-white flex items-center justify-center font-semibold text-sm shadow-md">
                    {initials || "U"}
                  </div>
                  <ChevronDown
                    size={16}
                    className={`text-muted transition-transform duration-200 hidden sm:block ${
                      isProfileMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </motion.button>

                {/* Profile dropdown menu */}
                <AnimatePresence>
                  {isProfileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 bg-card rounded-xl shadow-hard border border-default overflow-hidden z-50"
                    >
                      {/* User info */}
                      <div className="px-4 py-3 border-b border-default">
                        <p className="text-sm font-semibold text-primary truncate">
                          {name}
                        </p>
                        <p className="text-xs text-muted truncate">{email}</p>
                      </div>

                      {/* Menu items */}
                      <div className="p-1">
                        <NavLink
                          to="/profile"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-primary hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        >
                          <User size={16} />
                          <span>Profile</span>
                        </NavLink>
                        <NavLink
                          to="/settings"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-primary hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        >
                          <Settings size={16} />
                          <span>Settings</span>
                        </NavLink>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-accent-red hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
                        >
                          <LogOut size={16} />
                          <span>Logout</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            /* Unauthenticated user UI */
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Sign Up button - Primary CTA (now just blue) */}
              <NavLink
                to="/signup"
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium rounded-lg transition-all duration-300 shadow-md hover:shadow-glow"
              >
                <UserPlus size={16} />
                <span className="hidden xs:inline">Sign Up</span>
                <span className="xs:hidden">Sign Up</span>
              </NavLink>

              {/* Mobile Sign In icon */}
              <NavLink
                to="/login"
                className="sm:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-card transition-colors"
                aria-label="Sign In"
              >
                <LogIn size={18} className="text-muted" />
              </NavLink>

              <NavLink
                to="/login"
                className="hidden sm:flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted hover:text-primary transition-colors"
              >
                <LogIn size={16} />
                <span>Sign In</span>
              </NavLink>
            </div>
          )}
        </div>
      </motion.header>

      {/* Mobile Menu Overlay - Only for authenticated users */}
      <AnimatePresence>
        {isAuthenticated && isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
            />

            {/* Mobile menu panel */}
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-64 bg-card shadow-2xl z-50 md:hidden"
            >
              <div className="flex flex-col h-full">
                {/* Mobile menu header */}
                <div className="p-4 border-b border-default">
                  <div className="flex items-center gap-2">
                    <Box className="w-8 h-8 rounded-xl text-white bg-primary-500 p-1.5" />
                    <span className="font-bold text-lg text-primary">
                      Chronovah
                    </span>
                  </div>
                </div>

                {/* Mobile navigation */}
                <nav className="flex-1 p-4 space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={({ isActive }) => `
                          flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
                          transition-colors duration-200
                          ${
                            isActive
                              ? "bg-primary-50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400"
                              : "text-muted hover:bg-gray-100 dark:hover:bg-gray-800"
                          }
                        `}
                      >
                        <Icon size={18} />
                        <span>{item.label}</span>
                      </NavLink>
                    );
                  })}
                </nav>

                {/* Mobile user info */}
                <div className="p-4 border-t border-default">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-500 text-white flex items-center justify-center font-semibold">
                      {initials || "U"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-primary truncate">
                        {name}
                      </p>
                      <p className="text-xs text-muted truncate">{email}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Global Search Modal - Only for authenticated */}
      {isAuthenticated && openSearch && (
        <GlobalSearch onClose={() => setOpenSearch(false)} />
      )}
    </>
  );
}

export default Header;
