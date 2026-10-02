const express = require("express");
const cors = require("cors");
const Stripe = require("stripe");

const app = express();
app.use(cors());
app.use(express.json());

const stripe = Stripe("sk_test_your_actual_key"); // Replace with your real secret key

// Create Checkout Session
app.post("/create-checkout-session", async (req, res) => {
  try {
    const { cartItems, user, deliveryInfo, total, paymentMethod } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: cartItems.map((item) => ({
        price_data: {
          currency: "inr",
          product_data: {
            name: item.title || "No Name",
            images: item.image ? [item.image] : [],
          },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity || 1,
      })),
      success_url: `http://localhost:5173/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:5173/checkout`,
      metadata: {
        userId: user.uid,
        userEmail: user.email,
        deliveryInfo: JSON.stringify(deliveryInfo),
        cartItems: JSON.stringify(cartItems),
        total: total.toString(),
        paymentMethod,
      },
    });

    res.json({ id: session.id });
  } catch (err) {
    console.error("Checkout session creation failed:", err);
    res.status(400).json({ error: err.message });
  }
});

// Get Checkout Session by ID
app.get("/checkout-session/:id", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.params.id);
    res.json(session);
  } catch (err) {
    console.error("Failed to retrieve session:", err);
    res.status(400).json({ error: err.message });
  }
});

app.listen(5000, () => console.log("server running on port 5000"));
