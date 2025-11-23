import api from './axios'
import type { User, Post, Activity, Metric, PostsPage, CompendiumArticle, CompendiumCategory } from '../types/api'
import { PAGINATION } from '../constants/app'

// Re-export types for backward compatibility
export type { User, Post, Activity, Metric, PostsPage, CompendiumArticle, CompendiumCategory }

// API Services
export const userService = {
  // Get user profile
  getProfile: async (userId: number = 1): Promise<User> => {
    const response = await api.get<User>(`/users/${userId}`)
    return response.data
  },

  // Get all users
  getUsers: async (): Promise<User[]> => {
    const response = await api.get<User[]>('/users')
    return response.data
  },

  // Update user
  updateUser: async (userId: number, data: Partial<User>): Promise<User> => {
    const response = await api.put<User>(`/users/${userId}`, data)
    return response.data
  },
}

export const postService = {
  // Get all posts
  getPosts: async (): Promise<Post[]> => {
    const response = await api.get<Post[]>('/posts')
    return response.data
  },

  // Get paginated posts for infinite scroll
  getPostsPage: async (page: number = 1, limit: number = PAGINATION.DEFAULT_PAGE_SIZE): Promise<PostsPage> => {
    // JSONPlaceholder has 100 posts total
    const start = (page - 1) * limit
    const response = await api.get<Post[]>('/posts', {
      params: {
        _start: start,
        _limit: limit,
      },
    })

    const posts = response.data
    const hasMore = posts.length === limit
    const nextPage = hasMore ? page + 1 : undefined

    return {
      posts,
      nextPage,
      hasMore,
    }
  },

  // Get posts by user
  getUserPosts: async (userId: number): Promise<Post[]> => {
    const response = await api.get<Post[]>(`/posts?userId=${userId}`)
    return response.data
  },

  // Get single post
  getPost: async (postId: number): Promise<Post> => {
    const response = await api.get<Post>(`/posts/${postId}`)
    return response.data
  },
}

export const dashboardService = {
  // Get dashboard metrics
  getMetrics: async (): Promise<Metric[]> => {
    // Since we're using JSONPlaceholder, we'll fetch users and posts and create metrics
    const [users, posts] = await Promise.all([
      userService.getUsers(),
      postService.getPosts(),
    ])

    return [
      { label: 'Total Users', value: users.length, change: '+12%', positive: true },
      { label: 'Total Posts', value: posts.length, change: '+8%', positive: true },
      { label: 'Active Sessions', value: '89', change: '+5%', positive: true },
      { label: 'Errors', value: '0', change: '-100%', positive: true },
    ]
  },

  // Get recent activity
  getActivity: async (): Promise<Activity[]> => {
    // Mock activity data (in a real app, this would come from an API)
    return [
      { id: 1, text: 'New user registered', time: '2 minutes ago' },
      { id: 2, text: 'Post created', time: '15 minutes ago' },
      { id: 3, text: 'Profile updated', time: '1 hour ago' },
      { id: 4, text: 'Settings changed', time: '2 hours ago' },
    ]
  },
}

