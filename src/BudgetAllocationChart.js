import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const BudgetAllocationChart = () => {
  // Sample data for demonstration
  const plannedData = {
    venue: [500, 400, 450],
    food: [300, 200, 250],
    decorations: [100, 150, 120],
  };

  const actualData = {
    venue: [450, 420, 400],
    food: [320, 210, 270],
    decorations: [110, 130, 140],
  };

  // Calculate the total planned and actual budget for each event
  const plannedTotals = plannedData.venue.map((_, i) =>
    plannedData.venue[i] + plannedData.food[i] + plannedData.decorations[i]
  );
  const actualTotals = actualData.venue.map((_, i) =>
    actualData.venue[i] + actualData.food[i] + actualData.decorations[i]
  );

  // Calculate the maximum of these totals and add a buffer
  const maxTotal = Math.max(...plannedTotals, ...actualTotals) + 100;

  const data = {
    labels: ['Event 1', 'Event 2', 'Event 3'],
    datasets: [
      {
        label: 'Planned - Venue',
        data: plannedData.venue,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        stack: 'planned',
      },
      {
        label: 'Planned - Food',
        data: plannedData.food,
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        stack: 'planned',
      },
      {
        label: 'Planned - Decorations',
        data: plannedData.decorations,
        backgroundColor: 'rgba(255, 159, 64, 0.6)',
        stack: 'planned',
      },
      {
        label: 'Actual - Venue',
        data: actualData.venue,
        backgroundColor: 'rgba(75, 192, 192, 1)',
        stack: 'actual',
      },
      {
        label: 'Actual - Food',
        data: actualData.food,
        backgroundColor: 'rgba(153, 102, 255, 1)',
        stack: 'actual',
      },
      {
        label: 'Actual - Decorations',
        data: actualData.decorations,
        backgroundColor: 'rgba(255, 159, 64, 1)',
        stack: 'actual',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        beginAtZero: true,
        max: maxTotal, // Set the max of y-axis based on calculated max total with buffer
      },
    },
  };

  return (
    <div style={{ width: '80%', margin: 'auto' }}>
      <h2>Budget Allocation by Event</h2>
      <Bar data={data} options={options} />
    </div>
  );
};

export default BudgetAllocationChart;
