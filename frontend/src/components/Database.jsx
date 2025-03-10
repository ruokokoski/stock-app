import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { stockService, finnhubService } from '../services/stockServices'
import { addToWatchlist } from '../services/watchlists'
import DatabaseTable from './DatabaseTable'
import { getColor, formatMarketCap, handleAddToWatchlist } from '../utils/helpers'

const UPDATE_LIMIT = 15

const Database = ({ setMessage, setMessageVariant }) => {
  const [stockData, setStockData] = useState([])
  const [loading, setLoading] = useState(true)
  const [sortConfig, setSortConfig] = useState({
    field: 'ticker',
    order: 'ASC'
  })

  const fetchData = useCallback(async () => {
    try {
      const items = await stockService.getAllFromDB(sortConfig)
      setStockData(items)
      setLoading(false)
    } catch (error) {
      console.error('Error:', error)
      setMessage('Error fetching stocks from database')
      setMessageVariant('danger')
      setLoading(false)
    }
  }, [setMessage, setMessageVariant, sortConfig])

  const handleSort = (field) => {
    setSortConfig(prev => ({
      field,
      order: prev.field === field && prev.order === 'ASC' ? 'DESC' : 'ASC'
    }))
  }

  const updateOldestStocks = useCallback(async () => {
    try {
      const currentStocks = await stockService.getAllFromDB(sortConfig)
      
      const oldestStocks = [...currentStocks]
        .sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt))
        .slice(0, UPDATE_LIMIT)

      console.log(`Stocks to update (${UPDATE_LIMIT} oldest): `, oldestStocks.map(stock => stock.ticker))

      const updateResults = await Promise.allSettled(
        oldestStocks.map(async (stock) => {
          await finnhubService.getTicker(stock.ticker, null, stock.name)
          await finnhubService.getMetrics(stock.ticker)
        })
      )

      updateResults.forEach((result) => {
        if (result.status === 'rejected') {
          console.error('Failed to update:', result.reason)
        }
      })

      await fetchData()
    } catch (error) {
      console.error('Update failed:', error)
      setMessage('Error during stock updates')
      setMessageVariant('danger')
    }
  }, [fetchData, setMessage, setMessageVariant])

  useEffect(() => {
    fetchData()

    const interval = setInterval(updateOldestStocks, 60000) // interval 1 min
    
    return () => clearInterval(interval)
  }, [fetchData, updateOldestStocks])

  const renderStocks = (stock) => {
    const percentageChange = stock.pchange !== null ? `${stock.pchange.toFixed(2)}%` : '-'
    const ytdChange = stock.ytdpricereturn !== null ? `${stock.ytdpricereturn.toFixed(2)}%` : '-'
    const color = getColor(percentageChange)
    const ytdcolor = getColor(ytdChange)

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

        <td style={ytdcolor}>{ytdChange}</td>
        <td>{stock.marketcap ? formatMarketCap(stock.marketcap) : '-'}</td>
        <td>{stock.pe || '-'}</td>
        <td>{stock.pb || '-'}</td>
        <td>{stock.roe ? `${stock.roe.toFixed(2)}%` : '-'}</td>
        <td>{stock.divyield ? `${stock.divyield.toFixed(2)}%` : '-'}</td>

        <td>{stock.timestamp ? new Date(stock.timestamp).toLocaleDateString() : '-'}</td>
        <td>
          <button
            onClick={() => handleAddToWatchlist(stock.ticker, setMessage, setMessageVariant)}
            style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
          >
            👁️
          </button>
        </td>
      </tr>
    )
  }

  if (loading) return (
    <div className="spinner" />
  )
    
  return (
    <div className='content-padding'>
      <h3>Stocks in own database ({stockData.length})</h3>
      {stockData.length === 0 ? (
        <div>Database is empty</div>
        ) : (
        <>
          <DatabaseTable 
            data={stockData} 
            renderRow={renderStocks}
            sortConfig={sortConfig}
            onSort={handleSort}
          />
        </>
        )}

    </div>
  )
}

export default Database