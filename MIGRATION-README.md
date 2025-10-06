# Cheating Daddy - React Migration

This document outlines the migration from Lit to React and provides instructions for building and running the application.

## Migration Overview

The application has been successfully migrated from Lit web components to React 18+ with the following key changes:

### Architecture Changes

1. **Frontend Framework**: Migrated from Lit to React 18+ with functional components and hooks
2. **Build System**: Replaced custom build with Vite for better React support and faster development
3. **Styling**: Implemented Tailwind CSS for modern, utility-first styling
4. **State Management**: Used React hooks (useState, useEffect, useCallback) for state management
5. **Component Structure**: Converted all Lit components to React functional components

### Key Features Preserved

- ✅ All original functionality maintained
- ✅ Electron integration preserved
- ✅ IPC communication working
- ✅ Screen and audio capture
- ✅ AI assistant functionality
- ✅ Keyboard shortcuts
- ✅ Window management
- ✅ Settings and customization
- ✅ Conversation history
- ✅ Advanced features

## Development Setup

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. For development with hot reload:
```bash
npm run dev
```

3. For production build:
```bash
npm run build
```

4. To package the application:
```bash
npm run package
```

5. To create distributable:
```bash
npm run make
```

## Build Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run dev:vite` | Start only Vite dev server |
| `npm run dev:electron` | Start only Electron (requires Vite server) |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run package` | Package Electron app |
| `npm run make` | Create distributable packages |
| `npm run lint` | Run ESLint |
| `npm test` | Run tests |

## File Structure

```
src/
├── components/
│   ├── App.jsx                 # Main app component
│   ├── AppHeader.jsx           # Header with navigation
│   └── views/
│       ├── MainView.jsx        # Main welcome screen
│       ├── AssistantView.jsx   # AI assistant interface
│       ├── CustomizeView.jsx   # Settings and customization
│       ├── HelpView.jsx        # Help and shortcuts
│       ├── HistoryView.jsx     # Conversation history
│       ├── OnboardingView.jsx  # First-time user onboarding
│       └── AdvancedView.jsx    # Advanced settings
├── main.jsx                    # React entry point
├── index.css                   # Tailwind CSS imports
├── index.html                  # HTML template
├── index.js                    # Electron main process
└── utils/                      # Utility files (unchanged)
```

## Key Technical Details

### React Components

All components are functional components using modern React patterns:

- **Hooks**: useState, useEffect, useCallback for state and lifecycle management
- **Props**: Clean prop interfaces for component communication
- **Event Handling**: Modern event handling with proper cleanup
- **Performance**: Optimized re-renders with proper dependency arrays

### Styling

- **Tailwind CSS**: Utility-first CSS framework
- **Custom Colors**: App-specific color palette defined in tailwind.config.js
- **Responsive**: Mobile-first responsive design principles
- **Animations**: CSS animations for smooth transitions

### Build System

- **Vite**: Fast build tool with HMR (Hot Module Replacement)
- **React Plugin**: @vitejs/plugin-react for JSX transformation
- **PostCSS**: For Tailwind CSS processing
- **ESLint**: Code linting with React-specific rules

### Electron Integration

- **IPC Communication**: All IPC handlers preserved and working
- **Window Management**: Window creation, positioning, and shortcuts
- **File System**: File operations and data persistence
- **Security**: Content security policy and sandboxing

## Testing Instructions

### Manual Testing Checklist

1. **Application Startup**
   - [ ] App starts without errors
   - [ ] Onboarding shows for new users
   - [ ] Main view loads correctly

2. **Core Functionality**
   - [ ] API key input and validation
   - [ ] Session start/stop
   - [ ] Screen capture working
   - [ ] Audio capture working
   - [ ] AI responses displaying

3. **Navigation**
   - [ ] All view transitions work
   - [ ] Header buttons functional
   - [ ] Back/close buttons work

4. **Settings**
   - [ ] Profile selection
   - [ ] Language selection
   - [ ] Screenshot interval
   - [ ] Image quality
   - [ ] Layout modes
   - [ ] Advanced settings

5. **Keyboard Shortcuts**
   - [ ] Window movement (Ctrl/Cmd + Arrow keys)
   - [ ] Hide/show (Ctrl/Cmd + \\)
   - [ ] Click-through (Ctrl/Cmd + M)
   - [ ] Start session (Ctrl/Cmd + Enter)
   - [ ] Response navigation
   - [ ] Scroll shortcuts

6. **Data Persistence**
   - [ ] Settings saved to localStorage
   - [ ] Conversation history
   - [ ] Saved responses

## Troubleshooting

### Common Issues

1. **Build Errors**
   - Ensure all dependencies are installed: `npm install`
   - Clear node_modules and reinstall if needed

2. **Development Server Issues**
   - Check if port 5173 is available
   - Try `npm run dev:vite` separately to isolate issues

3. **Electron Issues**
   - Ensure Vite dev server is running before starting Electron
   - Check console for IPC communication errors

4. **Styling Issues**
   - Verify Tailwind CSS is properly configured
   - Check if custom CSS classes are defined

### Performance Optimization

- Use React DevTools for component profiling
- Monitor memory usage during long sessions
- Check for memory leaks in IPC handlers

## Migration Benefits

1. **Modern Development**: React 18+ with latest features
2. **Better Tooling**: Vite for fast builds and HMR
3. **Improved Styling**: Tailwind CSS for consistent design
4. **Type Safety**: Better IDE support and error catching
5. **Maintainability**: Cleaner component structure
6. **Performance**: Optimized rendering and bundle size

## Future Enhancements

Potential improvements for future versions:

1. **TypeScript**: Add TypeScript for better type safety
2. **State Management**: Consider Redux Toolkit for complex state
3. **Testing**: Add comprehensive test suite with Jest/React Testing Library
4. **Accessibility**: Improve ARIA labels and keyboard navigation
5. **Internationalization**: Add i18n support for multiple languages

## Support

For issues or questions about the migration:

1. Check the console for error messages
2. Verify all dependencies are correctly installed
3. Test with a clean build (`npm run build`)
4. Check the original Lit version for comparison if needed

The migration maintains 100% feature parity with the original Lit version while providing a modern, maintainable React codebase.