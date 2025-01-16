import { useState, useEffect } from 'react'
//import { Link } from 'react-router-dom'
import { finnhubService } from '../services/stockServices'
import { Table } from 'react-bootstrap'
import { getColor } from '../utils/helpers'

const COMMON_STOCKS = [
  /*
  { ticker: 'AAPL', name: 'Apple Inc.' },
  { ticker: 'AMZN', name: 'Amazon.com Inc.' },
  { ticker: 'AVGO', name: 'Broadcom Inc.' },
  { ticker: 'BAC', name: 'Bank of America Corp.' },
  { ticker: 'COST', name: 'Costco Wholesale Corp.' },
  { ticker: 'CRM', name: 'Salesforce Inc.' },
  { ticker: 'CRWD', name: 'CrowdStrike Holdings Inc.' },
  { ticker: 'DIS', name: 'Walt Disney Co.' },
  { ticker: 'F', name: 'Ford Motor Co.' },
  { ticker: 'GOOGL', name: 'Alphabet Inc.' },
  { ticker: 'JPM', name: 'JPMorgan Chase & Co.' },
  { ticker: 'KO', name: 'Coca-Cola Co.' },
  { ticker: 'MCD', name: 'McDonald\'s Corp.' },
  { ticker: 'META', name: 'Meta Platforms Inc.' },
  { ticker: 'MSFT', name: 'Microsoft Corp.' },
  { ticker: 'NFLX', name: 'Netflix Inc.' },
  { ticker: 'NKE', name: 'Nike Inc.' },
  { ticker: 'NVDA', name: 'NVIDIA Corp.' },
  { ticker: 'PFE', name: 'Pfizer Inc.' },
  { ticker: 'PG', name: 'Procter & Gamble Co.' },
  { ticker: 'PLTR', name: 'Palantir Technologies Inc.' },
  { ticker: 'PYPL', name: 'PayPal Holdings Inc.' },
  { ticker: 'V', name: 'Visa Inc.' },
  */
  { ticker: 'WMT', name: 'Walmart Inc.' },
]

const Stocks = ({ setMessage, setMessageVariant }) => {
  const [stockData, setStockData] = useState({})

  useEffect(() => {
    const fetchData = async () => {
      const newStockData = {}

      const fetchFinnhubData = async (ticker, name) => {
        try {
          const data = await finnhubService.getTicker(ticker, null, name)
          //console.log('Finnhub data:', data)
          newStockData[ticker] = data
        } catch (error) {
          console.error('Error fetching data from Finnhub:', error)
          setMessage('Error fetching data from Finnhub')
          setMessageVariant('danger')
        }
      }

      for (const { ticker, name } of COMMON_STOCKS) {
        await fetchFinnhubData(ticker, name)
      }

      setStockData(newStockData)
    }

    fetchData()
  }, [])

  const renderTableRows = () => {
    return COMMON_STOCKS.map(({ ticker, name }) => {
      const percentageChange = stockData[ticker]?.pchange 
        ? `${stockData[ticker].pchange.toFixed(2)}%`
        : '-'
      const color = getColor(percentageChange)

      return (
        <tr key={ticker}>
          <td>{ticker}</td>
          <td>{name}</td>
          <td>{stockData[ticker]?.latest || '-'}</td>
          <td style={color}>{percentageChange}</td>
          <td>{stockData[ticker]?.timestamp || '-'}</td>
        </tr>
      )
    })
  }

  return (
    <div className='content-padding'>
      <h4>Common US stocks</h4>
      <Table striped bordered hover style={{ width: '100%' }}>
        <thead>
        <tr>
          <th style={{ width: '10%' }}>Ticker</th>
          <th style={{ width: '35%' }}>Name</th>
          <th style={{ width: '15%' }}>Price</th>
          <th style={{ width: '15%' }}>% Change</th>
          <th style={{ width: '30%' }}>Date/Time</th>
        </tr>
        </thead>
        <tbody>
          {renderTableRows()}
        </tbody>
      </Table>
    </div>
  )
}

export default Stocks