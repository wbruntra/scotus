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
      backgroundColor: 'rgba(54, 162, 235, 0.6)',
    },
  ],
};

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Distribution of Vote Splits',
    },
    datalabels: {
      anchor: 'end',
      align: 'top',
      formatter: (value, context) => {
        const percentage = ((value / totalCases) * 100).toFixed(1) + '%';
        return percentage;
      },
      font: {
        weight: 'bold'
      }
    }
  },
};

function VoteSplitChart() {
  return <Bar options={chartOptions} data={chartData} />;
}

export default VoteSplitChart;
