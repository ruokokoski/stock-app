import { useState, useEffect } from 'react'
import cryptoService from '../services/coincap'
import { Table } from 'react-bootstrap'
import { getColor } from '../utils/helpers'

const Crypto = () => {
  const [cryptoData, setCryptoData] = useState([])

  useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        const response = await cryptoService.getCoins()
        const top20Coins = response.data
        setCryptoData(top20Coins)
      } catch (error) {
        console.error('Error fetching crypto data:', error)
      }
    }

    fetchCryptoData()
  }, [])

  return (
    <div className='content-padding'>
      <h2>Top 10 Cryptocurrencies</h2>
      <Table striped bordered hover>
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
          {cryptoData.map((coin) => (
            <tr key={coin.id}>
              <td>{coin.rank}</td>
              <td>
                <img 
                  src={`https://assets.coincap.io/assets/icons/${coin.symbol.toLowerCase()}@2x.png`} 
                  alt={`icon`}
                  style={{ width: '20px', height: '20px', marginRight: '10px' }}
                />
                {coin.name}
              </td>
              <td>{coin.symbol}</td>
              <td>${parseFloat(coin.priceUsd).toFixed(2)}</td>
              <td>${parseFloat(coin.marketCapUsd / 1e9).toFixed(2)}B</td>
              <td style={ getColor(coin.changePercent24Hr) }>
                {parseFloat(coin.changePercent24Hr).toFixed(2)}%
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}

export default Crypto