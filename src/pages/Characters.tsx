import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { characterService } from '../api/services'
import { Loading, ErrorDisplay, EmptyState } from '../components'
import type { Character } from '../types/api'
import './Characters.css'

function Characters() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<Character['type'] | null>(null)

  // Fetch characters
  const { data: characters, isLoading, error } = useQuery({
    queryKey: ['characters'],
    queryFn: characterService.getCharacters,
  })

  // Filter characters based on search and type
  const filteredCharacters = useMemo(() => {
    if (!characters) return []

    let result = characters

    // Filter by type
    if (selectedType) {
      result = result.filter((character) => character.type === selectedType)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (character) =>
          character.name.toLowerCase().includes(query) ||
          character.faction.toLowerCase().includes(query) ||
          character.game.toLowerCase().includes(query) ||
          character.role.toLowerCase().includes(query) ||
          character.description.toLowerCase().includes(query),
      )
    }

    return result
  }, [characters, searchQuery, selectedType])

  // Get character type counts
  const typeCounts = useMemo(() => {
    if (!characters) return {}
    const counts: Record<string, number> = {}
    characters.forEach((char) => {
      counts[char.type] = (counts[char.type] || 0) + 1
    })
    return counts
  }, [characters])

  const characterTypes: Character['type'][] = [
    'Protagonist',
    'Companion',
    'Antagonist',
    'Faction Leader',
    'NPC',
  ]

  if (isLoading) {
    return (
      <div className="page characters-page">
        <h1>Characters</h1>
        <Loading message="Loading characters..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="page characters-page">
        <h1>Characters</h1>
        <ErrorDisplay
          error={error}
          title="Failed to load characters"
          onRetry={() => window.location.reload()}
        />
      </div>
    )
  }

  return (
    <div className="page characters-page">
      <div className="characters-header">
        <div className="characters-title">
          <h1>Characters</h1>
          <p>Notable figures from across the Fallout universe</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="characters-search">
        <input
          type="text"
          placeholder="Search characters..."
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

      {/* Type Filter */}
      <div className="characters-types">
        <button
          className={`type-tag ${!selectedType ? 'active' : ''}`}
          onClick={() => setSelectedType(null)}
        >
          All Characters ({characters?.length || 0})
        </button>
        {characterTypes.map((type) => (
          <button
            key={type}
            className={`type-tag ${selectedType === type ? 'active' : ''}`}
            onClick={() => setSelectedType(type)}
          >
            {type} ({typeCounts[type] || 0})
          </button>
        ))}
      </div>

      {/* Characters List */}
      {filteredCharacters.length === 0 ? (
        <EmptyState
          title={searchQuery ? 'No characters found' : 'No characters in this category'}
          message={
            searchQuery
              ? `We couldn't find any characters matching "${searchQuery}". Try a different search term.`
              : 'There are no characters in this category.'
          }
          icon="🎭"
        />
      ) : (
        <div className="characters-list">
          {filteredCharacters.map((character) => (
            <div key={character.id} className="character-card">
              <div className="character-card-header">
                <div className="character-info">
                  <h3 className="character-name">{character.name}</h3>
                  <div className="character-meta">
                    <span className="character-type">{character.type}</span>
                    <span className="character-status" data-status={character.status.toLowerCase()}>
                      {character.status}
                    </span>
                  </div>
                </div>
              </div>
              <div className="character-details">
                <div className="character-detail">
                  <span className="detail-label">Faction:</span>
                  <span className="detail-value">{character.faction}</span>
                </div>
                <div className="character-detail">
                  <span className="detail-label">Role:</span>
                  <span className="detail-value">{character.role}</span>
                </div>
                <div className="character-detail">
                  <span className="detail-label">Game:</span>
                  <span className="detail-value">{character.game}</span>
                </div>
              </div>
              <p className="character-description">{character.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Characters
