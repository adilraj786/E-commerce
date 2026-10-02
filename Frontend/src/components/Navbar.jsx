import { Link, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ShoppingCart, Menu, X } from "lucide-react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/context/FirebaseConfig";
import toast from "react-hot-toast";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogout, setShowLogout] = useState(false);

  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
        setCartItems([]);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    let unsubscribeCart;

    if (user) {
      const userRef = doc(db, "users", user.uid);
      unsubscribeCart = onSnapshot(userRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setCartItems(data.cart || []);
        }
      });
    }

    return () => {
      if (unsubscribeCart) unsubscribeCart();
    };
  }, [user]);

  const handleMyOrders = () => {
    if (user) {
      navigate("/orders");
    } else {
      toast.error("Please login to view your orders");
      navigate("/auth/login");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully");
      setShowLogout(false);
      setMenuOpen(false);
      navigate("/auth/login");
    } catch (err) {
      console.error("Logout failed:", err);
      toast.error("Logout failed");
    }
  };

  const cartCount = (cartItems || []).reduce(
    (acc, item) => acc + item.quantity,
    0
  );
  const userInitial =
    user?.displayName?.charAt(0).toUpperCase() ||
    user?.email?.charAt(0).toUpperCase() ||
    "U";

  return (
    <>
      <nav className="flex justify-between items-center px-4 sm:px-8 py-4 bg-white shadow-md relative">
        <div className="text-2xl font-bold flex items-center">
          <span className="text-black">V</span>ibes
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-6 text-black font-medium">
          {[
            { name: "Home", path: "/" },
            { name: "Clothes", path: "/clothes" },
            { name: "Footwear", path: "/footwear" },
            { name: "Accessories", path: "/accessories" },
            // { name: "Search", path: "/search" },
          ].map((item) => (
            <li key={item.name} className="hover:text-gray-500 cursor-pointer">
              <Link to={item.path}>{item.name}</Link>
            </li>
          ))}
        </ul>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-6 relative">
          <Link to="/product/cart" className="relative">
            <ShoppingCart className="w-7 h-7 text-black cursor-pointer" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="relative">
              <div
                onClick={() => setShowLogout(!showLogout)}
                className="w-8 h-8 bg-black text-white flex items-center justify-center rounded-full text-lg font-bold cursor-pointer"
              >
                {userInitial}
              </div>
              {showLogout && (
                <div className="absolute top-10 right-0 w-40 bg-white border border-gray-200 shadow-lg rounded-lg z-50 overflow-hidden">
                  <button
                    onClick={handleMyOrders}
                    className="w-full px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 transition text-left"
                  >
                    My Orders
                  </button>
                  <hr className="border-gray-200" />
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition text-left"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/auth/login"
                className="text-sm font-medium text-black border border-black px-4 py-1 rounded-md hover:bg-black hover:text-white transition"
              >
                Login
              </Link>
              <Link
                to="/auth/register"
                className="text-sm font-medium bg-black text-white px-4 py-1 rounded-md hover:opacity-80 transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Icons (Cart + Profile) */}
        <div className="flex md:hidden items-center space-x-4">
          <Link to="/product/cart" className="relative">
            <ShoppingCart className="w-6 h-6 text-black" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>

          {user && (
            <div className="w-8 h-8 bg-black text-white flex items-center justify-center rounded-full text-lg font-bold">
              {userInitial}
            </div>
          )}

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-black z-50"
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="absolute top-16 left-0 w-full bg-white shadow-md flex flex-col px-6 py-4 space-y-4 md:hidden z-40">
            {[
              { name: "Home", path: "/" },
              { name: "Clothes", path: "/clothes" },
              { name: "Footwear", path: "/footwear" },
              { name: "Accessories", path: "/accessories" },
              { name: "Search", path: "/search" },
            ].map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="text-black font-medium"
                onClick={() => setMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}

            {user ? (
              <>
                <button
                  onClick={handleLogout}
                  className="text-left text-black font-medium hover:text-red-500"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/auth/login"
                  className="text-black"
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/auth/register"
                  className="text-black"
                  onClick={() => setMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </nav>

      <Outlet />
    </>
  );
};

export default Navbar;
