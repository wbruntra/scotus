const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../src/data/scData.json');

fs.readFile(dataPath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading the data file:', err);
    return;
  }

  try {
    const scData = JSON.parse(data);

    const updatedData = scData.map(caseData => {
      if (caseData.majorityJustices) {
        const concurring = caseData.concurringJustices || [];
        caseData.justicesFor = [...new Set([...caseData.majorityJustices, ...concurring])];
      }
      return caseData;
    });

    fs.writeFile(dataPath, JSON.stringify(updatedData, null, 2), 'utf8', (err) => {
      if (err) {
        console.error('Error writing the updated data file:', err);
        return;
      }
      console.log('Successfully updated scData.json');
    });

  } catch (parseErr) {
    console.error('Error parsing JSON data:', parseErr);
  }
});
