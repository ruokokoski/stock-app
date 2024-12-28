import { useState, useEffect } from 'react'
import { eodhdService } from '../services/stockServices'
import '../styles/styles.css'
import { getColor } from '../utils/helpers'

// EODHD free tickers:
const EODHD_TICKERS = [
  { ticker: 'AMZN.US', name: 'Amazon', flag: '🇺🇸' },
  { ticker: 'AAPL.US', name: 'Apple', flag: '🇺🇸' },
  { ticker: 'TSLA.US', name: 'Tesla', flag: '🇺🇸' },
  { ticker: 'BTC-USD.CC', name: 'BTC/USD', flag: '🇺🇸' },
  { ticker: 'EURUSD.FOREX', name: 'EUR/USD', flag: '🇺🇸' },
]

const Marquee = ({ speed = 30 }) => {
    const [tickerData, setTickerData] = useState([])

    useEffect(() => {
      const fetchData = async () => {
        const newTickerData = []
  
        for (const { ticker, name } of EODHD_TICKERS) {
          try {
            const data = await eodhdService.getTicker(ticker)
            const latestClose = data.latest.close || '-'
            const percentageChange = data.previous?.percentageChange || '-'
          
            newTickerData.push({ name, latestClose, percentageChange })
          } catch (error) {
            console.error(`Error fetching ${ticker} data:`, error)
            newTickerData.push({ name, latestClose: '-', percentageChange: '-' })
          }
        }
        setTickerData(newTickerData)
      }
      fetchData()
    }, [])

  return (
    <div className="marquee-container">
      <div 
        className="marquee-content" 
        style={{ animationDuration: `${speed}s` }}
      >
        {tickerData.map(({ name, latestClose, percentageChange }, index) => {
          const { color } = getColor(percentageChange)

          return (
            <span key={index} style={{ marginRight: '60px' }}>
              <strong>
                {name}: 
                <span style={{ marginLeft: '20px' }}>{latestClose}</span>
                <span style={{ color, marginLeft:'15px' }}> {percentageChange}</span>
              </strong>
            </span>
          )
        })}
      </div>
    </div>
  )
}

export default Marquee