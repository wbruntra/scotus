#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

// Load the data
const dataPath = path.join(__dirname, '../src/data/scData.json')
const scData = JSON.parse(fs.readFileSync(dataPath, 'utf8'))

// Known justices list
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
]

console.log('🔍 Supreme Court Data Integrity Check')
console.log('=====================================\n')

console.log(`📊 Total cases in dataset: ${scData.length}\n`)

// 1. Basic data completeness check
console.log('1. BASIC DATA COMPLETENESS')
console.log('---------------------------')

const casesWithoutTitle = scData.filter((c) => !c.caseTitle)
const casesWithoutJusticesFor = scData.filter(
  (c) => !c.justicesFor || !Array.isArray(c.justicesFor),
)
const casesWithoutDissentingJustices = scData.filter(
  (c) => !c.dissentingJustices || !Array.isArray(c.dissentingJustices),
)
const casesWithoutDate = scData.filter((c) => !c.date)
const casesWithoutOpinionType = scData.filter((c) => !c.opinionType)

console.log(`❌ Cases without title: ${casesWithoutTitle.length}`)
console.log(`❌ Cases without justicesFor: ${casesWithoutJusticesFor.length}`)
console.log(`❌ Cases without dissentingJustices: ${casesWithoutDissentingJustices.length}`)
console.log(`❌ Cases without date: ${casesWithoutDate.length}`)
console.log(`❌ Cases without opinionType: ${casesWithoutOpinionType.length}`)

// Valid cases for further analysis
const validCases = scData.filter(
  (c) =>
    c.caseTitle &&
    c.justicesFor &&
    Array.isArray(c.justicesFor) &&
    c.dissentingJustices &&
    Array.isArray(c.dissentingJustices),
)

console.log(`✅ Valid cases for analysis: ${validCases.length}\n`)

// 2. Justice coverage analysis
console.log('2. JUSTICE COVERAGE ANALYSIS')
console.log('-----------------------------')

allJustices.forEach((justice) => {
  const casesWithJustice = validCases.filter((c) => {
    const allJusticesInCase = [
      ...(c.justicesFor || []),
      ...(c.dissentingJustices || []),
      ...(c.concurringJustices || []),
    ]
    return allJusticesInCase.includes(justice)
  })

  const percentage = ((casesWithJustice.length / validCases.length) * 100).toFixed(1)
  const status = percentage < 95 ? '⚠️' : '✅'
  console.log(
    `${status} ${justice}: ${casesWithJustice.length}/${validCases.length} cases (${percentage}%)`,
  )
})

// 3. Vote count consistency
console.log('\n3. VOTE COUNT CONSISTENCY')
console.log('--------------------------')

const inconsistentVoteCounts = validCases.filter((c) => {
  const majorityJusticesCount = (c.majorityJustices || []).length
  const justicesForCount = (c.justicesFor || []).length
  const dissentingCount = (c.dissentingJustices || []).length
  const concurringCount = (c.concurringJustices || []).length
  const totalVotes = majorityJusticesCount + dissentingCount + concurringCount

  // Check if vote counts match the votesFor/votesAgainst fields
  const votesForMismatch = c.votesFor && c.votesFor !== justicesForCount
  const votesAgainstMismatch = c.votesAgainst && c.votesAgainst !== dissentingCount

  return votesForMismatch || votesAgainstMismatch || totalVotes === 0 || totalVotes > 9
})

console.log(`❌ Cases with inconsistent vote counts: ${inconsistentVoteCounts.length}`)

if (inconsistentVoteCounts.length > 0 && inconsistentVoteCounts.length <= 10) {
  inconsistentVoteCounts.forEach((c) => {
    const justicesForCount = (c.justicesFor || []).length
    const dissentingCount = (c.dissentingJustices || []).length
    const concurringCount = (c.concurringJustices || []).length
    console.log(
      `  • ${c.caseTitle}: For:${justicesForCount} Against:${dissentingCount} Concur:${concurringCount} (votesFor:${c.votesFor} votesAgainst:${c.votesAgainst})`,
    )
  })
}

// 4. Unknown justices check
console.log('\n4. UNKNOWN JUSTICES')
console.log('-------------------')

