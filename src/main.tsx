import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { ThemeProvider } from './components/Theme/theme-provider.tsx';
import './index.css';



createRoot(document.getElementById('root')!).render(

  <StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <App/>
    </ThemeProvider>
  </StrictMode>,
)
