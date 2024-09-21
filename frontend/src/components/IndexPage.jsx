import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import twelvedataService from '../services/twelvedata'
import polygonService from '../services/polygon'
//import { LineChart } from 'lightweight-charts'

const IndexPage = () => {
  const { ticker } = useParams()
  const [chartData, setChartData] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = ticker.startsWith('I:') 
          ? await polygonService.getTicker(ticker)
          : await twelvedataService.getTicker(ticker)
          
        setChartData(data.values || [])  // Assuming the time series data is in `values`
      } catch (error) {
        console.error(`Error fetching data for ${ticker}:`, error)
      }
    }

    fetchData()
  }, [ticker])

  return (
    <div className="content-padding">
      <h2>{ticker}</h2>
      <div id="chart">
        testi
      </div>
    </div>
  )
}

export default IndexPage