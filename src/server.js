// server.js
require("dotenv").config();
const express = require("express");
const Stripe = require("stripe");
const cors = require("cors");

const app = express();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

app.use(express.json());
app.use(cors());

// Define a route for the root URL
app.get("/", (req, res) => {
  res.send("Server is running!"); // or send a static file if needed
});

// Endpoint to create checkout session
app.post("/create-checkout-session", async (req, res) => {
  const { eventType, price, installments } = req.body;
  try {
    let session;
    if (eventType === "one_time") {
      // One-time purchase
      session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: "Event Ticket",
              },
              unit_amount: price * 100,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${process.env.CLIENT_URL}/success`,
        cancel_url: `${process.env.CLIENT_URL}/cancel`,
      });
    } else if (eventType === "recurring") {
      // Recurring payment
      session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: "Event Subscription",
              },
              recurring: {
                interval: "month",
              },
              unit_amount: price * 100,
            },
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: `${process.env.CLIENT_URL}/success`,
        cancel_url: `${process.env.CLIENT_URL}/cancel`,
      });
    }

    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/success", (req, res) => {
  // If you want to serve an HTML page or a confirmation message, you can do it here.
  // Example: Send a simple text message or serve a static success page.
  res.send("Payment successful! Thank you for your purchase.");
});

// Handle the /cancel route (optional, in case the user cancels payment)
app.get("/cancel", (req, res) => {
  res.send("Payment cancelled. Please try again.");
});

app.listen(3000, () => console.log("Server running on port 3000"));
