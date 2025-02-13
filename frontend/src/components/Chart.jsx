import { useEffect, useState, useRef } from 'react'
import { createChart } from 'lightweight-charts'
import { formatChartData, createToolTip } from '../utils/helpers'

const Chart = ({ chartData, name, selectedInterval }) => {
  const chartContainerRef = useRef(null)
  const chartRef = useRef(null)
  const areaSeriesRef = useRef(null)
  const toolTipRef = useRef(null)
  //const [chart, setChart] = useState(null)
  //const [areaSeries, setAreaSeries] = useState(null)
  /* eslint-disable no-unused-vars */
  const [toolTip, setToolTip] = useState(null)
  /* eslint-enable no-unused-vars */

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
    const newAreaSeries = newChart.addAreaSeries({
      topColor: 'rgba(41, 98, 255, 0.4)',
      bottomColor: 'rgba(41, 98, 255, 0)',
      lineColor: '#2962FF',
      lineWidth: 2,
    })

    const toolTipInstance = createToolTip(container, name)

    newChart.subscribeCrosshairMove(param => {
      handleToolTipMove(param, newAreaSeries, toolTipInstance)
    })

    chartRef.current = newChart
    areaSeriesRef.current = newAreaSeries
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
  }, [selectedInterval, name])

  useEffect(() => {
    const chart = chartRef.current
    const areaSeries = areaSeriesRef.current
    if (!chart || !areaSeries || chartData.length === 0) return
    
    const formattedData = formatChartData(chartData)

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
    
  }, [chartData, selectedInterval])

  const handleToolTipMove = (param, newAreaSeries, toolTipInstance) => {
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

      const padding = 10
      const margin = 250
      /*
      const tooltipWidth = toolTipInstance.offsetWidth
      const tooltipHeight = toolTipInstance.offsetHeight
      const x = param.point.x
      const y = param.point.y

      let left = x + tooltipWidth + padding
      if (left + tooltipWidth > chartContainerRef.current.clientWidth) {
        left = x
      }
      left = Math.max(left, padding)

      let top = y + padding + margin
      if (top + tooltipHeight > chartContainerRef.current.clientHeight) {
        top = y - tooltipHeight - padding + margin
      }
      top = Math.max(top, padding)

      toolTipInstance.style.left = `${left}px`
      toolTipInstance.style.top = `${top}px`
      */

      toolTipInstance.style.left = `${padding}}px`
      toolTipInstance.style.top = `${margin + padding}px`
    }
  }

  return (
    <div>
      <div
        ref={chartContainerRef}
        id="chart"
      >
      </div>
    </div>
  )
}

export default Chart
