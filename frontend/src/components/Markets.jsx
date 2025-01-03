import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { twelvedataService, polygonService } from '../services/stockServices'
import { Table } from 'react-bootstrap'
import { getColor } from '../utils/helpers'

// Free plan for Twelvedata provides only US ETF tickers e.g. SPX and QQQ now outdated!
const TWELVEDATA_TICKERS = [
  { ticker: 'SPY', name: 'S&P 500 (SPY)', flag: '🇺🇸' },
  //{ ticker: 'SPX', name: 'S&P 500', flag: '🇺🇸' },
  //{ ticker: 'QQQ', name: 'Nasdaq (QQQ)', flag: '🇺🇸' },
  //{ ticker: 'NDX', name: 'Nasdaq Composite', flag: '🇺🇸' },
  //{ ticker: 'DJI', name: 'Dow Jones', flag: '🇺🇸' },
  //{ ticker: 'RUT', name: 'Russell 2000', flag: '🇺🇸' },
  //{ ticker: 'FTSE', name: 'FTSE100', flag: '🇺🇸' },
]

// Polygon tickers are not real-time
const POLYGON_TICKERS = [
  { ticker: 'I:OMXHPI', name: 'OMX Helsinki PI', flag: '🇫🇮' },
  //{ ticker: 'I:OMXS30', name: 'OMX Stockholm 30', flag: '🇸🇪' },
  //{ ticker: 'I:NQJP', name: 'Nasdaq Japan Index', flag: '🇯🇵' },
]

const Markets = () => {
  const [marketData, setMarketData] = useState({})

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
          }
        }
      }
  
      await fetchTickerData(TWELVEDATA_TICKERS, async (ticker) => twelvedataService.getTicker(ticker, '1m'))
      await fetchTickerData(POLYGON_TICKERS, async (ticker) => polygonService.getTicker(ticker))
  
      setMarketData(newMarketData)
    }
    fetchData()
  }, [])

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
        <td>{marketData[ticker]?.latest?.datetime || '-'}</td>
      </tr>
    ))
  }

  return (
    <div className='content-padding'>
      <h2>Markets overview</h2>
      <Table striped bordered hover style={{ width: '80%', maxWidth: '1200px' }}>
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
    </div>
  )
}

export default Markets