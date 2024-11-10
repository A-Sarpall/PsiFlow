// netlify/functions/create-checkout-session.js
require("dotenv").config();
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_API_KEY);

exports.handler = async (event, context) => {
  const { eventType, price, installments } = JSON.parse(event.body);
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
              unit_amount: price * 100, // Convert price to cents
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
              unit_amount: monthlyPrice, // Monthly price
            },
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: `${process.env.CLIENT_URL}/success`,
        cancel_url: `${process.env.CLIENT_URL}/cancel`,
      });
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ url: session.url }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
