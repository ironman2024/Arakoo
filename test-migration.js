#!/usr/bin/env node

/**
 * Migration Test Script
 * Verifies that all React components and dependencies are properly set up
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Testing Cheating Daddy React Migration...\n');

const tests = [
  {
    name: 'Package.json has React dependencies',
    test: () => {
      const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      return pkg.dependencies.react && pkg.dependencies['react-dom'] && pkg.devDependencies['@vitejs/plugin-react'];
    }
  },
  {
    name: 'Vite config exists',
    test: () => fs.existsSync('vite.config.js')
  },
  {
    name: 'Tailwind config exists',
    test: () => fs.existsSync('tailwind.config.js')
  },
  {
    name: 'Main React entry point exists',
    test: () => fs.existsSync('src/main.jsx')
  },
  {
    name: 'App component exists',
    test: () => fs.existsSync('src/components/App.jsx')
  },
  {
    name: 'All view components exist',
    test: () => {
      const views = [
        'MainView.jsx',
        'AssistantView.jsx', 
        'CustomizeView.jsx',
        'HelpView.jsx',
        'HistoryView.jsx',
        'OnboardingView.jsx',
        'AdvancedView.jsx'
      ];
      return views.every(view => fs.existsSync(`src/components/views/${view}`));
    }
  },
  {
    name: 'AppHeader component exists',
    test: () => fs.existsSync('src/components/AppHeader.jsx')
  },
  {
    name: 'CSS file with Tailwind imports exists',
    test: () => {
      if (!fs.existsSync('src/index.css')) return false;
      const css = fs.readFileSync('src/index.css', 'utf8');
      return css.includes('@tailwind base') && css.includes('@tailwind components') && css.includes('@tailwind utilities');
    }
  },
  {
    name: 'Updated HTML file exists',
    test: () => {
      if (!fs.existsSync('src/index.html')) return false;
      const html = fs.readFileSync('src/index.html', 'utf8');
      return html.includes('src="/src/main.jsx"') && html.includes('<div id="root">');
    }
  },
  {
    name: 'Electron main process updated',
    test: () => {
      if (!fs.existsSync('src/utils/window.js')) return false;
      const windowJs = fs.readFileSync('src/utils/window.js', 'utf8');
      return windowJs.includes('localhost:5173') && windowJs.includes('dist/index.html');
    }
  },
  {
    name: 'Original files backed up',
    test: () => fs.existsSync('package-original.json') && fs.existsSync('src/index-original.html')
  }
];

let passed = 0;
let failed = 0;

tests.forEach(test => {
  try {
    if (test.test()) {
      console.log(`✅ ${test.name}`);
      passed++;
    } else {
      console.log(`❌ ${test.name}`);
      failed++;
    }
  } catch (error) {
    console.log(`❌ ${test.name} (Error: ${error.message})`);
    failed++;
  }
});

console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed`);

if (failed === 0) {
  console.log('\n🎉 Migration test passed! You can now run:');
  console.log('   npm install');
  console.log('   npm run dev');
} else {
  console.log('\n⚠️  Some tests failed. Please check the missing files/configurations.');
}

console.log('\n📚 See MIGRATION-README.md for detailed instructions.');