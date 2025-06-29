import { useState } from 'react';
import scData from '../data/scData.json';
import './CaseExplorer.scss';

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

function CaseExplorer() {
  const [voteType, setVoteType] = useState('all'); // 'all', 'majority', 'dissent'
  const [selectedJustices, setSelectedJustices] = useState([]);

  const handleJusticeToggle = (justice) => {
    setSelectedJustices(prev =>
      prev.includes(justice)
        ? prev.filter(j => j !== justice)
        : [...prev, justice]
    );
  };

  const filteredCases = validCases.filter(c => {
    if (selectedJustices.length === 0) return false;

    const targetGroup = 
      voteType === 'majority' ? c.majorityJustices :
      voteType === 'dissent' ? c.dissentingJustices :
      null;

    if (targetGroup) {
      return selectedJustices.every(j => targetGroup.includes(j));
    } else { // 'all'
      const inMajority = selectedJustices.every(j => c.majorityJustices.includes(j));
      const inDissent = selectedJustices.every(j => c.dissentingJustices.includes(j));
      return inMajority || inDissent;
    }
  });

  return (
    <div className="case-explorer">
      <h2 className="mb-4">Case Explorer</h2>
      <div className="row mb-4">
        <div className="col-md-4">
          <label htmlFor="vote-type" className="form-label">Vote Type</label>
          <select id="vote-type" className="form-select" value={voteType} onChange={e => setVoteType(e.target.value)}>
            <option value="all">All</option>
            <option value="majority">Majority</option>
            <option value="dissent">Dissent</option>
          </select>
        </div>
        <div className="col-md-8">
          <label className="form-label">Select Justices</label>
          <p className="form-text text-muted small">
            Select one or more justices to find cases where they voted together.
          </p>
          <div className="justices-selection">
            {allJustices.map(justice => (
              <div key={justice} className="form-check form-check-inline">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  id={`justice-${justice}`} 
                  value={justice} 
                  checked={selectedJustices.includes(justice)}
                  onChange={() => handleJusticeToggle(justice)}
                />
                <label className="form-check-label" htmlFor={`justice-${justice}`}>{justice}</label>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p>{filteredCases.length} case(s) found ({validCases.length > 0 ? ((filteredCases.length / validCases.length) * 100).toFixed(1) : 0}% of total).</p>

      <ul className="list-group">
        {filteredCases.map(c => (
          <li key={c.caseTitle} className="list-group-item">
            <h5>{c.caseTitle}</h5>
            <p className="mb-1">{c.fullText}</p>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <small className="text-muted">Date: {c.date}</small>
              {c.linkUrl && 
                <a href={c.linkUrl} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary">
                  Full Opinion (PDF)
                </a>
              }
            </div>
            <div className="vote-groups">
              <p className="mb-1"><strong>Majority:</strong> {c.majorityJustices.join(', ') || 'None'}</p>
              {c.concurringJustices && c.concurringJustices.length > 0 && (
                <p className="mb-1"><strong>Concurring:</strong> {c.concurringJustices.join(', ')}</p>
              )}
              <p className="mb-0"><strong>Dissenting:</strong> {c.dissentingJustices.join(', ') || 'None'}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CaseExplorer;
