import { useParams, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import twelvedataService from '../services/twelvedata'
import polygonService from '../services/polygon'
import { createChart } from 'lightweight-charts'
import { getColor } from '../utils/helpers'

const IndexPage = () => {
  const { ticker } = useParams()
  const location = useLocation()
  const { name, percentageChange, chartData: forwardedChartData } = location.state || {}
  const [chartData, setChartData] = useState([])
  const [chart, setChart] = useState(null)
  //const [lineSeries, setLineSeries] = useState(null)
  const [areaSeries, setAreaSeries] = useState(null)
  const [lastUpdated, setLastUpdated] = useState('')
  const [initialDataUsed, setInitialDataUsed] = useState(false)
  const [selectedInterval, setSelectedInterval] = useState('1m')

  const formatDate = (latestTime) => {
    //console.log('latestTime:', latestTime)
    const date = new Date(latestTime.includes(' ') ? latestTime : `${latestTime}T00:00:00`)
    //console.log('date:', date)
    const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }
    const dateString = date.toLocaleDateString('en-US', options)
    const timeOptions = { hour: '2-digit', minute: '2-digit' }
    const timeString = date.toLocaleTimeString('en-US', timeOptions)

    if (!latestTime.includes(' ')) {
        return dateString
    } else if (date.getHours() === 0 && date.getMinutes() === 0) {
        return dateString
    }

    return `${dateString}, ${timeString}`
  }

  const fetchData = async (range) => {
    try {
      const response = ticker.startsWith('I:') 
        ? await polygonService.getTicker(ticker)
        : await twelvedataService.getTicker(ticker, range)
      setChartData(response.chartData || [])
      if (response.chartData && response.chartData.length > 0) {
        const latestTime = response.chartData[response.chartData.length - 1].time
        setLastUpdated(formatDate(latestTime))
      }
      console.log('Chart data was fetched from API')
    } catch (error) {
      console.error(`Error fetching data for ${ticker}:`, error)
    }
  }

  useEffect(() => {
    // Use forwarded data for initial render only
    if (forwardedChartData && forwardedChartData.length > 0 && !initialDataUsed) {
      setChartData(forwardedChartData)
      const latestTime = forwardedChartData[forwardedChartData.length - 1].time
      console.log('Latest time:', latestTime)
      setLastUpdated(formatDate(latestTime))
      setInitialDataUsed(true)
    } else if (initialDataUsed) {
      fetchData(selectedInterval)
    }
  }, [ticker, forwardedChartData, initialDataUsed, selectedInterval])

  useEffect(() => {
    const container = document.getElementById('chart')

    const width = container.clientWidth
    const height = Math.round((width) / 3)

    const chartOptions = {
      layout: {
        textColor: 'black',
        background: { type: 'solid', color: 'white' },
      },
      width: width,
      height: height,
      //autoSize: true,
    }
    const newChart = createChart(container, chartOptions)
    //const newLineSeries = newChart.addLineSeries({ color: '#2962FF' })
    const newAreaSeries = newChart.addAreaSeries({
      topColor: 'rgba(41, 98, 255, 0.4)',
      bottomColor: 'rgba(41, 98, 255, 0)',
      lineColor: '#2962FF',
      lineWidth: 2,
      crossHairMarkerVisible: false,
    })
    
    newChart.applyOptions({
      rightPriceScale: {
        scaleMargins: {
          top: 0.3,
          bottom: 0.25,
        },
      },
      crosshair: {
        horzLine: {
          visible: false,
          labelVisible: false,
        },
        vertLine: {
          labelVisible: false,
        },
      },
    })

    const toolTipWidth = 100
    const toolTipHeight = 90
    const toolTipMargin = 10
    const leftOffset = 100
    const topOffset = 220

    // Create the tooltip HTML element
    const toolTip = document.createElement('div')
    toolTip.style = `width: ${toolTipWidth}px; height: ${toolTipHeight}px; position: absolute; display: none; padding: 8px; box-sizing: border-box; font-size: 12px; text-align: left; z-index: 1000; pointer-events: none; border: 1px solid; border-radius: 2px; background: white; color: black; border-color: rgba(38, 166, 154, 1);`;
    container.appendChild(toolTip)

    newChart.subscribeCrosshairMove(param => {
      if (
        param.point === undefined ||
        !param.time ||
        param.point.x < 0 ||
        param.point.x > container.clientWidth ||
        param.point.y < 0 ||
        param.point.y > container.clientHeight
      ) {
        toolTip.style.display = 'none'
      } else {
        const dateStr = new Date(param.time * 1000).toLocaleDateString('en-US', {
          year: 'numeric', month: 'short', day: 'numeric'
        })
        toolTip.style.display = 'block'
        const data = param.seriesData.get(newAreaSeries)
        const price = data.value !== undefined ? data.value : data.close

        toolTip.innerHTML = `<div style="color: rgba(38, 166, 154, 1)">${name.split(' ')[0]}</div>
          <div style="font-size: 16px; margin: 4px 0px; color: black">
            ${Math.round(100 * price) / 100}
          </div>
          <div style="color: black">
            ${dateStr}
          </div>`
        
        const y = param.point.y
        let left = param.point.x + toolTipMargin + leftOffset
        if (left > container.clientWidth - toolTipWidth) {
          left = param.point.x - toolTipMargin - toolTipWidth + leftOffset
        }

        let top = y + toolTipMargin + topOffset
        
        if (top > container.clientHeight - toolTipHeight) {
          top = y - toolTipHeight - toolTipMargin + topOffset
        }
        
        toolTip.style.left = left + 'px'
        toolTip.style.top = top + 'px'
      }
    })

    setChart(newChart)
    //setLineSeries(newLineSeries)
    setAreaSeries(newAreaSeries)

    return () => {
      newChart.remove()
      container.removeChild(toolTip)
    }
  }, [])

  useEffect(() => {
    if (areaSeries && chartData.length > 0) {
      const formattedData = chartData.map(point => ({
        time: Math.floor(new Date(point.time + 'Z').getTime() / 1000),
        value: parseFloat(point.value),
      }))
  
      //lineSeries.setData(formattedData)
      areaSeries.setData(formattedData)
      chart.timeScale().fitContent()

      chart.timeScale().setVisibleRange({
        from: formattedData[0].time,
        to: formattedData[formattedData.length - 1].time,
      })
      chart.timeScale().applyOptions({
        timeVisible: selectedInterval === '1d',
        secondsVisible: false,
        ticksVisible: true,
        allowBoldLabels: true,
      })
    }
  }, [areaSeries, chartData])

  /*
  useEffect(() => {
  const container = document.getElementById('chart')

  const resizeChart = () => {
    const width = container.clientWidth * 0.9
    const height = Math.round(width / 2.5)

    chart.applyOptions({ width, height })
  }

  window.addEventListener('resize', resizeChart);

  resizeChart();

  return () => {
    window.removeEventListener('resize', resizeChart)
  }
}, [chart])
  */

  const setChartInterval = (interval) => {
    // Adjust data fetching logic based on interval
    console.log(`Interval set to: ${interval}`)
    setSelectedInterval(interval)
    fetchData(interval)
  }

  return (
    <div className="content-padding">
      <h4>{name} Index</h4>
      <span>ticker: {ticker}, change: </span>
      <span style={getColor(percentageChange)}>
        {percentageChange}
      </span>
      <p>Last updated: {lastUpdated}</p>
      <div id="chart"></div>
      <div className="buttons-container">
        {['1d', '1w', '1m', '1y'].map(interval => (
          <button 
            key={interval}
            className="gradient-button"
            onClick={() => setChartInterval(interval)}
          >
            {interval}
          </button>
        ))}
      </div>
    </div>
  )
}

export default IndexPage