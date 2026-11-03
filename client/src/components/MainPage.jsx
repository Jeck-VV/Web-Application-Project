import { Outlet } from 'react-router';
import { Container } from 'react-bootstrap';
import Header from './Header.jsx';
import ThemeContext from './ThemeContext.jsx';
import LanguageContext from './LanguageContext.jsx';
import { useContext } from 'react';

export function MainPage(props) {

    const { language, setLanguage } = useContext(LanguageContext);

    const { theme, setTheme } = useContext(ThemeContext);

    const handleLangToggle = () => {
        setLanguage(language === 'it' ? 'en' : 'it');
    };

    const handleThemeToggle = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    return (
        <div className='d-flex flex-column'>
            <Header className='col-md-12'
                loggedIn={props.loggedIn}

                currentLang={language}
                handleLangToggle={handleLangToggle}

                currentTheme={theme}
                handleThemeToggle={handleThemeToggle}

                handleLogout={props.handleLogout}
                user={props.user}
            > </Header>
            <Container className="flex-grow-1 mt-3">
                <Outlet />
            </Container>
        </div>
    );
}