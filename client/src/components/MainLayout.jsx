import { Row, Col, Card, Container, Table } from "react-bootstrap";
import { Link } from "react-router";
import "./css/MainLayout.css";
import { useContext } from "react";
import LanguageContext from "./LanguageContext.jsx";
import ThemeContext from './ThemeContext.jsx';
import FormLogin from './FormLogin.jsx';
import gameTranslations from './GameTranslations.js';


const b = {
    dark: 1,
    light: 0,
};

export function NotFoundLayout() {
    const { language } = useContext(LanguageContext);
    const tx = gameTranslations[language];

    const { theme } = useContext(ThemeContext);
    const bx = b[theme];

    return (
        <div className="d-flex flex-column" style={{ marginTop: '1rem' }}>
            <Row style={{ marginBottom: '2rem', justifyContent: 'center' }}> <Col xs="auto"> <h2>{tx.title}</h2> </Col> </Row>
            <Row style={{ marginBottom: '2rem', justifyContent: 'center' }}> <Col xs="auto"> <img src="/img/not-found.png" alt="page not found" style={{ maxWidth: '400px', height: 'auto', marginBottom: '2rem', filter: `invert(${bx})` }} /> </Col> </Row>
            <Row style={{ marginBottom: '2rem', justifyContent: 'center' }}> <Col xs="auto"> <h2>{tx.quote}</h2> </Col> </Row>
            <Row style={{ justifyContent: 'center' }}> <Col xs="auto"> <Link to="/" className="goHomeButton btn">{tx.btn}</Link> </Col> </Row>
        </div>
    );
}

export function LoginLayout(props) {
    const { theme } = useContext(ThemeContext);

    const { language } = useContext(LanguageContext);
    const tx = gameTranslations[language];

    const cardClass = theme === 'dark' ? 'bg-dark text-white border-secondary' : 'bg-white border-light';

    return (
        <Container className="d-flex justify-content-center align-items-center mt-5" style={{ minHeight: '60vh' }}>
            <Card
                style={{ width: '100%', maxWidth: '420px', borderRadius: '20px', boxShadow: '0 10px 40px rgba(0,0,0,0.75)' }}
                className={`border ${cardClass} p-4`}
            >
                <Card.Body>
                    <FormLogin t={gameTranslations} handleLogin={props.handleLogin} loginError={props.loginError} setLoginError={props.setLoginError} />
                </Card.Body>
            </Card>
        </Container>
    );
}


export function LeaderboardLayout(props) {
    const { language } = useContext(LanguageContext);
    const tx = gameTranslations[language];

    const { theme } = useContext(ThemeContext);
    const cardClass = theme === 'dark' ? 'bg-dark text-white border-secondary' : 'bg-white border-light';

    return (
        <Container className="d-flex justify-content-center mt-4" style={{ minHeight: '60vh' }}>
            <Card
                style={{ width: '100%', maxWidth: '800px', borderRadius: '20px', boxShadow: '0 10px 40px rgba(0,0,0,0.15)' }}
                className={`border ${cardClass} p-2 p-md-4`}
            >
                <Card.Body>
                    <h2 className="text-center mb-4 fw-bold">{tx.leaderboardTitle}</h2>

                    <div className="table-responsive" style={{ borderRadius: '15px', overflow: 'hidden', border: theme === 'dark' ? '1px solid #444' : '1px solid #dee2e6' }}>
                        <Table striped hover variant={theme} className="mb-0 text-center align-middle">
                            <thead className={theme === 'dark' ? 'table-dark' : 'table-light'}>
                                <tr>
                                    <th className="py-3 text-muted">#</th>
                                    <th className="py-3">{tx.thUser}</th>
                                    <th className="py-3">{tx.thScore}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {props.classifica && props.classifica.length > 0 ? (
                                    props.classifica.map((row, index) => {
                                        return (
                                            <tr key={`uid-${row.uid}`}>
                                                <td className="fw-bold fs-5 text-warning"> {index + 1} </td>
                                                <td className="fw-semibold"> {row.username} </td>
                                                <td className="fw-bold text-success fs-5"> {row.max_score} 🪙 </td>
                                            </tr>
                                        );
                                    })
                                ) : null}
                            </tbody>
                        </Table>

                        {props.classifica && props.classifica.length === 0 && (
                            <h3 className="text-center mt-4 text-muted">{tx.noGame}</h3>
                        )}
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
}
