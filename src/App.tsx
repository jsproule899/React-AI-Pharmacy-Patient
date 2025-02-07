import { BrowserRouter, Route, Routes, useLocation } from "react-router";
import './App.css';
import Footer from './components/Navigation/Footer.tsx';
import Navbar from './components/Navigation/Navbar.tsx';
import { Toaster } from "./components/ui/toaster.tsx";
import './index.css';
import ErrorPage from './pages/ErrorPage.tsx';
import HomePage from './pages/Home/HomePage.tsx';
import IssuesPage from "./pages/Issues/IssuesPage.tsx";
import LoginPage from './pages/Login/LoginPage.tsx';
import ScenarioFormPage from './pages/Scenario/ScenarioFormPage.tsx';
import ScenarioPage from './pages/Scenario/ScenarioPage.tsx';
import ScenariosPage from './pages/Scenario/ScenariosPage.tsx';
import TranscriptPage from "./pages/Transcripts/TranscriptPage.tsx";
import TranscriptsPage from "./pages/Transcripts/TranscriptsPage.tsx";
import RequireAuth from "./components/Auth/RequireAuth.tsx";
import PersistAuth from "./components/Auth/PersistAuth.tsx";
import Unauthorized from "./pages/Unauthorized.tsx";


function App() {
  return (
    <BrowserRouter>
      <AppWithRouting />
    </BrowserRouter>
  );
}

function AppWithRouting() {
  const location = useLocation();
  const isEmbeddedRoute = location.pathname.startsWith('/embedded');

  return (
    <div className='min-h-screen flex flex-col scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar scrollbar-thumb-slate-700 scrollbar-track-slate-300 relative'>

      {!isEmbeddedRoute && <Navbar />}
      <div className="flex-grow bg-stone-50 dark:bg-stone-900 font-brandon">
        <Routes>
          <Route element={<PersistAuth />}>
            <Route path="/" element={<HomePage />} />
            {/*protected routes*/}
            <Route element={<RequireAuth allowedRoles={['student', 'staff', 'superUser']} />}>
              <Route path="scenarios" element={<ScenariosPage />} />
              <Route path="/transcripts" element={<TranscriptsPage />} />
              <Route path="/transcripts/:id" element={<TranscriptPage />} />
            </Route>
            {/*Staff/SU protected routes*/}
            <Route element={<RequireAuth allowedRoles={['staff', 'superUser']} />}>
              <Route path="scenarios/add" element={<ScenarioFormPage />} />
              <Route path="scenarios/edit/:id" element={<ScenarioFormPage />} />

              <Route path="/issues" element={<IssuesPage />} />
            </Route>

            <Route path="scenarios/:id" element={<ScenarioPage />} />
            <Route path="/login" element={<LoginPage />} />

            <Route path='/unauthorized' element={<Unauthorized />} />
            <Route path='*' element={<ErrorPage />} />
          </Route>       


          
        
          {/* Embedded routes without Navbar/Footer */}
          <Route path="/embedded">
            <Route path="scenarios/:id" element={<ScenarioPage />} />
          </Route>

    
        </Routes>
      </div>
      {!isEmbeddedRoute && <Footer />}
      <Toaster />
    </div>

  )
}

export default App
