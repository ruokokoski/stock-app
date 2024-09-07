# Comparison of **free** stock market APIs

| API Name       | Update Frequency | Free Tier Limits       | Review                |
|----------------|------------------|------------------------|-----------------------|
| [Polygon.io](https://www.polygon.io/pricing) | End of day | 5 API calls/min | fundamentals, technical, 2 years historical but **no real-time data** |
| [Alphavantage](https://www.alphavantage.co/documentation/) | End of day | 25 requests per day | good documentation, lots of fundamentals,  +15 years of history data,  **no real time** |
| [Twelvedata](https://twelvedata.com/) | Real-time | 800 API credits/day | 1 call is 1 credit or more, it is unclear what 800 daily credits actually mean |
| [Finnhub](https://finnhub.io/pricing) | Real-time | 60 API calls/min | only US market and market data for 50 symbols |
| [Financial Modeling Prep API](https://intelligence.financialmodelingprep.com/developer/docs/pricing) | End of day | 250 calls/day | 5 year historical, very limited symbols, **tested not good** |
| [Barchart On Demand](https://www.barchart.com/ondemand/api) | Real-time | ? | global markets, availability of free tier is questionable - requires registration and company details |
| [EODHD](https://eodhd.com/) | 15 min delayed | 20 API calls/day | limited calls for free, 1 year history data, fundamentals |
| [Marketstack](https://marketstack.com/product) | End of day | 100 API calls/month | number of calls in free tier is very limited |
| [Yahoo Finance](https://developer.yahoo.com/api/) | Real-time | ? | unofficial API, probably based on webscraping and thus unreliable |
| [Bavest](https://www.bavest.co/en) | ? | ? | API key requested - no answer |
| [Tiingo](https://www.tiingo.com/) | Real-time | 1000 API calls/day |  real-time price data, news, company descriptions |
| [Alpaca Markets](https://alpaca.markets/) | Real-time | 200 API calls/min | Only IEX exchange included in free tier |
| [Stockdata.org](https://www.stockdata.org/) | ? | 100 API calls/day | intra-day / historical data |

### Conclusion

Free real-time stock market APIs are relatively scarce and often come with strict limitations. For those needing real-time data, some providers offer options, but with restrictions on the number of calls. Alphavantage provides a robust range of market coverage and fundamental data, though it is limited to end-of-day updates in its free tier. However, fundamental metrics don't need to be updated in real-time, as they typically reflect longer-term financial data and trends, making end-of-day updates sufficient for most users. The 25 calls/day limitation can be managed by storing the data in own database, allowing for more efficient access.

Tiingo is a versatile and comprehensive API offering real-time stock price data, along with additional features like news, company descriptions, and historical data. With its free tier, users can make up to 1,000 API calls per day.
Using Tiingo, Twelvedata and Stockdata.org (and maybe also Finnhub and Alpaca) together, it might be possible to create a robust and diverse stock market application that taps into the strengths of each API.

However, for comprehensive and real-time data, web scraping might be a necessary approach to bypass these limitations. 
