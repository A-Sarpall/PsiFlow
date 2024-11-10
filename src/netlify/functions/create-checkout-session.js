require("dotenv").config();
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_API_KEY);

exports.handler = async (event, context) => {
  // Log the incoming request
  console.log("Function invoked with event:", {
    body: event.body,
    method: event.httpMethod,
    path: event.path,
  });

  // Check if it's a POST request
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const { eventType, price, installments } = JSON.parse(event.body);

    // Log the parsed data
    console.log("Parsed request data:", { eventType, price, installments });

    let session;
    if (eventType === "one_time") {
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
      const monthlyPrice = Math.round((price / installments) * 100);

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
              unit_amount: monthlyPrice,
            },
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: `${process.env.CLIENT_URL}/success`,
        cancel_url: `${process.env.CLIENT_URL}/cancel`,
      });
    }

    // Log successful response
    console.log("Stripe session created:", session.id);

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*", // Add CORS headers
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: JSON.stringify({ url: session.url }),
    };
  } catch (error) {
    // Enhanced error logging
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      type: error.type,
      code: error.code,
    });

    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*", // Add CORS headers
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: JSON.stringify({
        error: error.message,
        type: error.type,
        code: error.code,
      }),
    };
  }
};
