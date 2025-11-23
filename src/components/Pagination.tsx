import { useMemo } from 'react'
import './Pagination.css'

const ELLIPSIS = '...' as const
const DEFAULT_MAX_VISIBLE = 5

type PageItem = number | typeof ELLIPSIS

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  maxVisible?: number
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  maxVisible = DEFAULT_MAX_VISIBLE
}: PaginationProps) {
  const pageNumbers = useMemo(() => {
    return calculatePageNumbers(currentPage, totalPages, maxVisible)
  }, [currentPage, totalPages, maxVisible])

  const handlePrevious = () => onPageChange(currentPage - 1)
  const handleNext = () => onPageChange(currentPage + 1)
  const handlePageClick = (page: number) => onPageChange(page)

  const isFirstPage = currentPage === 1
  const isLastPage = currentPage === totalPages

  return (
    <div className="pagination">
      <button
        className="pagination-btn"
        onClick={handlePrevious}
        disabled={isFirstPage}
        aria-label="Go to previous page"
        type="button"
      >
        Previous
      </button>

      <div className="pagination-numbers" role="navigation" aria-label="Pagination">
        {pageNumbers.map((item: PageItem, index: number) => (
          <PageItem
            key={getPageItemKey(item, index)}
            item={item}
            currentPage={currentPage}
            onPageClick={handlePageClick}
          />
        ))}
      </div>

      <button
        className="pagination-btn"
        onClick={handleNext}
        disabled={isLastPage}
        aria-label="Go to next page"
        type="button"
      >
        Next
      </button>
    </div>
  )
}

interface PageItemProps {
  item: PageItem
  currentPage: number
  onPageClick: (page: number) => void
}

function PageItem({ item, currentPage, onPageClick }: PageItemProps) {
  if (item === ELLIPSIS) {
    return (
      <span className="pagination-ellipsis" aria-hidden="true">
        {ELLIPSIS}
      </span>
    )
  }

  const isActive = currentPage === item

  return (
    <button
      className={`pagination-number ${isActive ? 'active' : ''}`}
      onClick={() => onPageClick(item)}
      aria-label={`Go to page ${item}`}
      aria-current={isActive ? 'page' : undefined}
    >
      {item}
    </button>
  )
}

function calculatePageNumbers(
  currentPage: number,
  totalPages: number,
  maxVisible: number
): PageItem[] {
  if (totalPages <= maxVisible) {
    return generatePageRange(1, totalPages)
  }

  const pages: PageItem[] = []
  const firstPage = 1
  const lastPage = totalPages

  // Always show first page
  pages.push(firstPage)

  // Calculate the range of pages to show around current page
  const halfVisible = Math.floor(maxVisible / 2)
  let startPage = Math.max(2, currentPage - halfVisible)
  const endPage = Math.min(lastPage - 1, startPage + maxVisible - 3)

  // Adjust if we're near the end
  if (endPage === lastPage - 1) {
    startPage = Math.max(2, endPage - maxVisible + 3)
  }

  // Add ellipsis after first page if there's a gap
  if (startPage > 2) {
    pages.push(ELLIPSIS)
  }

  // Add visible page numbers
  pages.push(...generatePageRange(startPage, endPage))

  // Add ellipsis before last page if there's a gap
  if (endPage < lastPage - 1) {
    pages.push(ELLIPSIS)
  }

  // Always show last page
  pages.push(lastPage)

  return pages
}

function generatePageRange(start: number, end: number): number[] {
  const pages: number[] = []
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
}

function getPageItemKey(item: PageItem, index: number): string {
  return item === ELLIPSIS ? `ellipsis-${index}` : `page-${item}`
}

export default Pagination
