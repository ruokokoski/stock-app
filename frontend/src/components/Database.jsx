import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { stockService, finnhubService } from '../services/stockServices'
import StockTable from './StockTable'
import { getColor, convertUTCToLocal } from '../utils/helpers'

const Database = ({ setMessage, setMessageVariant }) => {
  const [stockData, setStockData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const items = await stockService.getAllFromDB()
        //console.log('Items: ', items)

        setStockData(items)
        setLoading(false)
      } catch (error) {
        console.error('Error:', error)
        setMessage('Error fetching stocks from database')
        setMessageVariant('danger')
        setLoading(false)
      }
    }

    fetchData()
  }, [setMessage, setMessageVariant])

  const renderStocks = (stock) => {
    const percentageChange = stock.pchange !== null ? `${stock.pchange.toFixed(2)}%` : '-'
    const color = getColor(percentageChange)

    return (
      <tr key={stock.ticker}>
        <td>{stock.ticker}</td>
        <td>
          <Link
            to={`/stock/${stock.ticker}`}
            state={{
              name: stock.name,
              percentageChange,
              latest: stock.latest?.toFixed(2),
              change: stock.change?.toFixed(2),
              timestamp: stock.timestamp
            }}>
            {stock.name}
          </Link>
        </td>
        <td>{stock.latest || '-'}</td>
        <td style={color}>{percentageChange}</td>
        <td>{stock.timestamp ? convertUTCToLocal(stock.timestamp) : '-'}</td>
      </tr>
    )
  }

  if (loading) return (
    <div className="spinner" />
  )
    
  return (
    <div className='content-padding'>
      <h3>Stocks in own database</h3>
      {stockData.length === 0 ? (
        <div>Database is empty</div>
        ) : (
        <>
          <StockTable data={stockData} renderRow={renderStocks} />
        </>
        )}

    </div>
  )
}

export default Database