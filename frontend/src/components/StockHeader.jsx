import { getColor, convertUTCToLocal } from '../utils/helpers'

const StockHeader = ({ name, profileData, ytdPriceReturn, metadata, ticker, percentageChange, latest, change, lastUpdated }) => {
  return (
    <div className="stock-header">
      <div className="header-top">
        <h1 className="stock-name">
          {name}
          {profileData.logo && (
            <img
              src={profileData.logo}
              alt={'logo'}
              className="stock-logo"
            />
          )}
        </h1>
        <a
          href={profileData.weburl}
          target="_blank"
          rel="noopener noreferrer"
          className="weburl-link"
        >
          Visit Website
        </a>
      </div>
      <div className="stock-meta">
        <span className="exchange">{metadata.exchange}: {ticker}</span>
        <span className="sector">{profileData.sector}</span>
      </div>
      <div className="stock-price">
        <span className="latest-price">{latest}</span>
        <span className="price-change" style={getColor(change)}>
          {change > 0 ? `+${change}` : change}
        </span>
        <span className="percentage-change" style={getColor(percentageChange)}>
          {`(${percentageChange}) ${parseFloat(percentageChange) < 0 ? '🡇' : '🡅'}`}
        </span>
      </div>
      <div className="stock-details">
        <span className="last-updated">Updated: {convertUTCToLocal(lastUpdated)} EET</span>
        <span className="ytd-return">
          YTD Return: {' '}
          <span style={getColor(ytdPriceReturn)}>
            {ytdPriceReturn !== undefined && ytdPriceReturn !== null 
              ? `${ytdPriceReturn}%`
              : '-'}
          </span>
        </span>
      </div>
    </div>
  )
}

export default StockHeader