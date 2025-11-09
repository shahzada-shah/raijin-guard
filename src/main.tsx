/**
 * RaijinGuard - Application Entry Point
 * 
 * Initializes and mounts the React application to the DOM.
 * Configures React's StrictMode for enhanced development warnings.
 * 
 * @module Main
 * @see {@link https://react.dev/reference/react/StrictMode | React StrictMode Documentation}
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Get the root DOM element or throw error if not found
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found. Make sure your HTML has a <div id="root"></div> element.');
}

// Create React root and render the application
createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
