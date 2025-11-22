import { Link } from 'react-router-dom'
import { useInfiniteQuery } from '@tanstack/react-query'
import { postService } from '../api/services'
import { useInfiniteScroll } from '../hooks/useInfiniteScroll'
import { Loading, ErrorDisplay, EmptyState } from '../components'
import { ROUTES, PAGINATION, INFINITE_SCROLL } from '../constants'
import './Posts.css'

function InfinitePosts() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: ['infinitePosts'],
    queryFn: ({ pageParam = 1 }) =>
      postService.getPostsPage(pageParam, INFINITE_SCROLL.DEFAULT_PAGE_SIZE),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
  })

  const loadMoreRef = useInfiniteScroll({
    loading: isFetchingNextPage,
    hasMore: hasNextPage ?? false,
    onLoadMore: fetchNextPage,
    rootMargin: INFINITE_SCROLL.ROOT_MARGIN,
    threshold: INFINITE_SCROLL.THRESHOLD,
  })

  if (isLoading) {
    return (
      <div className="page posts-page">
        <h1>Posts (Infinite Scroll)</h1>
        <Loading message="Loading posts..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="page posts-page">
        <h1>Posts (Infinite Scroll)</h1>
        <ErrorDisplay
          error={error}
          title="Failed to load posts"
          onRetry={() => window.location.reload()}
        />
      </div>
    )
  }

  const allPosts = data?.pages.flatMap((page) => page.posts) || []
  const totalLoaded = allPosts.length

  return (
    <div className="page posts-page">
      <div className="posts-header">
        <div className="posts-header-content">
          <div>
            <h1>Posts (Infinite Scroll)</h1>
            <p>Loaded {totalLoaded} posts • Scroll down to load more</p>
          </div>
          <Link to={ROUTES.POSTS} className="view-toggle">
            Switch to Pagination
          </Link>
        </div>
      </div>

      {allPosts.length === 0 ? (
        <EmptyState
          title="No posts found"
          message="There are no posts to display."
          icon="📝"
        />
      ) : (
        <div className="posts-grid">
          {allPosts.map((post) => (
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

      {/* Intersection observer target */}
      <div ref={loadMoreRef} className="load-more-trigger">
        {isFetchingNextPage && (
          <div className="loading-more">
            <div className="spinner"></div>
            <p>Loading more posts...</p>
          </div>
        )}
        {!hasNextPage && totalLoaded > 0 && (
          <div className="end-message">
            <p>You've reached the end!</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default InfinitePosts
