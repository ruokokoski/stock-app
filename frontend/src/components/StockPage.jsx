import { useParams, useLocation } from 'react-router-dom'
import { useState, useEffect, useCallback } from 'react'
import { twelvedataService, tiingoService, finnhubService } from '../services/stockServices'
import { cleanExpiredData } from '../utils/helpers'
import StockHeader from './StockHeader'
import StockOverview from './StockOverview'
import StockHistory from './StockHistory'
import StockNavigation from './StockNavigation'
import NewsArticles from './NewsArticles'

const StockPage = ({ setMessage, setMessageVariant }) => {
  const { ticker } = useParams()
  const location = useLocation()
  const { name, percentageChange, latest, change, timestamp } = location.state || {}
  const [chartData, setChartData] = useState([])
  const [selectedInterval, setSelectedInterval] = useState('1y')
  const [metadata, setMetadata] = useState([])
  const [activeTab, setActiveTab] = useState('overview')
  const [newsData, setNewsData] = useState([])
  const [newsLoading, setNewsLoading] = useState(false)
  const [profileData, setProfileData] = useState([])
  const [metricsData, setMetricsData] = useState([])
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

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
        console.log(`Used cached data for ${ticker}, interval: ${range}`)
        return
      } else if (now - parsedData.timestamp < longExpirationTime) {
        setChartData(parsedData.chartData || [])
      } else {
        localStorage.removeItem(storageKey)
      }
    }
    try {
      let response
      if (range === 'custom') {
        if (startDate && endDate) {
          response = await tiingoService.getHistorical(ticker, startDate, endDate);
        } else return
      }
      else if (range === 'YTD') {
        const today = new Date()
        const currentYear = today.getFullYear()
        const startDate = `${currentYear}-01-01`
        const month = String(today.getMonth() + 1).padStart(2, '0')
        const day = String(today.getDate()).padStart(2, '0')
        const endDate = `${currentYear}-${month}-${day}`
        response = await tiingoService.getHistorical(ticker, startDate, endDate)
      } else {
        response = await twelvedataService.getTicker(ticker, range)
      }
      
      if (response.chartData && response.chartData.length > 0) {
        setChartData(response.chartData)

        localStorage.setItem(storageKey, JSON.stringify({
            chartData: response.chartData,
            timestamp: now
        }))
      }
      console.log('Chart data was fetched from API')
    } catch (error) {
      console.error(`Error fetching data for ${ticker}:`, error)
      if (!storedData) {
        setChartData([])
      }
    }
  }, [ticker, startDate, endDate])

  useEffect(() => {
    cleanExpiredData()
    if (selectedInterval === 'custom' && (!startDate || !endDate)) {
      //console.log('Skipping fetch: startDate or endDate is missing')
      return
    }
    fetchHistoricalData(selectedInterval)
  }, [ticker, selectedInterval, fetchHistoricalData, startDate, endDate])

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
    setSelectedInterval(interval)
    if (interval !== 'custom') {
      setStartDate('')
      setEndDate('')
    }
  }

  return (
    <div className="content-padding">
      <StockHeader 
        name={name}
        profileData={profileData}
        ytdPriceReturn={metricsData.ytdPriceReturn}
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
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
        />
      ) : activeTab === 'history' ? (
        <StockHistory 
          ticker={ticker}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          setChartInterval={setChartInterval}
          chartData={chartData}
          selectedInterval={selectedInterval}
          setMessage={setMessage}
          setMessageVariant={setMessageVariant}
        />
      ) : (
        <NewsArticles newsData={newsData} newsLoading={newsLoading} />
      )}
    </div>
  )
}

export default StockPage