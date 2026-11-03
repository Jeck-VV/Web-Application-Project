import { Link } from 'react-router';
import { Navbar, Nav, Container } from 'react-bootstrap';
import CustomMenuToggle from './CustomMenuToggle.jsx';
import NavMenu from './NavMenu.jsx';
import LanguageContext from './LanguageContext.jsx';
import { useContext } from 'react';
import gameTranslations from './GameTranslations.js';

function Header(props) {

    const { language } = useContext(LanguageContext);

    const tx = gameTranslations[language];

    return (
        <Navbar expand="lg" className="contenitore bg-body-tertiary" sticky="top">
            <Container fluid>
                <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
                    <img
                        src="/img/metro-icon.png"
                        alt="Logo"
                        style={{ width: '50px' }}
                        className="me-4"
                    />
                    <span className="fs-3 fw-bold mb-0 brand-text">{tx.headerName}</span>
                </Navbar.Brand>

                {props.loggedIn && <div className='fs-3 fw-bold d-flex justify-content-center mx-auto brand-text'>
                    <span> {tx.headerGreetings} {props.user.username}</span>
                </div>}

                <CustomMenuToggle />

                <Navbar.Collapse id="basic-navbar-nav" className="flex-grow-0">
                    <Nav className="ms-auto align-items-center me-2">
                        <NavMenu
                            handleLangToggle={props.handleLangToggle}
                            loggedIn={props.loggedIn}
                            currentLang={props.currentLang}
                            handleThemeToggle={props.handleThemeToggle}
                            currentTheme={props.currenTheme}
                            onLogout={props.handleLogout}
                        />
                    </Nav>
                </Navbar.Collapse>

            </Container>
        </Navbar>
    );
}

export default Header;