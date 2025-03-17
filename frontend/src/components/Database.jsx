import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { stockService, finnhubService } from '../services/stockServices'
import DatabaseTable from './DatabaseTable'
import { getColor, formatMarketCap, handleAddToWatchlist } from '../utils/helpers'

const UPDATE_LIMIT = 15 // Finnhub rate limit: 60 calls/min and 30 calls/sec

const Database = ({ setMessage, setMessageVariant }) => {
  const [stockData, setStockData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [loading, setLoading] = useState(true)
  const [sortConfig, setSortConfig] = useState({
    field: 'ticker',
    order: 'ASC'
  })
  const [filters, setFilters] = useState({
    pe: { min: '', max: '' },
    pb: { min: '', max: '' },
    roe: { min: '', max: '' },
    divyield: { min: '', max: '' }
  })
  const [showFilters, setShowFilters] = useState(false)

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

  useEffect(() => {
    const filterStocks = () => {
      return stockData.filter(stock => {
        const passesPE = checkFilter(stock.pe, filters.pe)
        const passesPB = checkFilter(stock.pb, filters.pb)
        const passesROE = checkFilter(stock.roe, filters.roe)
        const passesDiv = checkFilter(stock.divyield, filters.divyield)
        return passesPE && passesPB && passesROE && passesDiv
      })
    }
    
    setFilteredData(filterStocks())
  }, [stockData, filters])

  const checkFilter = (value, { min, max }) => {
    if (min === '' && max === '') return true
    
    if (value === '-' || value === null || value === undefined) {
      return false
    }

    const numValue = Number(value)
    if (isNaN(numValue)) return false
    const minVal = min !== '' ? Number(min) : -Infinity
    const maxVal = max !== '' ? Number(max) : Infinity
    return numValue >= minVal && numValue <= maxVal
  }

  const handleFilterChange = (field, type, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: { ...prev[field], [type]: value }
    }))
  }

  const toggleFilters = () => {
    setShowFilters(prev => {
      if (prev) {
        setFilters({
          pe: { min: '', max: '' },
          pb: { min: '', max: '' },
          roe: { min: '', max: '' },
          divyield: { min: '', max: '' }
        })
      }
      return !prev
    })
  }

  const renderFilters = () => {
    if (!showFilters) return null

    return (
    <div className="filter-container">
      {['pe', 'pb', 'roe', 'divyield'].map((field) => (
        <div key={field} className="filter-group">
          <label>{field.toUpperCase()}</label>
          <input
            type="number"
            placeholder="Min"
            value={filters[field].min}
            onChange={(e) => handleFilterChange(field, 'min', e.target.value)}
          />
          <input
            type="number"
            placeholder="Max"
            value={filters[field].max}
            onChange={(e) => handleFilterChange(field, 'max', e.target.value)}
          />
        </div>
      ))}
    </div>
    )
  }

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
  }, [fetchData, setMessage, setMessageVariant, sortConfig])

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
      <h3>Stocks in own database: {stockData.length}</h3>

      <button
        className="gradient-button"
        onClick={toggleFilters}
        style={{ marginBottom: '1rem' }}
      >
        {showFilters ? 'Hide filters' : 'Filter data'}
      </button>

      {renderFilters()}

      {filteredData.length !== stockData.length && (
        <div className="filtered-count" style={{ margin: '10px 0', color: '#666' }}>
          Showing {filteredData.length} stocks matching filters
        </div>
      )}

      {stockData.length === 0 ? (
        <div>Database is empty</div>
        ) : (
        <>
          <DatabaseTable 
            data={filteredData} 
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