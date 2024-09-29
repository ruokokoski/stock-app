import { useEffect, useState } from 'react'
import { createChart } from 'lightweight-charts'

const Chart = ({ chartData, name, selectedInterval }) => {
  const [chart, setChart] = useState(null)
  const [areaSeries, setAreaSeries] = useState(null)

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
    const newAreaSeries = newChart.addAreaSeries({
      topColor: 'rgba(41, 98, 255, 0.4)',
      bottomColor: 'rgba(41, 98, 255, 0)',
      lineColor: '#2962FF',
      lineWidth: 2,
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

    const toolTip = document.createElement('div')
    toolTip.style = `width: ${toolTipWidth}px; height: ${toolTipHeight}px; position: absolute; display: none; padding: 8px; box-sizing: border-box; font-size: 12px; text-align: left; z-index: 1000; pointer-events: none; border: 1px solid; border-radius: 2px; background: white; color: black; border-color: rgba(38, 166, 154, 1);`
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

  return (
    <div>
      <div id="chart"></div>
    </div>
  )
}

export default Chart
