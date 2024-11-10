import React, { useState, useEffect } from 'react';

function App() {
  // State to store the values and loading states
  const [inputValues, setInputValues] = useState({
    activeBrothers: '',
    pledges: '',
    partTimeLOA: '',
    expenseDescription: '',
    expenseAmount: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Handle input changes for each value
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputValues({
      ...inputValues,
      [name]: value
    });
  };

  // Handle individual count submission
  const handleSubmit = async (e, field) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/update-count', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: field,
          value: parseInt(inputValues[field])
        }),
      });
      
      const data = await response.json();
      setMessage(data.message || 'Update successful');
      
      // Clear the input
      setInputValues(prev => ({
        ...prev,
        [field]: ''
      }));
    } catch (error) {
      setMessage('Error updating count: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle expense submission
  const handleExpenseSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/add-expense', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: inputValues.expenseDescription,
          amount: parseFloat(inputValues.expenseAmount)
        }),
      });
      
      const data = await response.json();
      setMessage(data.message || 'Expense added successfully');
      
      // Clear the inputs
      setInputValues(prev => ({
        ...prev,
        expenseDescription: '',
        expenseAmount: ''
      }));
    } catch (error) {
      setMessage('Error adding expense: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Fraternity Management System</h1>
        
        {message && (
          <div className="mb-4 p-3 bg-blue-100 text-blue-700 rounded">
            {message}
          </div>
        )}
        
        <div className="space-y-6">
          {/* Member Counts Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Member Counts</h2>
            
            <div className="grid gap-4">
              <div>
                <label htmlFor="activeBrothers" className="block text-sm font-medium text-gray-700">
                  Active Brothers:
                </label>
                <div className="mt-1 flex space-x-2">
                  <input
                    type="number"
                    id="activeBrothers"
                    name="activeBrothers"
                    value={inputValues.activeBrothers}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                  <button
                    onClick={(e) => handleSubmit(e, 'activeBrothers')}
                    disabled={isLoading}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Submit
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="pledges" className="block text-sm font-medium text-gray-700">
                  Pledges:
                </label>
                <div className="mt-1 flex space-x-2">
                  <input
                    type="number"
                    id="pledges"
                    name="pledges"
                    value={inputValues.pledges}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                  <button
                    onClick={(e) => handleSubmit(e, 'pledges')}
                    disabled={isLoading}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Submit
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="partTimeLOA" className="block text-sm font-medium text-gray-700">
                  Part-Time LOA:
                </label>
                <div className="mt-1 flex space-x-2">
                  <input
                    type="number"
                    id="partTimeLOA"
                    name="partTimeLOA"
                    value={inputValues.partTimeLOA}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                  <button
                    onClick={(e) => handleSubmit(e, 'partTimeLOA')}
                    disabled={isLoading}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Expenses Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Add Expense</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="expenseDescription" className="block text-sm font-medium text-gray-700">
                  Expense Description:
                </label>
                <input
                  type="text"
                  id="expenseDescription"
                  name="expenseDescription"
                  value={inputValues.expenseDescription}
                  onChange={handleChange}
                  className="mt-1 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label htmlFor="expenseAmount" className="block text-sm font-medium text-gray-700">
                  Expense Amount:
                </label>
                <input
                  type="number"
                  id="expenseAmount"
                  name="expenseAmount"
                  value={inputValues.expenseAmount}
                  onChange={handleChange}
                  className="mt-1 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <button
                onClick={handleExpenseSubmit}
                disabled={isLoading}
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
              >
                Submit Expense
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;