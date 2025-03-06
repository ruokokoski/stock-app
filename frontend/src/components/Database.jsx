import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { stockService, finnhubService } from '../services/stockServices'
import { addToWatchlist } from '../services/watchlists'
import StockTable from './StockTable'
import { getColor, convertUTCToLocal } from '../utils/helpers'

const WATCHLIST_COUNT = 30

const Database = ({ setMessage, setMessageVariant }) => {
  const [stockData, setStockData] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    try {
      const items = await stockService.getAllFromDB()
      setStockData(items)
      setLoading(false)
    } catch (error) {
      console.error('Error:', error)
      setMessage('Error fetching stocks from database')
      setMessageVariant('danger')
      setLoading(false)
    }
  }, [setMessage, setMessageVariant])

  const updateOldestStocks = useCallback(async () => {
    try {
      const currentStocks = await stockService.getAllFromDB()
      
      const oldestStocks = [...currentStocks]
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
        .slice(0, 25)

      console.log('Stocks to update (25 oldest timestamps):', oldestStocks.map(stock => stock.ticker))

      const updateResults = await Promise.allSettled(
        oldestStocks.map(stock => 
          finnhubService.getTicker(stock.ticker, null, stock.name)
        )
      )

      updateResults.forEach((result, index) => {
        if (result.status === 'rejected') {
          console.error('Failed to update:', oldestStocks[index].ticker, result.reason)
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

  const handleAddToWatchlist = async (ticker) => {
    try {
      const loggedUserJSON = window.localStorage.getItem('loggedStockappUser')
      const user = JSON.parse(loggedUserJSON)

      const currentWatchlist = JSON.parse(localStorage.getItem('watchlist') || '[]')
      //console.log('Watchlist length: ', currentWatchlist.length)

      if (currentWatchlist.length >= WATCHLIST_COUNT) {
        setMessage(`Watchlist limit reached (${WATCHLIST_COUNT} stocks). Remove some stocks first.`)
        setMessageVariant('warning')
        window.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }

      await addToWatchlist(ticker, user.token)
      setMessage(`Added ${ticker} to your watchlist`)
      setMessageVariant('success')
      window.scrollTo({ top: 0, behavior: 'smooth' })

      const newWatchlist = [...currentWatchlist, { ticker }]
      localStorage.setItem('watchlist', JSON.stringify(newWatchlist))
    } catch (error) {
      console.error('Error adding to watchlist:', error)
      const errorMessage = error.response?.data?.error || 'Failed to add to watchlist'
      setMessage(errorMessage)
      setMessageVariant('danger')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

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
        <td>
          <button
            onClick={() => handleAddToWatchlist(stock.ticker)}
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
          <StockTable data={stockData} renderRow={renderStocks} />
        </>
        )}

    </div>
  )
}

export default Database