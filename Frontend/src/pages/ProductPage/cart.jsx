import React, { useEffect, useState } from "react";
import { Trash2, Plus, Minus } from "lucide-react";
import toast from "react-hot-toast";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/context/FirebaseConfig";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await fetchCart(currentUser.uid);
      } else {
        setUser(null);
        setCartItems([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchCart = async (uid) => {
    setLoading(true);
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        const cart = data.cart || [];
        setCartItems(cart);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      toast.error("Failed to load cart.");
    }
    setLoading(false);
  };

  const saveCart = async (updatedCart) => {
    if (!user) return;
    try {
      await setDoc(doc(db, "users", user.uid), { cart: updatedCart }, { merge: true });
    } catch (error) {
      console.error("Failed to update cart:", error);
      toast.error("Cart update failed.");
    }
  };

  const updateQuantity = async (id, size, delta) => {
    if (!user) return toast.error("Please login to update cart.");
    const updatedCart = cartItems.map((item) => {
      if (item.id === id && item.size === size) {
        const newQty = item.quantity + delta;
        return { ...item, quantity: newQty < 1 ? 1 : newQty };
      }
      return item;
    });
    setCartItems(updatedCart);
    await saveCart(updatedCart);
  };

  const removeItem = async (id, size) => {
    if (!user) return toast.error("Please login to update cart.");
    const updatedCart = cartItems.filter(
      (item) => !(item.id === id && item.size === size)
    );
    setCartItems(updatedCart);
    await saveCart(updatedCart);
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + (item.price || 0) * (item.quantity || 1),
    0
  );
  const shippingFee = 40;
  const total = subtotal + shippingFee;

  if (!user) {
    return (
      <p className="text-center text-red-500 mt-10">
        Please login to view your cart.
      </p>
    );
  }

  if (loading) {
    return <p className="text-center text-gray-500 mt-10">Loading your cart...</p>;
  }

  if (cartItems.length === 0) {
    return (
      <p className="text-center text-gray-500 mt-10">Your cart is empty.</p>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold tracking-wide mb-8 border-b pb-2">
        YOUR <span className="font-bold">CART</span>
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="md:col-span-2">
          <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2">
            {cartItems.map((item, index) => (
              <div
                key={`${item.id}-${item.size}-${index}`}
                className="flex items-center justify-between border-b pb-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded"
                  />
                  <div>
                    <h2 className="text-md font-medium">{item.name}</h2>
                    <p className="text-gray-500 text-sm">₹{item.price}</p>
                    {item.size && (
                      <div className="mt-1 px-2 py-1 border w-fit text-sm text-gray-600">
                        {item.size}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateQuantity(item.id, item.size, -1)}
                    className="px-2 py-1 bg-gray-200 rounded"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="min-w-[24px] text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.size, 1)}
                    className="px-2 py-1 bg-gray-200 rounded"
                  >
                    <Plus size={14} />
                  </button>
                  <button
                    onClick={() => removeItem(item.id, item.size)}
                    className="text-gray-500 hover:text-red-600 ml-3"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cart Summary Section */}
        <div className="border p-6">
          <h2 className="text-lg font-semibold tracking-wide mb-4">
            CART <span className="font-bold">TOTALS</span>
          </h2>
          <div className="flex justify-between mb-2 text-sm">
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-2 text-sm">
            <span>Shipping Fee</span>
            <span>₹{shippingFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-md mt-4 mb-6">
            <span>Total</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
          <button
            onClick={() => navigate("/checkout")}
            className="w-full bg-black text-white py-3 text-sm tracking-wide font-semibold hover:opacity-90 transition-all"
          >
            PROCEED TO CHECKOUT
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
