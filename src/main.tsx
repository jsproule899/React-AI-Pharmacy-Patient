import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { ThemeProvider } from './components/Theme/theme-provider.tsx';
import {QueryClientProvider, QueryClient} from '@tanstack/react-query';
import './index.css';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(

  <StrictMode>
    <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <App/>
    </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
)