export const compendiumService = {
  // Get all articles
  getArticles: async (): Promise<CompendiumArticle[]> => {
    // Mock compendium articles data
    return [
      {
        id: 1,
        title: 'Getting Started with the App',
        category: 'Basics',
        description: 'Learn the fundamentals of using this application.',
        content: `Welcome to the Compendium! This guide will help you get started with all the basic features.

## What You'll Learn
- How to navigate the application
- Understanding the dashboard
- Managing your profile
- Basic settings configuration

## Getting Started
Start by exploring the main dashboard to understand the interface layout and available features.`,
        createdAt: '2024-01-15',
        updatedAt: '2024-11-20',
        readTime: 5,
        views: 342,
      },
      {
        id: 2,
        title: 'Dashboard Overview',
        category: 'Features',
        description: 'Complete guide to understanding your dashboard metrics and analytics.',
        content: `The dashboard provides a comprehensive overview of your activity and metrics.

## Key Sections
- **Metrics**: Real-time statistics about your usage
- **Activity Feed**: Recent actions and updates
- **Quick Actions**: Fast access to common tasks

## Understanding Metrics
Each metric card displays:
- Current value
- Percentage change
- Trend indicator`,
        createdAt: '2024-01-20',
        updatedAt: '2024-11-15',
        readTime: 8,
        views: 218,
      },
      {
        id: 3,
        title: 'Theme Customization',
        category: 'Customization',
        description: 'How to customize your app theme and appearance settings.',
        content: `Personalize your experience by adjusting theme settings.

## Available Themes
- **Light Mode**: Bright interface for daytime use
- **Dark Mode**: Easy on the eyes for evening use
- **System**: Follow your device settings

## How to Change Theme
1. Go to Settings (⚙️ icon)
2. Click the Theme Toggle button
3. Your preference is automatically saved`,
        createdAt: '2024-02-01',
        updatedAt: '2024-11-10',
        readTime: 4,
        views: 156,
      },
      {
        id: 4,
        title: 'Keyboard Shortcuts',
        category: 'Tips & Tricks',
        description: 'Speed up your workflow with keyboard shortcuts.',
        content: `Master these keyboard shortcuts to navigate faster.

## Navigation Shortcuts
- \`G + H\`: Go to Home
- \`G + D\`: Go to Dashboard
- \`G + P\`: Go to Posts
- \`G + S\`: Go to Settings
- \`T\`: Toggle Theme
- \`?\`: Show this help menu

## Productivity Tips
- Use shortcuts to switch between pages instantly
- Theme toggle is always one keystroke away`,
        createdAt: '2024-02-10',
        updatedAt: '2024-11-05',
        readTime: 3,
        views: 89,
      },
      {
        id: 5,
        title: 'Mobile App Guide',
        category: 'Mobile',
        description: 'Optimize your mobile experience with these tips.',
        content: `Get the most out of the mobile version of the app.

## Mobile Features
- Responsive design for all screen sizes
- Touch-friendly navigation
- Optimized performance
- Offline support (PWA)

## Mobile-First Tips
- Use the bottom navigation for quick access
- Swipe left/right to navigate
- Tap and hold for context menus
- Use dark mode to save battery`,
        createdAt: '2024-03-01',
        updatedAt: '2024-11-18',
        readTime: 6,
        views: 203,
      },
      {
        id: 6,
        title: 'Privacy & Security',
        category: 'Security',
        description: 'Learn how we protect your data and privacy.',
        content: `Your privacy and security are our top priorities.

## Data Protection
- End-to-end encryption
- Secure authentication
- Regular security audits
- Compliant with GDPR and CCPA

## Best Practices
- Use strong passwords
- Enable two-factor authentication
- Review your activity regularly
- Report suspicious activity immediately`,
        createdAt: '2024-03-15',
        updatedAt: '2024-11-01',
        readTime: 7,
        views: 124,
      },
    ]
  },

  // Get article by ID
  getArticle: async (articleId: number): Promise<CompendiumArticle> => {
    const articles = await compendiumService.getArticles()
    const article = articles.find((a) => a.id === articleId)
    if (!article) {
      throw new Error(`Article with ID ${articleId} not found`)
    }
    return article
  },

  // Get articles by category
  getArticlesByCategory: async (category: string): Promise<CompendiumArticle[]> => {
    const articles = await compendiumService.getArticles()
    return articles.filter((a) => a.category === category)
  },

  // Get categories
  getCategories: async (): Promise<CompendiumCategory[]> => {
    const articles = await compendiumService.getArticles()
    const categoryMap = new Map<string, number>()

    articles.forEach((article) => {
      const count = categoryMap.get(article.category) || 0
      categoryMap.set(article.category, count + 1)
    })

    const categories: CompendiumCategory[] = [
      {
        id: 'basics',
        name: 'Basics',
        description: 'Fundamental concepts',
        count: categoryMap.get('Basics') || 0,
      },
      {
        id: 'features',
        name: 'Features',
        description: 'Feature guides and tutorials',
        count: categoryMap.get('Features') || 0,
      },
      {
        id: 'customization',
        name: 'Customization',
        description: 'Personalize your experience',
        count: categoryMap.get('Customization') || 0,
      },
      {
        id: 'tips-tricks',
        name: 'Tips & Tricks',
        description: 'Productivity tips and shortcuts',
        count: categoryMap.get('Tips & Tricks') || 0,
      },
      {
        id: 'mobile',
        name: 'Mobile',
        description: 'Mobile-specific guides',
        count: categoryMap.get('Mobile') || 0,
      },
      {
        id: 'security',
        name: 'Security',
        description: 'Privacy and security information',
        count: categoryMap.get('Security') || 0,
      },
    ]

    return categories
  },

  // Search articles
  searchArticles: async (query: string): Promise<CompendiumArticle[]> => {
    const articles = await compendiumService.getArticles()
    const lowerQuery = query.toLowerCase()
    return articles.filter(
      (article) =>
        article.title.toLowerCase().includes(lowerQuery) ||
        article.description.toLowerCase().includes(lowerQuery) ||
        article.content.toLowerCase().includes(lowerQuery),
    )
  },
}
