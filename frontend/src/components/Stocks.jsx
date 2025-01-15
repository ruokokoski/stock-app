import { useState, useEffect } from 'react'
//import { Link } from 'react-router-dom'
import { tiingoService } from '../services/stockServices'
import { Table } from 'react-bootstrap'
import { getColor } from '../utils/helpers'

const COMMON_STOCKS = [
  /*
  { ticker: 'AAPL', name: 'Apple Inc.' },
  { ticker: 'ABBV', name: 'AbbVie Inc.' },
  { ticker: 'AMD', name: 'Advanced Micro Devices Inc.' },
  { ticker: 'AMZN', name: 'Amazon.com Inc.' },
  { ticker: 'AVGO', name: 'Broadcom Inc.' },
  { ticker: 'BAC', name: 'Bank of America Corp.' },
  { ticker: 'COST', name: 'Costco Wholesale Corp.' },
  { ticker: 'CRM', name: 'Salesforce Inc.' },
  { ticker: 'GOOGL', name: 'Alphabet Inc.' },
  { ticker: 'JPM', name: 'JPMorgan Chase & Co.' },
  { ticker: 'KO', name: 'Coca-Cola Co.' },
  { ticker: 'META', name: 'Meta Platforms Inc.' },
  { ticker: 'MSFT', name: 'Microsoft Corp.' },
  { ticker: 'NVDA', name: 'NVIDIA Corp.' },
  { ticker: 'PFE', name: 'Pfizer Inc.' },
  { ticker: 'T', name: 'AT&T Inc.' },
  { ticker: 'TSLA', name: 'Tesla Inc.' },
  { ticker: 'UNH', name: 'UnitedHealth Group Inc.' },
  { ticker: 'V', name: 'Visa Inc.' },
  { ticker: 'WMT', name: 'Walmart Inc.' },
  { ticker: 'PG', name: 'Procter & Gamble Co.' },
  { ticker: 'DIS', name: 'Walt Disney Co.' },
  { ticker: 'INTC', name: 'Intel Corp.' },
  { ticker: 'CSCO', name: 'Cisco Systems Inc.' },
  { ticker: 'NFLX', name: 'Netflix Inc.' },
  { ticker: 'ADBE', name: 'Adobe Inc.' },
  { ticker: 'PEP', name: 'PepsiCo Inc.' },
  { ticker: 'NKE', name: 'Nike Inc.' },
  { ticker: 'MRK', name: 'Merck & Co. Inc.' },
  { ticker: 'XOM', name: 'Exxon Mobil Corp.' },
  { ticker: 'CVX', name: 'Chevron Corp.' },
  { ticker: 'BA', name: 'The Boeing Co.' },
  { ticker: 'ORCL', name: 'Oracle Corp.' },
  { ticker: 'QCOM', name: 'Qualcomm Inc.' },
  { ticker: 'MMM', name: '3M Co.' },
  { ticker: 'GE', name: 'General Electric Co.' },
  { ticker: 'SPGI', name: 'S&P Global Inc.' },
  { ticker: 'UPS', name: 'United Parcel Service Inc.' },
  { ticker: 'LOW', name: 'Lowe\'s Companies Inc.' },
  { ticker: 'BKNG', name: 'Booking Holdings Inc.' },
  { ticker: 'TGT', name: 'Target Corp.' },
  { ticker: 'MO', name: 'Altria Group Inc.' },
  { ticker: 'FDX', name: 'FedEx Corp.' },
  { ticker: 'LMT', name: 'Lockheed Martin Corp.' },
  { ticker: 'C', name: 'Citigroup Inc.' },
  { ticker: 'GS', name: 'The Goldman Sachs Group Inc.' },
  { ticker: 'MS', name: 'Morgan Stanley' },
  { ticker: 'BLK', name: 'BlackRock Inc.' },
  { ticker: 'PLTR', name: 'Palantir Technologies Inc.' },
  { ticker: 'PYPL', name: 'PayPal Holdings Inc.' },
  { ticker: 'SQ', name: 'Block Inc.' },
  { ticker: 'ROKU', name: 'Roku Inc.' },
  { ticker: 'SHOP', name: 'Shopify Inc.' },
  { ticker: 'SNOW', name: 'Snowflake Inc.' },
  { ticker: 'ZS', name: 'Zscaler Inc.' },
  { ticker: 'TWLO', name: 'Twilio Inc.' },
  { ticker: 'OKTA', name: 'Okta Inc.' },
  { ticker: 'MDB', name: 'MongoDB Inc.' },
  { ticker: 'DDOG', name: 'Datadog Inc.' },
  { ticker: 'CRWD', name: 'CrowdStrike Holdings Inc.' },
  { ticker: 'PANW', name: 'Palo Alto Networks Inc.' },
  { ticker: 'DOCU', name: 'DocuSign Inc.' },
  { ticker: 'NVAX', name: 'Novavax Inc.' },
  { ticker: 'MRNA', name: 'Moderna Inc.' },
  { ticker: 'BIIB', name: 'Biogen Inc.' },
  { ticker: 'VRTX', name: 'Vertex Pharmaceuticals Inc.' },
  { ticker: 'REGN', name: 'Regeneron Pharmaceuticals Inc.' },
  { ticker: 'ILMN', name: 'Illumina Inc.' },
  { ticker: 'DAL', name: 'Delta Air Lines Inc.' },
  { ticker: 'UAL', name: 'United Airlines Holdings Inc.' },
  { ticker: 'AAL', name: 'American Airlines Group Inc.' },
  { ticker: 'SBUX', name: 'Starbucks Corp.' },
  { ticker: 'MCD', name: 'McDonald\'s Corp.' },
  { ticker: 'YUM', name: 'Yum! Brands Inc.' },
  { ticker: 'CME', name: 'CME Group Inc.' },
  { ticker: 'NDAQ', name: 'Nasdaq Inc.' },
  { ticker: 'ICE', name: 'Intercontinental Exchange Inc.' },
  { ticker: 'BX', name: 'Blackstone Inc.' },
  { ticker: 'KKR', name: 'KKR & Co. Inc.' },
  { ticker: 'AMT', name: 'American Tower Corp.' },
  { ticker: 'CCI', name: 'Crown Castle Inc.' },
  { ticker: 'EQIX', name: 'Equinix Inc.' },
  { ticker: 'PSA', name: 'Public Storage' },
  { ticker: 'HCA', name: 'HCA Healthcare Inc.' },
  { ticker: 'CNC', name: 'Centene Corp.' },
  { ticker: 'WELL', name: 'Welltower Inc.' },
  { ticker: 'DHR', name: 'Danaher Corp.' },
  { ticker: 'TMO', name: 'Thermo Fisher Scientific Inc.' },
  { ticker: 'A', name: 'Agilent Technologies Inc.' },
  { ticker: 'APD', name: 'Air Products and Chemicals Inc.' },
  { ticker: 'LIN', name: 'Linde plc' },
  { ticker: 'AVB', name: 'AvalonBay Communities Inc.' },
  { ticker: 'BXP', name: 'Boston Properties Inc.' },
  { ticker: 'F', name: 'Ford Motor Co.' },
  { ticker: 'GM', name: 'General Motors Co.' },
  { ticker: 'HLT', name: 'Hilton Worldwide Holdings Inc.' },
  { ticker: 'MAR', name: 'Marriott International Inc.' },
  { ticker: 'IBM', name: 'International Business Machines Corp.' },
  { ticker: 'HPE', name: 'Hewlett Packard Enterprise Co.' },
  { ticker: 'DE', name: 'Deere & Co.' },
  { ticker: 'CAT', name: 'Caterpillar Inc.' },
  { ticker: 'TSCO', name: 'Tractor Supply Co.' },
  { ticker: 'EL', name: 'The Estée Lauder Companies Inc.' },
  { ticker: 'CL', name: 'Colgate-Palmolive Co.' },
  { ticker: 'KMB', name: 'Kimberly-Clark Corp.' },
  { ticker: 'GIS', name: 'General Mills Inc.' },
  { ticker: 'HRL', name: 'Hormel Foods Corp.' },
  { ticker: 'KHC', name: 'The Kraft Heinz Co.' },
  { ticker: 'MDLZ', name: 'Mondelez International Inc.' },
  { ticker: 'STZ', name: 'Constellation Brands Inc.' },
  { ticker: 'D', name: 'Dominion Energy Inc.' },
  { ticker: 'SO', name: 'Southern Co.' },
  { ticker: 'DUK', name: 'Duke Energy Corp.' },
  { ticker: 'NEE', name: 'NextEra Energy Inc.' },
  { ticker: 'PPL', name: 'PPL Corp.' },
  { ticker: 'WEC', name: 'WEC Energy Group Inc.' },
  { ticker: 'EFX', name: 'Equifax Inc.' },
  { ticker: 'AIZ', name: 'Assurant Inc.' },
  { ticker: 'RHI', name: 'Robert Half International Inc.' },
  { ticker: 'NVR', name: 'NVR Inc.' },
  { ticker: 'ROL', name: 'Rollins Inc.' },
  { ticker: 'CMS', name: 'CMS Energy Corp.' },
  { ticker: 'ES', name: 'Eversource Energy' },
  { ticker: 'AEE', name: 'Ameren Corp.' },
  { ticker: 'ETR', name: 'Entergy Corp.' },
  { ticker: 'FE', name: 'FirstEnergy Corp.' },
  { ticker: 'DTE', name: 'DTE Energy Co.' },
  { ticker: 'AES', name: 'AES Corp.' },
  { ticker: 'NI', name: 'NiSource Inc.' },
  { ticker: 'NRG', name: 'NRG Energy Inc.' },
  { ticker: 'EXC', name: 'Exelon Corp.' },
  { ticker: 'CMS', name: 'CMS Energy Corp.' },
  { ticker: 'XEL', name: 'Xcel Energy Inc.' },
  { ticker: 'SRE', name: 'Sempra' },
  { ticker: 'ATO', name: 'Atmos Energy Corp.' },
  { ticker: 'LNT', name: 'Alliant Energy Corp.' },
  { ticker: 'OGE', name: 'OGE Energy Corp.' },
  { ticker: 'PNW', name: 'Pinnacle West Capital Corp.' },
  { ticker: 'AEP', name: 'American Electric Power Co. Inc.' },
  { ticker: 'EIX', name: 'Edison International' },
  { ticker: 'PEG', name: 'Public Service Enterprise Group Inc.' },
  { ticker: 'WBA', name: 'Walgreens Boots Alliance Inc.' },
  { ticker: 'CAH', name: 'Cardinal Health Inc.' },
  { ticker: 'TJX', name: 'The TJX Companies Inc.' },
  { ticker: 'ROST', name: 'Ross Stores Inc.' },
  { ticker: 'KDP', name: 'Keurig Dr Pepper Inc.' },
  { ticker: 'MAT', name: 'Mattel Inc.' },
  { ticker: 'HAS', name: 'Hasbro Inc.' },
  { ticker: 'WHR', name: 'Whirlpool Corp.' },
  { ticker: 'LEG', name: 'Leggett & Platt Inc.' },
  { ticker: 'DVA', name: 'DaVita Inc.' },
  { ticker: 'IQV', name: 'IQVIA Holdings Inc.' },
  { ticker: 'MTD', name: 'Mettler-Toledo International Inc.' },
  { ticker: 'ZBH', name: 'Zimmer Biomet Holdings Inc.' },
  { ticker: 'ISRG', name: 'Intuitive Surgical Inc.' },
  { ticker: 'COO', name: 'The Cooper Companies Inc.' },
  { ticker: 'TFX', name: 'Teleflex Inc.' },
  { ticker: 'EW', name: 'Edwards Lifesciences Corp.' },
  { ticker: 'IDXX', name: 'IDEXX Laboratories Inc.' },
  { ticker: 'WAT', name: 'Waters Corp.' },
  { ticker: 'CINF', name: 'Cincinnati Financial Corp.' },
  { ticker: 'LNC', name: 'Lincoln National Corp.' },
  { ticker: 'AFL', name: 'Aflac Inc.' },
  { ticker: 'TSN', name: 'Tyson Foods Inc.' },
  { ticker: 'K', name: 'Kellogg Co.' },
  { ticker: 'SYY', name: 'Sysco Corp.' },
  { ticker: 'VLO', name: 'Valero Energy Corp.' },
  { ticker: 'HES', name: 'Hess Corp.' },
  { ticker: 'PSX', name: 'Phillips 66' },
  { ticker: 'SLB', name: 'Schlumberger NV' },
  { ticker: 'HAL', name: 'Halliburton Co.' },
  { ticker: 'BKR', name: 'Baker Hughes Co.' },
  { ticker: 'OKE', name: 'ONEOK Inc.' },
  { ticker: 'APA', name: 'APA Corp.' },
  { ticker: 'DVN', name: 'Devon Energy Corp.' },
  { ticker: 'FANG', name: 'Diamondback Energy Inc.' },
  { ticker: 'MPC', name: 'Marathon Petroleum Corp.' },
  { ticker: 'CNP', name: 'CenterPoint Energy Inc.' },
  { ticker: 'MPW', name: 'Medical Properties Trust Inc.' },
  { ticker: 'OHI', name: 'Omega Healthcare Investors Inc.' },
  { ticker: 'NHI', name: 'National Health Investors Inc.' },
  { ticker: 'RWT', name: 'Redwood Trust Inc.' },
  { ticker: 'NYMT', name: 'New York Mortgage Trust Inc.' },
  { ticker: 'AAP', name: 'Advance Auto Parts Inc.' },
  { ticker: 'AIG', name: 'American International Group Inc.' },
  { ticker: 'ALL', name: 'Allstate Corp.' },
  { ticker: 'AME', name: 'AMETEK Inc.' },
  { ticker: 'APH', name: 'Amphenol Corp.' },
  { ticker: 'ATO', name: 'Atmos Energy Corp.' },
  { ticker: 'BBY', name: 'Best Buy Co. Inc.' },
  { ticker: 'CDNS', name: 'Cadence Design Systems Inc.' },
  { ticker: 'CE', name: 'Celanese Corp.' },
  { ticker: 'CHRW', name: 'C.H. Robinson Worldwide Inc.' },
  { ticker: 'CTAS', name: 'Cintas Corp.' },
  { ticker: 'DG', name: 'Dollar General Corp.' },
  { ticker: 'DLTR', name: 'Dollar Tree Inc.' },
  { ticker: 'EMN', name: 'Eastman Chemical Co.' },
  { ticker: 'ETSY', name: 'Etsy Inc.' },
  { ticker: 'FITB', name: 'Fifth Third Bancorp' },
  { ticker: 'HIG', name: 'The Hartford Financial Services Group Inc.' },
  { ticker: 'KEYS', name: 'Keysight Technologies Inc.' },
  { ticker: 'LHX', name: 'L3Harris Technologies Inc.' },
  { ticker: 'MKC', name: 'McCormick & Co. Inc.' },
  { ticker: 'MTB', name: 'M&T Bank Corp.' },
  { ticker: 'NEM', name: 'Newmont Corp.' },
  { ticker: 'ODFL', name: 'Old Dominion Freight Line Inc.' },
  { ticker: 'PNC', name: 'PNC Financial Services Group Inc.' },
  { ticker: 'WMB', name: 'Williams Companies Inc.' },
  */
]

