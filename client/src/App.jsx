import { useState, useEffect } from 'react';
import './App.css';
import { Routes, Route, useNavigate, useLocation } from 'react-router';
import { NotFoundLayout, LoginLayout, LeaderboardLayout } from './components/MainLayout.jsx';
import { GamePage } from './components/GamePage.jsx';
import { MainPage } from './components/MainPage.jsx';
import { RulesPage } from './components/RulesPage.jsx';
import LanguageContext from './components/LanguageContext.jsx';
import ThemeContext from './components/ThemeContext.jsx';
import API from "./API/API.js";

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(undefined);
  const [loginError, setLoginError] = useState(false);

  const [language, setLanguage] = useState(localStorage.getItem('language') || 'it');
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [isGameStarted, setIsGameStarted] = useState(false);

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Carica lo stato di gioco specifico dell'utente
  useEffect(() => {
    if (user) {
      setIsGameStarted(localStorage.getItem(`isGameStarted_${user.id}`) === 'true');
    } else {
      setIsGameStarted(false);
    }
  }, [user]);

  // Modifica stato e salva contemporaneamente (evita race condition di useEffect)
  const handleSetIsGameStarted = (value) => {
    setIsGameStarted(value);
    if (user) {
      localStorage.setItem(`isGameStarted_${user.id}`, value);
    }
  };

  const [stazioni, setStazioni] = useState(undefined);
  const [tratte, setTratte] = useState(undefined);
  const [linee, setLinee] = useState(undefined);
  const [classifica, setClassifica] = useState(undefined);

  useEffect(() => {
    const testStazioni = async () => {
      try {
        const s = await API.getStazioniInfo();
        setStazioni(s);
      } catch (err) {
        setStazioni("errore");
      }
    };
    if (loggedIn) {
      testStazioni();
    }
  }, [loggedIn]);

  useEffect(() => {
    const testTratte = async () => {
      try {
        const t = await API.getTratteInfo();
        setTratte(t);
      } catch (err) {
        setTratte("errore");
      }
    };
    if (loggedIn) {
      testTratte();
    }
  }, [loggedIn]);

  useEffect(() => {
    const testLinee = async () => {
      try {
        const l = await API.getLineeInfo();
        setLinee(l);
      } catch (err) {
        setLinee("errore");
      }
    };
    if (loggedIn) {
      testLinee();
    }
  }, [loggedIn]);

  useEffect(() => {
    const testClassifica = async () => {
      try {
        const c = await API.getClassificaInfo();
        setClassifica(c);
      } catch (err) {
        setClassifica("errore");
      }
    };
    if (loggedIn && location.pathname === '/leaderboard') {
      testClassifica();
    }
  }, [loggedIn, isGameStarted, location.pathname]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await API.getUserInfo();
        setLoggedIn(true);
        setUser(user);
      } catch (error) {
        console.warn(error);
      }
    };
    checkAuth();
  }, []);

  const handleLogin = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      setLoggedIn(true);
      setLoginError(false);
      setUser(user);
      navigate('/');
    } catch (err) {
      setLoginError(true);
    }
  };

  const handleLogout = async () => {
    await API.logOut();
    setLoggedIn(false);
    setUser(undefined);
    setIsGameStarted(false);
    navigate('/');
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      <ThemeContext.Provider value={{ theme, setTheme }}>
        <div className='mainClass min-vh-100 d-flex flex-column' data-bs-theme={theme}>
          <Routes>
            <Route path='/' element={<MainPage loggedIn={loggedIn} handleLogout={handleLogout} user={user} />}>
              <Route index element={loggedIn ? <GamePage stazioni={stazioni} tratte={tratte} linee={linee} isGameStarted={isGameStarted} setIsGameStarted={handleSetIsGameStarted} user={user} /> : <RulesPage />} /> 
              {loggedIn && <Route path='rules' element={<RulesPage />} />}
              {!loggedIn && <Route path='login' element={<LoginLayout handleLogin={handleLogin} loginError={loginError} setLoginError={setLoginError}/>} />}
              {loggedIn && <Route path='leaderboard' element={<LeaderboardLayout classifica={classifica} />} />}
              <Route path="*" element={<NotFoundLayout />} />
            </Route>
          </Routes>
        </div>
      </ThemeContext.Provider>
    </LanguageContext.Provider>
  )
}

export default App
