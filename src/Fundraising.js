import React, { useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';

import './App.css';

Chart.register(ArcElement, Tooltip, Legend);

const FundraisingPieChart = () => {
  const [goalAmount, setGoalAmount] = useState(1000); // Default goal amount
  const [donations, setDonations] = useState(0); // Initial donations amount
  const [sponsorships, setSponsorships] = useState(0); // Initial sponsorships amount
  const [events, setEvents] = useState(0); // Initial events amount
  const [merchandise, setMerchandise] = useState(0); // Initial merchandise amount
  const [amount, setAmount] = useState(0); // Amount to be added

  const totalRaised = donations + sponsorships + events + merchandise;
  const missingAmount = Math.max(goalAmount - totalRaised, 0); // Calculate the missing amount

  const [data, setData] = useState({
    labels: ['Donations', 'Sponsorships', 'Events', 'Merchandise', 'Missing Amount'],
    datasets: [
      {
        label: 'Fundraising Sources',
        data: [0, 0, 0, 0, goalAmount], // Initial data with missing amount
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(211, 211, 211, 0.2)', // Gray color for missing amount
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(169, 169, 169, 1)', // Dark gray border for missing amount
        ],
        borderWidth: 1,
      },
    ],
  });

  const saveDataToBackend = (newData) => {
    fetch('http://localhost:5000/api/save-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newData),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  const handleAddAmount = (category) => {
    if (totalRaised >= goalAmount) return; // Prevent adding if goal is reached

    let newDonations = donations;
    let newSponsorships = sponsorships;
    let newEvents = events;
    let newMerchandise = merchandise;

    if (category === 'Donations') {
      newDonations += amount;
      setDonations(newDonations);
    } else if (category === 'Sponsorships') {
      newSponsorships += amount;
      setSponsorships(newSponsorships);
    } else if (category === 'Events') {
      newEvents += amount;
      setEvents(newEvents);
    } else if (category === 'Merchandise') {
      newMerchandise += amount;
      setMerchandise(newMerchandise);
    }

    const newTotalRaised = newDonations + newSponsorships + newEvents + newMerchandise;
    const newMissingAmount = Math.max(goalAmount - newTotalRaised, 0);

    const newData = {
      goalAmount,
      donations: newDonations,
      sponsorships: newSponsorships,
      events: newEvents,
      merchandise: newMerchandise,
      missingAmount: newMissingAmount,
    };

    setData({
      labels: ['Donations', 'Sponsorships', 'Events', 'Merchandise', 'Missing Amount'],
      datasets: [
        {
          label: 'Fundraising Sources',
          data: [newDonations, newSponsorships, newEvents, newMerchandise, newMissingAmount],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(211, 211, 211, 0.2)', // Gray color for missing amount
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(169, 169, 169, 1)', // Dark gray border for missing amount
          ],
          borderWidth: 1,
        },
      ],
    });

    saveDataToBackend(newData);
  };

  const handleReset = () => {
    setGoalAmount(1000);
    setDonations(0);
    setSponsorships(0);
    setEvents(0);
    setMerchandise(0);
    setAmount(0);

    const resetData = {
      goalAmount: 1000,
      donations: 0,
      sponsorships: 0,
      events: 0,
      merchandise: 0,
      missingAmount: 1000,
    };

    setData({
      labels: ['Donations', 'Sponsorships', 'Events', 'Merchandise', 'Missing Amount'],
      datasets: [
        {
          label: 'Fundraising Sources',
          data: [0, 0, 0, 0, 1000], // Reset data with missing amount
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(211, 211, 211, 0.2)', // Gray color for missing amount
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(169, 169, 169, 1)', // Dark gray border for missing amount
          ],
          borderWidth: 1,
        },
      ],
    });

    saveDataToBackend(resetData);
  };

  return (
    <div>
      <h2>Fundraising Breakdown</h2>
      <div style={{display:'inline-flex'}}>
        <div style={{ width: '300px', height: '300px' }}>
            <Pie data={data} />
        </div>
        <div><h1 style={{color:'red'}}>Goal Amount: ${goalAmount}</h1>
        <div>{totalRaised >= goalAmount && 
            <h2  className='animated-text'>Goal Reached!</h2>}</div>
        </div>
        
      </div>
      <div style={{ marginTop: '20px' }}>
        <label>
          Goal Amount: $
          <input
            type="number"
            value={goalAmount}
            onChange={(e) => setGoalAmount(Number(e.target.value))}
          />
        </label>
        <br />
     
        <label>
          Amount to Add: $
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            
          />
        </label>
        <button style={{marginLeft:'15px'}} onClick={handleReset}>Reset</button>
        <br />
        <br />
        <button className="cat" onClick={() => handleAddAmount('Donations')} disabled={totalRaised >= goalAmount}>Add to Donations</button>
        <button className="cat" onClick={() => handleAddAmount('Sponsorships')} disabled={totalRaised >= goalAmount}>Add to Sponsorships</button>
        <button className="cat" onClick={() => handleAddAmount('Events')} disabled={totalRaised >= goalAmount}>Add to Events</button>
        <button className="cat" onClick={() => handleAddAmount('Merchandise')} disabled={totalRaised >= goalAmount}>Add to Merchandise</button>
        <br /><br />
      </div>
    </div>
  );
};

export default FundraisingPieChart;
