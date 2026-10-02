import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { collection, addDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "@/context/FirebaseConfig";

import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  "pk_test_your_actual_key"
);

const CheckoutPage = () => {
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const navigate = useNavigate();

  const stripe = useStripe();
  const elements = useElements();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
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
        setCartItems(data.cart || []);
      }
    } catch (error) {
      console.error("Failed to fetch cart:", error);
      toast.error("Could not load cart");
    }
    setLoading(false);
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + (item.price || 0) * (item.quantity || 1),
    0
  );
  const shippingFee = 40;
  const total = subtotal + shippingFee;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const nameRegex = /^[a-zA-Z\s]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10,}$/;
    const zipRegex = /^[0-9]{4,}$/;

    if (!form.firstName || !nameRegex.test(form.firstName))
      return toast.error("Enter a valid first name");
    if (!form.lastName || !nameRegex.test(form.lastName))
      return toast.error("Enter a valid last name");
    if (!form.email || !emailRegex.test(form.email))
      return toast.error("Enter a valid email");
    if (!form.street) return toast.error("Street is required");
    if (!form.city || !nameRegex.test(form.city))
      return toast.error("Enter a valid city");
    if (!form.state || !nameRegex.test(form.state))
      return toast.error("Enter a valid state");
    if (!form.zipcode || !zipRegex.test(form.zipcode))
      return toast.error("Enter a valid zipcode");
    if (!form.country || !nameRegex.test(form.country))
      return toast.error("Enter a valid country");
    if (!form.phone || !phoneRegex.test(form.phone))
      return toast.error("Enter a valid phone number");

    return true;
  };

  const handlePlaceOrder = async () => {
    if (!user) return toast.error("Please login to place order.");
    if (!validateForm()) return;
    if (cartItems.length === 0) return toast.error("Cart is empty.");

    const orderDetails = {
      userId: user.uid,
      userEmail: user.email,
      deliveryInfo: form,
      paymentMethod,
      items: cartItems,
      subtotal,
      shippingFee,
      total,
      status: paymentMethod === "cod" ? "Pending" : "Paid",
      paymentStatus: paymentMethod === "cod" ? "pending" : "paid",
      createdAt: new Date().toISOString(),
    };

    // Stripe redirect flow
    if (paymentMethod === "stripe") {
      try {
        const res = await fetch(
          "http://localhost:5000/create-checkout-session",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              user,
              deliveryInfo: form,
              cartItems,
              total,
              paymentMethod,
            }),
          }
        );

        const { id } = await res.json();
        const stripe = await stripePromise;
        await stripe.redirectToCheckout({ sessionId: id });
      } catch (err) {
        console.error("Stripe error:", err);
        toast.error("Stripe checkout failed.");
      }
      return;
    }

    // COD or Razorpay — store order in Firestore immediately
    try {
      const orderRef = await addDoc(collection(db, "orders"), orderDetails);
      await updateDoc(doc(db, "users", user.uid), { cart: [] });

      navigate("/order-confirmation", {
        state: { ...orderDetails, orderId: orderRef.id },
      });

      toast.success("Order placed successfully!");
    } catch (error) {
      console.error("Order placement failed:", error);
      toast.error("Something went wrong. Try again.");
    }
  };

  if (!user)
    return (
      <p className="text-center text-red-500 mt-10">Please login first.</p>
    );
  if (loading)
    return <p className="text-center text-gray-500 mt-10">Loading...</p>;
  if (cartItems.length === 0)
    return (
      <p className="text-center text-gray-500 mt-10">Your cart is empty.</p>
    );

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* Delivery Info */}
      <div>
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">
          DELIVERY INFORMATION
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <input
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            placeholder="First name"
            className="border p-2 rounded"
          />
          <input
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            placeholder="Last name"
            className="border p-2 rounded"
          />
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email address"
            className="col-span-2 border p-2 rounded"
          />
          <input
            name="street"
            value={form.street}
            onChange={handleChange}
            placeholder="Street"
            className="col-span-2 border p-2 rounded"
          />
          <input
            name="city"
            value={form.city}
            onChange={handleChange}
            placeholder="City"
            className="border p-2 rounded"
          />
          <input
            name="state"
            value={form.state}
            onChange={handleChange}
            placeholder="State"
            className="border p-2 rounded"
          />
          <input
            name="zipcode"
            value={form.zipcode}
            onChange={handleChange}
            placeholder="Zipcode"
            className="border p-2 rounded"
          />
          <input
            name="country"
            value={form.country}
            onChange={handleChange}
            placeholder="Country"
            className="border p-2 rounded"
          />
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone"
            className="col-span-2 border p-2 rounded"
          />
        </div>
      </div>

      {/* Cart Totals + Payment */}
      <div>
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">
          CART TOTALS
        </h2>
        <div className="space-y-2 text-sm mb-6">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping Fee</span>
            <span>₹{shippingFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
        </div>

        <h2 className="text-md font-semibold mb-2 border-b pb-1">
          PAYMENT METHOD
        </h2>
        <div className="flex gap-4 items-center mb-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="payment"
              value="stripe"
              checked={paymentMethod === "stripe"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <span className="text-purple-700 font-semibold">Stripe</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="payment"
              value="razorpay"
              checked={paymentMethod === "razorpay"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <span className="text-blue-700 font-semibold">Razorpay</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="payment"
              value="cod"
              checked={paymentMethod === "cod"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <span className="text-green-600 font-semibold">
              Cash on Delivery
            </span>
          </label>
        </div>

        <button
          onClick={handlePlaceOrder}
          className="bg-black text-white w-full py-3 font-semibold hover:opacity-90"
        >
          PLACE ORDER
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;
