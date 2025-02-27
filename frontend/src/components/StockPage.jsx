import { useParams, useLocation } from 'react-router-dom'
import { useState, useEffect, useCallback } from 'react'
import { twelvedataService, polygonService, tiingoService, finnhubService } from '../services/stockServices'
import { cleanExpiredData } from '../utils/helpers'
//import Chart from './Chart'
import StockHeader from './StockHeader'
import StockOverview from './StockOverview'
import StockNavigation from './StockNavigation'
import NewsArticles from './NewsArticles'

const StockPage = () => {
  const { ticker } = useParams()
  const location = useLocation()
  const { name, percentageChange, latest, change, timestamp } = location.state || {}
  const [chartData, setChartData] = useState([])
  //const [lastUpdated, setLastUpdated] = useState('')
  const [selectedInterval, setSelectedInterval] = useState('1y')
  const [metadata, setMetadata] = useState([])
  const [activeTab, setActiveTab] = useState('overview')
  const [newsData, setNewsData] = useState([])
  const [newsLoading, setNewsLoading] = useState(false)
  const [profileData, setProfileData] = useState([])
  const [metricsData, setMetricsData] = useState([])

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
        //setLastUpdated(parsedData.lastUpdated || '')
        console.log(`Used cached data for ${ticker}, interval: ${range}`)
        return
      } else if (now - parsedData.timestamp < longExpirationTime) {
        setChartData(parsedData.chartData || [])
        //setLastUpdated(parsedData.lastUpdated || '')
      } else {
        localStorage.removeItem(storageKey)
      }
    }
    try {
      const response = ticker.startsWith('I:') 
        ? await polygonService.getTicker(ticker)
        : await twelvedataService.getTicker(ticker, range)
      
      if (response.chartData && response.chartData.length > 0) {
        //const latestTime = response.chartData[response.chartData.length - 1].time
        //const formattedTime = formatDate(latestTime)
        //setLastUpdated(formattedTime)
        setChartData(response.chartData)

        localStorage.setItem(storageKey, JSON.stringify({
            chartData: response.chartData,
            //lastUpdated: formattedTime,
            timestamp: now
        }))
      }
      console.log('Chart data was fetched from API')
    } catch (error) {
      console.error(`Error fetching data for ${ticker}:`, error)
      if (!storedData) {
        setChartData([])
        //setLastUpdated('')
      }
    }
  }, [ticker])

  useEffect(() => {
    cleanExpiredData()
    fetchHistoricalData(selectedInterval)
  }, [ticker, selectedInterval, fetchHistoricalData])

  useEffect(() => {
    const fetchDescription = async (ticker) => {
      try {
        const data = await tiingoService.getDescription(ticker)
        setMetadata(data)
      } catch (error) {
        console.error('Error fetching meta data from Tiingo:', error)
      }
    }
    fetchDescription(ticker)
  }, [])

  useEffect(() => {
    const fetchNews = async (ticker) => {
      setNewsLoading(true)
      try {
        const data = await finnhubService.getCompanyNews(ticker)
        setNewsData(data)
      } catch (error) {
        console.error('Error fetching news:', error)
      } finally {
        setNewsLoading(false)
      }
    }
    
    if (activeTab === 'news') {
      fetchNews(ticker)
    }
  }, [ticker, activeTab])

  useEffect(() => {
    const fetchProfile = async (ticker) => {
      try {
        const data = await finnhubService.getCompanyProfile(ticker)
        setProfileData(data)
      } catch (error) {
        console.error('Error fetching company profile:', error)
      }
    }
    fetchProfile(ticker)
  }, [ticker])

  useEffect(() => {
    const fetchMetrics = async (ticker) => {
      try {
        const data = await finnhubService.getMetrics(ticker)
        setMetricsData(data)
      } catch (error) {
        console.error('Error fetching key metrics:', error)
      }
    }
    fetchMetrics(ticker)
  }, [ticker])

  const setChartInterval = (interval) => {
    console.log(`Interval set to: ${interval}`)
    //console.log(`Ticker: ${ticker}`)
    setSelectedInterval(interval)
  }

  return (
    <div className="content-padding">
      <StockHeader 
        name={name}
        profileData={profileData}
        metadata={metadata}
        ticker={ticker}
        percentageChange={percentageChange}
        latest={latest}
        change={change}
        lastUpdated={timestamp}
      />
      
      <StockNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === 'overview' ? (
        <StockOverview 
          chartData={chartData}
          name={name}
          selectedInterval={selectedInterval}
          setChartInterval={setChartInterval}
          metricsData={metricsData}
          profileData={profileData}
          metadata={metadata}
        />
      ) : (
        <NewsArticles newsData={newsData} newsLoading={newsLoading} />
      )}
    </div>
  )
}

export default StockPage