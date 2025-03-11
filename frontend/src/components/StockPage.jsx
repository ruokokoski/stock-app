import { useParams, useLocation } from 'react-router-dom'
import { useState, useEffect, useCallback } from 'react'
import { twelvedataService, tiingoService, finnhubService, stockService } from '../services/stockServices'
import { cleanExpiredData } from '../utils/helpers'
import StockHeader from './StockHeader'
import StockOverview from './StockOverview'
import StockHistory from './StockHistory'
import StockMetrics from './StockMetrics'
import StockNavigation from './StockNavigation'
import NewsArticles from './NewsArticles'

const StockPage = ({ setMessage, setMessageVariant }) => {
  const { ticker } = useParams()
  const location = useLocation()
  const { state } = location

  const [stockData, setStockData] = useState({
    name: state?.name || '',
    percentageChange: state?.percentageChange || 0,
    latest: state?.latest || 0,
    change: state?.change || 0,
    timestamp: state?.timestamp || null,
  })

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        let newData
        const now = Date.now()
        
        if (state?.timestamp) {
          const dataTime = new Date(state.timestamp).getTime()
          if (now - dataTime > 60000) {
            console.log('Data is old, fetching fresh')
            const apiData = await finnhubService.getTicker(ticker, null, state.name)
            newData = {
              ...apiData,
              percentageChange: apiData.pchange ? `${apiData.pchange.toFixed(2)}%` : '-'
            }
          } else {
            console.log('Using fresh data from state')
            newData = {
              name: state.name,
              percentageChange: state.percentageChange,
              latest: state.latest,
              change: state.change,
              timestamp: state.timestamp
            }
          }
        } else {
          console.log('No initial data, fetching fresh')
          const apiData = await finnhubService.getTicker(ticker, null, null)
          newData = {
            ...apiData,
            percentageChange: apiData.pchange ? `${apiData.pchange.toFixed(2)}%` : '-'
          }
        }
        
        setStockData(newData)
      } catch (error) {
        console.error('Error fetching stock data:', error)
        setMessage('Failed to fetch stock data')
        setMessageVariant('danger')
        if (state) setStockData(state)
      }
    }

    fetchData()
  }, [])

  const fetchHistoricalData = useCallback(async (range) => {
    const storageKey = `historicalData-${ticker}-${range}`
    const now = Date.now()
    
    let storedData = null
    if (range !== 'custom') {
      storedData = localStorage.getItem(storageKey)
      
      if (storedData) {
        const parsedData = JSON.parse(storedData)
        const dataAge = now - parsedData.timestamp
      
        if (dataAge < 60 * 1000) { // 1 minute
          setChartData(parsedData.chartData || [])
          console.log(`Used cached data for ${ticker}, interval: ${range}`)
          return
        } else if (dataAge < 60 * 60 * 1000) { // 1 hour
          console.log('Less than 1h')
          //setChartData(parsedData.chartData || [])
        } else {
          localStorage.removeItem(storageKey)
        }
      }
    }
    try {
      let response
      if (range === 'custom') {
        if (startDate && endDate) {
          console.log(`Fetching custom range data from ${startDate} to ${endDate}`)
          response = await tiingoService.getHistorical(ticker, startDate, endDate)
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
        console.log('Range: ', range)
        response = await twelvedataService.getTicker(ticker, range)
      }
      
      if (response.chartData && response.chartData.length > 0) {
        //console.log('Setting chartData')
        setChartData(response.chartData)

        //console.log("First element:", response.chartData[0])
        //console.log("Last element:", response.chartData[response.chartData.length - 1])

        if (range !== 'custom') {
          localStorage.setItem(
            storageKey,
            JSON.stringify({
              chartData: response.chartData,
              timestamp: now
            })
          )
        }
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
      console.log('Skipping fetch: startDate or endDate is missing')
      return
    }
    console.log('Triggering fetchHistoricalData')
    fetchHistoricalData(selectedInterval)
  }, [ticker, selectedInterval, fetchHistoricalData, startDate, endDate])

  useEffect(() => {
    const fetchDescription = async (ticker) => {
      try {
        const stockMetadata = await stockService.getFromDB(ticker)
        
        if (stockMetadata?.description && stockMetadata?.exchange) {
          console.log('Using metadata from own db', stockMetadata)
          setMetadata(stockMetadata)
        } else {
          throw new Error('Incomplete data in database')
        }
      } catch (dbError) {
        console.log('Falling back to Tiingo:', dbError)
        try {
          const tiingoData = await tiingoService.getDescription(ticker)
          if (tiingoData?.description) {
            console.log('Using Tiingo metadata:', tiingoData)
            setMetadata(tiingoData)
          }
        } catch (tiingoError) {
          console.error('Both sources failed:', tiingoError)
          setMessage('Failed to load stock details')
          setMessageVariant('danger')
        }
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
        name={stockData.name}
        profileData={profileData}
        ytdPriceReturn={metricsData.ytdPriceReturn}
        metadata={metadata}
        ticker={ticker}
        percentageChange={stockData.percentageChange}
        latest={stockData.latest}
        change={stockData.change}
        lastUpdated={stockData.timestamp}
      />
      
      <StockNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === 'overview' ? (
        <StockOverview 
          chartData={chartData}
          name={stockData.name}
          selectedInterval={selectedInterval}
          setChartInterval={setChartInterval}
          metricsData={metricsData}
          profileData={profileData}
          metadata={metadata}
          //startDate={startDate}
          setStartDate={setStartDate}
          //endDate={endDate}
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
      ) : activeTab === 'metrics' ? (
        <StockMetrics 
          ticker={ticker}
          quarterlyMetrics={metricsData.quarterlyMetrics}
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