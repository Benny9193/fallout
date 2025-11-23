import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { npcService } from '../api/services'
import { Loading, ErrorDisplay } from '../components'
import { ROUTES } from '../constants'
import './NPCDetail.css'

function NPCDetail() {
  const { id } = useParams<{ id: string }>()
  const npcId = id ? parseInt(id, 10) : 0

  const { data: npc, isLoading, error } = useQuery({
    queryKey: ['npc', npcId],
    queryFn: () => npcService.getNPC(npcId),
    enabled: npcId > 0,
  })

  if (isLoading) {
    return (
      <div className="page npc-detail-page">
        <Loading message="Loading NPC details..." />
      </div>
    )
  }

  if (error || !npc) {
    return (
      <div className="page npc-detail-page">
        <ErrorDisplay
          error={error || new Error('NPC not found')}
          title="Failed to load NPC"
          onRetry={() => window.location.reload()}
        />
        <Link to={ROUTES.NPCS} className="back-link">
          ← Back to NPCs
        </Link>
      </div>
    )
  }

  return (
    <div className="page npc-detail-page">
      <Link to={ROUTES.NPCS} className="back-link">
        ← Back to NPCs
      </Link>

      <div className="npc-detail-header">
        <div className="npc-detail-icon">{npc.image || '👤'}</div>
        <div className="npc-detail-header-content">
          <h1>{npc.name}</h1>
          <div className="npc-detail-badges">
            <span className={`badge badge-${npc.role.toLowerCase().replace(/\s+/g, '-')}`}>
              {npc.role}
            </span>
            {npc.faction !== 'None' && (
              <span className="badge badge-faction">{npc.faction}</span>
            )}
            {npc.isCompanion && (
              <span className="badge badge-companion">Companion</span>
            )}
            {npc.isMerchant && (
              <span className="badge badge-merchant">Merchant</span>
            )}
            {npc.isEssential && (
              <span className="badge badge-essential">Essential</span>
            )}
          </div>
          <p className="npc-detail-description">{npc.description}</p>
        </div>
      </div>

      <div className="npc-detail-content">
        {/* Stats Section */}
        {npc.stats && (
          <div className="npc-section npc-stats">
            <h2>Statistics</h2>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-label">Health:</span>
                <span className="stat-value">{npc.stats.health}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Level:</span>
                <span className="stat-value">{npc.stats.level}</span>
              </div>
              {npc.stats.resistance && (
                <>
                  <div className="stat-item">
                    <span className="stat-label">Damage Resistance:</span>
                    <span className="stat-value">{npc.stats.resistance.damage}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Energy Resistance:</span>
                    <span className="stat-value">{npc.stats.resistance.energy}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Radiation Resistance:</span>
                    <span className="stat-value">{npc.stats.resistance.radiation}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Biography Section */}
        <div className="npc-section npc-biography">
          <h2>Biography</h2>
          <div
            className="biography-content markdown-content"
            dangerouslySetInnerHTML={{
              __html: npc.biography.replace(/\n/g, '<br />').replace(/## /g, '<h3>').replace(/<br \/><br \/>/g, '</p><p>'),
            }}
          />
        </div>

        {/* Perks Section */}
        {npc.perks && npc.perks.length > 0 && (
          <div className="npc-section npc-perks">
            <h2>Perks</h2>
            <div className="perks-list">
              {npc.perks.map((perk, index) => (
                <div key={index} className="perk-item">
                  <h3 className="perk-name">⭐ {perk.name}</h3>
                  <p className="perk-description">{perk.description}</p>
                  {perk.requirement && (
                    <p className="perk-requirement">
                      <strong>Requirement:</strong> {perk.requirement}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Location Section */}
        <div className="npc-section npc-location">
          <h2>Location</h2>
          <p>📍 {npc.location}</p>
        </div>

        {/* Inventory Section */}
        {npc.inventory && npc.inventory.length > 0 && (
          <div className="npc-section npc-inventory">
            <h2>Inventory</h2>
            <ul className="inventory-list">
              {npc.inventory.map((item, index) => (
                <li key={index} className="inventory-item">
                  🎒 {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Quests Section */}
        {npc.quests && npc.quests.length > 0 && (
          <div className="npc-section npc-quests">
            <h2>Related Quests</h2>
            <ul className="quests-list">
              {npc.quests.map((quest, index) => (
                <li key={index} className="quest-item">
                  ⚔️ {quest}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Dialogue Section */}
        {npc.dialogue && npc.dialogue.length > 0 && (
          <div className="npc-section npc-dialogue">
            <h2>Notable Dialogue</h2>
            <div className="dialogue-list">
              {npc.dialogue.map((line, index) => (
                <blockquote key={index} className="dialogue-item">
                  "{line}"
                </blockquote>
              ))}
            </div>
          </div>
        )}

        {/* Relationships Section */}
        {npc.relationships && (
          <div className="npc-section npc-relationships">
            <h2>Relationships</h2>
            <div className="relationships-grid">
              {npc.relationships.likes.length > 0 && (
                <div className="relationship-group">
                  <h3>👍 Likes</h3>
                  <ul className="relationship-list">
                    {npc.relationships.likes.map((like, index) => (
                      <li key={index}>{like}</li>
                    ))}
                  </ul>
                </div>
              )}
              {npc.relationships.dislikes.length > 0 && (
                <div className="relationship-group">
                  <h3>👎 Dislikes</h3>
                  <ul className="relationship-list">
                    {npc.relationships.dislikes.map((dislike, index) => (
                      <li key={index}>{dislike}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="npc-detail-footer">
        <p className="last-updated">Last updated: {new Date(npc.updatedAt).toLocaleDateString()}</p>
      </div>
    </div>
  )
}

export default NPCDetail
