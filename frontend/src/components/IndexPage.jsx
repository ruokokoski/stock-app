import { useParams, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { twelvedataService, polygonService } from '../services/stockServices'
import { getColor, formatDate, convertUTCToLocal } from '../utils/helpers'
import Chart from './Chart'

const IndexPage = () => {
  const { ticker } = useParams()
  const location = useLocation()
  const { name, percentageChange, chartData: forwardedChartData } = location.state || {}
  const [chartData, setChartData] = useState([])
  const [fullData, setFullData] = useState([]) // Used for Polygon data
  const [lastUpdated, setLastUpdated] = useState('')
  const [initialDataUsed, setInitialDataUsed] = useState(false)
  const [selectedInterval, setSelectedInterval] = useState('1m')

  const fetchData = async (range) => {
    try {
      const response = ticker.startsWith('I:') 
        ? await polygonService.getTicker(ticker)
        : await twelvedataService.getTicker(ticker, range)
      setChartData(response.chartData || [])
      if (response.chartData && response.chartData.length > 0) {
        const latestTime = response.chartData[response.chartData.length - 1].time
        setLastUpdated(formatDate(latestTime))
      }
      console.log('Chart data was fetched from API')
    } catch (error) {
      console.error(`Error fetching data for ${ticker}:`, error)
    }
  }

  useEffect(() => {
    setFullData(forwardedChartData)
    if (forwardedChartData && forwardedChartData.length > 0 && !initialDataUsed) {
      console.log('initialDataUsed:', initialDataUsed)
      setChartData(forwardedChartData)
      const latestTime = forwardedChartData[forwardedChartData.length - 1].time
      console.log('Latest time:', latestTime)
      setLastUpdated(formatDate(latestTime))
      setInitialDataUsed(true)
    } else if (!ticker.startsWith('I:')) {
      fetchData(selectedInterval)
    }
  }, [ticker, forwardedChartData, selectedInterval, initialDataUsed])

  const setChartInterval = (interval) => {
    console.log(`Interval set to: ${interval}`)
    console.log(`Ticker: ${ticker}`)
    setSelectedInterval(interval)

    // Polygon data has 1 year range: full year data is also used for 1m and 1w:
    if (ticker.startsWith('I:')) {
      if (interval === '1w') {
        const oneWeekData = fullData.slice(-5)
        setChartData(oneWeekData)
      } else if (interval === '1m') {
        const oneMonthData = fullData.slice(-23)
        setChartData(oneMonthData)
      } else {
        setChartData(fullData)
      }
    } else {
      fetchData(interval)
    }
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
    <>
    <div className="stock-header">
      <h4 className="stock-name">{name} Index</h4>
      <div className="stock-meta">
        <span>{ticker}</span>
      </div>
      <div className="stock-price">
        <span className="price-change" style={getColor(percentageChange)}>
          {percentageChange}
        </span>
      </div>
      <div className="stock-details">
        <span className="last-updated">Updated: {convertUTCToLocal(lastUpdated)} EET</span>
      </div>
    </div>
    <div>
      <Chart 
        chartData={chartData} 
        name={name} 
        selectedInterval={selectedInterval} 
      />
      <div className="buttons-container">
        {renderIntervalButtons(ticker.startsWith('I:') ? ['1w', '1m', '1y'] : ['1d', '1w', '1m', '1y', '5y', '10y'])}
      </div>
    </div>
    </>
  )
}

export default IndexPage