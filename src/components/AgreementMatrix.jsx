import scData from '../data/scData.json';
import './AgreementMatrix.scss';

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

const agreementData = allJustices.map(justice1 => {
  return {
    justice: justice1,
    agreements: allJustices.map(justice2 => {
      if (justice1 === justice2) {
        return { justice: justice2, agreement: 1, cases: scData.length };
      }

      const casesInAgreement = scData.filter(d => {
        if (!d.majorityJustices || !d.dissentingJustices) {
          return false;
        }
        const inMajority = d.majorityJustices.includes(justice1) && d.majorityJustices.includes(justice2);
        const inDissent = d.dissentingJustices.includes(justice1) && d.dissentingJustices.includes(justice2);
        return inMajority || inDissent;
      });

      const totalCases = scData.filter(d => d.majorityJustices && d.dissentingJustices).length;

      return {
        justice: justice2,
        agreement: casesInAgreement.length / totalCases,
        cases: casesInAgreement.length
      };
    })
  };
});

const getColorForPercentage = (percentage) => {
  const hue = 240; // Blue
  const saturation = 85;
  const lightness = 100 - (percentage * 70); // from 100% (white) to 30% (dark blue)
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

function AgreementMatrix() {
  return (
    <div className="agreement-matrix">
      <h2>Justice Agreement Matrix</h2>
      <p>Percentage of cases where justices voted in the same bloc (majority or dissent).</p>
      <table>
        <thead>
          <tr>
            <th></th>
            {allJustices.map(justice => <th key={justice}>{justice.slice(0,1)}</th>)}
          </tr>
        </thead>
        <tbody>
          {agreementData.map(row => (
            <tr key={row.justice}>
              <td className="justice-name">{row.justice}</td>
              {row.agreements.map(cell => (
                <td 
                  key={cell.justice} 
                  style={{ backgroundColor: getColorForPercentage(cell.agreement) }}
                  className={`cell-wrapper ${cell.agreement > 0.5 ? 'light-text' : ''}`}
                >
                  <div className="tooltip">
                    {row.justice} & {cell.justice}:<br />
                    {Math.round(cell.agreement * 100)}% ({cell.cases} cases)
                  </div>
                  {Math.round(cell.agreement * 100)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AgreementMatrix;
