import React from 'react'

const HelpView = ({ onExternalLinkClick }) => {
  const shortcuts = [
    {
      category: 'General',
      items: [
        { keys: ['Ctrl/Cmd', 'Enter'], description: 'Start session or take manual screenshot' },
        { keys: ['Ctrl/Cmd', '\\'], description: 'Hide/show window' },
        { keys: ['Ctrl/Cmd', 'M'], description: 'Toggle click-through mode' },
        { keys: ['Ctrl/Cmd', '←/→'], description: 'Move window left/right' },
        { keys: ['Ctrl/Cmd', '↑/↓'], description: 'Move window up/down' }
      ]
    },
    {
      category: 'Assistant View',
      items: [
        { keys: ['←/→'], description: 'Navigate between responses' },
        { keys: ['↑/↓'], description: 'Scroll response up/down' },
        { keys: ['Enter'], description: 'Send text message' }
      ]
    }
  ]

  const KeyBadge = ({ keyText }) => (
    <span className="bg-white/10 px-2 py-1 rounded text-xs font-mono">
      {keyText}
    </span>
  )

  const handleLinkClick = (url) => {
    onExternalLinkClick(url)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-xl font-semibold mb-6">Help & Shortcuts</div>

      {/* Keyboard Shortcuts */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">Keyboard Shortcuts</h3>
        {shortcuts.map((category, categoryIndex) => (
          <div key={categoryIndex} className="mb-6">
            <h4 className="text-md font-medium text-white/80 mb-3">{category.category}</h4>
            <div className="space-y-3">
              {category.items.map((shortcut, index) => (
                <div key={index} className="flex items-center justify-between py-2">
                  <span className="text-sm text-white/70">{shortcut.description}</span>
                  <div className="flex gap-1">
                    {shortcut.keys.map((key, keyIndex) => (
                      <KeyBadge key={keyIndex} keyText={key} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Getting Started */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">Getting Started</h3>
        <div className="space-y-4 text-sm text-white/70">
          <div>
            <strong className="text-white/90">1. Get API Key:</strong> Visit{' '}
            <button
              onClick={() => handleLinkClick('https://aistudio.google.com/apikey')}
              className="text-app-focus underline hover:text-blue-400"
            >
              Google AI Studio
            </button>{' '}
            to get your Gemini API key
          </div>
          <div>
            <strong className="text-white/90">2. Configure:</strong> Choose your profile and language in the customize settings
          </div>
          <div>
            <strong className="text-white/90">3. Start Session:</strong> Click "Start Session" or press Ctrl/Cmd+Enter
          </div>
          <div>
            <strong className="text-white/90">4. Position Window:</strong> Use keyboard shortcuts to move the window where you need it
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">Tips</h3>
        <div className="space-y-3 text-sm text-white/70">
          <div>• Use manual screenshot mode for better control over when images are captured</div>
          <div>• Enable click-through mode to interact with content behind the window</div>
          <div>• Save important responses using the save button in assistant view</div>
          <div>• Use compact layout mode for smaller window size</div>
        </div>
      </div>

      {/* Links */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">Links</h3>
        <div className="space-y-2 text-sm">
          <div>
            <button
              onClick={() => handleLinkClick('https://github.com/sohzm/cheating-daddy')}
              className="text-app-focus underline hover:text-blue-400"
            >
              GitHub Repository
            </button>
          </div>
          <div>
            <button
              onClick={() => handleLinkClick('https://cheatingdaddy.com')}
              className="text-app-focus underline hover:text-blue-400"
            >
              Official Website
            </button>
          </div>
          <div>
            <button
              onClick={() => handleLinkClick('https://aistudio.google.com/apikey')}
              className="text-app-focus underline hover:text-blue-400"
            >
              Get Gemini API Key
            </button>
          </div>
        </div>
      </div>

      {/* Version Info */}
      <div className="text-xs text-white/50 pt-4 border-t border-white/10">
        Cheating Daddy v0.4.0 - React Edition
      </div>
    </div>
  )
}

export default HelpView