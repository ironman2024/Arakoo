import React, { useState } from 'react'

const OnboardingView = ({ onComplete, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    {
      title: 'Welcome to Cheating Daddy',
      content: (
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-app-focus/20 rounded-full flex items-center justify-center">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 12l2 2 4-4" />
              <circle cx="12" cy="12" r="10" />
            </svg>
          </div>
          <p className="text-lg text-white/80 mb-4">
            Your AI assistant for interviews, meetings, and presentations
          </p>
          <p className="text-sm text-white/60">
            Get real-time help during video calls with contextual AI responses
          </p>
        </div>
      )
    },
    {
      title: 'How It Works',
      content: (
        <div>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-app-focus/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-sm font-bold">1</span>
              </div>
              <div>
                <h4 className="font-medium text-white/90 mb-1">Screen & Audio Capture</h4>
                <p className="text-sm text-white/60">
                  Captures your screen and audio to understand the context of your session
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-app-focus/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-sm font-bold">2</span>
              </div>
              <div>
                <h4 className="font-medium text-white/90 mb-1">AI Analysis</h4>
                <p className="text-sm text-white/60">
                  Google Gemini 2.0 analyzes the content and provides relevant assistance
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-app-focus/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-sm font-bold">3</span>
              </div>
              <div>
                <h4 className="font-medium text-white/90 mb-1">Real-time Help</h4>
                <p className="text-sm text-white/60">
                  Get contextual responses and suggestions in real-time
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Privacy & Security',
      content: (
        <div>
          <div className="w-16 h-16 mx-auto mb-6 bg-green-500/20 rounded-full flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <div className="space-y-4 text-sm text-white/70">
            <div>
              <strong className="text-white/90">Local Processing:</strong> Your API key is stored locally on your device
            </div>
            <div>
              <strong className="text-white/90">No Data Storage:</strong> We don't store your conversations or screen captures
            </div>
            <div>
              <strong className="text-white/90">Direct Connection:</strong> Communication goes directly to Google's Gemini API
            </div>
            <div>
              <strong className="text-white/90">Your Control:</strong> You can clear all data anytime from settings
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Get Started',
      content: (
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-6 bg-app-focus/20 rounded-full flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>
          <p className="text-lg text-white/80 mb-4">
            You're ready to start!
          </p>
          <div className="space-y-3 text-sm text-white/60">
            <div>1. Get your Gemini API key from Google AI Studio</div>
            <div>2. Choose your profile (Interview, Meeting, etc.)</div>
            <div>3. Start your session and get AI assistance</div>
          </div>
        </div>
      )
    }
  ]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = () => {
    localStorage.setItem('onboardingCompleted', 'true')
    onComplete()
  }

  const handleSkip = () => {
    handleComplete()
  }

  return (
    <div className="h-full flex items-center justify-center bg-gradient-to-br from-app-bg to-black/90">
      <div className="max-w-md w-full mx-auto p-8">
        {/* Progress Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentStep
                    ? 'bg-app-focus'
                    : index < currentStep
                    ? 'bg-app-focus/60'
                    : 'bg-white/20'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">
            {steps[currentStep].title}
          </h2>
          <div className="text-white/80">
            {steps[currentStep].content}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center">
          <button
            onClick={handleSkip}
            className="text-sm text-white/60 hover:text-white/80 transition-colors"
          >
            Skip
          </button>

          <div className="flex gap-3">
            {currentStep > 0 && (
              <button
                onClick={handlePrevious}
                className="px-4 py-2 bg-white/10 text-white border border-white/20 rounded-lg text-sm font-medium hover:bg-white/20 transition-all"
              >
                Previous
              </button>
            )}
            
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-app-focus text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-all"
            >
              {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
            </button>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-white/60 hover:text-white/80 transition-colors"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default OnboardingView