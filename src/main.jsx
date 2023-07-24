import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { DarkModeProvider } from './context/DarkModeConext.jsx';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallback } from './ui/ErrorFallback.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <DarkModeProvider>
      <ErrorBoundary //To handle error on react rendering (just on that, the rest of errors we need to handle them on each place)
        FallbackComponent={ErrorFallback} //Component to render instead of white screen
        onReset={() => window.location.replace('/')} //function we can pass
      >
        <App />
      </ErrorBoundary>
    </DarkModeProvider>
  </React.StrictMode>
);
