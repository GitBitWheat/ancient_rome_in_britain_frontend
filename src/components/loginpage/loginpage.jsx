import { useState, useCallback, useContext } from "react";

import { Button, Form } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { LoginContext } from "../contexts/logincontext";
import './loginpage.css';

const loginURL = 'actions/auth/login/';
const config = {
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 60 * 1000 // 60 seconds
};

const LoginPage = () => {

    const loginCtx = useContext(LoginContext);

    const [pwInput, setPwIn] = useState('');
    const ChangeEventHandler = useCallback(event => {
        setPwIn(event.target.value);
    }, []);

    const [showErrMsg, setShowErrMsg] = useState(false);
    const nav = useNavigate();

    const login = useCallback(() => {
        const data = {
            name: 'Ilay',
            email: 'ilay.daniel@gmail.com',
            password: pwInput
        };
        axios.post(loginURL, JSON.stringify(data), config)
        .then(response => {
            loginCtx.setToken(response.data.token);
            nav('/');
        })
        .catch(_err => {
            setShowErrMsg(true);
        });
    }, [pwInput, nav, loginCtx]);

    return (
        <div className="login-page-container">
            <Form className="login-form">
                <Form.Group
                    className="mb-3"
                    controlId="password-input"
                >
                    <Form.Label>Password</Form.Label>
                    <Form.Control onChange={ChangeEventHandler}/>
                    {showErrMsg && (
                        <Form.Text className="err-msg">
                            <span className="err-msg">Password is incorrect</span>
                        </Form.Text>
                    )}
                </Form.Group>
                <Button onClick={login}>
                    Login
                </Button>
            </Form>
        </div>
    )
};

export default LoginPage;