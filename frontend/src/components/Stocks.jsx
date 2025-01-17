import { useState, useEffect } from 'react'
//import { Link } from 'react-router-dom'
import { finnhubService } from '../services/stockServices'
import StockTable from './StockTable'
import SearchForm from './SearchForm'
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
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])

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

  const renderCommonStocks = () => {
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

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setMessage('Search query is required')
      setMessageVariant('danger')
      return
    }

    try {
      const response = await finnhubService.searchSymbol(searchTerm)
      //console.log('Search response:', response)
      setSearchResults(response.result)
    } catch (error) {
      console.error('Error searching for symbols:', error)
      const errorMessage = error.response?.data?.error || 'Error searching for symbols'
      setMessage(errorMessage)
      setMessageVariant('danger')
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
        <td>{result.name}</td>
        <td>{result.latest}</td>
        <td style={color}>{percentageChange}</td>
        <td>{result.timestamp}</td>
    </tr>
    )
  }

  return (
    <div className='content-padding'>
      <SearchForm searchTerm={searchTerm} setSearchTerm={setSearchTerm} handleSearch={handleSearch} />

      {searchResults.length > 0 && (
        <>
          <h4>Search Results</h4>
          <StockTable data={searchResults} renderRow={renderSearchResults} />
        </>
      )}

      <h4>Common US stocks</h4>
      <StockTable data={COMMON_STOCKS} renderRow={renderCommonStocks} />
    </div>
  )
}

export default Stocks