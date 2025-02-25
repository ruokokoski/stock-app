import { getColor } from '../utils/helpers'

const StockHeader = ({ name, profileData, metadata, ticker, percentageChange, latest, change, lastUpdated }) => {
  return (
    <>
      <h4 className="header-container">
        {name}
        {profileData.logo && (
          <img
            src={profileData.logo}
            alt={'logo'}
            style={{ width: '30px', height: '30px', marginLeft: '20px' }}
          />
        )}
        <a
          href={profileData.weburl}
          target="_blank"
          rel="noopener noreferrer"
          className="weburl-link"
        >
          {profileData.weburl}
        </a>
      </h4>
      <span>{metadata.exchange}: {ticker}, sector: {profileData.sector}</span>
      <br />
      <div className="percentage-container">
        <span className="latest-price">{latest} </span>
        <span className="price-change" style={getColor(change)}>
          {change > 0 ? `+${change}` : change}
        </span>
        <span className="percentage-change" style={getColor(percentageChange)}>
          {`(${percentageChange}) ${parseFloat(percentageChange) < 0 ? '🡇' : '🡅'}`}
        </span> today
      </div>
      <p>Last updated: {lastUpdated} EET</p>
    </>
  )
}

export default StockHeader