import { Card, ListGroup } from 'react-bootstrap'
import { FaExternalLinkAlt } from 'react-icons/fa'

const Links = () => {
  const links = [
    { 
        title: 'Yahoo Finance', 
        description: 'Stock quotes, financial news, and portfolio tracking tools',
        url: 'https://finance.yahoo.com/' 
    },
    { 
        title: 'MarketWatch', 
        description: 'Latest stock market news, analysis, and real-time market data',
        url: 'https://www.marketwatch.com/' 
    },
    { 
        title: 'TradingView', 
        description: 'Advanced charting tools and community-driven market insights',
        url: 'https://www.tradingview.com/' 
    },
    { 
        title: 'Investing.com', 
        description: 'Global financial markets data, news, and analysis tools',
        url: 'https://www.investing.com/' 
    },
    { 
        title: 'Seeking Alpha', 
        description: 'Investor opinions and analysis',
        url: 'https://seekingalpha.com/' 
    },
    { 
        title: 'Bloomberg', 
        description: 'Global business and financial market news',
        url: 'https://www.bloomberg.com/europe' 
    },
    { 
        title: 'Kauppalehti', 
        description: 'Finnish business news and financial market coverage',
        url: 'https://www.kauppalehti.fi/' 
    },
    { 
        title: 'Inderes - Keskustelut', 
        description: 'Finnish investment community discussions',
        url: 'https://keskustelut.inderes.fi/' 
    },
    { 
        title: 'Sijoitustieto', 
        description: 'Finnish investment information and discussions',
        url: 'https://www.sijoitustieto.fi/' 
    },
    { 
        title: 'Nordnet', 
        description: 'Nordic online brokerage and investment platform',
        url: 'https://www.nordnet.fi/fi' 
    }
  ]
  return (
    <div className='content-padding'>
      <h3>Financial links</h3>
      <Card className="shadow-sm">
        <ListGroup variant="flush">
          {links.map((link, index) => (
            <ListGroup.Item 
              key={index}
              action 
              as="a" 
              href={link.url} 
              target="_blank"
              rel="noopener noreferrer"
              className="d-flex justify-content-between align-items-center link-item"
            >
              <div className="d-flex flex-column flex-grow-1 me-3">
                <span className="link-title fw-semibold mb-1">{link.title}</span>
                <small className="link-description text-muted">{link.description}</small>
              </div>
              <FaExternalLinkAlt className="text-muted flex-shrink-0" />
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card>
    </div>
  )
}

export default Links