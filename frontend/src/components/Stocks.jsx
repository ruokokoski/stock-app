import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { finnhubService } from '../services/stockServices'
import { addToWatchlist } from '../services/watchlists'
import StockTable from './StockTable'
import SearchForm from './SearchForm'
import { getColor, convertUTCToLocal } from '../utils/helpers'

//watchlist: 👁️ ⭐ ➕ 💼 📌
const COMMON_STOCKS = [
  { ticker: 'AAPL', name: 'Apple Inc.' },
  //{ ticker: 'AMZN', name: 'Amazon.com Inc.' },
  //{ ticker: 'AVGO', name: 'Broadcom Inc.' },
  //{ ticker: 'BAC', name: 'Bank of America Corp.' },
  //{ ticker: 'COST', name: 'Costco Wholesale Corp.' },
  { ticker: 'CRM', name: 'Salesforce Inc.' },
  { ticker: 'CRWD', name: 'CrowdStrike Holdings Inc.' },
  { ticker: 'DIS', name: 'Walt Disney Co.' },
  //{ ticker: 'F', name: 'Ford Motor Co.' },
  { ticker: 'GOOGL', name: 'Alphabet Inc.' },
  { ticker: 'JPM', name: 'JPMorgan Chase & Co.' },
  { ticker: 'KO', name: 'Coca-Cola Co.' },
  //{ ticker: 'MCD', name: 'McDonald\'s Corp.' },
  //{ ticker: 'META', name: 'Meta Platforms Inc.' },
  { ticker: 'MSFT', name: 'Microsoft Corp.' },
  { ticker: 'NFLX', name: 'Netflix Inc.' },
  { ticker: 'NKE', name: 'Nike Inc.' },
  { ticker: 'NVDA', name: 'NVIDIA Corp.' },
  { ticker: 'PFE', name: 'Pfizer Inc.' },
  //{ ticker: 'PG', name: 'Procter & Gamble Co.' },
  { ticker: 'PLTR', name: 'Palantir Technologies Inc.' },
  { ticker: 'PYPL', name: 'PayPal Holdings Inc.' },
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
        const storageKey = `stock-${ticker}`;
        const storedData = localStorage.getItem(storageKey);

        if (!storedData || (storedData && now - JSON.parse(storedData).timestamp > expirationTime)) {
          try {
            const data = await finnhubService.getTicker(ticker, null, name)
            const dataWithTimestamp = {
              ...data,
              timestamp: now,
            };
            localStorage.setItem(
              storageKey,
              JSON.stringify({
                data: dataWithTimestamp,
                timestamp: now,
              })
            )
            newStockData[ticker] = dataWithTimestamp;
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

  const handleAddToWatchlist = async (ticker) => {
    try {
      const loggedUserJSON = window.localStorage.getItem('loggedStockappUser')
      const user = JSON.parse(loggedUserJSON)
      await addToWatchlist(ticker, user.token)
      setMessage(`Added ${ticker} to your watchlist`)
      setMessageVariant('success')
    } catch (error) {
      console.error('Error adding to watchlist:', error)
      const errorMessage = error.response?.data?.error || 'Failed to add to watchlist'
      setMessage(errorMessage)
      setMessageVariant('danger')
    }
  }

  const renderStocks = ({ ticker, name }) => {
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
              percentageChange
            }}>
            {name}
          </Link>
        </td>
        <td>{stockData[ticker]?.latest || '-'}</td>
        <td style={color}>{percentageChange}</td>
        <td>{stockData[ticker]?.timestamp ? convertUTCToLocal(stockData[ticker].timestamp) : '-'}</td>
        <td>
          <button
            onClick={() => handleAddToWatchlist(ticker)}
            style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
          >
            👁️
          </button>
        </td>
      </tr>
    )
  }

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setMessage('Search query is required')
      setMessageVariant('danger')
      return
    }

    setSearchLoading(true)

    try {
      const response = await finnhubService.searchSymbol(searchTerm)
      //console.log('Search response:', response)
      setSearchResults(response.result)
      setSearchLoading(false)
    } catch (error) {
      console.error('Error searching for symbols:', error)
      const errorMessage = error.response?.data?.error || 'Error searching for symbols'
      setMessage(errorMessage)
      setMessageVariant('danger')
      setSearchLoading(false)
    }
  }

  const renderSearchResults = (result) => {
    if (!result || !result.ticker) {
      return null
    }
    const percentageChange = result?.pchange ? `${result.pchange.toFixed(2)}%` : '-'
    const color = getColor(percentageChange)

    return (
    <tr key={result.ticker}>
        <td>{result.ticker}</td>
        <td>
          <Link
            to={`/stock/${result.ticker}`}
            state={{
              name: result.name,
              percentageChange
            }}>
            {result.name}
          </Link>
        </td>
        <td>{result.latest}</td>
        <td style={color}>{percentageChange}</td>
        <td>{result.timestamp ? convertUTCToLocal(result.timestamp) : '-'}</td>
        <td>
          <button
            onClick={() => handleAddToWatchlist(result.ticker, result.name)}
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
          <StockTable data={searchResults} renderRow={renderSearchResults} />
        </>
      )}

      <h3>Common US stocks</h3>
      <StockTable data={COMMON_STOCKS} renderRow={renderStocks} />
    </div>
  )
}

export default Stocks