import React from 'react';
import { Button } from 'react-bootstrap';

const LogoutButton = ({ onLogout }) => {
    return <Button variant="dark" onClick={onLogout}>Déconnexion</Button>;
};

export default LogoutButton;
