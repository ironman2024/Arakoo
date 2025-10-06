import React, { useState, useEffect, useCallback } from 'react'
import AppHeader from './AppHeader'
import MainView from './views/MainView'
import CustomizeView from './views/CustomizeView'
import HelpView from './views/HelpView'
import HistoryView from './views/HistoryView'
import AssistantView from './views/AssistantView'
import OnboardingView from './views/OnboardingView'
import AdvancedView from './views/AdvancedView'

const App = () => {
  const [currentView, setCurrentView] = useState(
    localStorage.getItem('onboardingCompleted') ? 'main' : 'onboarding'
  )
  const [statusText, setStatusText] = useState('')
  const [startTime, setStartTime] = useState(null)
  const [isRecording, setIsRecording] = useState(false)
  const [sessionActive, setSessionActive] = useState(false)
  const [selectedProfile, setSelectedProfile] = useState(
    localStorage.getItem('selectedProfile') || 'interview'
  )
  const [selectedLanguage, setSelectedLanguage] = useState(
    localStorage.getItem('selectedLanguage') || 'en-US'
  )
  const [responses, setResponses] = useState([])
  const [currentResponseIndex, setCurrentResponseIndex] = useState(-1)
  const [selectedScreenshotInterval, setSelectedScreenshotInterval] = useState(
    localStorage.getItem('selectedScreenshotInterval') || '5'
  )
  const [selectedImageQuality, setSelectedImageQuality] = useState(
    localStorage.getItem('selectedImageQuality') || 'medium'
  )
  const [layoutMode, setLayoutMode] = useState(
    localStorage.getItem('layoutMode') || 'normal'
  )
  const [advancedMode, setAdvancedMode] = useState(
    localStorage.getItem('advancedMode') === 'true'
  )
  const [isClickThrough, setIsClickThrough] = useState(false)
  const [awaitingNewResponse, setAwaitingNewResponse] = useState(false)
  const [currentResponseIsComplete, setCurrentResponseIsComplete] = useState(true)
  const [shouldAnimateResponse, setShouldAnimateResponse] = useState(false)

  // Apply layout mode to document root
  const updateLayoutMode = useCallback(() => {
    if (layoutMode === 'compact') {
      document.documentElement.classList.add('compact-layout')
    } else {
      document.documentElement.classList.remove('compact-layout')
    }
  }, [layoutMode])

  useEffect(() => {
    updateLayoutMode()
  }, [updateLayoutMode])

  useEffect(() => {
    // Set up IPC listeners if needed
    if (window.require) {
      const { ipcRenderer } = window.require('electron')
      
      const handleUpdateResponse = (_, response) => {
        setResponseHandler(response)
      }
      
      const handleUpdateStatus = (_, status) => {
        setStatusHandler(status)
      }
      
      const handleClickThroughToggled = (_, isEnabled) => {
        setIsClickThrough(isEnabled)
      }

      ipcRenderer.on('update-response', handleUpdateResponse)
      ipcRenderer.on('update-status', handleUpdateStatus)
      ipcRenderer.on('click-through-toggled', handleClickThroughToggled)

      return () => {
        ipcRenderer.removeAllListeners('update-response')
        ipcRenderer.removeAllListeners('update-status')
        ipcRenderer.removeAllListeners('click-through-toggled')
      }
    }
  }, [])

  useEffect(() => {
    // Notify main process of view change
    if (window.require) {
      const { ipcRenderer } = window.require('electron')
      ipcRenderer.send('view-changed', currentView)
    }
  }, [currentView])

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('selectedProfile', selectedProfile)
  }, [selectedProfile])

  useEffect(() => {
    localStorage.setItem('selectedLanguage', selectedLanguage)
  }, [selectedLanguage])

  useEffect(() => {
    localStorage.setItem('selectedScreenshotInterval', selectedScreenshotInterval)
  }, [selectedScreenshotInterval])

  useEffect(() => {
    localStorage.setItem('selectedImageQuality', selectedImageQuality)
  }, [selectedImageQuality])

  useEffect(() => {
    localStorage.setItem('layoutMode', layoutMode)
  }, [layoutMode])

  useEffect(() => {
    localStorage.setItem('advancedMode', advancedMode.toString())
  }, [advancedMode])

  const setStatusHandler = useCallback((text) => {
    setStatusText(text)
    
    // Mark response as complete when we get certain status messages
    if (text.includes('Ready') || text.includes('Listening') || text.includes('Error')) {
      setCurrentResponseIsComplete(true)
    }
  }, [])

  const setResponseHandler = useCallback((response) => {
    // Check if this looks like a filler response
    const isFillerResponse =
      response.length < 30 &&
      (response.toLowerCase().includes('hmm') ||
        response.toLowerCase().includes('okay') ||
        response.toLowerCase().includes('next') ||
        response.toLowerCase().includes('go on') ||
        response.toLowerCase().includes('continue'))

    if (awaitingNewResponse || responses.length === 0) {
      // Always add as new response when explicitly waiting for one
      setResponses(prev => [...prev, response])
      setCurrentResponseIndex(prev => prev + 1)
      setAwaitingNewResponse(false)
      setCurrentResponseIsComplete(false)
    } else if (!currentResponseIsComplete && !isFillerResponse && responses.length > 0) {
      // For substantial responses, update the last one (streaming behavior)
      setResponses(prev => [...prev.slice(0, prev.length - 1), response])
    } else {
      // For filler responses or when current response is complete, add as new
      setResponses(prev => [...prev, response])
      setCurrentResponseIndex(prev => prev + 1)
      setCurrentResponseIsComplete(false)
    }
    setShouldAnimateResponse(true)
  }, [awaitingNewResponse, currentResponseIsComplete, responses.length])

  // Header event handlers
  const handleCustomizeClick = () => setCurrentView('customize')
  const handleHelpClick = () => setCurrentView('help')
  const handleHistoryClick = () => setCurrentView('history')
  const handleAdvancedClick = () => setCurrentView('advanced')

  const handleClose = async () => {
    if (['customize', 'help', 'history', 'advanced'].includes(currentView)) {
      setCurrentView('main')
    } else if (currentView === 'assistant') {
      window.cheddar?.stopCapture()

      // Close the session
      if (window.require) {
        const { ipcRenderer } = window.require('electron')
        await ipcRenderer.invoke('close-session')
      }
      setSessionActive(false)
      setCurrentView('main')
    } else {
      // Quit the entire application
      if (window.require) {
        const { ipcRenderer } = window.require('electron')
        await ipcRenderer.invoke('quit-application')
      }
    }
  }

  const handleHideToggle = async () => {
    if (window.require) {
      const { ipcRenderer } = window.require('electron')
      await ipcRenderer.invoke('toggle-window-visibility')
    }
  }

  const handleBackClick = () => setCurrentView('main')

  // Main view event handlers
  const handleStart = async () => {
    const apiKey = localStorage.getItem('apiKey')?.trim()
    if (!apiKey || apiKey === '') {
      // Trigger API key error in MainView
      return false
    }

    await window.cheddar?.initializeGemini(selectedProfile, selectedLanguage)
    window.cheddar?.startCapture(selectedScreenshotInterval, selectedImageQuality)
    setResponses([])
    setCurrentResponseIndex(-1)
    setStartTime(Date.now())
    setCurrentView('assistant')
    return true
  }

  const handleAPIKeyHelp = async () => {
    if (window.require) {
      const { ipcRenderer } = window.require('electron')
      await ipcRenderer.invoke('open-external', 'https://cheatingdaddy.com/help/api-key')
    }
  }

  const handleLayoutModeChange = async (newLayoutMode) => {
    setLayoutMode(newLayoutMode)
    
    // Notify main process about layout change for window resizing
    if (window.require) {
      try {
        const { ipcRenderer } = window.require('electron')
        await ipcRenderer.invoke('update-sizes')
      } catch (error) {
        console.error('Failed to update sizes in main process:', error)
      }
    }
  }

  // Assistant view event handlers
  const handleSendText = async (message) => {
    const result = await window.cheddar?.sendTextMessage(message)

    if (!result?.success) {
      console.error('Failed to send message:', result?.error)
      setStatusText('Error sending message: ' + result?.error)
    } else {
      setStatusText('Message sent...')
      setAwaitingNewResponse(true)
    }
  }

  const handleResponseIndexChanged = (index) => {
    setCurrentResponseIndex(index)
    setShouldAnimateResponse(false)
  }

  // Onboarding event handlers
  const handleOnboardingComplete = () => {
    setCurrentView('main')
  }

  const handleExternalLinkClick = async (url) => {
    if (window.require) {
      const { ipcRenderer } = window.require('electron')
      await ipcRenderer.invoke('open-external', url)
    }
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'onboarding':
        return (
          <OnboardingView
            onComplete={handleOnboardingComplete}
            onClose={handleClose}
          />
        )

      case 'main':
        return (
          <MainView
            onStart={handleStart}
            onAPIKeyHelp={handleAPIKeyHelp}
            onLayoutModeChange={handleLayoutModeChange}
          />
        )

      case 'customize':
        return (
          <CustomizeView
            selectedProfile={selectedProfile}
            selectedLanguage={selectedLanguage}
            selectedScreenshotInterval={selectedScreenshotInterval}
            selectedImageQuality={selectedImageQuality}
            layoutMode={layoutMode}
            advancedMode={advancedMode}
            onProfileChange={setSelectedProfile}
            onLanguageChange={setSelectedLanguage}
            onScreenshotIntervalChange={setSelectedScreenshotInterval}
            onImageQualityChange={setSelectedImageQuality}
            onLayoutModeChange={handleLayoutModeChange}
            onAdvancedModeChange={setAdvancedMode}
          />
        )

      case 'help':
        return <HelpView onExternalLinkClick={handleExternalLinkClick} />

      case 'history':
        return <HistoryView />

      case 'advanced':
        return <AdvancedView />

      case 'assistant':
        return (
          <AssistantView
            responses={responses}
            currentResponseIndex={currentResponseIndex}
            selectedProfile={selectedProfile}
            onSendText={handleSendText}
            shouldAnimateResponse={shouldAnimateResponse}
            onResponseIndexChanged={handleResponseIndexChanged}
            onResponseAnimationComplete={() => {
              setShouldAnimateResponse(false)
              setCurrentResponseIsComplete(true)
            }}
          />
        )

      default:
        return <div className="text-app-text">Unknown view: {currentView}</div>
    }
  }

  const getMainContentClass = () => {
    let baseClass = "flex-1 overflow-y-auto mt-2 rounded-lg transition-all duration-150 custom-scrollbar"
    
    if (currentView === 'assistant') {
      return `${baseClass} p-2 bg-transparent`
    } else if (currentView === 'onboarding') {
      return `${baseClass} p-0 bg-transparent`
    } else {
      return `${baseClass} p-5 bg-app-bg border border-app-border`
    }
  }

  // Make app functions available globally for cheddar
  useEffect(() => {
    if (window.cheddar) {
      // Update the cheatingDaddyApp reference in renderer.js
      const rendererScript = document.querySelector('script[src*="renderer.js"]')
      if (rendererScript) {
        // Set the app reference for cheddar
        window.cheddar.setStatus = setStatusHandler
        window.cheddar.setResponse = setResponseHandler
        window.cheddar.getCurrentView = () => currentView
        window.cheddar.getLayoutMode = () => layoutMode
        window.cheddar.element = () => ({
          handleStart,
          currentView,
          layoutMode,
          setStatus: setStatusHandler,
          setResponse: setResponseHandler
        })
        window.cheddar.e = window.cheddar.element
      }
    }
  }, [currentView, layoutMode, handleStart, setStatusHandler, setResponseHandler])

  return (
    <div className="w-full h-screen bg-transparent text-app-text font-inter">
      <div className="h-screen rounded-lg overflow-hidden">
        <div className="flex flex-col h-full">
          <AppHeader
            currentView={currentView}
            statusText={statusText}
            startTime={startTime}
            advancedMode={advancedMode}
            isClickThrough={isClickThrough}
            onCustomizeClick={handleCustomizeClick}
            onHelpClick={handleHelpClick}
            onHistoryClick={handleHistoryClick}
            onAdvancedClick={handleAdvancedClick}
            onCloseClick={handleClose}
            onBackClick={handleBackClick}
            onHideToggleClick={handleHideToggle}
          />
          <div className={getMainContentClass()}>
            <div className="opacity-100 transform-none transition-all duration-150 h-full">
              {renderCurrentView()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App