const Stocks = () => {
  const [stockData, setStockData] = useState({})

  useEffect(() => {
    const fetchData = async () => {
      const newStockData = {}

      const fetchTickerData = async (ticker) => {
        try {
          const data = await tiingoService.getTicker(ticker)
          newStockData[ticker] = data
        } catch (error) {
          console.error(`Error fetching ${ticker} data:`, error)
          newStockData[ticker] = [{ latest: '-', percentageChange: '-', datetime: '-' }]
        }
      }

      for (const { ticker } of COMMON_STOCKS) {
        await fetchTickerData(ticker)
      }

      setStockData(newStockData)
    }

    fetchData()
  }, [])

  const renderTableRows = () => {
    return COMMON_STOCKS.map(({ ticker, name }) => {
      const percentageChange = stockData[ticker]?.percentageChange || '-'
      const color = getColor(percentageChange)

      return (
        <tr key={ticker}>
          <td>{ticker}</td>
          <td>{name}</td>
          <td>{stockData[ticker]?.latest || '-'}</td>
          <td style={color}>{percentageChange}</td>
          <td>{stockData[ticker]?.datetime || '-'}</td>
        </tr>
      )
    })
  }

  return (
    <div className='content-padding'>
      <h4>Common US stocks</h4>
      <Table striped bordered hover style={{ width: '80%', maxWidth: '1500px' }}>
        <thead>
        <tr>
          <th style={{ width: '10%' }}>Ticker</th>
          <th style={{ width: '35%' }}>Name</th>
          <th style={{ width: '15%' }}>Price</th>
          <th style={{ width: '15%' }}>% Change</th>
          <th style={{ width: '30%' }}>Date/Time</th>
        </tr>
        </thead>
        <tbody>
          {renderTableRows()}
        </tbody>
      </Table>
    </div>
  )
}

export default Stocks