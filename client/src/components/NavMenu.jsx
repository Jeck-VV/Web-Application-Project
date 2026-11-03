import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router';
import { useContext } from 'react';
import LanguageContext from './LanguageContext.jsx';
import ThemeContext from './ThemeContext.jsx';
import './css/NavMenu.css';

import gameTranslations from './GameTranslations.js';

const b = {
    light: {
        themeBtn: '🌙',
    },
    dark: {
        themeBtn: '☀️',
    }
}

function NavMenu(props) {
    const { language, setLanguage } = useContext(LanguageContext);
    const tx = gameTranslations[language];

    const { theme, setTheme } = useContext(ThemeContext);
    const bx = b[theme];

    const location = useLocation();
    const isOnRules = location.pathname === '/rules';
    const isOnLogin = location.pathname === '/login';
    const isOnLeaderboard = location.pathname === '/leaderboard';


    return (<>
        {props.loggedIn ? (
            /* MENU PER UTENTE LOGGATO */
            <>
                {isOnRules
                    ? <Nav.Link className="linkNav" as={Link} to="/">{tx.navHome}</Nav.Link>
                    : <Nav.Link className="linkNav" as={Link} to="/rules">{tx.navRules}</Nav.Link>
                }
                {isOnLeaderboard
                    ? <Nav.Link className="linkNav" as={Link} to="/">{tx.navHome}</Nav.Link>
                    : <Nav.Link className="linkNav" as={Link} to="/leaderboard">{tx.navLeaderboard}</Nav.Link>
                }
                <Nav.Link className="linkNav" onClick={props.onLogout} style={{ cursor: 'pointer' }}>
                    {tx.navLogout}
                </Nav.Link>
            </>
        ) : (
            /* MENU PER UTENTE NON LOGGATO */
            <>
                {isOnLogin
                    ? <Nav.Link className="linkNav" as={Link} to="/">{tx.navHome}</Nav.Link>
                    : <Nav.Link className="linkNav" as={Link} to="/login">{tx.navLogin}</Nav.Link>
                }
            </>
        )}
        <div className="d-flex align-items-center ms-lg-3 mt-3 mt-lg-0 border-start-lg ps-lg-3 custom-controls-container">

            {/* --- SWITCH LINGUA --- */}
            <div className="form-check form-switch custom-switch-wrapper me-3 mb-0 d-flex align-items-center">
                <input
                    className="form-check-input shadow-none m-0"
                    type="checkbox"
                    role="switch"
                    id="langSwitch"
                    checked={language === 'en'}
                    onChange={() => setLanguage(language === 'it' ? 'en' : 'it')}
                />
                {/* Testo sovrapposto gestito dal CSS */}
                <span className="switch-inner-content lang-text">
                    {tx.langBtn}
                </span>
            </div>

            {/* --- SWITCH TEMA --- */}
            <div className="form-check form-switch custom-switch-wrapper mb-0 d-flex align-items-center">
                <input
                    className="form-check-input shadow-none m-0"
                    type="checkbox"
                    role="switch"
                    id="themeSwitch"
                    checked={theme === 'dark'}
                    onChange={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                />
                {/* Icona sovrapposta gestita dal CSS */}
                <span className="switch-inner-content theme-icon">
                    {bx.themeBtn}
                </span>
            </div>

        </div>
    </>
    );
}

export default NavMenu;