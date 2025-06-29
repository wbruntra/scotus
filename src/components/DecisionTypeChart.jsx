import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import scData from '../data/scData.json';

ChartJS.register(ArcElement, Tooltip, Legend);

const validCases = scData.filter(d => d.caseTitle);
const decisionTypes = validCases.reduce((acc, d) => {
  const type = d.opinionType || 'Other';
  acc[type] = (acc[type] || 0) + 1;
  return acc;
}, {});

const chartData = {
  labels: Object.keys(decisionTypes),
  datasets: [
    {
      label: 'Number of Cases',
      data: Object.values(decisionTypes),
      backgroundColor: [
        'rgba(255, 99, 132, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(75, 192, 192, 0.6)',
        'rgba(153, 102, 255, 0.6)',
        'rgba(255, 159, 64, 0.6)',
      ],
    },
  ],
};

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
      labels: {
        color: '#f0f0f0',
      },
    },
    title: {
      display: true,
      text: 'Breakdown of Decision Types',
      color: '#f0f0f0',
      font: { size: 18 },
    },
  },
};

function DecisionTypeChart() {
  return <Pie options={chartOptions} data={chartData} />;
}

export default DecisionTypeChart;
