import { useState, useEffect } from 'react'
import twelvedataService from '../services/twelvedata'
import { Table } from 'react-bootstrap'

const TICKERS = [
  { ticker: 'SPX', name: 'S&P 500', flag: '🇺🇸' },
  { ticker: 'NDX', name: 'Nasdaq', flag: '🇺🇸' },
  { ticker: 'DAX', name: 'DAX', flag: '🇩🇪' },
  { ticker: 'FTSE', name: 'FTSE 100', flag: '🇬🇧' },
  { ticker: 'OMXH', name: 'OMX Helsinki', flag: '🇫🇮' },
  { ticker: 'OMXS', name: 'OMX Stockholm', flag: '🇸🇪' },
  { ticker: 'N225', name: 'Nikkei 225', flag: '🇯🇵' }
]

const Markets = () => {
  const [marketData, setMarketData] = useState({
    sp500: {
      latest: { close: '-', datetime: '-' },
      previous: { close: '-' },
    },
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sp500Data = await twelvedataService.getTicker('SPX')
        console.log('S&P 500 Data:', sp500Data)
        setMarketData(prevData => ({
          ...prevData,
          sp500: sp500Data,
        }))  
      } catch (error) {
        console.error('Error fetching S&P500 data:', error)
      }
    }

    fetchData()
  }, [])

  const getColor = (percentageChange) => {
    if (!percentageChange || percentageChange === '-') return { color: 'black' }
    if (percentageChange.startsWith('-')) {
      return { color: 'red' }
    } else {
      return { color: 'green' }
    }
  }

  return (
    <div className='content-padding'>
      <h2>Markets overview</h2>
      <Table striped bordered hover style={{ width: '80%', maxWidth: '1200px' }}>
        <thead>
          <tr>
            <th style={{ width: '20%' }}>Index</th>
            <th style={{ width: '10%' }}>Points</th>
            <th style={{ width: '10%' }}>% Change</th>
            <th style={{ width: '15%' }}>Date/Time</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>🇺🇸 S&P 500</td>
            <td>{marketData.sp500.latest.close}</td>
            <td style={getColor(marketData.sp500.previous.percentageChange)}>
              {marketData.sp500.previous.percentageChange}
            </td>
            <td>{marketData.sp500.latest.datetime}</td>
          </tr>
          <tr>
            <td>🇺🇸 Nasdaq</td>
            <td>-</td>
            <td>%</td>
            <td>-</td>
          </tr>
          <tr>
            <td>🇩🇪 DAX</td>
            <td>-</td>
            <td>%</td>
            <td>-</td>
          </tr>
          <tr>
            <td>🇬🇧 FTSE 100</td>
            <td>-</td>
            <td>%</td>
            <td>-</td>
          </tr>
          <tr>
            <td>🇫🇮 OMX Helsinki</td>
            <td>-</td>
            <td>%</td>
            <td>-</td>
          </tr>
          <tr>
            <td>🇸🇪 OMX Stockholm</td>
            <td>-</td>
            <td>%</td>
            <td>-</td>
          </tr>
          <tr>
            <td>🇯🇵 Nikkei 225</td>
            <td>-</td>
            <td>%</td>
            <td>-</td>
          </tr>
        </tbody>
      </Table>
    </div>
  )
}

export default Markets