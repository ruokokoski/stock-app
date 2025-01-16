require('dotenv').config()

module.exports = {
  DATABASE_URL: process.env.DATABASE_URL,
  PORT: process.env.PORT || 3001,
  SECRET: process.env.SECRET,
  TIINGO_API_KEY: process.env.TIINGO_API_KEY,
  TWELVEDATA_API_KEY: process.env.TWELVEDATA_API_KEY,
  FINNHUB_API_KEY: process.env.FINNHUB_API_KEY,
  EODHD_API_KEY: process.env.EODHD_API_KEY,
  POLYGON_API_KEY: process.env.POLYGON_API_KEY,
  COINCAP_API_KEY: process.env.COINCAP_API_KEY,
}