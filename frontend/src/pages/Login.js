import { useEffect, useState } from "react";
import { useAuth } from "../components/AuthProvider";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Row, Col, Image } from 'react-bootstrap';
import loginImg from '../components/img/login.jpg';
import loginIcon from '../components/img/login.png';
import { toast } from "react-toastify";

function Login() {
    const { isLoggedIn, user, login, logout } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        password: '',
        email: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    useEffect(() => {
        if (isLoggedIn) {
            navigate("/");
        }
    }, [isLoggedIn]);

    const handleLogin = async e => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8080/autentificare/', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                }, 
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            if (!response.ok) {
                toast.error('Eroare la autentificare: ' + data.message);
            } else {
                toast.success("Autentificat!");
                login(data);
            }
        } catch (error) {
            console.error('Eroare la autentificare!');
        }
        setFormData({
            phone: '',
            email: ''
        });
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', backgroundImage: "url(https://i.imgur.com/YDwNPZg.jpg)" }}>
            <Container className="login-container">
                <Row>
                    <Col col='6' style={{ margin: 'auto', display: 'block' }} >
                        <Image width="100%" src={loginImg}></Image>
                    </Col>
                    <Col col='6'>
                        <Form className="login-form text-center" onSubmit={handleLogin}>
                            <Image width="50px" src={loginIcon}></Image>
                            <h2 className="text-center my-4">Autentificare</h2>
                            <Form.Group className="text-start mb-3">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                            </Form.Group>
                            <Form.Group className="text-start">
                                <Form.Label>Parolă</Form.Label>
                                <Form.Control type="password" name="password" placeholder="Parolă" value={formData.password} onChange={handleChange} required />
                            </Form.Group>
                            <Button variant="primary" type="submit" className="btn-block my-3" style={{ backgroundColor: '#314c47' }}>
                                Autentificare
                            </Button>
                            <p><a href="#" onClick={() => navigate("/signup")}>Înregistrează-te dacă nu ai deja cont.</a></p>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </div>

    );
}

export default Login;