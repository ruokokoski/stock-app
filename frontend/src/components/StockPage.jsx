import { useParams, useLocation } from 'react-router-dom'
import { useState, useEffect, useCallback } from 'react'
import { twelvedataService, polygonService } from '../services/stockServices'
import { getColor, formatDate, cleanExpiredData } from '../utils/helpers'
import Chart from './Chart'

const StockPage = () => {
  const { ticker } = useParams()
  const location = useLocation()
  const { name, percentageChange } = location.state || {}
  const [chartData, setChartData] = useState([])
  const [lastUpdated, setLastUpdated] = useState('')
  const [selectedInterval, setSelectedInterval] = useState('1m')

  const fetchHistoricalData = useCallback(async (range) => {
    const storageKey = `historicalData-${ticker}-${range}`
    const now = Date.now()
    const shortExpirationTime = 60 * 1000 // 1 min
    const longExpirationTime = 60 * 60 * 1000 // 1 hour
    const storedData = localStorage.getItem(storageKey)
    if (storedData) {
      const parsedData = JSON.parse(storedData)
        
      if (now - parsedData.timestamp < shortExpirationTime) {
        setChartData(parsedData.chartData || [])
        setLastUpdated(parsedData.lastUpdated || '')
        console.log(`Used cached data for ${ticker}, interval: ${range}`)
        return
      } else if (now - parsedData.timestamp < longExpirationTime) {
        setChartData(parsedData.chartData || [])
        setLastUpdated(parsedData.lastUpdated || '')
      } else {
        localStorage.removeItem(storageKey)
      }
    }
    try {
      const response = ticker.startsWith('I:') 
        ? await polygonService.getTicker(ticker)
        : await twelvedataService.getTicker(ticker, range)
      
      if (response.chartData && response.chartData.length > 0) {
        const latestTime = response.chartData[response.chartData.length - 1].time
        const formattedTime = formatDate(latestTime)
        setLastUpdated(formattedTime)
        setChartData(response.chartData)

        localStorage.setItem(storageKey, JSON.stringify({
            chartData: response.chartData,
            lastUpdated: formattedTime,
            timestamp: now
        }))
      }
      console.log('Chart data was fetched from API')
    } catch (error) {
      console.error(`Error fetching data for ${ticker}:`, error)
      if (!storedData) {
        setChartData([])
        setLastUpdated('')
      }
    }
  }, [ticker])

  useEffect(() => {
    cleanExpiredData()
    fetchHistoricalData(selectedInterval)
  }, [ticker, selectedInterval, fetchHistoricalData])

  const setChartInterval = (interval) => {
    console.log(`Interval set to: ${interval}`)
    console.log(`Ticker: ${ticker}`)
    setSelectedInterval(interval)
  }

  const renderIntervalButtons = (intervals) => {
    return intervals.map(interval => (
      <button
        key={interval}
        className={`gradient-button gradient-button-small ${selectedInterval === interval ? 'selected' : ''}`}
        onClick={() => setChartInterval(interval)}
        disabled={selectedInterval === interval}
      >
        {interval}
      </button>
    ))
  }

  return (
    <div className="content-padding">
      <h4>{name}</h4>
      <span>ticker: {ticker}, change 24h: </span>
      <span style={getColor(percentageChange)}>
        {percentageChange}
      </span>
      <p>Last updated: {lastUpdated} EET</p>
      <Chart 
        chartData={chartData} 
        name={name} 
        selectedInterval={selectedInterval} 
      />
      <div className="buttons-container">
        {renderIntervalButtons(['1d', '1w', '1m', '1y'])}
      </div>
    </div>
  )
}

export default StockPage