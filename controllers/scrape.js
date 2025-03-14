const router = require('express').Router()
const puppeteer = require('puppeteer')

router.get('/indices', async (req, res) => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
    ],
  })

  const page = await browser.newPage()
  
  try {
    await page.goto('https://www.kauppalehti.fi', {
      waitUntil: 'networkidle2',
      timeout: 30000
    })

    const timestamp = new Date().toISOString()

    const indices = await page.evaluate((timestamp) => {
      // eslint-disable-next-line no-undef
      const marketHeaders = Array.from(document.querySelectorAll('[data-k5a-pos^="MarketHeader"]'))

      return marketHeaders.map(header => {
        const nameElement = header.querySelector('.tmcl-__sc-e37vct-1.fqPyXf')
        const priceElement = header.querySelector('.tmcl-__sc-ytji64-1.gxJroE')
        const changeElement = header.querySelector('.tmcl-__sc-lsh9h-1')

        return {
          name: nameElement ? nameElement.innerText : 'N/A',
          price: priceElement ? parseFloat(priceElement.innerText.replace(',', '.')) : 0,
          change: changeElement ? changeElement.innerText : '0%',
          changeValue: changeElement ? parseFloat(changeElement.innerText.replace(',', '.')) : 0,
          timestamp: timestamp
        }
      })
    }, timestamp)

    await browser.close()
    res.json(indices)
  } catch (error) {
    console.error('Scraping error:', error)
    if (browser) {
      const page = await browser.pages()[0]
      const status = await page.status()
      console.error(`Page status: ${status}`)
    }
    await browser.close()
    res.status(500).json({ error: 'Scraping failed' })
  }
})

module.exports = router