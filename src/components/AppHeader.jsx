import React, { useState, useEffect } from 'react'

const AppHeader = ({
  currentView,
  statusText,
  startTime,
  advancedMode,
  isClickThrough,
  onCustomizeClick,
  onHelpClick,
  onHistoryClick,
  onAdvancedClick,
  onCloseClick,
  onBackClick,
  onHideToggleClick
}) => {
  const [elapsedTime, setElapsedTime] = useState('')

  useEffect(() => {
    let interval = null
    
    if (currentView === 'assistant' && startTime) {
      interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000)
        setElapsedTime(`${elapsed}s`)
      }, 1000)
    } else {
      setElapsedTime('')
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [currentView, startTime])

  const getViewTitle = () => {
    const titles = {
      onboarding: 'Welcome to Cheating Daddy',
      main: 'Cheating Daddy',
      customize: 'Customize',
      help: 'Help & Shortcuts',
      history: 'Conversation History',
      advanced: 'Advanced Tools',
      assistant: 'Cheating Daddy',
    }
    return titles[currentView] || 'Cheating Daddy'
  }

  const isNavigationView = () => {
    return ['customize', 'help', 'history', 'advanced'].includes(currentView)
  }

  const isMacOS = window.cheddar?.isMacOS || navigator.platform.toUpperCase().indexOf('MAC') >= 0

  return (
    <div 
      className="flex items-center px-5 py-2 border border-app-border bg-app-bg rounded-lg"
      style={{ WebkitAppRegion: 'drag' }}
    >
      <div className="flex-1 text-base font-semibold" style={{ WebkitAppRegion: 'drag' }}>
        {getViewTitle()}
      </div>
      
      <div 
        className="flex gap-3 items-center text-sm text-app-text-secondary"
        style={{ WebkitAppRegion: 'no-drag' }}
      >
        {currentView === 'assistant' && (
          <>
            <span>{elapsedTime}</span>
            <span>{statusText}</span>
          </>
        )}
        
        {currentView === 'main' && (
          <>
            {/* History Button */}
            <button
              className="p-2 rounded-lg opacity-60 hover:opacity-100 hover:bg-app-hover transition-all"
              onClick={onHistoryClick}
            >
              <svg width="24" height="24" strokeWidth="1.7" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 21V7C12 5.89543 12.8954 5 14 5H21.4C21.7314 5 22 5.26863 22 5.6V18.7143"
                  stroke="currentColor"
                  strokeLinecap="round"
                />
                <path
                  d="M12 21V7C12 5.89543 11.1046 5 10 5H2.6C2.26863 5 2 5.26863 2 5.6V18.7143"
                  stroke="currentColor"
                  strokeLinecap="round"
                />
                <path d="M14 19L22 19" stroke="currentColor" strokeLinecap="round" />
                <path d="M10 19L2 19" stroke="currentColor" strokeLinecap="round" />
                <path
                  d="M12 21C12 19.8954 12.8954 19 14 19"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 21C12 19.8954 11.1046 19 10 19"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {/* Advanced Tools Button */}
            {advancedMode && (
              <button
                className="p-2 rounded-lg opacity-60 hover:opacity-100 hover:bg-app-hover transition-all"
                onClick={onAdvancedClick}
                title="Advanced Tools"
              >
                <svg width="24" height="24" strokeWidth="1.7" viewBox="0 0 24 24" fill="none">
                  <path d="M18.5 15L5.5 15" stroke="currentColor" strokeLinejoin="round" />
                  <path
                    d="M16 4L8 4"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9 4.5L9 10.2602C9 10.7376 8.82922 11.1992 8.51851 11.5617L3.48149 17.4383C3.17078 17.8008 3 18.2624 3 18.7398V19C3 20.1046 3.89543 21 5 21L19 21C20.1046 21 21 20.1046 21 19V18.7398C21 18.2624 20.8292 17.8008 20.5185 17.4383L15.4815 11.5617C15.1708 11.1992 15 10.7376 15 10.2602L15 4.5"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 9.01L12.01 8.99889"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M11 2.01L11.01 1.99889"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            )}

            {/* Settings Button */}
            <button
              className="p-2 rounded-lg opacity-60 hover:opacity-100 hover:bg-app-hover transition-all"
              onClick={onCustomizeClick}
            >
              <svg width="24" height="24" strokeWidth="1.7" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M19.6224 10.3954L18.5247 7.7448L20 6L18 4L16.2647 5.48295L13.5578 4.36974L12.9353 2H10.981L10.3491 4.40113L7.70441 5.51596L6 4L4 6L5.45337 7.78885L4.3725 10.4463L2 11V13L4.40111 13.6555L5.51575 16.2997L4 18L6 20L7.79116 18.5403L10.397 19.6123L11 22H13L13.6045 19.6132L16.2551 18.5155C16.6969 18.8313 18 20 18 20L20 18L18.5159 16.2494L19.6139 13.598L21.9999 12.9772L22 11L19.6224 10.3954Z"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {/* Help Button */}
            <button
              className="p-2 rounded-lg opacity-60 hover:opacity-100 hover:bg-app-hover transition-all"
              onClick={onHelpClick}
            >
              <svg width="24" height="24" strokeWidth="1.7" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 9C9 5.49997 14.5 5.5 14.5 9C14.5 11.5 12 10.9999 12 13.9999"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 18.01L12.01 17.9989"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </>
        )}

        {currentView === 'assistant' && (
          <>
            <button
              className="px-4 py-2 bg-app-button border border-white/10 rounded-lg text-sm font-medium hover:bg-app-hover transition-all"
              onClick={onHideToggleClick}
            >
              Hide&nbsp;&nbsp;
              <span className="bg-white/10 px-2 py-1 rounded text-xs pointer-events-none">
                {isMacOS ? 'Cmd' : 'Ctrl'}
              </span>
              &nbsp;&nbsp;
              <span className="bg-white/10 px-2 py-1 rounded text-xs">\</span>
            </button>
            <button
              className="p-2 rounded-lg opacity-60 hover:opacity-100 hover:bg-app-hover transition-all"
              onClick={onCloseClick}
            >
              <svg width="24" height="24" strokeWidth="1.7" viewBox="0 0 24 24" fill="none">
                <path
                  d="M6.75827 17.2426L12.0009 12M17.2435 6.75736L12.0009 12M12.0009 12L6.75827 6.75736M12.0009 12L17.2435 17.2426"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </>
        )}

        {!['main', 'assistant'].includes(currentView) && (
          <button
            className="p-2 rounded-lg opacity-60 hover:opacity-100 hover:bg-app-hover transition-all"
            onClick={isNavigationView() ? onBackClick : onCloseClick}
          >
            <svg width="24" height="24" strokeWidth="1.7" viewBox="0 0 24 24" fill="none">
              <path
                d="M6.75827 17.2426L12.0009 12M17.2435 6.75736L12.0009 12M12.0009 12L6.75827 6.75736M12.0009 12L17.2435 17.2426"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}

export default AppHeader