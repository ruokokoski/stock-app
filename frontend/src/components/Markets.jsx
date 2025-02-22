import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { twelvedataService, polygonService, finnhubService } from '../services/stockServices'
import { Table } from 'react-bootstrap'
import { getColor, convertUTCToLocal } from '../utils/helpers'
import NewsArticles from './NewsArticles'

// Free plan for Twelvedata provides only US ETF tickers e.g. SPX and QQQ now outdated!
const TWELVEDATA_TICKERS = [
  { ticker: 'SPY', name: 'S&P 500 (SPY ETF)', flag: '🇺🇸' },
  //{ ticker: 'ADYEN:Euronext', name: 'Adyen N.V.', flag: '🇳🇱' },
  //{ ticker: '005930:KRX', name: 'Samsumg Electronics Co.', flag: '🇰🇷' },
]

// Polygon tickers are not real-time
const POLYGON_TICKERS = [
  { ticker: 'I:OMXHPI', name: 'OMX Helsinki PI', flag: '🇫🇮' },
  { ticker: 'I:OMXS30', name: 'OMX Stockholm 30', flag: '🇸🇪' },
  //{ ticker: 'I:NQJP', name: 'Nasdaq Japan Index', flag: '🇯🇵' },
]

const Markets = ({ setMessage, setMessageVariant }) => {
  const [marketData, setMarketData] = useState(() => {
    const initialMarketData = {}
    const allTickers = [...TWELVEDATA_TICKERS, ...POLYGON_TICKERS]
    allTickers.forEach(({ ticker }) => {
      const storedData = localStorage.getItem(`market-${ticker}`)
      if (storedData) {
        initialMarketData[ticker] = JSON.parse(storedData).data
      }
    })
    return initialMarketData
  })
  const [newsData, setNewsData] = useState([])
  const [newsLoading, setNewsLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const newMarketData = { ...marketData }
      const now = Date.now()
      const expirationTime = 60 * 1000 // 1 minute

      const fetchTickerData = async (tickers, fetchService) => {
        for (const { ticker } of tickers) {
          const storageKey = `market-${ticker}`
          const storedData = localStorage.getItem(storageKey)

          if (!storedData || (storedData && now - JSON.parse(storedData).timestamp > expirationTime)) {
            try {
              const data = await fetchService(ticker)
              const dataWithTimestamp = {
                ...data,
                timestamp: now,
              }
              localStorage.setItem(
                storageKey,
                JSON.stringify({
                  data: dataWithTimestamp,
                  timestamp: now,
                })
              )
              newMarketData[ticker] = dataWithTimestamp
              console.log('Data was fetched from API')
            } catch (error) {
              console.log(`Error fetching ${ticker} data:`, error)
              newMarketData[ticker] = {
                latest: { close: '-', datetime: '-' },
                previous: { close: '-', percentageChange: '-' },
                timestamp: now,
              }
              setMessage(`Error fetching ${ticker} data`)
              setMessageVariant('danger')
            }
          }
        }
      }

      await fetchTickerData(TWELVEDATA_TICKERS, async (ticker) => twelvedataService.getTicker(ticker, '1y'))
      await fetchTickerData(POLYGON_TICKERS, async (ticker) => polygonService.getTicker(ticker))

      setMarketData(newMarketData)
    }

    fetchData()
  }, [setMessage, setMessageVariant])

  useEffect(() => {
    const fetchNewsData = async () => {
      setNewsLoading(true)
      try {
        const data = await finnhubService.getMarketNews()
        setNewsData(data)
        setNewsLoading(false)
      } catch (error) {
        console.error('Error fetching news from Finnhub:', error)
        setMessage('Error fetching news from Finnhub')
        setMessageVariant('danger')
      }
    }
    fetchNewsData()
  }, [setMessage, setMessageVariant])

  const renderTableRows = (tickers) => {
    return tickers.map(({ ticker, name, flag }) => (
      <tr key={ticker}>
        <td>
          <span>{flag} </span>
          <Link
            to={`/index/${ticker}`}
            state={{
              name,
              percentageChange: marketData[ticker]?.previous?.percentageChange,
              chartData: marketData[ticker]?.chartData,
            }}>
            {name}
          </Link>
        </td>
        <td>{marketData[ticker]?.latest?.close || '-'}</td>
        <td style={getColor(marketData[ticker]?.previous?.percentageChange)}>
          {marketData[ticker]?.previous?.percentageChange || '-'}
        </td>
        <td>{convertUTCToLocal(marketData[ticker]?.latest?.datetime.split('T')[0]).split(',')[0] || '-'}</td>
      </tr>
    ))
  }

  return (
    <div className='content-padding'>
      <h3>Markets overview</h3>
      <Table striped bordered hover style={{ width: '100%' }}>
        <thead>
          <tr>
            <th style={{ width: '36%' }}>Index</th>
            <th style={{ width: '19%' }}>Points</th>
            <th style={{ width: '19%' }}>% Change</th>
            <th style={{ width: '26%' }}>Date/Time</th>
          </tr>
        </thead>
        <tbody>
          {renderTableRows(TWELVEDATA_TICKERS)}
          {renderTableRows(POLYGON_TICKERS)}
        </tbody>
      </Table>

      <h3>Latest News</h3>
      <NewsArticles newsData={newsData} newsLoading={newsLoading} />
    </div>
  )
}

export default Markets