import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { npcService } from '../api/services'
import { Loading, ErrorDisplay, EmptyState } from '../components'
import { ROUTES } from '../constants'
import type { NPCRole, NPCFaction } from '../types/api'
import './NPCs.css'

function NPCs() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRole, setSelectedRole] = useState<NPCRole | 'All'>('All')
  const [selectedFaction, setSelectedFaction] = useState<NPCFaction | 'All'>('All')
  const [companionsOnly, setCompanionsOnly] = useState(false)

  // Fetch NPCs
  const { data: npcs, isLoading, error } = useQuery({
    queryKey: ['npcs'],
    queryFn: npcService.getNPCs,
  })

  // Filter NPCs based on search, role, and faction
  const filteredNPCs = useMemo(() => {
    if (!npcs) return []

    let result = npcs

    // Filter by role
    if (selectedRole !== 'All') {
      result = result.filter((npc) => npc.role === selectedRole)
    }

    // Filter by faction
    if (selectedFaction !== 'All') {
      result = result.filter((npc) => npc.faction === selectedFaction)
    }

    // Filter companions only
    if (companionsOnly) {
      result = result.filter((npc) => npc.isCompanion)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (npc) =>
          npc.name.toLowerCase().includes(query) ||
          npc.description.toLowerCase().includes(query) ||
          npc.location.toLowerCase().includes(query),
      )
    }

    return result
  }, [npcs, searchQuery, selectedRole, selectedFaction, companionsOnly])

  if (isLoading) {
    return (
      <div className="page npcs-page">
        <h1>NPCs</h1>
        <Loading message="Loading NPCs..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="page npcs-page">
        <h1>NPCs</h1>
        <ErrorDisplay
          error={error}
          title="Failed to load NPCs"
          onRetry={() => window.location.reload()}
        />
      </div>
    )
  }

  return (
    <div className="page npcs-page">
      <div className="npcs-header">
        <div className="npcs-title">
          <h1>NPCs Database</h1>
          <p>Characters, companions, and personalities of the wasteland</p>
        </div>
        <div className="npcs-stats">
          <div className="stat">
            <span className="stat-label">Total</span>
            <span className="stat-value">{npcs?.length || 0}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Companions</span>
            <span className="stat-value">
              {npcs?.filter((n) => n.isCompanion).length || 0}
            </span>
          </div>
          <div className="stat">
            <span className="stat-label">Merchants</span>
            <span className="stat-value">
              {npcs?.filter((n) => n.isMerchant).length || 0}
            </span>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="npcs-search">
        <input
          type="text"
          placeholder="Search NPCs by name, description, or location..."
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

      {/* Filters */}
      <div className="npcs-filters">
        <div className="filter-group">
          <label htmlFor="role-filter">Role:</label>
          <select
            id="role-filter"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value as NPCRole | 'All')}
            className="filter-select"
          >
            <option value="All">All Roles</option>
            <option value="Companion">Companion</option>
            <option value="Merchant">Merchant</option>
            <option value="Quest Giver">Quest Giver</option>
            <option value="Faction Leader">Faction Leader</option>
            <option value="Civilian">Civilian</option>
            <option value="Enemy">Enemy</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="faction-filter">Faction:</label>
          <select
            id="faction-filter"
            value={selectedFaction}
            onChange={(e) => setSelectedFaction(e.target.value as NPCFaction | 'All')}
            className="filter-select"
          >
            <option value="All">All Factions</option>
            <option value="Brotherhood of Steel">Brotherhood of Steel</option>
            <option value="Railroad">Railroad</option>
            <option value="Institute">Institute</option>
            <option value="Minutemen">Minutemen</option>
            <option value="Raiders">Raiders</option>
            <option value="Gunners">Gunners</option>
            <option value="Children of Atom">Children of Atom</option>
            <option value="None">Independent</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="companions-only" className="checkbox-label">
            <input
              id="companions-only"
              type="checkbox"
              checked={companionsOnly}
              onChange={(e) => setCompanionsOnly(e.target.checked)}
              className="filter-checkbox"
            />
            <span>Companions Only</span>
          </label>
        </div>
      </div>

      {/* Active Filters Display */}
      {(selectedRole !== 'All' || selectedFaction !== 'All' || companionsOnly || searchQuery) && (
        <div className="active-filters">
          <span className="filter-label">Active filters:</span>
          {searchQuery && (
            <span className="filter-tag">
              Search: "{searchQuery}"
              <button onClick={() => setSearchQuery('')}>✕</button>
            </span>
          )}
          {selectedRole !== 'All' && (
            <span className="filter-tag">
              Role: {selectedRole}
              <button onClick={() => setSelectedRole('All')}>✕</button>
            </span>
          )}
          {selectedFaction !== 'All' && (
            <span className="filter-tag">
              Faction: {selectedFaction}
              <button onClick={() => setSelectedFaction('All')}>✕</button>
            </span>
          )}
          {companionsOnly && (
            <span className="filter-tag">
              Companions Only
              <button onClick={() => setCompanionsOnly(false)}>✕</button>
            </span>
          )}
          <button
            className="clear-all-filters"
            onClick={() => {
              setSearchQuery('')
              setSelectedRole('All')
              setSelectedFaction('All')
              setCompanionsOnly(false)
            }}
          >
            Clear All
          </button>
        </div>
      )}

      {/* NPCs List */}
      <div className="npcs-list">
        {filteredNPCs.length === 0 ? (
          <EmptyState
            title="No NPCs found"
            message="Try adjusting your filters or search query"
            action={{
              label: 'Clear Filters',
              onClick: () => {
                setSearchQuery('')
                setSelectedRole('All')
                setSelectedFaction('All')
                setCompanionsOnly(false)
              },
            }}
          />
        ) : (
          filteredNPCs.map((npc) => (
            <Link
              key={npc.id}
              to={ROUTES.NPC_DETAIL.replace(':id', npc.id.toString())}
              className="npc-card"
            >
              <div className="npc-card-header">
                <div className="npc-icon">{npc.image || '👤'}</div>
                <div className="npc-header-content">
                  <h3 className="npc-name">{npc.name}</h3>
                  <div className="npc-badges">
                    <span className={`badge badge-${npc.role.toLowerCase().replace(/\s+/g, '-')}`}>
                      {npc.role}
                    </span>
                    {npc.faction !== 'None' && (
                      <span className="badge badge-faction">
                        {npc.faction}
                      </span>
                    )}
                    {npc.isCompanion && (
                      <span className="badge badge-companion">Companion</span>
                    )}
                    {npc.isMerchant && (
                      <span className="badge badge-merchant">Merchant</span>
                    )}
                  </div>
                </div>
              </div>

              <p className="npc-description">{npc.description}</p>

              <div className="npc-meta">
                <div className="npc-meta-item">
                  <span className="meta-icon">📍</span>
                  <span className="meta-text">{npc.location}</span>
                </div>
                {npc.stats && (
                  <div className="npc-meta-item">
                    <span className="meta-icon">❤️</span>
                    <span className="meta-text">Level {npc.stats.level}</span>
                  </div>
                )}
                {npc.perks && npc.perks.length > 0 && (
                  <div className="npc-meta-item">
                    <span className="meta-icon">⭐</span>
                    <span className="meta-text">{npc.perks.length} Perk{npc.perks.length !== 1 ? 's' : ''}</span>
                  </div>
                )}
              </div>
            </Link>
          ))
        )}
      </div>

      {filteredNPCs.length > 0 && (
        <div className="npcs-footer">
          <p>Showing {filteredNPCs.length} of {npcs?.length || 0} NPCs</p>
        </div>
      )}
    </div>
  )
}

export default NPCs
