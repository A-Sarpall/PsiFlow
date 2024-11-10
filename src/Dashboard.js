import React from "react";
import BudgetAllocationChart from "./BudgetAllocationChart";
import FundraisingPieChart from "./FundraisingPieChart"; // Ensure your component name is correct

const Dashboard = () => {
  return (
    <div className="dashboard">
      <h1>Dashboard</h1>

      <div className="chart-container">
        <BudgetAllocationChart />
      </div>

      <div className="fundraising-container">
        <FundraisingPieChart />
      </div>
    </div>
  );
};

export default Dashboard;
