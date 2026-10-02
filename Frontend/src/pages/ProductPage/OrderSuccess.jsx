import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { doc, addDoc, collection, updateDoc } from "firebase/firestore";
import { db } from "@/context/FirebaseConfig";
import toast from "react-hot-toast";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const sessionId = new URLSearchParams(location.search).get("session_id");

  useEffect(() => {
    const fetchSessionAndSaveOrder = async () => {
      try {
        const res = await fetch(`http://localhost:5000/checkout-session/${sessionId}`);
        const session = await res.json();

        const metadata = session.metadata;

        const userId = metadata.userId;
        const userEmail = metadata.userEmail;
        const deliveryInfo = JSON.parse(metadata.deliveryInfo || "{}");
        const cartItems = JSON.parse(metadata.cartItems || "[]");
        const total = parseFloat(metadata.total || "0");
        const paymentMethod = metadata.paymentMethod;
        const paymentStatus = session.payment_status || "unknown"; // ✅ added

        const orderDetails = {
          userId,
          userEmail,
          deliveryInfo,
          paymentMethod,
          paymentStatus, // ✅ storing payment status
          items: cartItems,
          subtotal: total - 40,
          shippingFee: 40,
          total,
          status: "Paid",
          createdAt: new Date().toISOString(),
        };

        // Save order to Firestore
        const orderRef = await addDoc(collection(db, "orders"), orderDetails);

        // Clear user cart
        await updateDoc(doc(db, "users", userId), {
          cart: [],
        });

        toast.success("Payment successful! Order placed.");
        navigate("/order-confirmation", {
          state: { ...orderDetails, orderId: orderRef.id },
        });
      } catch (err) {
        console.error("Stripe session fetch error:", err);
        toast.error("Something went wrong with your order.");
      }
    };

    if (sessionId) fetchSessionAndSaveOrder();
  }, [sessionId, navigate]);

  return (
    <div className="max-w-2xl mx-auto mt-10 text-center">
      <h1 className="text-2xl font-bold mb-4">Processing your order...</h1>
      <p>Please wait while we confirm your payment and place your order.</p>
    </div>
  );
};

export default OrderSuccess;
