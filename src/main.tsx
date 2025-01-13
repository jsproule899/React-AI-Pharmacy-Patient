import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";
import './index.css'
import App from './App.tsx'
import Navbar from './components/Navigation/Navbar.tsx';
import ScenarioPage from './pages/Scenario/ScenarioPage.tsx';
import { ThemeProvider } from './components/Theme/theme-provider.tsx';
import Footer from './components/Navigation/Footer.tsx';
import HomePage from './pages/Home/HomePage.tsx';
import Scenarios from './pages/Scenario/Scenarios.tsx';
import LoginPage from './pages/Login/LoginPage.tsx';
import ScenarioFormPage from './pages/Scenario/ScenarioFormPage.tsx';
import Transcripts from './pages/Transcripts/Transcripts.tsx';
import ErrorPage from './pages/ErrorPage.tsx';


createRoot(document.getElementById('root')!).render(

  <StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <div className='min-h-screen flex flex-col scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar scrollbar-thumb-slate-700 scrollbar-track-slate-300 relative'>
        <BrowserRouter>
          <Navbar />
          <Routes>
          <Route path='*' element={<ErrorPage/>} />
            <Route path="/" element={<HomePage />} />
            <Route path="scenarios" element={<Scenarios />} />
            <Route path="scenarios/add" element={<ScenarioFormPage />} />
            <Route path="scenarios/edit/:id" element={<ScenarioFormPage/>} />
            <Route path="scenarios/:id" element={<ScenarioPage />} />
            <Route path="/transcripts" element={<Transcripts />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
          <Footer />
        </BrowserRouter>


      </div>
    </ThemeProvider>
  </StrictMode>,
)
