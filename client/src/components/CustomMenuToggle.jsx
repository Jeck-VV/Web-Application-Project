import { Navbar } from 'react-bootstrap';
import "./css/CustomMenuToggle.css"

function CustomMenuToggle() {
    return (
        <Navbar.Toggle 
            aria-controls="basic-navbar-nav" 
            className="border-0 shadow-none px-2 custom-toggle-btn"
            style={{ backgroundColor: 'transparent' }}
        >
            <svg 
                className="toggle-arrow"
                width="32" 
                height="32" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="#000000"
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
            >
                <path d="M6 9l6 6 6-6"/>
            </svg>
        </Navbar.Toggle>
    );
}

export default CustomMenuToggle;