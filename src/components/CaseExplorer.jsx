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

const validCases = scData.filter(d => d.caseTitle && d.justicesFor && d.dissentingJustices);

function CaseExplorer() {
  const [voteType, setVoteType] = useState('all'); // 'all', 'majority', 'dissent'
  const [selectedJustices, setSelectedJustices] = useState([]);
  const [excludeUnanimous, setExcludeUnanimous] = useState(false);

  const handleJusticeToggle = (justice) => {
    setSelectedJustices(prev =>
      prev.includes(justice)
        ? prev.filter(j => j !== justice)
        : [...prev, justice]
    );
  };

  const filteredCases = validCases.filter(c => {
    if (selectedJustices.length === 0) return false;

    // Filter out unanimous cases if option is selected
    if (excludeUnanimous && c.votesAgainst === 0) return false;

    const targetGroup = 
      voteType === 'majority' ? c.justicesFor :
      voteType === 'dissent' ? c.dissentingJustices :
      null;

    if (targetGroup) {
      return selectedJustices.every(j => targetGroup.includes(j));
    } else { // 'all'
      const inMajority = selectedJustices.every(j => c.justicesFor.includes(j));
      const inDissent = selectedJustices.every(j => c.dissentingJustices.includes(j));
      return inMajority || inDissent;
    }
  });

  const generateSummaryText = () => {
    if (selectedJustices.length === 0) {
      return "Select justices to find cases where they voted together.";
    }

    const justiceList = selectedJustices.join(', ');
    const caseCount = filteredCases.length;
    const percentage = validCases.length > 0 ? ((caseCount / validCases.length) * 100).toFixed(1) : 0;
    
    let summary = `${caseCount} case${caseCount !== 1 ? 's' : ''} found with ${justiceList}`;
    
    // Add vote type specification
    if (voteType === 'majority') {
      summary += ' in the majority';
    } else if (voteType === 'dissent') {
      summary += ' in dissent';
    } else {
      summary += ' voting together';
    }
    
    // Add unanimous exclusion note (but not for dissents since unanimous cases have no dissents)
    if (excludeUnanimous && voteType !== 'dissent') {
      summary += ', excluding unanimous cases';
    }
    
    summary += ` (${percentage}% of total).`;
    
    return summary;
  };

  return (
    <div className="case-explorer">
      <h2 className="mb-4">Case Explorer</h2>
      <div className="mb-4">
        <div className="mb-3">
          <label className="form-label me-3">Vote Type</label>
          <div className="vote-type-selection">
            <button
              type="button"
              className={`vote-type-pill ${voteType === 'all' ? 'selected' : ''}`}
              onClick={() => setVoteType('all')}
            >
              All
            </button>
            <button
              type="button"
              className={`vote-type-pill ${voteType === 'majority' ? 'selected' : ''}`}
              onClick={() => setVoteType('majority')}
            >
              Majority
            </button>
            <button
              type="button"
              className={`vote-type-pill ${voteType === 'dissent' ? 'selected' : ''}`}
              onClick={() => setVoteType('dissent')}
            >
              Dissent
            </button>
          </div>
          <div className="mt-3">
            <div className="form-check">
              <input 
                className="form-check-input" 
                type="checkbox" 
                id="exclude-unanimous"
                checked={excludeUnanimous}
                onChange={(e) => setExcludeUnanimous(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="exclude-unanimous">
                Exclude unanimous cases
              </label>
            </div>
          </div>
        </div>
        <div>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <label className="form-label mb-0">Select Justices</label>
            <div className="quick-actions">
              <button 
                type="button" 
                className="btn btn-sm btn-outline-secondary me-2"
                onClick={() => setSelectedJustices(allJustices)}
              >
                Select All
              </button>
              <button 
                type="button" 
                className="btn btn-sm btn-outline-secondary"
                onClick={() => setSelectedJustices([])}
              >
                Clear All
              </button>
            </div>
          </div>
          <p className="form-text text-muted small mb-3">
            Click justices to find cases where they voted together.
          </p>
          <div className="justices-selection">
            {allJustices.map(justice => (
              <button
                key={justice}
                type="button"
                className={`justice-pill ${selectedJustices.includes(justice) ? 'selected' : ''}`}
                onClick={() => handleJusticeToggle(justice)}
              >
                {justice}
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className="mb-4" style={{ fontSize: '1.1rem', fontWeight: '500' }}>{generateSummaryText()}</p>

      <ul className="list-group">
        {filteredCases.map(c => (
          <li key={c.caseTitle} className="list-group-item">
            <h5>{c.caseTitle}</h5>
            <p className="mb-1">{c.fullText}</p>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <small className="text-muted">Date: {c.date}</small>
              {c.linkUrl && 
                <a href={c.linkUrl} target="_blank" rel="noopener noreferrer" className="pdf-link">
                  <span className="pdf-icon">📄</span>
                  Full Opinion
                </a>
              }
            </div>
            <div className="vote-groups">
              <p className="mb-1"><strong>Majority:</strong> {c.majorityJustices?.join(', ') || 'None'}</p>
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
