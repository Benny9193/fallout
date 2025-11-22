import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { postService } from '../api/services'
import { Pagination, Loading, ErrorDisplay, EmptyState } from '../components'
import { PAGINATION, ROUTES } from '../constants'
import './Posts.css'

const POSTS_PER_PAGE = PAGINATION.DEFAULT_PAGE_SIZE

function Posts() {
  const [currentPage, setCurrentPage] = useState(1)

  // Fetch all posts
  const { data: allPosts, isLoading, error } = useQuery({
    queryKey: ['posts'],
    queryFn: postService.getPosts,
  })

  // Calculate pagination
  const totalPosts = allPosts?.length || 0
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE)
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE
  const endIndex = startIndex + POSTS_PER_PAGE
  const currentPosts = allPosts?.slice(startIndex, endIndex) || []

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (isLoading) {
    return (
      <div className="page posts-page">
        <h1>Posts (Pagination)</h1>
        <Loading message="Loading posts..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="page posts-page">
        <h1>Posts (Pagination)</h1>
        <ErrorDisplay
          error={error}
          title="Failed to load posts"
          onRetry={() => window.location.reload()}
        />
      </div>
    )
  }

  return (
    <div className="page posts-page">
      <div className="posts-header">
        <div className="posts-header-content">
          <div>
            <h1>Posts (Pagination)</h1>
            <p>
              Showing {startIndex + 1}-{Math.min(endIndex, totalPosts)} of {totalPosts} posts
            </p>
          </div>
          <Link to={ROUTES.POSTS_INFINITE} className="view-toggle">
            Switch to Infinite Scroll
          </Link>
        </div>
      </div>

      {currentPosts.length === 0 ? (
        <EmptyState
          title="No posts found"
          message="There are no posts to display."
          icon="📝"
        />
      ) : (
        <div className="posts-grid">
          {currentPosts.map((post) => (
            <article key={post.id} className="post-card">
              <div className="post-header">
                <span className="post-id">#{post.id}</span>
                <span className="post-user">User {post.userId}</span>
              </div>
              <h2 className="post-title">{post.title}</h2>
              <p className="post-body">{post.body}</p>
            </article>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  )
}

export default Posts
