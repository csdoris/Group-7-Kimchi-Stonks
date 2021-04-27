import React, { useEffect, useContext } from 'react';
import Chart from 'chart.js/auto';
import { useLocation } from 'react-router-dom';

import Button from '../../../../components/Button/Button';
import { StockContext } from '../../../../contexts/Stock';

const TIME_PERIOD = ['Day', 'Week', 'Month', 'Year'];

function StockGraph() {
  const { stock, stockData } = useContext(StockContext);
  const queryPeriod = new URLSearchParams(useLocation().search).get('period');

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
          {TIME_PERIOD.map((period) => (
            <Button
              className={`time-period-button ${queryPeriod === period.toLowerCase() ? 'active' : ''}`}
              type="button"
              value={period}
              text={period}
              variant="text"
            />
          ))}
        </div>
      </div>
      <div className="stock-graph-container">
        <canvas className="stock-graph" id="stock-graph" />
      </div>
    </div>
  );
}

export default StockGraph;
