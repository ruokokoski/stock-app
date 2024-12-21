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

export const formatCurrency = (amount) => {
  return `$${parseFloat(amount).toFixed(2)}`
}

export const formatMarketCap = (marketCap) => {
  return `$${(parseFloat(marketCap) / 1e9).toFixed(2)}B`
}

export const formatChartData = (chartData) => {
  return chartData.map(point => ({
    time: Math.floor(new Date(point.time + 'Z').getTime() / 1000),
    value: parseFloat(point.value),
  }))
}

export const createToolTip = (container, name) => {
  const toolTipWidth = 100
  const toolTipHeight = 90
  const toolTipMargin = 10
  const leftOffset = 100
  const topOffset = 220

  const toolTip = document.createElement('div')
  toolTip.style = `width: ${toolTipWidth}px; height: ${toolTipHeight}px; position: absolute; display: none; padding: 8px; box-sizing: border-box; font-size: 12px; text-align: left; z-index: 1000; pointer-events: none; border: 1px solid; border-radius: 2px; background: white; color: black; border-color: rgba(38, 166, 154, 1);`
  container.appendChild(toolTip)

  return toolTip
}
