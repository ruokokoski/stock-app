import { useState, useEffect } from 'react'
import cryptoService from '../services/coincap'
import { Table } from 'react-bootstrap'
import { getColor, formatCurrency, formatMarketCap } from '../utils/helpers'

const LIMIT = 20

const CryptoRow = ({ coin }) => (
  <tr key={coin.id}>
    <td>{coin.rank}</td>
    <td>
      <img 
        src={`https://assets.coincap.io/assets/icons/${coin.symbol.toLowerCase()}@2x.png`} 
        alt={`${coin.symbol} icon`}
        style={{ width: '20px', height: '20px', marginRight: '10px' }}
      />
      {coin.name}
    </td>
    <td>{coin.symbol}</td>
    <td>{formatCurrency(coin.priceUsd)}</td>
    <td>{formatMarketCap(coin.marketCapUsd)}</td>
    <td style={getColor(coin.changePercent24Hr)}>
      {parseFloat(coin.changePercent24Hr).toFixed(2)}%
    </td>
  </tr>
)

const Crypto = () => {
  const [cryptoData, setCryptoData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCryptoData = async (limit) => {
      try {
        const response = await cryptoService.getCoins(limit)
        const top20Coins = response.data
        setCryptoData(top20Coins)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching crypto data:', error)
        setLoading(false)
      }
    }

    fetchCryptoData(LIMIT)
  }, [])

  if (loading) return (
    <div className="spinner" />
  )

  return (
    <div className='content-padding'>
      <h3>Top {LIMIT} Cryptocurrencies</h3>
      <Table striped bordered hover className="tight-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Symbol</th>
            <th>Price</th>
            <th>Market Cap</th>
            <th>Change 24h</th>
          </tr>
        </thead>
        <tbody>
          {cryptoData.map(coin => (
            <CryptoRow key={coin.id} coin={coin} />
          ))}
        </tbody>
      </Table>
    </div>
  )
}

export default Crypto