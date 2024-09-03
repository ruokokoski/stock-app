import { useState, useEffect } from 'react'
import tickerService from '../services/tickers'
import { Table } from 'react-bootstrap'

const Markets = () => {
  const [marketData, setMarketData] = useState({})

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sp500Data = await tickerService.getTicker('SPY') // SPY is ETF not index, I cannot find ticker for index itself
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

  return (
    <div className='content-padding'>
      <h2>Markets overview</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Index</th>
            <th>Points</th>
            <th>% Change</th>
            <th>Date/Time</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>🇺🇸 S&P 500</td>
            <td>-</td>
            <td>%</td>
            <td>-</td>
          </tr>
          <tr>
            <td>🇺🇸 Nasdaq</td>
            <td>-</td>
            <td>%</td>
            <td>-</td>
          </tr>
          <tr>
            <td>🇺🇸 Dow Jones</td>
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
          <tr>
            <td>🇨🇳 Shanghai Composite</td>
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