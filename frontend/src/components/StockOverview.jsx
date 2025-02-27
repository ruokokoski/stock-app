import Chart from './Chart'

const StockOverview = ({
  name,
  chartData,
  selectedInterval,
  setChartInterval,
  metricsData,
  profileData,
  metadata
}) => {
  
  const renderIntervalButtons = (intervals) => {
    return intervals.map(interval => (
      <button
        key={interval}
        className={`gradient-button gradient-button-xsmall ${selectedInterval === interval ? 'selected' : ''}`}
        onClick={() => setChartInterval(interval)}
        disabled={selectedInterval === interval}
      >
        {interval}
      </button>
    ))
  }

  return (
    <div className="chart-description-container">
      <div className="chart-section">
        <Chart chartData={chartData} name={name} selectedInterval={selectedInterval} />
        <div className="buttons-container">
          {renderIntervalButtons(['1d', '1w', '1m', 'YTD', '1y', '5y', '10y'])}
        </div>

        <div className="metrics-section">
          <table className="metrics-table">
            <tbody>
              <tr>
                <td>Market Cap</td>
                <td>{metricsData.marketCap ?? 'N/A'}B</td>
                <td>Div yield</td>
                <td>{metricsData.divYield ?? 'N/A'}%</td>
                <td>ROE</td>
                <td>{metricsData.roe ?? 'N/A'}</td>
              </tr>
              <tr>
                <td>P/E</td>
                <td>{metricsData.pe ?? 'N/A'}</td>
                <td>Div Growth 5Y</td>
                <td>{metricsData.divGrowth5y ?? 'N/A'}</td>
                <td>ROA</td>
                <td>{metricsData.roa ?? 'N/A'}</td>
              </tr>
              <tr>
                <td>P/B</td>
                <td>{metricsData.pb ?? 'N/A'}</td>
                <td>52-wk high</td>
                <td>{metricsData.high52 ?? 'N/A'}</td>
                <td>Net Profit Margin</td>
                <td>{metricsData.netProfitMargin ?? 'N/A'}</td>
              </tr>
              <tr>
                <td>P/S</td>
                <td>{metricsData.ps ?? 'N/A'}</td>
                <td>52-wk low</td>
                <td>{metricsData.low52 ?? 'N/A'}</td>
                <td>Operating Margin</td>
                <td>{metricsData.operatingMargin ?? 'N/A'}</td>
              </tr>
              <tr>
                <td>EPS</td>
                <td>{metricsData.eps ?? 'N/A'}</td>
                <td>Rev Growth TTM</td>
                <td>{metricsData.revGrowthTTM ?? 'N/A'}</td>
                <td>EBITDA CAGR 5Y</td>
                <td>{metricsData.ebitdaCagr5y ?? 'N/A'}</td>
              </tr>
              <tr>
                <td>EPS Growth 5Y</td>
                <td>{metricsData.epsGrowth5y ?? 'N/A'}</td>
                <td>Rev Growth 5Y</td>
                <td>{metricsData.revGrowth5y ?? 'N/A'}</td>
                <td>Current Ratio</td>
                <td>{metricsData.currentRatio ?? 'N/A'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="description-section">
        <h6>About</h6>
        <p>Ipo date: {profileData.ipo}</p>
        {metadata.description}
      </div>
    </div>
  )
}

export default StockOverview
