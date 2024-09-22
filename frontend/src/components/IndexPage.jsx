import { useParams, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import twelvedataService from '../services/twelvedata'
import polygonService from '../services/polygon'
import { createChart } from 'lightweight-charts'
import { getColor } from '../utils/helpers'

const IndexPage = () => {
  const { ticker } = useParams()
  const location = useLocation()
  const { name, percentageChange, chartData: forwardedChartData } = location.state || {}
  const [chartData, setChartData] = useState([])
  const [chart, setChart] = useState(null)
  const [lineSeries, setLineSeries] = useState(null)
  const [lastUpdated, setLastUpdated] = useState('')
  const [initialDataUsed, setInitialDataUsed] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = ticker.startsWith('I:') 
          ? await polygonService.getTicker(ticker)
          : await twelvedataService.getTicker(ticker, '1month')
        setChartData(response.chartData || [])
        if (response.chartData && response.chartData.length > 0) {
          const latestTime = response.chartData[response.chartData.length - 1].time
          setLastUpdated(new Date(latestTime).toDateString())
        }
        console.log('Chart data was fecthed from API')
      } catch (error) {
          console.error(`Error fetching data for ${ticker}:`, error)
      }
    }
  
    // Use forwarded data for initial render only
    if (forwardedChartData && forwardedChartData.length > 0 && !initialDataUsed) {
      setChartData(forwardedChartData)
      const latestTime = forwardedChartData[forwardedChartData.length - 1].time
      setLastUpdated(new Date(latestTime).toDateString())
      setInitialDataUsed(true)
    } else if (initialDataUsed) {
      fetchData()
    }
  }, [ticker, forwardedChartData, initialDataUsed])

  useEffect(() => {
    const container = document.getElementById('chart');
    const chartOptions = {
      layout: {
        textColor: 'black',
        background: { type: 'solid', color: 'white' },
      },
      height: 400,
    }
    const newChart = createChart(container, chartOptions)
    const newLineSeries = newChart.addLineSeries({ color: '#2962FF' })
    
    setChart(newChart)
    setLineSeries(newLineSeries)

    return () => {
        newChart.remove()
    }
  }, [])

  useEffect(() => {
    if (lineSeries && chartData.length > 0) {
      const formattedData = chartData.map(point => ({
        time: point.time,//Math.floor(new Date(point.time).getTime() / 1000),
        value: parseFloat(point.value),
      }))
  
      lineSeries.setData(formattedData);
      chart.timeScale().fitContent();
    }
  }, [lineSeries, chartData])

  const setChartInterval = (interval) => {
    // Adjust data fetching logic based on interval
    console.log(`Interval set to: ${interval}`)
  }

  return (
    <div className="content-padding">
      <h4>{name} Index</h4>
      <span>ticker: {ticker}, change: </span>
      <span style={getColor(percentageChange)}>
        {percentageChange}
      </span>
      <p>Last updated: {lastUpdated}</p>
      <div id="chart">
      </div>
      <div className="buttons-container">
        {['1D', '1W', '1M', '1Y'].map(interval => (
          <button 
            key={interval}
            className="gradient-button"
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