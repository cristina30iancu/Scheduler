import { useEffect, useState } from "react";
import { useAuth } from "../components/AuthProvider";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Row, Col, Image } from 'react-bootstrap';
import signupImg from '../components/img/signup.jpg';
import signupIcon from '../components/img/signup.png';
import { toast } from "react-toastify";

function Signup() {
    const { isLoggedIn, user, login, logout } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
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

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8080/inregistrare/', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            if (!response.ok) {
                toast.error('Eroare la înregistrare: ' + data.message);
            } else {
                toast.success("Înregistrat!");
                navigate("/login");
            }
        } catch (error) {
            console.error('Eroare la înregistrare!');
        }
        setFormData({
            firstName: '',
            lastName: '',
            phone: '',
            email: ''
        });
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', backgroundImage: "url(https://i.imgur.com/YDwNPZg.jpg)" }}>
            <Container className="login-container">
                <Row>
                    <Col col='6' style={{ margin: 'auto', display: 'block' }} >
                        <Image width="100%" src={signupImg}></Image>
                    </Col>
                    <Col col='6'>
                        <Form className="login-form text-center" onSubmit={handleSubmit}>
                            <Image width="50px" src={signupIcon}></Image>
                            <h2 className="text-center my-4">Înregistrare</h2>
                            <Form.Group className="text-start mb-3">
                                <Form.Label>Nume</Form.Label>
                                <Form.Control type="text" placeholder="Nume" name="lastName" value={formData.lastName} onChange={handleChange} required />
                            </Form.Group>
                            <Form.Group className="text-start">
                                <Form.Label>Prenume</Form.Label>
                                <Form.Control type="text" placeholder="Prenume" name="firstName" value={formData.firstName} onChange={handleChange} required />
                            </Form.Group>
                            <Form.Group className="text-start mb-3">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" placeholder="Email" name="email" value={formData.email} onChange={handleChange} required />
                            </Form.Group>
                            <Form.Group className="text-start">
                                <Form.Label>Parolă</Form.Label>
                                <Form.Control type="password" placeholder="Parolă" name="password" value={formData.password} onChange={handleChange} required />
                            </Form.Group>
                            <Button variant="primary" type="submit" className="btn-block my-3" style={{ backgroundColor: '#314c47' }}>
                                Înregistrare
                            </Button>
                            <p><a href="#" onClick={() => navigate("/login")}>Autentifică-te dacă ai deja cont.</a></p>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </div>

    );
}

export default Signup;