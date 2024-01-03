import { useState, useCallback, useContext } from "react";

import { Button, Form } from "devextreme-react";
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

const formData = {
    Password: ''
};

const LoginPage = () => {

    const loginCtx = useContext(LoginContext);

    const [fieldData, setFieldData] = useState(formData);
    const onFormDataChanged = useCallback(event => {
        const updatedFormData = { ...formData, [event.dataField]: event.value };
        setFieldData(updatedFormData);
    }, []);

    const [showErrMsg, setShowErrMsg] = useState(false);
    const nav = useNavigate();

    const login = useCallback(() => {
        const data = {
            name: 'Ilay',
            email: 'ilay.daniel@gmail.com',
            password: fieldData.Password
        };
        axios.post(loginURL, JSON.stringify(data), config)
        .then(response => {
            loginCtx.setToken(response.data.token);
            nav('/');
        })
        .catch(_err => {
            setShowErrMsg(true);
        });
    }, [fieldData, nav, loginCtx]);

    return (
        <div className="login-page-container">
            <Form
                formData={formData}
                onFieldDataChanged={onFormDataChanged}
                labelMode='outside'
                labelLocation='left'
                showColonAfterLabel={true}
                width='50vw'
            />
            <Button
                text='Login'
                onClick={login}
            />
            {showErrMsg && (
                <p className="err-msg">
                    Password is incorrect
                </p>
            )}
        </div>
    )
};

export default LoginPage;