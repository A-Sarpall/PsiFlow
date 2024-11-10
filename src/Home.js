// Home.js
import React, { useState } from "react";
import axios from "axios";

const Home = ({ onLogout }) => {
  const [eventType, setEventType] = useState("one_time");
  const [price, setPrice] = useState("");
  const [installments, setInstallments] = useState(1);

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      const apiUrl = "http://localhost:3000"; // Change this to the backend API URL
      const response = await axios.post(`${apiUrl}/create-checkout-session`, {
        eventType,
        price: parseInt(price),
        installments: parseInt(installments),
      });
      window.location.href = response.data.url;
    } catch (error) {
      console.error("Error creating checkout session:", error);
    }
  };

  return (
    <div>
      <h2>Welcome to the Home Page!</h2>
      <p>You are logged in.</p>
      <button onClick={onLogout}>Logout</button>

      <h3>Create a Payment Link</h3>
      <form onSubmit={handleCreateEvent}>
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

export default Home;
