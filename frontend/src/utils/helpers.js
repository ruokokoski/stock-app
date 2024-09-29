export const getColor = (percentageChange) => {
  if (!percentageChange || percentageChange === '-') return { color: 'black' }
  if (percentageChange.startsWith('-')) {
    return { color: 'red' }
  } else {
    return { color: 'green' }
  }
}

export const formatDate = (latestTime) => {
  //console.log('latestTime:', latestTime)
  const date = new Date(latestTime.includes(' ') ? latestTime : `${latestTime}T00:00:00`)
  //console.log('date:', date)
  const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }
  const dateString = date.toLocaleDateString('en-US', options)
  const timeOptions = { hour: '2-digit', minute: '2-digit' }
  const timeString = date.toLocaleTimeString('en-US', timeOptions)

  if (!latestTime.includes(' ')) {
      return dateString
  } else if (date.getHours() === 0 && date.getMinutes() === 0) {
      return dateString
  }

  return `${dateString}, ${timeString}`
}