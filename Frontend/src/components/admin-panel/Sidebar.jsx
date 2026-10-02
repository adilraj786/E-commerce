import { useState, useEffect } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import {
  Home,
  Users,
  Settings,
  LogOut,
  Image,
  Package,
  ShoppingCart,
  ChartNoAxesCombined,
  Menu,
  X,
  LayoutDashboard,
} from "lucide-react";
import { useFirebase } from "@/context/FirebaseContext";

const Sidebar = () => {
  const { logout } = useFirebase();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(
    localStorage.getItem("activeTab") || "dashboard"
  );

  // Update active tab on route change
  useEffect(() => {
    const currentPath = location.pathname.split("/admin/")[1] || "dashboard";
    setActiveTab(currentPath);
    localStorage.setItem("activeTab", currentPath);
  }, [location.pathname]);

  const handleNavigation = (tab, route) => {
    setActiveTab(tab);
    localStorage.setItem("activeTab", tab);
    navigate(route);
    setIsSidebarOpen(false); // close sidebar on mobile
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/auth/login"); // redirect after logout
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="h-screen flex bg-gray-100 relative">
      {/* Mobile Toggle Button */}
      <button
        className="p-3 md:hidden fixed top-4 left-4 bg-white shadow-lg rounded-full z-50"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`w-64 bg-white shadow-md p-4 flex flex-col justify-between fixed top-0 left-0 h-full z-50 transition-transform duration-300 md:translate-x-0
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:relative`}
      >
        <div>
          <div
            onClick={() => handleNavigation("dashboard", "/admin/dashboard")}
            className="p-2 flex items-center gap-2 cursor-pointer text-xl font-bold mb-6"
          >
            <div className="text-2xl font-bold gap-2 flex items-center justify-center w-full">
              <ChartNoAxesCombined size={30} />
              <span className="w-15 h-8 flex items-center justify-center font-bold">
                Vibes
              </span>
            </div>
          </div>
          <h6 className="font-bold gap-2 flex items-center justify-center w-full">
            Admin Panel
          </h6>
          <ul>
            {[
              { name: "dashboard", icon: LayoutDashboard, route: "/admin/dashboard" },
              { name: "products", icon: Package, route: "/admin/products" },
              { name: "orders", icon: ShoppingCart, route: "/admin/orders" },
              { name: "settings", icon: Settings, route: "/admin/settings" },
            ].map(({ name, icon: Icon, route }) => (
              <li
                key={name}
                className={`p-3 mb-1 rounded-lg flex items-center gap-2 cursor-pointer hover:bg-gray-200 transition ${
                  activeTab === name ? "bg-gray-200" : ""
                }`}
                onClick={() => handleNavigation(name, route)}
              >
                <Icon size={20} />{" "}
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </li>
            ))}
          </ul>
        </div>

        {/* Logout Button */}
        <div className="flex items-center text-center justify-center">
          <button
            className="p-3 w-32 flex items-center justify-center gap-2 bg-primary text-white rounded-lg transition"
            onClick={handleLogout}
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-gray bg-opacity-10 backdrop-blur-xs md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default Sidebar;