const unknownJustices = new Set()
validCases.forEach((c) => {
  const allJusticesInCase = [
    ...(c.justicesFor || []),
    ...(c.dissentingJustices || []),
    ...(c.concurringJustices || []),
  ]

  allJusticesInCase.forEach((justice) => {
    if (!allJustices.includes(justice)) {
      unknownJustices.add(justice)
    }
  })
})

if (unknownJustices.size > 0) {
  console.log(`❌ Unknown justices found: ${Array.from(unknownJustices).join(', ')}`)
} else {
  console.log('✅ All justices are recognized')
}

// 5. Duplicate justice check
console.log('\n5. DUPLICATE JUSTICES IN SAME CASE')
console.log('-----------------------------------')

const casesWithDuplicates = validCases.filter((c) => {
  const allJusticesInCase = [
    ...(c.justicesFor || []),
    ...(c.dissentingJustices || []),
    ...(c.concurringJustices || []),
  ]

  const uniqueJustices = new Set(allJusticesInCase)
  return uniqueJustices.size !== allJusticesInCase.length
})

console.log(`❌ Cases with duplicate justices: ${casesWithDuplicates.length}`)

if (casesWithDuplicates.length > 0 && casesWithDuplicates.length <= 5) {
  casesWithDuplicates.forEach((c) => {
    console.log(`  • ${c.caseTitle}`)
  })
}

// 6. Opinion type analysis
console.log('\n6. OPINION TYPE DISTRIBUTION')
console.log('-----------------------------')

const opinionTypes = {}
validCases.forEach((c) => {
  const type = c.opinionType || 'Missing'
  opinionTypes[type] = (opinionTypes[type] || 0) + 1
})

Object.entries(opinionTypes)
  .sort((a, b) => b[1] - a[1])
  .forEach(([type, count]) => {
    const percentage = ((count / validCases.length) * 100).toFixed(1)
    console.log(`  ${type}: ${count} cases (${percentage}%)`)
  })

// 7. Date analysis
console.log('\n7. DATE ANALYSIS')
console.log('----------------')

const casesWithInvalidDates = validCases.filter((c) => {
  if (!c.date) return true
  const date = new Date(c.date)
  return isNaN(date.getTime()) || date.getFullYear() < 2020 || date.getFullYear() > 2025
})

console.log(`❌ Cases with invalid/suspicious dates: ${casesWithInvalidDates.length}`)

if (casesWithInvalidDates.length > 0 && casesWithInvalidDates.length <= 5) {
  casesWithInvalidDates.forEach((c) => {
    console.log(`  • ${c.caseTitle}: ${c.date}`)
  })
}

// 8. Missing justice analysis for specific justice
console.log('\n8. DETAILED MISSING JUSTICE ANALYSIS')
console.log('-------------------------------------')

allJustices.forEach((justice) => {
  const casesWithoutJustice = validCases.filter((c) => {
    const allJusticesInCase = [
      ...(c.justicesFor || []),
      ...(c.dissentingJustices || []),
      ...(c.concurringJustices || []),
    ]
    return !allJusticesInCase.includes(justice)
  })

  if (casesWithoutJustice.length > 0) {
    console.log(`\n${justice} missing from ${casesWithoutJustice.length} cases:`)
    casesWithoutJustice.slice(0, 3).forEach((c) => {
      const allJusticesInCase = [
        ...(c.justicesFor || []),
        ...(c.dissentingJustices || []),
        ...(c.concurringJustices || []),
      ]
      console.log(`  • ${c.caseTitle} (${c.date}) - Justices: ${allJusticesInCase.join(', ')}`)
    })
    if (casesWithoutJustice.length > 3) {
      console.log(`  ... and ${casesWithoutJustice.length - 3} more cases`)
    }
  }
})

// Summary
console.log('\n🎯 SUMMARY')
console.log('==========')
const totalIssues =
  casesWithoutTitle.length +
  casesWithoutJusticesFor.length +
  casesWithoutDissentingJustices.length +
  inconsistentVoteCounts.length +
  unknownJustices.size +
  casesWithDuplicates.length +
  casesWithInvalidDates.length

if (totalIssues === 0) {
  console.log('✅ No major data integrity issues found!')
} else {
  console.log(`❌ Found ${totalIssues} potential data integrity issues.`)
}

console.log(`📈 Data completeness: ${((validCases.length / scData.length) * 100).toFixed(1)}%`)
console.log(`📊 Usable cases: ${validCases.length}/${scData.length}`)
