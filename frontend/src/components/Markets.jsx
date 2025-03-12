import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { twelvedataService, polygonService, finnhubService, scrapeService } from '../services/stockServices'
import { Table } from 'react-bootstrap'
import { getColor, convertUTCToLocal } from '../utils/helpers'
import NewsArticles from './NewsArticles'

// Free plan for Twelvedata provides only US ETF tickers e.g. SPX and QQQ now outdated!
const TWELVEDATA_TICKERS = [
  { ticker: 'SPY', name: 'SPDR S&P 500 ETF Trust', flag: '🇺🇸' },
]

// Polygon tickers are not real-time
const POLYGON_TICKERS = [
  { ticker: 'I:OMXHPI', name: 'OMX HELSINKI PI', flag: '🇫🇮' },
  { ticker: 'I:OMXS30', name: 'OMX STOCKHOLM 30', flag: '🇸🇪' },
]

const Markets = ({ setMessage, setMessageVariant }) => {
  const [marketData, setMarketData] = useState({})
  const [scrapedIndices, setScrapedIndices] = useState([])
  const [newsData, setNewsData] = useState([])
  const [marketLoading, setMarketLoading] = useState(false)
  const [newsLoading, setNewsLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const newMarketData = { }
      const now = Date.now()
      const expirationTime = 60 * 1000 // 1 minute

      const fetchTickerData = async (tickers, fetchService) => {
        for (const { ticker } of tickers) {
          const storageKey = `market-${ticker}`
          const storedData = localStorage.getItem(storageKey)

          try {
            if (storedData) {
              const parsedData = JSON.parse(storedData)
              if (now - parsedData.timestamp <= expirationTime) {
                newMarketData[ticker] = parsedData.data
                console.log('Data was fresh')
                continue
              }
            }

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
            console.log('Data fetched from API for', ticker)
          } catch (error) {
            console.error(`Error fetching ${ticker} data:`, error)
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

      await fetchTickerData(TWELVEDATA_TICKERS, async (ticker) => twelvedataService.getTicker(ticker, '1y'))
      await fetchTickerData(POLYGON_TICKERS, async (ticker) => polygonService.getTicker(ticker))

      setMarketData(newMarketData)
    }

    fetchData()
  }, [setMessage, setMessageVariant])

  //web scraping:
  useEffect(() => {
    const fetchScrapedIndices = async () => {
      setMarketLoading(true)
      try {
        const data = await scrapeService.scrapeIndices()
        const updatedData = data.map((index) => {
          return {
            ...index,
            flag:
              index.name.includes('OMX HELSINKI PI') ? '🇫🇮' :
              index.name.includes('DAX') ? '🇩🇪' :
              index.name.includes('STOXX EUROPE 600') ? '🇪🇺' :
              index.name.includes('NASDAQ 100') ? '🇺🇸' :
              index.name.includes('S&P 500') ? '🇺🇸' :
              '',
          }
        })
        setMarketLoading(false)
        setScrapedIndices(updatedData)
      } catch (error) {
        console.error('Error scraping indices:', error)
        setMessage('Error scraping indices')
        setMessageVariant('danger')
      }
    }
    fetchScrapedIndices()
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
      {marketLoading ? (
        <div className="spinner" />
      ) : (
        <Table striped bordered hover style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>Index</th>
              <th>Price</th>
              <th>% Change</th>
            </tr>
          </thead>
          <tbody>
            {scrapedIndices.map((index, idx) => (
              <tr key={idx}>
                <td>
                  <span>{index.flag} </span>
                  {index.name}
                </td>
                <td>{index.price}</td>
                <td style={getColor(index.change)}>{index.change}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <h3>Historical data</h3>
      <Table striped bordered hover style={{ width: '100%' }}>
        <thead>
          <tr>
            <th style={{ width: '36%' }}>Index</th>
            <th style={{ width: '19%' }}>Price</th>
            <th style={{ width: '19%' }}>% Change</th>
            <th style={{ width: '26%' }}>Date/Time</th>
          </tr>
        </thead>
        <tbody>
          {renderTableRows(POLYGON_TICKERS)}
          {renderTableRows(TWELVEDATA_TICKERS)}
        </tbody>
      </Table>

      <h3>Financial News</h3>
      <NewsArticles newsData={newsData} newsLoading={newsLoading} />
    </div>
  )
}

export default Markets