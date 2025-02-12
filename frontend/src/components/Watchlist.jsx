import { useState, useEffect } from 'react'
//import { Link } from 'react-router-dom'
import { getWatchlist } from '../services/watchlists'
import { finnhubService } from '../services/stockServices'
import StockTable from './StockTable'
import { getColor, convertUTCToLocal } from '../utils/helpers'

const STOCKS = [
  { ticker: 'V', name: 'Visa Inc.' },
]

const Watchlist = ({ setMessage, setMessageVariant }) => {
  const [stockData, setStockData] = useState({})
  const [watchlistItems, setWatchlistItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch watchlist items
        const loggedUserJSON = window.localStorage.getItem('loggedStockappUser')
        const user = JSON.parse(loggedUserJSON)
        const items = await getWatchlist(user.token)
        //console.log('Items: ', items)
        setWatchlistItems(items)

        // Fetch Finnhub data for each stock
        const newStockData = {}
        for (const item of items) {
          const { ticker, name } = item
          try {
            const data = await finnhubService.getTicker(ticker, null, name)
            newStockData[ticker] = data
          } catch (error) {
            console.error(`Error fetching ${ticker}:`, error)
          }
        }
        
        setStockData(newStockData)
        setLoading(false)
      } catch (error) {
        console.error('Error:', error)
        setMessage('Error fetching watchlist')
        setMessageVariant('danger')
        setLoading(false)
      }
    }

    fetchData()
  }, [setMessage, setMessageVariant])

  const renderStocks = ({ ticker, name }) => {
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
          <td>{stockData[ticker]?.timestamp ? convertUTCToLocal(stockData[ticker].timestamp) : '-'}</td>
          <td>-</td>
        </tr>
      )
  }

  if (loading) return <div>Loading watchlist...</div>
  if (watchlistItems.length === 0) return <div>Your watchlist is empty</div>
    
    return (
        <div className='content-padding'>
          <h3>Watchlist</h3>
          <StockTable data={watchlistItems} renderRow={renderStocks} />
        </div>
    )
}

export default Watchlist