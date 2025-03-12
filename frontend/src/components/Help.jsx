import { Card } from 'react-bootstrap'

const Help = () => {
  return (
    <div className='content-padding'>
      <h3>Help</h3>
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <h6 className="text-primary mb-3">The application is a web-based tool for monitoring U.S. stock markets. Its various pages provide the following functionalities:</h6>

          <div className="help-section">
            <h6 className="text-secondary mb-2">Markets</h6>
            <p className="mb-4">
              This page displays the performance of key stock indices, including S&P 500, OMX Helsinki, and OMX Stockholm. Below the indices, the latest financial news is shown. Clicking on an index takes the user to a page with historical performance data.
              <br/><br/>
              Due to limitations of free stock market APIs, the S&P 500 index is represented by the SPY ETF, and European stock index charts are available only with end-of-day data.
            </p>

            <h6 className="text-secondary mb-2">Stocks</h6>
            <p className="mb-4">
              Users can search for U.S. stocks by entering a keyword in the search field. The search returns up to five of the most relevant results. Below the search, a selection of popular U.S. stocks, such as Apple, Coca-Cola, and Microsoft, is displayed along with their latest performance. Clicking on a stock directs the user to a detailed stock page. Stocks can be added to the watchlist by clicking the eye icon.
            </p>

            <h6 className="text-secondary mb-2">Detailed Stock Info</h6>
            <p className="mb-4">
              This page provides a comprehensive view of an individual stock, including recent price changes, key metrics, and a company description. Users can choose between &apos;area&apos; and &apos;candlestick&apos; chart formats and select different timeframes, either from predefined options or by entering custom start and end dates. A link to the company&apos;s website is also available.
              <br/><br/>
              The page includes four tabs:<br/>
              Overview – General stock information.<br/>
              Historical Prices – Users can select a timeframe and download data as a CSV file.<br/>
              Quarterly Metrics – Key financial figures, which can also be saved.<br/>
              Company News – The latest news related to the stock.
            </p>

            <h6 className="text-secondary mb-2">Watchlist</h6>
            <p className="mb-4">
              The watchlist displays stocks selected by the user. Stocks can be removed from watchlist by selecting them using the checkbox on the right and clicking the Remove stocks button.
            </p>

            <h6 className="text-secondary mb-2">Database</h6>
            <p className="mb-4">
              Each time a user searches for stocks, the results are also stored in the database. The database page lists all stored stocks along with their latest performance and key metrics. By default, stocks are ordered by ticker, but users can sort them by other criteria such as name, YTD price return, or market cap. The list updates every minute by fetching the latest price and metrics for the 15 stocks with the oldest timestamps, considering API rate limits.
            </p>

            <h6 className="text-secondary mb-2">Crypto</h6>
            <p className="mb-4">
              This page displays the top 20 cryptocurrencies by market cap along with their latest performance.
            </p>

            <h6 className="text-secondary mb-2">Links</h6>
            <p>
              This page provides a collection of financial resources, including links to Yahoo Finance, Bloomberg, and other relevant sites.
            </p>

            <h6 className="text-secondary mb-2">User Profile and Settings</h6>
            <p>
            In the top right corner of the navigation bar, the user&apos;s name is displayed. Clicking on it opens a dropdown menu with options to change the name or password, access the Help section, and log out.
            </p>
          </div>
        </Card.Body>
      </Card>
    </div>
  )
}

export default Help