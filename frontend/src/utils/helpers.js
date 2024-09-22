export const getColor = (percentageChange) => {
  if (!percentageChange || percentageChange === '-') return { color: 'black' }
  if (percentageChange.startsWith('-')) {
    return { color: 'red' }
  } else {
    return { color: 'green' }
  }
}
