import React from 'react'

const Waiting = () => {
  return (
    <div>
        <div className="waiting-message">
    <div className="waiting-message-grid">
      <div className="loading-indicator">
        <div className="loading-spinner"></div>
      </div>
      <div className="status-text">
        <div className="status-label">
          <span className="status-prompt">&gt;</span>
          <span>GAME STATUS:</span>
          <span className="status-value">WAITING</span>
        </div>
        <div className="status-message">
          Waiting for another player to join...
          <span className="cursor-blink"></span>
        </div>
      </div>
    </div>
    
    <div className="connection-status">
      <div className="status-indicator"></div>
      <div className="connection-info">
        Connection established | Server ready | Matchmaking active
      </div>
    </div>
  </div>
    </div>
  )
}

export default Waiting