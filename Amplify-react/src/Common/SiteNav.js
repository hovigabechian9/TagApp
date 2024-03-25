import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import LogoutButton from './LogoutButton'; // Assurez-vous que le chemin est correct
import { useNavigate } from 'react-router-dom';

function SiteNav({ signOut }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        signOut(); // Appelle la fonction de déconnexion
        navigate('/login'); // Redirige vers la page de connexion après la déconnexion
    };

    return (
        <header>
            <Navbar bg="dark" expand="lg" variant='dark'>
                <Container>
                    <Navbar.Brand><Nav.Link href="/">Tagging App</Nav.Link></Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-md-auto">
                        <Nav.Link href="/Tag">AWS</Nav.Link>
                        {/* Remplacer par LogoutButton */}
                        <LogoutButton onLogout={handleLogout} />
                    </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    );
}

export default SiteNav;
