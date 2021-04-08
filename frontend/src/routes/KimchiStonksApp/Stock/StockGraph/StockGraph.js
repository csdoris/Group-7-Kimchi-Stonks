import React, { useEffect } from 'react';
import Chart from 'chart.js/auto';

function StockGraph() {
  useEffect(() => {
    const ctx = document.getElementById('stock-graph');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [
          {
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.3,
          },
        ],
      },
    });
  }, []);

  return (
    <div className="inner-graph-container">
      <div className="graph-header-container">
        <div className="container-title">
          AAPL | Apple, inc.
        </div>
      </div>
      <div className="stock-graph-container">
        <canvas className="stock-graph" id="stock-graph" />
      </div>
    </div>
  );
}

export default StockGraph;
