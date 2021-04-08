import React, { useEffect } from 'react';
import Chart from 'chart.js/auto';

function StockGraph() {
  const graphData = {
    metaData: {
      symbol: 'IBM',
      date: '2021-04-07',
      interval: 'Day',
      timeZone: 'US/Eastern',
    },
    timeSeriesData: [
      {
        time: '10:00',
        open: '134.5100',
        high: '134.6100',
        low: '134.3700',
        close: '134.4800',
        volume: '26486',
      },
      {
        time: '11:00',
        open: '134.6100',
        high: '134.6400',
        low: '134.5501',
        close: '134.5802',
        volume: '22378',
      },
      {
        time: '12:00',
        open: '134.1000',
        high: '134.2900',
        low: '134.0848',
        close: '134.2800',
        volume: '21261',
      },
      {
        time: '13:00',
        open: '134.2538',
        high: '134.3400',
        low: '134.2400',
        close: '134.3200',
        volume: '19299',
      },
      {
        time: '14:00',
        open: '134.3300',
        high: '134.4300',
        low: '134.3300',
        close: '134.4300',
        volume: '19473',
      },
      {
        time: '15:00',
        open: '134.5300',
        high: '134.5900',
        low: '134.4750',
        close: '134.4800',
        volume: '18010',
      },
      {
        time: '16:00',
        open: '134.7000',
        high: '134.9400',
        low: '134.6900',
        close: '134.9300',
        volume: '154917',
      },
    ],
  };

  useEffect(() => {
    const graphCanvas = document.getElementById('stock-graph');
    new Chart(graphCanvas, {
      type: 'line',
      data: {
        datasets: [
          {
            data: graphData.timeSeriesData,
            fill: false,
            borderColor: '#E56536',
            tension: 0.3,
          },
        ],
      },
      options: {
        parsing: {
          xAxisKey: 'time',
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
