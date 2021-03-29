import React from 'react';

import TableHeader from '../TableHeader/TableHeader';
import TableRow from '../TableRow/TableRow';
import TITLES from './DashboardDummyTitles';
import DUMMY_HOLDINGS_LIST from './DashboardDummyHoldingsList';

import './Dashboard.scss';

function Dashboard() {
  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">HOLDINGS</h1>
      <div className="table-container">
        <TableHeader titles={TITLES} />
        {DUMMY_HOLDINGS_LIST.map((holding) => (
          <TableRow className="col" holding={holding} />
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
