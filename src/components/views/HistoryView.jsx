import React, { useState, useEffect } from 'react'

const HistoryView = () => {
  const [sessions, setSessions] = useState([])
  const [selectedSession, setSelectedSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadConversationHistory()
  }, [])

  const loadConversationHistory = async () => {
    try {
      if (window.cheddar?.getAllConversationSessions) {
        const allSessions = await window.cheddar.getAllConversationSessions()
        setSessions(allSessions)
      }
    } catch (error) {
      console.error('Error loading conversation history:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (timestamp) => {
    const date = new Date(parseInt(timestamp))
    return date.toLocaleString()
  }

  const getProfileName = (profile) => {
    const profiles = {
      interview: 'Job Interview',
      sales: 'Sales Call',
      meeting: 'Business Meeting',
      presentation: 'Presentation',
      negotiation: 'Negotiation',
      exam: 'Exam Assistant'
    }
    return profiles[profile] || profile
  }

  const renderConversationHistory = (history) => {
    if (!history || !Array.isArray(history)) return null

    return (
      <div className="space-y-4">
        {history.map((turn, index) => (
          <div key={index} className="border-l-2 border-white/20 pl-4">
            <div className="text-xs text-white/60 mb-1">
              {turn.role === 'user' ? 'You' : 'AI Assistant'}
            </div>
            <div className="text-sm text-white/80 whitespace-pre-wrap">
              {turn.parts?.[0]?.text || 'No content'}
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-white/60">Loading conversation history...</div>
      </div>
    )
  }

  if (sessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <div className="text-white/60 mb-4">No conversation history found</div>
        <div className="text-sm text-white/40">
          Start a session to begin building your conversation history
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex">
      {/* Sessions List */}
      <div className="w-1/3 border-r border-white/20 pr-4">
        <div className="text-lg font-medium mb-4">Sessions</div>
        <div className="space-y-2 max-h-full overflow-y-auto custom-scrollbar">
          {sessions.map((session) => (
            <div
              key={session.sessionId}
              onClick={() => setSelectedSession(session)}
              className={`p-3 rounded-lg cursor-pointer transition-all ${
                selectedSession?.sessionId === session.sessionId
                  ? 'bg-app-focus/20 border border-app-focus/40'
                  : 'bg-white/5 hover:bg-white/10 border border-transparent'
              }`}
            >
              <div className="text-sm font-medium text-white/90">
                {formatDate(session.timestamp)}
              </div>
              <div className="text-xs text-white/60 mt-1">
                Profile: {getProfileName(session.profile || 'unknown')}
              </div>
              <div className="text-xs text-white/50 mt-1">
                {session.conversationHistory?.length || 0} messages
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Session Details */}
      <div className="flex-1 pl-4">
        {selectedSession ? (
          <div className="h-full flex flex-col">
            <div className="mb-4">
              <div className="text-lg font-medium">
                Session from {formatDate(selectedSession.timestamp)}
              </div>
              <div className="text-sm text-white/60">
                Profile: {getProfileName(selectedSession.profile || 'unknown')}
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {selectedSession.conversationHistory && selectedSession.conversationHistory.length > 0 ? (
                renderConversationHistory(selectedSession.conversationHistory)
              ) : (
                <div className="text-white/60 text-center py-8">
                  No conversation data available for this session
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-white/60 text-center">
              <div className="mb-2">Select a session to view details</div>
              <div className="text-sm text-white/40">
                Choose from the sessions list on the left
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default HistoryView