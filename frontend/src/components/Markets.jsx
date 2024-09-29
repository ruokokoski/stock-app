import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import twelvedataService from '../services/twelvedata'
import polygonService from '../services/polygon'
import { Table } from 'react-bootstrap'
import { getColor } from '../utils/helpers'

// Free plan for Twelvedata provides only US indices
const TICKERS = [
  //{ ticker: 'SPX', name: 'S&P 500', flag: '🇺🇸' },
  //{ ticker: 'NDX', name: 'Nasdaq Composite', flag: '🇺🇸' },
  //{ ticker: 'DJI', name: 'Dow Jones', flag: '🇺🇸' },
  //{ ticker: 'RUT', name: 'Russell 2000', flag: '🇺🇸' },
]

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

      for (const { ticker } of TICKERS) {
        try {
          const data = await twelvedataService.getTicker(ticker, '1m')
          //console.log(`${ticker} data:`, data)
          //console.log(`Percentage Change for ${ticker}:`, data.previous?.percentageChange)
          newMarketData[ticker] = data
        } catch (error) {
          console.error(`Error fetching ${ticker} data:`, error)
          newMarketData[ticker] = {
            latest: { close: '-', datetime: '-' },
            previous: { close: '-', percentageChange: '-' },
          }
        }
      }

      for (const { ticker } of POLYGON_TICKERS) {
        try {
          const data = await polygonService.getTicker(ticker)
          //console.log(`${ticker} Polygon data:`, data)
          newMarketData[ticker] = data
        } catch (error) {
          console.error(`Error fetching ${ticker} data:`, error)
          newMarketData[ticker] = {
            latest: { close: '-', datetime: '-' },
            previous: { close: '-', percentageChange: '-' },
          }
        }
      }

      setMarketData(newMarketData)
    }
    fetchData()
  }, [])

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
          {TICKERS.map(({ ticker, name, flag }) => (
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
          ))}
          {POLYGON_TICKERS.map(({ ticker, name, flag }) => (
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
          ))}
        </tbody>
      </Table>
    </div>
  )
}

export default Markets