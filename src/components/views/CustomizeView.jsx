import React from 'react'

const CustomizeView = ({
  selectedProfile,
  selectedLanguage,
  selectedScreenshotInterval,
  selectedImageQuality,
  layoutMode,
  advancedMode,
  onProfileChange,
  onLanguageChange,
  onScreenshotIntervalChange,
  onImageQualityChange,
  onLayoutModeChange,
  onAdvancedModeChange
}) => {
  const profiles = [
    { value: 'interview', label: 'Job Interview' },
    { value: 'sales', label: 'Sales Call' },
    { value: 'meeting', label: 'Business Meeting' },
    { value: 'presentation', label: 'Presentation' },
    { value: 'negotiation', label: 'Negotiation' },
    { value: 'exam', label: 'Exam Assistant' }
  ]

  const languages = [
    { value: 'en-US', label: 'English (US)' },
    { value: 'en-GB', label: 'English (UK)' },
    { value: 'es-ES', label: 'Spanish' },
    { value: 'fr-FR', label: 'French' },
    { value: 'de-DE', label: 'German' },
    { value: 'it-IT', label: 'Italian' },
    { value: 'pt-BR', label: 'Portuguese (Brazil)' },
    { value: 'ja-JP', label: 'Japanese' },
    { value: 'ko-KR', label: 'Korean' },
    { value: 'zh-CN', label: 'Chinese (Simplified)' }
  ]

  const screenshotIntervals = [
    { value: '3', label: '3 seconds' },
    { value: '5', label: '5 seconds' },
    { value: '10', label: '10 seconds' },
    { value: '15', label: '15 seconds' },
    { value: '30', label: '30 seconds' },
    { value: 'manual', label: 'Manual only' }
  ]

  const imageQualities = [
    { value: 'low', label: 'Low (faster)' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High (slower)' }
  ]

  const layoutModes = [
    { value: 'normal', label: 'Normal' },
    { value: 'compact', label: 'Compact' }
  ]

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

  const CheckboxField = ({ label, checked, onChange, description }) => (
    <div className="mb-6">
      <label className="flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        <div className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center transition-all ${
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

  return (
    <div className="max-w-md mx-auto">
      <div className="text-xl font-semibold mb-6">Customize Settings</div>

      <SelectField
        label="Profile"
        value={selectedProfile}
        options={profiles}
        onChange={onProfileChange}
        description="Choose the context for AI responses"
      />

      <SelectField
        label="Language"
        value={selectedLanguage}
        options={languages}
        onChange={onLanguageChange}
        description="Language for AI responses"
      />

      <SelectField
        label="Screenshot Interval"
        value={selectedScreenshotInterval}
        options={screenshotIntervals}
        onChange={onScreenshotIntervalChange}
        description="How often to capture screen automatically"
      />

      <SelectField
        label="Image Quality"
        value={selectedImageQuality}
        options={imageQualities}
        onChange={onImageQualityChange}
        description="Higher quality uses more bandwidth"
      />

      <SelectField
        label="Layout Mode"
        value={layoutMode}
        options={layoutModes}
        onChange={onLayoutModeChange}
        description="Adjust UI density"
      />

      <CheckboxField
        label="Advanced Mode"
        checked={advancedMode}
        onChange={onAdvancedModeChange}
        description="Enable advanced tools and features"
      />
    </div>
  )
}

export default CustomizeView