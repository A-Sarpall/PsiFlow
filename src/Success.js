// Success.js
import React from "react";

const Success = () => {
  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-semibold text-green-600 mb-4">
        Payment Successful!
      </h2>
      <p className="text-lg text-gray-700">
        Your payment has been processed successfully. Thank you for your
        purchase!
      </p>
    </div>
  );
};

export default Success;
