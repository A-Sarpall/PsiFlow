import React, { useState, useEffect } from "react";

function Input() {
  const [inputValues, setInputValues] = useState({
    activeBrothers: "",
    pledges: "",
    partTimeLOA: "",
    expenseDescription: "",
    expenseAmount: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [data, setData] = useState({ counts: {}, expenses: [] }); // To store fetched data

  // Fetch data from the backend
  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/get-data");
      const data = await response.json();
      setData(data);
    } catch (error) {
      setMessage("Error fetching data: " + error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputValues({
      ...inputValues,
      [name]: value,
    });
  };

  const handleSubmit = async (e, field) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/update-count", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: field,
          value: parseInt(inputValues[field]),
        }),
      });

      const data = await response.json();
      setMessage(data.message || "Update successful");
      setInputValues((prev) => ({ ...prev, [field]: "" }));
      fetchData(); // Refresh data after submission
    } catch (error) {
      setMessage("Error updating count: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExpenseSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/add-expense", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: inputValues.expenseDescription,
          amount: parseFloat(inputValues.expenseAmount),
        }),
      });

      const data = await response.json();
      setMessage(data.message || "Expense added successfully");
      setInputValues((prev) => ({
        ...prev,
        expenseDescription: "",
        expenseAmount: "",
      }));
      fetchData(); // Refresh data after submission
    } catch (error) {
      setMessage("Error adding expense: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">
          Fraternity Management System
        </h1>

        {message && (
          <div className="mb-4 p-3 bg-blue-100 text-blue-700 rounded">
            {message}
          </div>
        )}

        <div className="space-y-6">
          {/* Display Fetched Counts */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Current Member Counts</h2>
            {Object.entries(data.counts).map(([key, value]) => (
              <p key={key} className="text-gray-700">
                {key}: {value}
              </p>
            ))}
          </div>

          {/* Display Expenses */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Expenses</h2>
            {data.expenses.map((expense, index) => (
              <p key={index} className="text-gray-700">
                {expense.description} - ${expense.amount} (Added on:{" "}
                {new Date(expense.timestamp).toLocaleDateString()})
              </p>
            ))}
          </div>

          {/* Member Counts Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Update Member Counts</h2>
            <form>
              <div>
                <label>Active Brothers:</label>
                <input
                  type="number"
                  name="activeBrothers"
                  value={inputValues.activeBrothers}
                  onChange={handleChange}
                  className="input"
                />
                <button
                  onClick={(e) => handleSubmit(e, "activeBrothers")}
                  className="btn"
                >
                  Update Active Brothers
                </button>
              </div>
              <div>
                <label>Pledges:</label>
                <input
                  type="number"
                  name="pledges"
                  value={inputValues.pledges}
                  onChange={handleChange}
                  className="input"
                />
                <button
                  onClick={(e) => handleSubmit(e, "pledges")}
                  className="btn"
                >
                  Update Pledges
                </button>
              </div>
              <div>
                <label>Part-Time LOA:</label>
                <input
                  type="number"
                  name="partTimeLOA"
                  value={inputValues.partTimeLOA}
                  onChange={handleChange}
                  className="input"
                />
                <button
                  onClick={(e) => handleSubmit(e, "partTimeLOA")}
                  className="btn"
                >
                  Update Part-Time LOA
                </button>
              </div>
            </form>
          </div>

          {/* Expenses Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Add Expense</h2>
            <form onSubmit={handleExpenseSubmit}>
              <div>
                <label>Expense Description:</label>
                <input
                  type="text"
                  name="expenseDescription"
                  value={inputValues.expenseDescription}
                  onChange={handleChange}
                  className="input"
                />
              </div>
              <div>
                <label>Amount:</label>
                <input
                  type="number"
                  name="expenseAmount"
                  value={inputValues.expenseAmount}
                  onChange={handleChange}
                  className="input"
                />
              </div>
              <button type="submit" className="btn">
                Add Expense
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Input;
