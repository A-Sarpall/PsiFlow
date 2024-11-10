// CreateEvent.js
import React, { useState } from "react";
import axios from "axios";

const CreateEvent = () => {
  const [eventType, setEventType] = useState("one_time");
  const [price, setPrice] = useState("");
  const [installments, setInstallments] = useState(1);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:3000/create-checkout-session",
        {
          eventType,
          price: parseInt(price),
          installments: parseInt(installments),
        }
      );

      // Redirect to Stripe Checkout page
      window.location.href = response.data.url;
    } catch (error) {
      console.error("Error creating checkout session:", error);
    }
  };

  return (
    <div>
      <h2>Create Event</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Price ($):</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Event Type:</label>
          <select
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
          >
            <option value="one_time">One-time</option>
            <option value="recurring">Recurring</option>
          </select>
        </div>
        {eventType === "recurring" && (
          <div>
            <label>Installments:</label>
            <input
              type="number"
              value={installments}
              onChange={(e) => setInstallments(e.target.value)}
              min="1"
            />
          </div>
        )}
        <button type="submit">Create Event</button>
      </form>
    </div>
  );
};

export default CreateEvent;
