import { useState, useEffect } from 'react'
//import { Link } from 'react-router-dom'
import { tiingoService } from '../services/stockServices'
import { Table } from 'react-bootstrap'
import { getColor } from '../utils/helpers'

const COMMON_STOCKS = [
  /*
  { ticker: 'AAPL', name: 'Apple Inc.' },
  { ticker: 'ABBV', name: 'AbbVie Inc.' },
  { ticker: 'AMD', name: 'Advanced Micro Devices Inc.' },
  { ticker: 'AMZN', name: 'Amazon.com Inc.' },
  { ticker: 'AVGO', name: 'Broadcom Inc.' },
  { ticker: 'BAC', name: 'Bank of America Corp.' },
  { ticker: 'COST', name: 'Costco Wholesale Corp.' },
  { ticker: 'CRM', name: 'Salesforce Inc.' },
  { ticker: 'GOOGL', name: 'Alphabet Inc.' },
  { ticker: 'JPM', name: 'JPMorgan Chase & Co.' },
  { ticker: 'KO', name: 'Coca-Cola Co.' },
  { ticker: 'META', name: 'Meta Platforms Inc.' },
  { ticker: 'MSFT', name: 'Microsoft Corp.' },
  { ticker: 'NVDA', name: 'NVIDIA Corp.' },
  { ticker: 'PFE', name: 'Pfizer Inc.' },
  { ticker: 'T', name: 'AT&T Inc.' },
  { ticker: 'TSLA', name: 'Tesla Inc.' },
  { ticker: 'UNH', name: 'UnitedHealth Group Inc.' },
  { ticker: 'V', name: 'Visa Inc.' },
  */
  { ticker: 'WMT', name: 'Walmart Inc.' },
]

const Stocks = () => {
  const [stockData, setStockData] = useState({})

  useEffect(() => {
    const fetchData = async () => {
      const newStockData = {}

      const fetchTickerData = async (ticker) => {
        try {
          const data = await tiingoService.getTicker(ticker)
          newStockData[ticker] = data
        } catch (error) {
          console.error(`Error fetching ${ticker} data:`, error)
          newStockData[ticker] = [{ latest: '-', percentageChange: '-', datetime: '-' }]
        }
      }

      for (const { ticker } of COMMON_STOCKS) {
        await fetchTickerData(ticker)
      }

      setStockData(newStockData)
    }

    fetchData()
  }, [])

  const renderTableRows = () => {
    return COMMON_STOCKS.map(({ ticker, name }) => {
      const percentageChange = stockData[ticker]?.percentageChange || '-'
      const color = getColor(percentageChange)

      return (
        <tr key={ticker}>
          <td>{ticker}</td>
          <td>{name}</td>
          <td>{stockData[ticker]?.latest || '-'}</td>
          <td style={color}>{percentageChange}</td>
          <td>{stockData[ticker]?.datetime || '-'}</td>
        </tr>
      )
    })
  }

  return (
    <div className='content-padding'>
      <h4>Common US stocks</h4>
      <Table striped bordered hover style={{ width: '80%', maxWidth: '1500px' }}>
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