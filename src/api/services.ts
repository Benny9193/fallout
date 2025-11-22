import api from './axios'

// Types
export interface User {
  id: number
  name: string
  email: string
  username: string
  phone: string
  website: string
}

export interface Post {
  id: number
  userId: number
  title: string
  body: string
}

export interface Activity {
  id: number
  text: string
  time: string
}

export interface Metric {
  label: string
  value: string | number
  change: string
  positive: boolean
}

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

export interface PostsPage {
  posts: Post[]
  nextPage: number | undefined
  hasMore: boolean
}

export const postService = {
  // Get all posts
  getPosts: async (): Promise<Post[]> => {
    const response = await api.get<Post[]>('/posts')
    return response.data
  },

  // Get paginated posts for infinite scroll
  getPostsPage: async (page: number = 1, limit: number = 10): Promise<PostsPage> => {
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
