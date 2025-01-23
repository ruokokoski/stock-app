import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { twelvedataService, polygonService, finnhubService } from '../services/stockServices'
import { Table } from 'react-bootstrap'
import { getColor, convertUTCToLocal } from '../utils/helpers'

// Free plan for Twelvedata provides only US ETF tickers e.g. SPX and QQQ now outdated!
const TWELVEDATA_TICKERS = [
  { ticker: 'SPY', name: 'S&P 500 (SPY)', flag: '🇺🇸' },
  //{ ticker: 'ADYEN:Euronext', name: 'Adyen N.V.', flag: '🇳🇱' },
  //{ ticker: '005930:KRX', name: 'Samsumg Electronics Co.', flag: '🇰🇷' },
]

// Polygon tickers are not real-time
const POLYGON_TICKERS = [
  { ticker: 'I:OMXHPI', name: 'OMX Helsinki PI', flag: '🇫🇮' },
  //{ ticker: 'I:OMXS30', name: 'OMX Stockholm 30', flag: '🇸🇪' },
  //{ ticker: 'I:NQJP', name: 'Nasdaq Japan Index', flag: '🇯🇵' },
]

const Markets = ({ setMessage, setMessageVariant }) => {
  const [marketData, setMarketData] = useState({})
  const [newsData, setNewsData] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const newMarketData = {}
      const fetchTickerData = async (tickers, fetchService) => {
        for (const { ticker } of tickers) {
          try {
            const data = await fetchService(ticker)
            newMarketData[ticker] = data
          } catch (error) {
            console.error(`Error fetching ${ticker} data:`, error)
            newMarketData[ticker] = {
              latest: { close: '-', datetime: '-' },
              previous: { close: '-', percentageChange: '-' },
            }
            setMessage(`Error fetching ${ticker} data`)
            setMessageVariant('danger')
          }
        }
      }
  
      await fetchTickerData(TWELVEDATA_TICKERS, async (ticker) => twelvedataService.getTicker(ticker, '1m'))
      await fetchTickerData(POLYGON_TICKERS, async (ticker) => polygonService.getTicker(ticker))
  
      setMarketData(newMarketData)
    }
    fetchData()
  }, [setMessage, setMessageVariant])

  useEffect(() => {
    const fetchNewsData = async () => {
      try {
        const data = await finnhubService.getMarketNews()
        setNewsData(data)
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

  const renderNewsArticles = () => {
    return newsData.map((article) => (
      <div key={article.id} className="news-article">
        <p><strong>
          <span className="news-date">{convertUTCToLocal(article.datetime)}</span>
          <span className="news-headline">
            <a href={article.url} target="_blank" rel="noopener noreferrer">{article.headline}</a>
          </span>
        </strong></p>
        <p>Source: <em>{article.source}</em></p>
        <p>{article.summary}</p>
        <hr />
      </div>
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
      <div className="news-section">
        {renderNewsArticles()}
      </div>
    </div>
  )
}

export default Markets