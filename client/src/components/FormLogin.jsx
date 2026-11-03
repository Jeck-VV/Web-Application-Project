import { useContext, useState } from "react";
import LanguageContext from "./LanguageContext.jsx";
import ThemeContext from './ThemeContext.jsx';
import { Form, Button, Alert } from "react-bootstrap";
import "./css/MainLayout.css";


function FormLogin(props) {
    const t = props.t;

    const { language } = useContext(LanguageContext);
    const tx = t[language];

    const { theme } = useContext(ThemeContext);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        const credentials = { username, password };
        await props.handleLogin(credentials);
    }

    const inputClass = theme === 'dark' ? 'bg-secondary text-white border-secondary' : '';
    return (
        <>
            <h2 className="text-center mb-4 fw-bold">{tx.loginTitle}</h2>
            {props.loginError && (
                <Alert variant="danger" dismissible onClose={() => props.setLoginError(false)}>
                    {tx.errMsg}
                </Alert>)}
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-4" controlId="formBasicEmail">
                    <Form.Label className="fw-semibold">{tx.emailLabel}</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder={tx.emailLabel}
                        className={`py-2 ${inputClass}`}
                        style={{ borderRadius: '10px' }}
                        required
                        name="username"
                        value={username}
                        onChange={(ev) => setUsername(ev.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mb-4" controlId="formBasicPassword" >
                    <Form.Label className="fw-semibold">{tx.pwdLabel}</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder={tx.pwdLabel}
                        className={`py-2 ${inputClass}`}
                        style={{ borderRadius: '10px' }}
                        name="password"
                        required
                        value={password}
                        onChange={(ev) => setPassword(ev.target.value)}
                    />
                </Form.Group>
                <Button
                    variant="primary"
                    type="submit"
                    className="w-100 fw-bold fs-5 mt-2 goHomeButton border-0"
                    style={{ borderRadius: '12px', padding: '12px' }}
                >
                    {tx.loginBtn}
                </Button>
            </Form>
        </>
    );
}

export default FormLogin;