import { useParams, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import twelvedataService from '../services/twelvedata'
import polygonService from '../services/polygon'
import { getColor, formatDate } from '../utils/helpers'
import Chart from './Chart'

const IndexPage = () => {
  const { ticker } = useParams()
  const location = useLocation()
  const { name, percentageChange, chartData: forwardedChartData } = location.state || {}
  const [chartData, setChartData] = useState([])
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
    // Use forwarded data for initial render only
    if (forwardedChartData && forwardedChartData.length > 0 && !initialDataUsed) {
      setChartData(forwardedChartData)
      const latestTime = forwardedChartData[forwardedChartData.length - 1].time
      console.log('Latest time:', latestTime)
      setLastUpdated(formatDate(latestTime))
      setInitialDataUsed(true)
    } else if (initialDataUsed) {
      fetchData(selectedInterval)
    }
  }, [ticker, forwardedChartData, initialDataUsed, selectedInterval])

  const setChartInterval = (interval) => {
    // Adjust data fetching logic based on interval
    console.log(`Interval set to: ${interval}`)
    setSelectedInterval(interval)
    fetchData(interval)
  }

  return (
    <div className="content-padding">
      <h4>{name} Index</h4>
      <span>ticker: {ticker}, change: </span>
      <span style={getColor(percentageChange)}>
        {percentageChange}
      </span>
      <p>Last updated: {lastUpdated}</p>
      <Chart 
        chartData={chartData} 
        name={name} 
        selectedInterval={selectedInterval} 
      />
      <div className="buttons-container">
        {['1d', '1w', '1m', '1y'].map(interval => (
          <button 
            key={interval}
            className="gradient-button gradient-button-small"
            onClick={() => setChartInterval(interval)}
          >
            {interval}
          </button>
        ))}
      </div>
    </div>
  )
}

export default IndexPage