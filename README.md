# Fallout Web App

A React-based web application built with Vite and TypeScript.

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

### Development

Start the development server:
```bash
npm run dev
```

The app will open automatically at `http://localhost:3000`

### Build

Create a production build:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

### Linting

Run ESLint:
```bash
npm run lint
```

## Tech Stack

- **React 18** - UI library with hooks
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Zustand** - Lightweight state management
- **React Query** - Server state management and data fetching
- **Axios** - HTTP client
- **ESLint** - Code linting

## Features

- Fast development with Vite HMR
- Type-safe development with TypeScript
- Client-side routing with React Router
- Global state management with Zustand
- Data fetching with React Query and Axios
- Loading and error states
- RESTful API integration (JSONPlaceholder demo)
- Pagination with reusable Pagination component
- Infinite scroll with React Query's useInfiniteQuery
- IntersectionObserver-based auto-loading

## Project Structure

```
fallout/
├── public/               # Static assets
├── src/
│   ├── api/
│   │   ├── axios.ts      # Axios configuration
│   │   └── services.ts   # API service functions
│   ├── components/
│   │   ├── Navigation.tsx
│   │   ├── Navigation.css
│   │   ├── Pagination.tsx
│   │   └── Pagination.css
│   ├── hooks/
│   │   └── useInfiniteScroll.ts  # Custom hook for infinite scroll
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Posts.tsx          # Paginated posts list
│   │   ├── InfinitePosts.tsx  # Infinite scroll posts list
│   │   ├── Profile.tsx
│   │   ├── Settings.tsx
│   │   ├── About.tsx
│   │   └── NotFound.tsx
│   ├── store/
│   │   └── counterStore.ts  # Zustand store
│   ├── App.tsx           # Main app component
│   ├── App.css           # App styles
│   ├── main.tsx          # Entry point with React Query provider
│   └── index.css         # Global styles
├── .env.example          # Environment variables template
├── index.html            # HTML template
├── package.json          # Dependencies
├── tsconfig.json         # TypeScript config
└── vite.config.ts        # Vite config
```

## API Integration

The app uses [JSONPlaceholder](https://jsonplaceholder.typicode.com) as a demo REST API.

To configure a different API:
1. Copy `.env.example` to `.env`
2. Update `VITE_API_URL` with your API endpoint
3. Modify services in `src/api/services.ts` as needed

### API Features

- Automatic request/response interceptors
- Token-based authentication support
- Centralized error handling
- TypeScript types for all API responses
- React Query for caching and state management

## Pages

The application includes the following pages:

- **Home** (`/`) - Landing page with a counter using Zustand
- **Dashboard** (`/dashboard`) - Metrics and activity overview with real API data
- **Posts** (`/posts`) - Paginated list of posts with 10 items per page
- **Infinite Posts** (`/posts/infinite`) - Infinite scroll version of posts list
- **Profile** (`/profile`) - User profile with stats from API
- **Settings** (`/settings`) - App preferences and configuration
- **About** (`/about`) - Information about the tech stack

## Components

### Pagination

A reusable pagination component used in the Posts page:

```tsx
<Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={handlePageChange}
  maxVisible={5}  // Optional: max page numbers to show
/>
```

Features:
- Smart ellipsis display for large page counts
- Previous/Next buttons
- Active page highlighting
- Responsive design

### Infinite Scroll

A custom hook (`useInfiniteScroll`) combined with React Query's `useInfiniteQuery` for infinite scrolling:

```tsx
import { useInfiniteScroll } from '../hooks/useInfiniteScroll'
import { useInfiniteQuery } from '@tanstack/react-query'

const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
  queryKey: ['infinitePosts'],
  queryFn: ({ pageParam = 1 }) => postService.getPostsPage(pageParam, 10),
  getNextPageParam: (lastPage) => lastPage.nextPage,
  initialPageParam: 1,
})

const loadMoreRef = useInfiniteScroll({
  loading: isFetchingNextPage,
  hasMore: hasNextPage ?? false,
  onLoadMore: fetchNextPage,
})

// In JSX:
<div ref={loadMoreRef} />
```

Features:
- IntersectionObserver-based detection
- Automatic loading when scrolling near bottom
- Loading spinner while fetching
- End of content indicator
- Configurable trigger distance and threshold
- Switch between pagination and infinite scroll views

Both pagination and infinite scroll patterns are demonstrated in the Posts pages, with a toggle button to switch between them.