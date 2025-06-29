import scData from '../data/scData.json';
import VoteSplitChart from './VoteSplitChart';
import DecisionTypeChart from './DecisionTypeChart';
import './Dashboard.scss';

const validCases = scData.filter(d => d.caseTitle);
const totalCases = validCases.length;

const unanimousCases = validCases.filter(d => d.votesAgainst === 0).length;
const unanimousPercentage = Math.round((unanimousCases / totalCases) * 100);

const voteSplits = validCases.reduce((acc, d) => {
  const split = `${d.votesFor}-${d.votesAgainst}`;
  acc[split] = (acc[split] || 0) + 1;
  return acc;
}, {});

const mostFrequentSplit = Object.keys(voteSplits).reduce((a, b) => voteSplits[a] > voteSplits[b] ? a : b);

const decisionTypes = validCases.reduce((acc, d) => {
  const type = d.opinionType || 'Other';
  acc[type] = (acc[type] || 0) + 1;
  return acc;
}, {});

function Dashboard() {
  return (
    <div className="dashboard">
      <h2 className="mb-4">Term Overview</h2>
      <div className="row">
        <div className="col-md-4">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">Total Cases Decided</h5>
              <p className="card-text display-4">{totalCases}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">Unanimous Decisions</h5>
              <p className="card-text display-4">{unanimousPercentage}%</p>
            </div>
          </div>
        </div>
        {/* <div className="col-md-4">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">Most Frequent Vote Split</h5>
              <p className="card-text display-4">{mostFrequentSplit}</p>
            </div>
          </div>
        </div> */}
      </div>
      <div className="row mt-4">
        <div className="col-md-6 mb-4">
          <div className="chart-container">
            <VoteSplitChart />
          </div>
        </div>
        <div className="col-md-6">
          <div className="chart-container">
            <DecisionTypeChart />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
