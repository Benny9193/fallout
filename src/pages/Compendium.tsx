import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { compendiumService } from '../api/services'
import { Loading, ErrorDisplay, EmptyState } from '../components'
import { ROUTES } from '../constants'
import './Compendium.css'

function Compendium() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  // Fetch articles and categories
  const { data: articles, isLoading, error } = useQuery({
    queryKey: ['compendium-articles'],
    queryFn: compendiumService.getArticles,
  })

  const { data: categories } = useQuery({
    queryKey: ['compendium-categories'],
    queryFn: compendiumService.getCategories,
  })

  // Filter articles based on search and category
  const filteredArticles = useMemo(() => {
    if (!articles) return []

    let result = articles

    // Filter by category
    if (selectedCategory) {
      result = result.filter((article) => article.category === selectedCategory)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (article) =>
          article.title.toLowerCase().includes(query) ||
          article.description.toLowerCase().includes(query),
      )
    }

    return result
  }, [articles, searchQuery, selectedCategory])

  if (isLoading) {
    return (
      <div className="page compendium-page">
        <h1>Compendium</h1>
        <Loading message="Loading articles..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="page compendium-page">
        <h1>Compendium</h1>
        <ErrorDisplay
          error={error}
          title="Failed to load compendium"
          onRetry={() => window.location.reload()}
        />
      </div>
    )
  }

  return (
    <div className="page compendium-page">
      <div className="compendium-header">
        <div className="compendium-title">
          <h1>Compendium</h1>
          <p>Knowledge base and documentation</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="compendium-search">
        <input
          type="text"
          placeholder="Search articles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        {searchQuery && (
          <button
            className="search-clear"
            onClick={() => setSearchQuery('')}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div className="compendium-categories">
        <button
          className={`category-tag ${!selectedCategory ? 'active' : ''}`}
          onClick={() => setSelectedCategory(null)}
        >
          All Articles ({articles?.length || 0})
        </button>
        {categories?.map((category) => (
          <button
            key={category.id}
            className={`category-tag ${selectedCategory === category.name ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category.name)}
          >
            {category.name} ({category.count})
          </button>
        ))}
      </div>

      {/* Articles List */}
      {filteredArticles.length === 0 ? (
        <EmptyState
          title={searchQuery ? 'No articles found' : 'No articles in this category'}
          message={
            searchQuery
              ? `We couldn't find any articles matching "${searchQuery}". Try a different search term.`
              : 'There are no articles in this category.'
          }
          icon="📚"
        />
      ) : (
        <div className="articles-list">
          {filteredArticles.map((article) => (
            <Link
              key={article.id}
              to={ROUTES.COMPENDIUM_ARTICLE.replace(':id', article.id.toString())}
              className="article-card"
            >
              <div className="article-card-header">
                <h3 className="article-title">{article.title}</h3>
                <span className="article-category">{article.category}</span>
              </div>
              <p className="article-description">{article.description}</p>
              <div className="article-footer">
                <div className="article-stats">
                  <span className="read-time">📖 {article.readTime} min read</span>
                  <span className="views">👁️ {article.views} views</span>
                </div>
                <span className="article-arrow">→</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default Compendium
