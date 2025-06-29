import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import scData from '../data/scData.json';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

const validCases = scData.filter(d => d.caseTitle);
const totalCases = validCases.length;

const voteSplits = validCases.reduce((acc, d) => {
  const split = `${d.votesFor}-${d.votesAgainst}`;
  acc[split] = (acc[split] || 0) + 1;
  return acc;
}, {});

const sortedSplits = Object.entries(voteSplits).sort((a, b) => {
  const [aFor, aAgainst] = a[0].split('-').map(Number);
  const [bFor, bAgainst] = b[0].split('-').map(Number);
  if (aFor !== bFor) {
    return bFor - aFor;
  }
  return bAgainst - aAgainst;
});

const chartData = {
  labels: sortedSplits.map(item => item[0]),
  datasets: [
    {
      label: 'Number of Cases',
      data: sortedSplits.map(item => item[1]),
      backgroundColor: [
        '#4e79a7', '#f28e2c', '#e15759', '#76b7b2', '#59a14f',
        '#edc949', '#af7aa1', '#ff9da7', '#9c755f', '#bab0ab'
      ],
      borderColor: '#1a1a1a',
      borderWidth: 2,
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
      text: 'Distribution of Vote Splits',
      color: '#f0f0f0',
      font: { size: 18 },
    },
    datalabels: {
      anchor: 'end',
      align: 'top',
      color: '#f0f0f0',
      formatter: (value, context) => {
        const percentage = ((value / totalCases) * 100).toFixed(1) + '%';
        return percentage;
      },
      font: {
        weight: 'bold'
      }
    }
  },
  scales: {
    x: {
      ticks: { color: '#f0f0f0' },
      grid: { color: 'rgba(255, 255, 255, 0.1)' },
    },
    y: {
      ticks: { color: '#f0f0f0' },
      grid: { color: 'rgba(255, 255, 255, 0.1)' },
    },
  },
};

function VoteSplitChart() {
  return <Bar options={chartOptions} data={chartData} />;
}

export default VoteSplitChart;
