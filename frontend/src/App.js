import React from 'react';
import { Bar } from 'react-chartjs-2';
import logo from './logo.svg';
import './App.css';

const App = () => {
  // Sample data for the chart
  const data = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Revenue ($)',
        data: [1200, 1900, 3000, 500, 2000, 3200, 4200],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Items Sold',
        data: [300, 500, 600, 200, 700, 800, 1000],
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Options for the chart
  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Vendor Dashboard</h1>
        <div className="chart-container">
          <Bar data={data} options={options} />
        </div>
      </header>
    </div>
  );
};

export default App;

