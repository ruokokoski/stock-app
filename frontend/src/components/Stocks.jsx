import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { finnhubService } from '../services/stockServices'
import { addToWatchlist } from '../services/watchlists'
import StockTable from './StockTable'
import SearchForm from './SearchForm'
import { getColor, convertUTCToLocal, handleAddToWatchlist } from '../utils/helpers'

const COMMON_STOCKS = [
  { ticker: 'AAPL', name: 'Apple Inc.' },
  { ticker: 'CRM', name: 'Salesforce Inc.' },
  { ticker: 'CRWD', name: 'CrowdStrike Holdings Inc.' },
  { ticker: 'DIS', name: 'Walt Disney Co.' },
  { ticker: 'GOOGL', name: 'Alphabet Inc.' },
  { ticker: 'JPM', name: 'JPMorgan Chase & Co.' },
  { ticker: 'KO', name: 'Coca-Cola Co.' },
  { ticker: 'MSFT', name: 'Microsoft Corp.' },
  { ticker: 'NFLX', name: 'Netflix Inc.' },
  { ticker: 'NKE', name: 'Nike Inc.' },
  { ticker: 'NVDA', name: 'NVIDIA Corp.' },
  { ticker: 'PFE', name: 'Pfizer Inc.' },
  { ticker: 'PLTR', name: 'Palantir Technologies Inc.' },
  { ticker: 'V', name: 'Visa Inc.' },
  { ticker: 'WMT', name: 'Walmart Inc.' },
]

const Stocks = ({ setMessage, setMessageVariant }) => {
  const [stockData, setStockData] = useState(() => {
    const initialStockData = {}
    COMMON_STOCKS.forEach(({ ticker }) => {
      const storedData = localStorage.getItem(`stock-${ticker}`)
      if (storedData) {
        initialStockData[ticker] = JSON.parse(storedData).data
      }
    })
    return initialStockData
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searchLoading, setSearchLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const newStockData = { ...stockData }
      const now = Date.now()
      const expirationTime = 60 * 1000 // 1 min
      for (const { ticker, name } of COMMON_STOCKS) {
        const storageKey = `stock-${ticker}`
        const storedData = localStorage.getItem(storageKey)

        if (!storedData || (storedData && now - JSON.parse(storedData).timestamp > expirationTime)) {
          try {
            const data = await finnhubService.getTicker(ticker, null, name)
            const dataWithTimestamp = {
              ...data,
              //timestamp: now,
            }
            localStorage.setItem(
              storageKey,
              JSON.stringify({
                data: dataWithTimestamp,
                timestamp: now,
              })
            )
            newStockData[ticker] = dataWithTimestamp
          } catch (error) {
            console.error('Error fetching data from Finnhub:', error)
            setMessage('Error fetching data from Finnhub')
            setMessageVariant('danger')
          }
        }
      }
      
      setStockData(newStockData)
    }

    fetchData()
  }, [setMessage, setMessageVariant])

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setMessage('Search query is required')
      setMessageVariant('danger')
      return
    }

    setSearchLoading(true)

    try {
      const response = await finnhubService.searchSymbol(searchTerm)
      //console.log('Search response:', response.result)

      if (response.message) {
        setMessage(response.message)
        setMessageVariant('warning')
      } else {
        setSearchResults(response.result)
      }
      setSearchLoading(false)
    } catch (error) {
      console.error('Error searching for symbols:', error)
      const errorMessage = error.response?.data?.error || 'Error searching for symbols'
      setMessage(errorMessage)
      setMessageVariant('danger')
      setSearchLoading(false)
    }
  }

  const renderStockRow = (stock) => {
    if (!stock) return null

    const { ticker, name, latest, change, pchange, timestamp } = stock
    const percentageChange = pchange ? `${pchange.toFixed(2)}%` : '-'
    const color = getColor(percentageChange)
    //console.log(`change for ${ticker}: `, change)
  
    return (
      <tr key={ticker}>
        <td>{ticker}</td>
        <td>
          <Link
            to={`/stock/${ticker}`}
            state={{
              name,
              percentageChange,
              latest: latest != null ? latest.toFixed(2) : '0.00',
              change: change != null ? change.toFixed(2) : '0.00',
              timestamp
            }}>
            {name}
          </Link>
        </td>
        <td>{latest || '-'}</td>
        <td style={color}>{percentageChange}</td>
        <td>{timestamp ? convertUTCToLocal(timestamp) : '-'}</td>
        <td>
          <button
            onClick={() => handleAddToWatchlist(ticker, setMessage, setMessageVariant)}
            style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
          >
            👁️
          </button>
        </td>
      </tr>
    )
  }  

  return (
    <div className='content-padding'>
      <SearchForm searchTerm={searchTerm} setSearchTerm={setSearchTerm} handleSearch={handleSearch} />

      {searchLoading && <div className="spinner" />}

      {searchResults.length > 0 && (
        <>
          <h3>Search Results</h3>
          <StockTable data={searchResults} renderRow={renderStockRow} />
        </>
      )}

      <h3>Common US stocks</h3>
      <StockTable 
        data={COMMON_STOCKS.map(({ ticker, name }) => ({
          ticker,
          name,
          latest: stockData[ticker]?.latest,
          pchange: stockData[ticker]?.pchange,
          change: stockData[ticker]?.change,
          timestamp: stockData[ticker]?.timestamp
        }))} 
        renderRow={renderStockRow} 
      />
    </div>
  )
}

export default Stocks
