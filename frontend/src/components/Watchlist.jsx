import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getWatchlist, deleteWatchlistItem } from '../services/watchlists'
import { finnhubService } from '../services/stockServices'
import StockTable from './StockTable'
import { getColor, convertUTCToLocal } from '../utils/helpers'
import { Modal, Button } from 'react-bootstrap'

const Watchlist = ({ setMessage, setMessageVariant }) => {
  const [stockData, setStockData] = useState({})
  const [watchlistItems, setWatchlistItems] = useState([])
  const [selectedItems, setSelectedItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)

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

  const handleCheckboxChange = (id) => {
    setSelectedItems(prevState =>
      prevState.includes(id) ? prevState.filter(itemId => itemId !== id) : [...prevState, id]
    )
  }

  const handleDelete = () => {
    setShowModal(true)
  }

  const handleClose = () => {
    setShowModal(false)
  }

  const handleConfirmDelete = async () => {
    if (selectedItems.length > 0) {
      const loggedUserJSON = window.localStorage.getItem('loggedStockappUser')
      const user = JSON.parse(loggedUserJSON)

      try {
      await Promise.all(selectedItems.map(id => deleteWatchlistItem(id, user.token)))
      setWatchlistItems(watchlistItems.filter(item => !selectedItems.includes(item.id)))
      setSelectedItems([])
      setMessage('Stock(s) removed from watchlist')
      setMessageVariant('success')
      } catch (error) {
      console.error('Error deleting item:', error)
      setMessage('Error removing stock from watchlist')
      setMessageVariant('danger')
      }
    }
    setShowModal(false)
  }

  const renderStocks = ({ id, ticker, name }) => {
    const percentageChange = stockData[ticker]?.pchange 
      ? `${stockData[ticker].pchange.toFixed(2)}%`
      : '-'
    const color = getColor(percentageChange)

    return (
      <tr key={ticker}>
        <td>{ticker}</td>
        <td>
          <Link
              to={`/stock/${ticker}`}
              state={{
              name,
              percentageChange,
              latest: stockData[ticker]?.latest.toFixed(2),
              change: stockData[ticker]?.change.toFixed(2)
              }}>
              {name}
          </Link>
        </td>
        <td>{stockData[ticker]?.latest || '-'}</td>
        <td style={color}>{percentageChange}</td>
        <td>{stockData[ticker]?.timestamp ? convertUTCToLocal(stockData[ticker].timestamp) : '-'}</td>
        <td>
          <input
              type="checkbox"
              checked={selectedItems.includes(id)}
              onChange={() => handleCheckboxChange(id)}
          />
        </td>
      </tr>
    )
  }

  if (loading) return (
    <div className="spinner" />
  )
    
  return (
    <div className='content-padding'>
      <h3>Watchlist</h3>
      {watchlistItems.length === 0 ? (
        <div>Your watchlist is empty</div>
        ) : (
        <>
          <StockTable data={watchlistItems} renderRow={renderStocks} />
          <button
          onClick={handleDelete}
          className="gradient-button"
          disabled={selectedItems.length === 0}
          >
          Remove stocks
          </button>
        </>
        )}

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
        <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to remove selected stocks from your watchlist?</Modal.Body>
        <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Cancel</Button>
        <Button variant="danger" onClick={handleConfirmDelete}>Yes</Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default Watchlist