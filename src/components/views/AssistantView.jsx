import React, { useState, useEffect, useRef, useCallback } from 'react'

const AssistantView = ({
  responses,
  currentResponseIndex,
  selectedProfile,
  onSendText,
  shouldAnimateResponse,
  onResponseIndexChanged,
  onResponseAnimationComplete
}) => {
  const [textInput, setTextInput] = useState('')
  const [savedResponses, setSavedResponses] = useState([])
  const [lastAnimatedWordCount, setLastAnimatedWordCount] = useState(0)
  const responseContainerRef = useRef(null)

  useEffect(() => {
    // Load saved responses from localStorage
    try {
      const saved = JSON.parse(localStorage.getItem('savedResponses') || '[]')
      setSavedResponses(saved)
    } catch (e) {
      setSavedResponses([])
    }
  }, [])

  useEffect(() => {
    // Load and apply font size
    const fontSize = localStorage.getItem('fontSize')
    if (fontSize !== null) {
      const fontSizeValue = parseInt(fontSize, 10) || 20
      document.documentElement.style.setProperty('--response-font-size', `${fontSizeValue}px`)
    }

    // Set up IPC listeners for keyboard shortcuts
    if (window.require) {
      const { ipcRenderer } = window.require('electron')

      const handlePreviousResponse = () => {
        navigateToPreviousResponse()
      }

      const handleNextResponse = () => {
        navigateToNextResponse()
      }

      const handleScrollUp = () => {
        scrollResponseUp()
      }

      const handleScrollDown = () => {
        scrollResponseDown()
      }

      ipcRenderer.on('navigate-previous-response', handlePreviousResponse)
      ipcRenderer.on('navigate-next-response', handleNextResponse)
      ipcRenderer.on('scroll-response-up', handleScrollUp)
      ipcRenderer.on('scroll-response-down', handleScrollDown)

      return () => {
        ipcRenderer.removeListener('navigate-previous-response', handlePreviousResponse)
        ipcRenderer.removeListener('navigate-next-response', handleNextResponse)
        ipcRenderer.removeListener('scroll-response-up', handleScrollUp)
        ipcRenderer.removeListener('scroll-response-down', handleScrollDown)
      }
    }
  }, [])

  useEffect(() => {
    if (currentResponseIndex !== undefined) {
      setLastAnimatedWordCount(0)
    }
    updateResponseContent()
  }, [responses, currentResponseIndex, shouldAnimateResponse])

  const getProfileNames = () => ({
    interview: 'Job Interview',
    sales: 'Sales Call',
    meeting: 'Business Meeting',
    presentation: 'Presentation',
    negotiation: 'Negotiation',
    exam: 'Exam Assistant',
  })

  const getCurrentResponse = () => {
    const profileNames = getProfileNames()
    return responses.length > 0 && currentResponseIndex >= 0
      ? responses[currentResponseIndex]
      : `Hey, Im listening to your ${profileNames[selectedProfile] || 'session'}?`
  }

  const renderMarkdown = (content) => {
    if (typeof window !== 'undefined' && window.marked) {
      try {
        window.marked.setOptions({
          breaks: true,
          gfm: true,
          sanitize: false,
        })
        let rendered = window.marked.parse(content)
        rendered = wrapWordsInSpans(rendered)
        return rendered
      } catch (error) {
        console.warn('Error parsing markdown:', error)
        return content
      }
    }
    return content
  }

  const wrapWordsInSpans = (html) => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')
    const tagsToSkip = ['PRE']

    function wrap(node) {
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() && !tagsToSkip.includes(node.parentNode.tagName)) {
        const words = node.textContent.split(/(\\s+)/)
        const frag = document.createDocumentFragment()
        words.forEach(word => {
          if (word.trim()) {
            const span = document.createElement('span')
            span.setAttribute('data-word', '')
            span.textContent = word
            frag.appendChild(span)
          } else {
            frag.appendChild(document.createTextNode(word))
          }
        })
        node.parentNode.replaceChild(frag, node)
      } else if (node.nodeType === Node.ELEMENT_NODE && !tagsToSkip.includes(node.tagName)) {
        Array.from(node.childNodes).forEach(wrap)
      }
    }
    Array.from(doc.body.childNodes).forEach(wrap)
    return doc.body.innerHTML
  }

  const updateResponseContent = useCallback(() => {
    const container = responseContainerRef.current
    if (container) {
      const currentResponse = getCurrentResponse()
      const renderedResponse = renderMarkdown(currentResponse)
      container.innerHTML = renderedResponse
      
      const words = container.querySelectorAll('[data-word]')
      if (shouldAnimateResponse) {
        // Show previously animated words immediately
        for (let i = 0; i < lastAnimatedWordCount && i < words.length; i++) {
          words[i].classList.add('opacity-100', 'blur-0')
          words[i].classList.remove('opacity-0', 'blur-sm')
        }
        
        // Animate new words
        for (let i = lastAnimatedWordCount; i < words.length; i++) {
          words[i].classList.add('opacity-0', 'blur-sm', 'inline-block', 'transition-all', 'duration-500')
          setTimeout(() => {
            words[i].classList.remove('opacity-0', 'blur-sm')
            words[i].classList.add('opacity-100', 'blur-0')
            if (i === words.length - 1) {
              onResponseAnimationComplete()
            }
          }, (i - lastAnimatedWordCount) * 100)
        }
        setLastAnimatedWordCount(words.length)
      } else {
        words.forEach(word => {
          word.classList.add('opacity-100', 'blur-0')
          word.classList.remove('opacity-0', 'blur-sm')
        })
        setLastAnimatedWordCount(words.length)
      }
    }
  }, [getCurrentResponse, renderMarkdown, shouldAnimateResponse, lastAnimatedWordCount, onResponseAnimationComplete])

  const getResponseCounter = () => {
    return responses.length > 0 ? `${currentResponseIndex + 1}/${responses.length}` : ''
  }

  const navigateToPreviousResponse = () => {
    if (currentResponseIndex > 0) {
      onResponseIndexChanged(currentResponseIndex - 1)
    }
  }

  const navigateToNextResponse = () => {
    if (currentResponseIndex < responses.length - 1) {
      onResponseIndexChanged(currentResponseIndex + 1)
    }
  }

  const scrollResponseUp = () => {
    const container = responseContainerRef.current
    if (container) {
      const scrollAmount = container.clientHeight * 0.3
      container.scrollTop = Math.max(0, container.scrollTop - scrollAmount)
    }
  }

  const scrollResponseDown = () => {
    const container = responseContainerRef.current
    if (container) {
      const scrollAmount = container.clientHeight * 0.3
      container.scrollTop = Math.min(
        container.scrollHeight - container.clientHeight,
        container.scrollTop + scrollAmount
      )
    }
  }

  const handleSendText = async () => {
    if (textInput.trim()) {
      const message = textInput.trim()
      setTextInput('')
      await onSendText(message)
    }
  }

  const handleTextKeydown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendText()
    }
  }

  const saveCurrentResponse = () => {
    const currentResponse = getCurrentResponse()
    if (currentResponse && !isResponseSaved()) {
      const newSavedResponses = [
        ...savedResponses,
        {
          response: currentResponse,
          timestamp: new Date().toISOString(),
          profile: selectedProfile,
        },
      ]
      setSavedResponses(newSavedResponses)
      localStorage.setItem('savedResponses', JSON.stringify(newSavedResponses))
    }
  }

  const isResponseSaved = () => {
    const currentResponse = getCurrentResponse()
    return savedResponses.some(saved => saved.response === currentResponse)
  }

  const responseCounter = getResponseCounter()
  const isSaved = isResponseSaved()

  return (
    <div className="h-full flex flex-col">
      {/* Response Container */}
      <div 
        ref={responseContainerRef}
        className="flex-1 overflow-y-auto rounded-lg bg-app-bg p-4 custom-scrollbar
          text-lg leading-relaxed select-text cursor-text"
        style={{ fontSize: 'var(--response-font-size, 18px)' }}
      >
        {/* Content will be injected here by updateResponseContent */}
      </div>

      {/* Text Input Container */}
      <div className="flex gap-3 mt-3 items-center">
        {/* Previous Response Button */}
        <button
          className="bg-transparent text-white border-none p-1 rounded-full text-xs flex items-center justify-center w-9 h-9 hover:bg-white/10 disabled:opacity-30 transition-all"
          onClick={navigateToPreviousResponse}
          disabled={currentResponseIndex <= 0}
        >
          <svg width="24" height="24" strokeWidth="1.7" viewBox="0 0 24 24" fill="none">
            <path d="M15 6L9 12L15 18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Response Counter */}
        {responses.length > 0 && (
          <span className="text-xs text-white/60 whitespace-nowrap min-w-[60px] text-center">
            {responseCounter}
          </span>
        )}

        {/* Save Button */}
        <button
          className={`bg-transparent border-none p-1 rounded-full text-xs flex items-center justify-center w-9 h-9 hover:bg-white/10 transition-all cursor-pointer ${
            isSaved ? 'text-green-500' : 'text-white'
          }`}
          onClick={saveCurrentResponse}
          title={isSaved ? 'Response saved' : 'Save this response'}
        >
          <svg width="24" height="24" strokeWidth="1.7" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 20V5C5 3.89543 5.89543 3 7 3H16.1716C16.702 3 17.2107 3.21071 17.5858 3.58579L19.4142 5.41421C19.7893 5.78929 20 6.29799 20 6.82843V20C20 21.1046 19.1046 22 18 22H7C5.89543 22 5 21 5 20Z"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M15 22V13H9V22" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9 3V8H15" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Text Input */}
        <input
          type="text"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          onKeyDown={handleTextKeydown}
          placeholder="Type a message to the AI..."
          className="flex-1 bg-app-input text-app-text border border-white/10 px-4 py-3 rounded-lg text-sm
            focus:outline-none focus:border-app-focus focus:shadow-[0_0_0_3px_rgba(0,122,255,0.2)] focus:bg-black/50
            placeholder:text-white/40"
        />

        {/* Next Response Button */}
        <button
          className="bg-transparent text-white border-none p-1 rounded-full text-xs flex items-center justify-center w-9 h-9 hover:bg-white/10 disabled:opacity-30 transition-all"
          onClick={navigateToNextResponse}
          disabled={currentResponseIndex >= responses.length - 1}
        >
          <svg width="24" height="24" strokeWidth="1.7" viewBox="0 0 24 24" fill="none">
            <path d="M9 6L15 12L9 18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default AssistantView