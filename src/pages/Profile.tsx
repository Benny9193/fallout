import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { userService, postService } from '../api/services'
import './Profile.css'

function Profile() {
  const [isEditing, setIsEditing] = useState(false)

  // Fetch user profile from API
  const { data: user, isLoading: userLoading, error: userError } = useQuery({
    queryKey: ['user', 1],
    queryFn: () => userService.getProfile(1),
  })

  // Fetch user posts to calculate stats
  const { data: posts, isLoading: postsLoading } = useQuery({
    queryKey: ['userPosts', 1],
    queryFn: () => postService.getUserPosts(1),
  })

  const stats = [
    { label: 'Posts', value: posts?.length || 0 },
    { label: 'Projects', value: '8' },
    { label: 'Team Members', value: '15' },
    { label: 'Achievements', value: '23' },
  ]

  if (userLoading) {
    return (
      <div className="page profile-page">
        <h1>Profile</h1>
        <div className="loading">Loading profile...</div>
      </div>
    )
  }

  if (userError) {
    return (
      <div className="page profile-page">
        <h1>Profile</h1>
        <div className="error">Error loading profile: {(userError as Error).message}</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="page profile-page">
      <h1>Profile</h1>

      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">
            {user.name.charAt(0)}
          </div>
          <div className="profile-info">
            <h2>{user.name}</h2>
            <p className="profile-role">@{user.username}</p>
            <p className="profile-location">{user.website}</p>
          </div>
          <button
            className="edit-button"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        <div className="profile-stats">
          {postsLoading ? (
            <div className="loading">Loading stats...</div>
          ) : (
            stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))
          )}
        </div>

        <div className="profile-details">
          <h3>Account Details</h3>
          <div className="detail-row">
            <span className="detail-label">Email</span>
            <span className="detail-value">{user.email}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Phone</span>
            <span className="detail-value">{user.phone}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Account Status</span>
            <span className="detail-value status-active">Active</span>
          </div>
        </div>

        {isEditing && (
          <div className="edit-form">
            <h3>Edit Profile</h3>
            <p className="info-message">Profile editing form would go here</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile
