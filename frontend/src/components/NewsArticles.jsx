import { convertUTCToLocal } from '../utils/helpers'

const NewsArticles = ({ newsData, newsLoading }) => {
  if (newsLoading) return (
    <div className="spinner" />
  )

  return (
    <div className="news-section">
      {newsData.map((article) => (
        <div key={article.id} className="news-article">
          <img 
            src={article.image} 
            alt={article.source} 
          />
          <div className="news-article-content">
            <p>
              <strong>
                <span className="news-date">{convertUTCToLocal(article.datetime)}</span>
                <span className="news-headline">
                  <a href={article.url} target="_blank" rel="noopener noreferrer">
                    {article.headline}
                  </a>
                </span>
              </strong>
            </p>
            <p>Source: <em>{article.source}</em></p>
            <p>{article.summary}</p>
            <hr />
          </div>
        </div>
      ))}
    </div>
  )
}

export default NewsArticles