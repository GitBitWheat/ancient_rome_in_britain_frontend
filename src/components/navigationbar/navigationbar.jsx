import { useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

import { Link } from 'react-router-dom';
import { LoginContext } from '../contexts/logincontext';
import './navigationbar.css'

const NavigationBar = () => {

    const loginCtx = useContext(LoginContext);
    const nav = useNavigate();

    const logout = useCallback(() => {
        loginCtx.logout();
        nav('/');
    }, [loginCtx, nav]);

    return (
        <Navbar className="fixed-top" variant="light" expand="sm">
            <Container>
                <Navbar.Brand>
                    Ancient Rome in British Children's Culture
                </Navbar.Brand>
                <Navbar.Collapse id="basic-navbar-nav">
                  <Nav className="me-auto">
                    <Link to='/' className='nav-link'>Home</Link>
                    <Link to='/entries' className='nav-link'>Entries</Link>
                    <Link to='/about' className='nav-link'>About</Link>
                    <Link to='/contact' className='nav-link'>Contact</Link>
                    {loginCtx.isLoggedIn ? <>
                        <Link to='/lists' className='nav-link'>Lists</Link>
                        <Nav.Link onClick={logout}>Logout</Nav.Link>
                    </> : (
                        <Link to='/login' className='nav-link'>Login</Link>
                    )}
                  </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavigationBar;