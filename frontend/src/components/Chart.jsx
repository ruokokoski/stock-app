import { useEffect, useState, useRef } from 'react'
import { createChart } from 'lightweight-charts'
import { formatChartData, createToolTip } from '../utils/helpers'

const Chart = ({ chartData, name, selectedInterval }) => {
  const chartContainerRef = useRef(null)
  const [chart, setChart] = useState(null)
  const [areaSeries, setAreaSeries] = useState(null)
  const [toolTip, setToolTip] = useState(null)

  useEffect(() => {
    const container = chartContainerRef.current
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

    setChart(newChart)
    setAreaSeries(newAreaSeries)
    setToolTip(toolTipInstance)

    return () => {
      newChart.remove()
      container.removeChild(toolTipInstance)
    }
  }, [])

  useEffect(() => {
    if (areaSeries && chartData.length > 0) {
      const formattedData = chartData.map(point => ({
        time: Math.floor(new Date(point.time + 'Z').getTime() / 1000),
        value: parseFloat(point.value),
      }))
  
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

      const y = param.point.y
      let left = param.point.x + 100 + 10
      if (left > chartContainerRef.current.clientWidth - 100) {
        left = param.point.x - 100 - 10 + 100
      }

      let top = y + 10 + 220
      if (top > chartContainerRef.current.clientHeight - 90) {
        top = y - 90 - 10 + 220
      }

      toolTipInstance.style.left = left + 'px'
      toolTipInstance.style.top = top + 'px'
    }
  }

  return (
    <div>
      <div ref={chartContainerRef} id="chart"></div>
    </div>
  )
}

export default Chart
