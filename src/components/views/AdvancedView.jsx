import React, { useState, useEffect } from 'react'

const AdvancedView = () => {
  const [contentProtection, setContentProtection] = useState(true)
  const [throttleTokens, setThrottleTokens] = useState(false)
  const [maxTokensPerMin, setMaxTokensPerMin] = useState(1000000)
  const [throttleAtPercent, setThrottleAtPercent] = useState(75)
  const [fontSize, setFontSize] = useState(18)
  const [audioMode, setAudioMode] = useState('speaker_only')
  const [stealthLevel, setStealthLevel] = useState('visible')

  useEffect(() => {
    // Load settings from localStorage
    setContentProtection(localStorage.getItem('contentProtection') !== 'false')
    setThrottleTokens(localStorage.getItem('throttleTokens') === 'true')
    setMaxTokensPerMin(parseInt(localStorage.getItem('maxTokensPerMin') || '1000000', 10))
    setThrottleAtPercent(parseInt(localStorage.getItem('throttleAtPercent') || '75', 10))
    setFontSize(parseInt(localStorage.getItem('fontSize') || '18', 10))
    setAudioMode(localStorage.getItem('audioMode') || 'speaker_only')
    setStealthLevel(localStorage.getItem('stealthLevel') || 'visible')
  }, [])

  const handleContentProtectionChange = async (enabled) => {
    setContentProtection(enabled)
    localStorage.setItem('contentProtection', enabled.toString())
    
    // Notify main process
    if (window.require) {
      const { ipcRenderer } = window.require('electron')
      await ipcRenderer.invoke('update-content-protection', enabled)
    }
  }

  const handleThrottleTokensChange = (enabled) => {
    setThrottleTokens(enabled)
    localStorage.setItem('throttleTokens', enabled.toString())
  }

  const handleMaxTokensChange = (value) => {
    const tokens = parseInt(value, 10)
    setMaxTokensPerMin(tokens)
    localStorage.setItem('maxTokensPerMin', tokens.toString())
  }

  const handleThrottlePercentChange = (value) => {
    const percent = parseInt(value, 10)
    setThrottleAtPercent(percent)
    localStorage.setItem('throttleAtPercent', percent.toString())
  }

  const handleFontSizeChange = (value) => {
    const size = parseInt(value, 10)
    setFontSize(size)
    localStorage.setItem('fontSize', size.toString())
    
    // Apply font size immediately
    document.documentElement.style.setProperty('--response-font-size', `${size}px`)
  }

  const handleAudioModeChange = (mode) => {
    setAudioMode(mode)
    localStorage.setItem('audioMode', mode)
  }

  const handleStealthLevelChange = async (level) => {
    setStealthLevel(level)
    localStorage.setItem('stealthLevel', level)
    
    // Notify main process
    if (window.require) {
      const { ipcRenderer } = window.require('electron')
      await ipcRenderer.invoke('set-stealth-level', level)
    }
  }

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all stored data? This will remove your API key, settings, and conversation history.')) {
      // Clear localStorage
      const keysToKeep = ['onboardingCompleted'] // Keep onboarding state
      const allKeys = Object.keys(localStorage)
      allKeys.forEach(key => {
        if (!keysToKeep.includes(key)) {
          localStorage.removeItem(key)
        }
      })
      
      // Clear IndexedDB conversation history
      if (window.cheddar?.initConversationStorage) {
        window.cheddar.initConversationStorage().then(() => {
          const deleteRequest = indexedDB.deleteDatabase('ConversationHistory')
          deleteRequest.onsuccess = () => {
            console.log('Conversation history cleared')
          }
        })
      }
      
      alert('All data has been cleared. Please restart the application.')
    }
  }

  const CheckboxField = ({ label, checked, onChange, description }) => (
    <div className="mb-6">
      <label className="flex items-start cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        <div className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center transition-all mt-0.5 ${
          checked 
            ? 'bg-app-focus border-app-focus' 
            : 'bg-transparent border-white/20 hover:border-white/40'
        }`}>
          {checked && (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path
                d="M20 6L9 17L4 12"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
        <div>
          <span className="text-sm font-medium text-app-text">{label}</span>
          {description && (
            <p className="text-xs text-white/60 mt-1">{description}</p>
          )}
        </div>
      </label>
    </div>
  )

  const SelectField = ({ label, value, options, onChange, description }) => (
    <div className="mb-6">
      <label className="block text-sm font-medium text-app-text mb-2">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-app-input text-app-text border border-white/10 px-4 py-3 rounded-lg text-sm
          focus:outline-none focus:border-app-focus focus:shadow-[0_0_0_3px_rgba(0,122,255,0.2)] focus:bg-black/50"
      >
        {options.map(option => (
          <option key={option.value} value={option.value} className="bg-gray-800">
            {option.label}
          </option>
        ))}
      </select>
      {description && (
        <p className="text-xs text-white/60 mt-1">{description}</p>
      )}
    </div>
  )

  const NumberField = ({ label, value, onChange, min, max, description }) => (
    <div className="mb-6">
      <label className="block text-sm font-medium text-app-text mb-2">
        {label}
      </label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min={min}
        max={max}
        className="w-full bg-app-input text-app-text border border-white/10 px-4 py-3 rounded-lg text-sm
          focus:outline-none focus:border-app-focus focus:shadow-[0_0_0_3px_rgba(0,122,255,0.2)] focus:bg-black/50"
      />
      {description && (
        <p className="text-xs text-white/60 mt-1">{description}</p>
      )}
    </div>
  )

  const audioModes = [
    { value: 'speaker_only', label: 'Speaker Only' },
    { value: 'mic_only', label: 'Microphone Only' },
    { value: 'both', label: 'Both Speaker & Microphone' }
  ]

  const stealthLevels = [
    { value: 'visible', label: 'Visible (Normal)' },
    { value: 'balanced', label: 'Balanced (Some Hiding)' },
    { value: 'ultra', label: 'Ultra Stealth (Maximum Hiding)' }
  ]

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-xl font-semibold mb-6">Advanced Settings</div>

      {/* Security Settings */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">Security & Privacy</h3>
        
        <CheckboxField
          label="Content Protection"
          checked={contentProtection}
          onChange={handleContentProtectionChange}
          description="Prevents screen recording of this window (may not work on all systems)"
        />

        <SelectField
          label="Stealth Level"
          value={stealthLevel}
          options={stealthLevels}
          onChange={handleStealthLevelChange}
          description="Controls how hidden the application appears in system processes"
        />
      </div>

      {/* Audio Settings */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">Audio Capture</h3>
        
        <SelectField
          label="Audio Mode"
          value={audioMode}
          options={audioModes}
          onChange={handleAudioModeChange}
          description="Choose which audio sources to capture"
        />
      </div>

      {/* Performance Settings */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">Performance & Rate Limiting</h3>
        
        <CheckboxField
          label="Enable Token Throttling"
          checked={throttleTokens}
          onChange={handleThrottleTokensChange}
          description="Automatically reduce capture frequency when approaching API limits"
        />

        {throttleTokens && (
          <>
            <NumberField
              label="Max Tokens Per Minute"
              value={maxTokensPerMin}
              onChange={handleMaxTokensChange}
              min={1000}
              max={10000000}
              description="Maximum API tokens to use per minute"
            />

            <NumberField
              label="Throttle at Percentage"
              value={throttleAtPercent}
              onChange={handleThrottlePercentChange}
              min={50}
              max={95}
              description="Start throttling when reaching this percentage of the limit"
            />
          </>
        )}
      </div>

      {/* UI Settings */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">User Interface</h3>
        
        <NumberField
          label="Response Font Size"
          value={fontSize}
          onChange={handleFontSizeChange}
          min={12}
          max={32}
          description="Font size for AI responses in pixels"
        />
      </div>

      {/* Data Management */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">Data Management</h3>
        
        <button
          onClick={handleClearData}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all"
        >
          Clear All Data
        </button>
        <p className="text-xs text-white/60 mt-2">
          This will remove your API key, settings, and conversation history
        </p>
      </div>

      {/* Warning */}
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 text-sm">
        <div className="font-medium text-yellow-400 mb-1">⚠️ Advanced Settings</div>
        <div className="text-yellow-300/80">
          These settings can affect application performance and behavior. 
          Change them only if you understand their impact.
        </div>
      </div>
    </div>
  )
}

export default AdvancedView