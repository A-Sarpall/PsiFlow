require("dotenv").config();
console.log("Stripe API Key:", process.env.STRIPE_API_KEY); // Make sure this logs the correct key

const express = require("express");
const Stripe = require("stripe");
const cors = require("cors");

const app = express();

// Use the correct method to initialize Stripe
const stripe = Stripe(process.env.STRIPE_API_KEY); // Ensure you are using the right environment variable

console.log("Stripe initialized with API Key:", process.env.STRIPE_API_KEY); // For debugging purposes

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3001", // Assuming your frontend runs here
  })
);

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
              unit_amount: price * 100, // Price in cents (e.g., $400 = 40000 cents)
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${process.env.CLIENT_URL}/success`,
        cancel_url: `${process.env.CLIENT_URL}/cancel`,
      });
    } else if (eventType === "recurring") {
      // Recurring payment (price divided by installments)
      const monthlyPrice = Math.round((price / installments) * 100); // Divide by installments, convert to cents

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
              unit_amount: monthlyPrice, // Correct monthly price
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
    console.error("Error creating checkout session:", error);
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
