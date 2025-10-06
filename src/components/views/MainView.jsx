import React, { useState, useEffect, useCallback } from 'react'

const MainView = ({ onStart, onAPIKeyHelp, onLayoutModeChange }) => {
  const [apiKey, setApiKey] = useState(localStorage.getItem('apiKey') || '')
  const [showApiKeyError, setShowApiKeyError] = useState(false)
  const [isInitializing, setIsInitializing] = useState(false)

  useEffect(() => {
    // Listen for session initialization status
    if (window.electron?.ipcRenderer) {
      const handleSessionInitializing = (event, initializing) => {
        setIsInitializing(initializing)
      }

      window.electron.ipcRenderer.on('session-initializing', handleSessionInitializing)

      return () => {
        window.electron.ipcRenderer.removeAllListeners('session-initializing')
      }
    }

    // Load and apply layout mode on startup
    loadLayoutMode()
    
    // Resize window for this view
    if (window.resizeLayout) {
      window.resizeLayout()
    }
  }, [])

  useEffect(() => {
    // Add keyboard event listener for Ctrl+Enter (or Cmd+Enter on Mac)
    const handleKeydown = (e) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
      const isStartShortcut = isMac ? e.metaKey && e.key === 'Enter' : e.ctrlKey && e.key === 'Enter'

      if (isStartShortcut) {
        e.preventDefault()
        handleStartClick()
      }
    }

    document.addEventListener('keydown', handleKeydown)
    return () => document.removeEventListener('keydown', handleKeydown)
  }, [])

  const loadLayoutMode = () => {
    const savedLayoutMode = localStorage.getItem('layoutMode')
    if (savedLayoutMode && savedLayoutMode !== 'normal') {
      onLayoutModeChange(savedLayoutMode)
    }
  }

  const handleInput = (e) => {
    const value = e.target.value
    setApiKey(value)
    localStorage.setItem('apiKey', value)
    
    // Clear error state when user starts typing
    if (showApiKeyError) {
      setShowApiKeyError(false)
    }
  }

  const handleStartClick = async () => {
    if (isInitializing) return

    const success = await onStart()
    if (!success) {
      // Trigger API key error animation
      setShowApiKeyError(true)
      setTimeout(() => setShowApiKeyError(false), 1000)
    }
  }

  const handleAPIKeyHelpClick = () => {
    onAPIKeyHelp()
  }

  const getStartButtonText = () => {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0

    const cmdIcon = (
      <svg width="14" height="14" viewBox="0 0 24 24" strokeWidth="2" fill="none">
        <path d="M9 6V18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M15 6V18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
        <path
          d="M9 6C9 4.34315 7.65685 3 6 3C4.34315 3 3 4.34315 3 6C3 7.65685 4.34315 9 6 9H18C19.6569 9 21 7.65685 21 6C21 4.34315 19.6569 3 18 3C16.3431 3 15 4.34315 15 6"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9 18C9 19.6569 7.65685 21 6 21C4.34315 21 3 19.6569 3 18C3 16.3431 4.34315 15 6 15H18C19.6569 15 21 16.3431 21 18C21 19.6569 19.6569 21 18 21C16.3431 21 15 19.6569 15 18"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )

    const enterIcon = (
      <svg width="14" height="14" strokeWidth="2" viewBox="0 0 24 24" fill="none">
        <path
          d="M10.25 19.25L6.75 15.75L10.25 12.25"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M6.75 15.75H12.75C14.9591 15.75 16.75 13.9591 16.75 11.75V4.75"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )

    return (
      <div className="flex items-center gap-2">
        Start Session
        <div className="flex items-center gap-1">
          {isMac ? (
            <>
              {cmdIcon}
              {enterIcon}
            </>
          ) : (
            <>
              <span>Ctrl</span>
              {enterIcon}
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col w-full max-w-lg">
      <div className="text-2xl mb-2 font-semibold mt-auto">Welcome</div>

      <div className="flex gap-3 mb-5">
        <input
          type="password"
          placeholder="Enter your Gemini API Key"
          value={apiKey}
          onChange={handleInput}
          className={`flex-1 bg-app-input text-app-text border border-white/10 px-4 py-3 rounded-lg text-sm transition-all
            focus:outline-none focus:border-app-focus focus:shadow-[0_0_0_3px_rgba(0,122,255,0.2)] focus:bg-black/50
            placeholder:text-white/40 ${showApiKeyError ? 'api-key-error' : ''}`}
        />
        <button
          onClick={handleStartClick}
          disabled={isInitializing}
          className={`bg-white text-black border border-white px-4 py-2 rounded-lg text-sm font-medium 
            whitespace-nowrap flex items-center gap-2 transition-all
            ${isInitializing 
              ? 'opacity-50 cursor-not-allowed' 
              : 'hover:bg-white/80 hover:border-black/20'
            }`}
        >
          {getStartButtonText()}
        </button>
      </div>

      <p className="text-white/60 text-sm mb-6 leading-relaxed">
        dont have an api key?{' '}
        <span 
          onClick={handleAPIKeyHelpClick}
          className="text-app-focus underline cursor-pointer"
        >
          get one here
        </span>
      </p>
    </div>
  )
}

export default MainView