import React from 'react';

import Table from '../../../components/Table/Table';

import './Dashboard.scss';

function Dashboard() {
  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">HOLDINGS</h1>
      <Table />
    </div>
  );
}

export default Dashboard;
