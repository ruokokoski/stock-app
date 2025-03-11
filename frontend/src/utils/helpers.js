import { addToWatchlist } from '../services/watchlists'

const WATCHLIST_COUNT = 30

export const getColor = (value) => {
  if (value === null || value === undefined || value === 'Loading...') {
    return { color: 'black' }
  }

  const valueString = String(value)
  
  if (valueString.startsWith('-')) {
    return { color: 'red' }
  }
  
  return { color: 'green' }
}

export const convertUTCToLocal = (utcTimestamp) => {
  const date = new Date(utcTimestamp)
  return date.toLocaleString()
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

export const formatCryptoMarketCap = (marketCap) => {
  return `$${(parseFloat(marketCap) / 1e9).toFixed(2)}B`
}

export const formatChartData = (chartData, seriesType) => {
  return chartData.map(point => {
    const time = Math.floor(new Date(point.time + 'Z').getTime() / 1000)
    
    if (seriesType === 'candlestick') {
      return {
        time,
        open: parseFloat(point.open),
        high: parseFloat(point.high),
        low: parseFloat(point.low),
        close: parseFloat(point.close),
      }
    }
    return {
      time,
      value: parseFloat(point.close),
    }
  })
}

export const createToolTip = (container) => {
  const toolTipWidth = 100
  const toolTipHeight = 90

  const toolTip = document.createElement('div')
  toolTip.style = `width: ${toolTipWidth}px; height: ${toolTipHeight}px; position: absolute; display: none; padding: 8px; box-sizing: border-box; font-size: 12px; text-align: left; z-index: 1000; pointer-events: none; border: 1px solid; border-radius: 2px; background: white; color: black; border-color: rgba(38, 166, 154, 1);`
  container.appendChild(toolTip)

  return toolTip
}

export const cleanExpiredData = () => {
  const now = Date.now()
  const expirationTime = 60 * 60 * 1000

  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith("historicalData-")) {
      const storedData = JSON.parse(localStorage.getItem(key))
      if (!storedData || now - storedData.timestamp >= expirationTime) {
        localStorage.removeItem(key)
      }
    }
  })
}

export const handleDateChange = (type, value, setStartDate, setEndDate) => {
  const newDate = value
  if (type === 'start') {
    setStartDate(newDate)
  } else {
    setEndDate(newDate)
  }
  //setChartInterval('custom')
}

export const formatMarketCap = (marketCap) => {
  if (marketCap == null || isNaN(marketCap)) {
    return '-'
  }

  if (marketCap >= 1000000) {
    return `${(marketCap / 1000000).toFixed(2)}T`
  } else if (marketCap >= 1000) {
    return `${(marketCap / 1000).toFixed(1)}B`
  }
  return `${marketCap.toFixed(1)}M`
}

export const handleAddToWatchlist = async (ticker, setMessage, setMessageVariant) => {
  try {
    const loggedUserJSON = window.localStorage.getItem('loggedStockappUser')
    const user = JSON.parse(loggedUserJSON)

    const currentWatchlist = JSON.parse(localStorage.getItem('watchlist') || '[]')
    //console.log('Watchlist length: ', currentWatchlist.length)

    if (currentWatchlist.length >= WATCHLIST_COUNT) {
      setMessage(`Watchlist limit reached (${WATCHLIST_COUNT} stocks). Remove some stocks first.`)
      setMessageVariant('warning')
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    await addToWatchlist(ticker, user.token)
    setMessage(`Added ${ticker} to your watchlist`)
    setMessageVariant('success')
    window.scrollTo({ top: 0, behavior: 'smooth' })

    const newWatchlist = [...currentWatchlist, { ticker }]
    localStorage.setItem('watchlist', JSON.stringify(newWatchlist))
  } catch (error) {
    console.error('Error adding to watchlist:', error)
    const errorMessage = error.response?.data?.error || 'Failed to add to watchlist'
    setMessage(errorMessage)
    setMessageVariant('danger')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}
