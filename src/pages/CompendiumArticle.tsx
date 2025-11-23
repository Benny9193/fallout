import { useMemo } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { compendiumService } from '../api/services'
import { Loading, ErrorDisplay } from '../components'
import { ROUTES } from '../constants'
import './CompendiumArticle.css'

function CompendiumArticle() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const articleId = id ? parseInt(id, 10) : 0

  // Fetch all articles to find the current one
  const { data: articles, isLoading, error } = useQuery({
    queryKey: ['compendium-articles'],
    queryFn: compendiumService.getArticles,
  })

  // Find current article and adjacent articles
  const articleData = useMemo(() => {
    if (!articles) return null

    const currentIndex = articles.findIndex((a) => a.id === articleId)
    if (currentIndex === -1) return null

    const article = articles[currentIndex]
    const previousArticle = currentIndex > 0 ? articles[currentIndex - 1] : null
    const nextArticle = currentIndex < articles.length - 1 ? articles[currentIndex + 1] : null

    return { article, previousArticle, nextArticle }
  }, [articles, articleId])

  if (isLoading) {
    return (
      <div className="page compendium-article-page">
        <Loading message="Loading article..." />
      </div>
    )
  }

  if (error || !articleData) {
    return (
      <div className="page compendium-article-page">
        <ErrorDisplay
          error={error || new Error('Article not found')}
          title="Failed to load article"
          onRetry={() => navigate(ROUTES.COMPENDIUM)}
        />
        <div className="article-back">
          <Link to={ROUTES.COMPENDIUM} className="back-link">
            ← Back to Compendium
          </Link>
        </div>
      </div>
    )
  }

  const { article, previousArticle, nextArticle } = articleData

  if (!article) {
    return (
      <div className="page compendium-article-page">
        <ErrorDisplay
          error={new Error('Article not found')}
          title="Article not found"
          onRetry={() => navigate(ROUTES.COMPENDIUM)}
        />
        <div className="article-back">
          <Link to={ROUTES.COMPENDIUM} className="back-link">
            ← Back to Compendium
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="page compendium-article-page">
      {/* Back Button */}
      <div className="article-back">
        <Link to={ROUTES.COMPENDIUM} className="back-link">
          ← Back to Compendium
        </Link>
      </div>

      {/* Article Header */}
      <article className="article-content">
        <div className="article-header">
          <div className="article-meta">
            <span className="article-category">{article.category}</span>
            <span className="article-divider">•</span>
            <span className="article-read-time">📖 {article.readTime} min read</span>
          </div>
          <h1 className="article-heading">{article.title}</h1>
          <p className="article-lead">{article.description}</p>
          <div className="article-info">
            <span>Updated: {new Date(article.updatedAt).toLocaleDateString()}</span>
            <span>Views: {article.views}</span>
          </div>
        </div>

        {/* Article Body */}
        <div className="article-body">
          {article.content.split('\n').map((paragraph, index) => {
            // Handle markdown-style headings
            if (paragraph.startsWith('## ')) {
              return (
                <h2 key={index} className="article-section-title">
                  {paragraph.replace(/^## /, '')}
                </h2>
              )
            }
            // Handle markdown-style bold
            if (paragraph.startsWith('- ')) {
              return (
                <li key={index} className="article-list-item">
                  {paragraph.replace(/^- /, '').replace(/\*\*(.*?)\*\//g, '$1')}
                </li>
              )
            }
            // Handle backticks for code
            if (paragraph.includes('`')) {
              return (
                <p key={index} className="article-paragraph">
                  {paragraph.split(/(`[^`]+`)/g).map((part, i) =>
                    part.startsWith('`') ? (
                      <code key={i} className="article-code">
                        {part.slice(1, -1)}
                      </code>
                    ) : (
                      part
                    ),
                  )}
                </p>
              )
            }
            // Regular paragraph
            if (paragraph.trim()) {
              return (
                <p key={index} className="article-paragraph">
                  {paragraph}
                </p>
              )
            }
            return null
          })}
        </div>
      </article>

      {/* Navigation */}
      {(previousArticle || nextArticle) && (
        <div className="article-navigation">
          {previousArticle ? (
            <Link to={ROUTES.COMPENDIUM_ARTICLE.replace(':id', previousArticle.id.toString())} className="nav-link prev">
              <span className="nav-label">← Previous</span>
              <span className="nav-title">{previousArticle.title}</span>
            </Link>
          ) : (
            <div className="nav-link-placeholder" />
          )}

          {nextArticle ? (
            <Link to={ROUTES.COMPENDIUM_ARTICLE.replace(':id', nextArticle.id.toString())} className="nav-link next">
              <span className="nav-label">Next →</span>
              <span className="nav-title">{nextArticle.title}</span>
            </Link>
          ) : (
            <div className="nav-link-placeholder" />
          )}
        </div>
      )}

      {/* Related Articles */}
      {articles && articles.length > 1 && article && (
        <div className="related-articles">
          <h3>More Articles</h3>
          <div className="related-list">
            {articles
              .filter((a) => a.id !== article.id)
              .slice(0, 3)
              .map((relatedArticle) => (
                <Link
                  key={relatedArticle.id}
                  to={ROUTES.COMPENDIUM_ARTICLE.replace(':id', relatedArticle.id.toString())}
                  className="related-item"
                >
                  <span className="related-category">{relatedArticle.category}</span>
                  <span className="related-title">{relatedArticle.title}</span>
                </Link>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default CompendiumArticle
