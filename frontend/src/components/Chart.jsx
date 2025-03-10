import { useEffect, useState, useRef, useCallback } from 'react'
import { createChart } from 'lightweight-charts'
import { formatChartData, createToolTip } from '../utils/helpers'

const Chart = ({ chartData, name, selectedInterval }) => {
  const chartContainerRef = useRef(null)
  const chartRef = useRef(null)
  const currentSeriesRef = useRef(null)
  const toolTipRef = useRef(null)
  const [seriesType, setSeriesType] = useState('area')
  //const [toolTip, setToolTip] = useState(null)

  const handleToolTipMove = useCallback((param, newAreaSeries, toolTipInstance) => {
    if (
      param.point === undefined ||
      !param.time ||
      param.point.x < 0 ||
      param.point.x > chartContainerRef.current.clientWidth ||
      param.point.y < 0 ||
      param.point.y > chartContainerRef.current.clientHeight
    ) {
      toolTipInstance.style.display = 'none'
    } else {
      const dateStr = new Date(param.time * 1000).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
      toolTipInstance.style.display = 'block'
      const data = param.seriesData.get(newAreaSeries)
      const price = data.value !== undefined ? data.value : data.close

      toolTipInstance.innerHTML = `<div style="color: rgba(38, 166, 154, 1)">${name.split(' ')[0]}</div>
        <div style="font-size: 16px; margin: 4px 0px; color: black">
          ${Math.round(100 * price) / 100}
        </div>
        <div style="color: black">
          ${dateStr}
        </div>`

      const padding = 120
      const margin = 280

      toolTipInstance.style.left = `${padding}}px`
      toolTipInstance.style.top = `${margin + padding}px`
    }
  }, [name]) 

  useEffect(() => {
    const container = chartContainerRef.current
    if (chartRef.current) {
      chartRef.current.remove()
      chartRef.current = null
    }
    const width = container.clientWidth
    const height = Math.round((width) / 3)

    const tickMarkFormatter = (time) => {
      const date = new Date(time * 1000)

      const utcDate = new Date(Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        date.getUTCHours(),
        date.getUTCMinutes(),
        date.getUTCSeconds()
      ))

      if (selectedInterval === '1d') {
        return utcDate.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'UTC',
        })
      } else {
        return utcDate.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })
      }
    }

    const chartOptions = {
      layout: {
        textColor: 'black',
        background: { type: 'solid', color: 'white' },
      },
      width: width,
      height: height,
      //autoSize: true,
      timeScale: {
        tickMarkFormatter: tickMarkFormatter,
      }
    }

    const newChart = createChart(container, chartOptions)
    if (seriesType === 'area') {
      currentSeriesRef.current = newChart.addAreaSeries({
        topColor: 'rgba(41, 98, 255, 0.4)',
        bottomColor: 'rgba(41, 98, 255, 0)',
        lineColor: '#2962FF',
        lineWidth: 2,
      })
    } else {
      currentSeriesRef.current = newChart.addCandlestickSeries({
        upColor: '#26a69a',
        downColor: '#ef5350',
        borderVisible: false,
        wickUpColor: '#26a69a',
        wickDownColor: '#ef5350',
      })
    }

    const toolTipInstance = createToolTip(container, name)

    newChart.subscribeCrosshairMove(param => {
      handleToolTipMove(param, currentSeriesRef.current, toolTipInstance)
    })

    chartRef.current = newChart
    toolTipRef.current = toolTipInstance

    return () => {
      if (chartRef.current) {
        chartRef.current.remove()
        chartRef.current = null
      }
      if (toolTipRef.current) {
        container.removeChild(toolTipRef.current)
        toolTipRef.current = null
      }
    }
  }, [selectedInterval, name, seriesType, handleToolTipMove])

  useEffect(() => {
    const chart = chartRef.current
    const currentSeries = currentSeriesRef.current
    if (!chart || !currentSeries || chartData.length === 0) return
    
    const formattedData = formatChartData(chartData, seriesType)

    currentSeries.setData(formattedData)
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

    if (formattedData.length > 0) {
      console.log('Chart interval: ', selectedInterval)
      console.log('First element:', formattedData[0])
      console.log('Last element:', formattedData[formattedData.length - 1])
    }
    
  }, [chartData, selectedInterval, seriesType])

  return (
    <div>
      <div className="mb-3 d-inline-block">
        <select 
          className="form-select w-auto d-inline-block"
          value={seriesType} 
          onChange={(e) => setSeriesType(e.target.value)}
          style={{ minWidth: '150px', fontSize: '16px', padding: '4px 8px' }}
        >
          <option value="area">Area Chart</option>
          <option value="candlestick">Candlestick</option>
        </select>
      </div>
      <div
        ref={chartContainerRef}
        id="chart"
        style={{ width: '100%', height: '100%' }}
      >
      </div>
    </div>
  )
}

export default Chart
