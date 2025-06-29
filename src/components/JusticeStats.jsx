import scData from '../data/scData.json';
import './JusticeStats.scss';

const allJustices = [
  'Roberts',
  'Thomas',
  'Alito',
  'Sotomayor',
  'Kagan',
  'Gorsuch',
  'Kavanaugh',
  'Barrett',
  'Jackson',
];

const validCases = scData.filter(d => d.caseTitle && d.majorityJustices && d.dissentingJustices);

const justiceStats = allJustices.map(justice => {
  const majorityVotes = validCases.filter(c => c.majorityJustices.includes(justice)).length;
  const concurringVotes = validCases.filter(c => c.concurringJustices && c.concurringJustices.includes(justice)).length;
  const dissentVotes = validCases.filter(c => c.dissentingJustices.includes(justice)).length;

  return {
    name: justice,
    majorityCount: majorityVotes,
    concurringCount: concurringVotes,
    dissentCount: dissentVotes,
  };
});

function JusticeStats() {
  return (
    <div className="justice-stats">
      <h2 className="mb-4">Justice Voting Statistics</h2>
      <table className="table table-striped table-hover">
        <thead className="thead-dark">
          <tr>
            <th>Justice</th>
            <th>Majority Votes</th>
            <th>Concurring Votes</th>
            <th>Dissent Votes</th>
          </tr>
        </thead>
        <tbody>
          {justiceStats.map(stats => (
            <tr key={stats.name}>
              <td>{stats.name}</td>
              <td>{stats.majorityCount}</td>
              <td>{stats.concurringCount}</td>
              <td>{stats.dissentCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default JusticeStats;
