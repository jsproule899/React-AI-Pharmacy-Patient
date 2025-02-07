import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { ThemeProvider } from './components/Theme/theme-provider.tsx';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import './index.css';
import { AuthProvider } from './context/AuthProvider.tsx';
import { disableReactDevTools } from '@fvilers/disable-react-devtools'

if (import.meta.env.PROD) {
  disableReactDevTools();
}

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(

  
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
    <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <App />
        </AuthProvider>
    </QueryClientProvider>
    </ThemeProvider>

)
