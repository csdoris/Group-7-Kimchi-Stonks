import React, { useEffect, useContext } from 'react';
import Chart from 'chart.js/auto';

import Button from '../../../../components/Button/Button';
import { StockContext } from '../../../../contexts/Stock';

function StockGraph() {
  const { stock, stockData } = useContext(StockContext);

  useEffect(() => {
    const graphCanvas = document.getElementById('stock-graph');
    const stockChart = new Chart(graphCanvas, {
      type: 'line',
      data: {
        datasets: [
          {
            data: stockData.timeSeriesData,
            fill: false,
            borderColor: '#E56536',
            tension: 0.3,
          },
        ],
      },
      options: {
        parsing: {
          xAxisKey: 'xAxis',
          yAxisKey: 'open',
        },
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              padding: 10,
              color: '#ACACAC',
              font: {
                size: '14',
              },
              align: 'center',
            },
          },
          y: {
            ticks: {
              padding: 15,
              color: '#ACACAC',
              font: {
                size: '14',
              },
              align: 'center',
            },
          },
        },
      },
    });

    return () => {
      stockChart.destroy();
    };
  }, [stockData]);

  return (
    <div className="inner-graph-container">
      <div className="graph-header-container">
        <div className="container-title">
          {`${stock.Symbol} | ${stock.Name}`}
        </div>
        <div className="time-period-container">
          <Button
            className="time-period-button"
            type="button"
            value="Day"
            text="Day"
            variant="text"
          />
          <Button
            className="time-period-button"
            type="button"
            value="Week"
            text="Week"
            variant="text"
          />
          <Button
            className="time-period-button"
            type="button"
            value="Month"
            text="Month"
            variant="text"
          />
          <Button
            className="time-period-button"
            type="button"
            value="Year"
            text="Year"
            variant="text"
          />
        </div>
      </div>
      <div className="stock-graph-container">
        <canvas className="stock-graph" id="stock-graph" />
      </div>
    </div>
  );
}

export default StockGraph;
