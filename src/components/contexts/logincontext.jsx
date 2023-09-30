import { useState, useEffect, useCallback, createContext } from "react";

export const LoginContext = createContext();

export const LoginContextProvider = ({ children }) => {

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [token, setToken] = useState(null);

    const handleTokenChange = useCallback(newToken => {
        setToken(newToken);
        setIsLoggedIn(true);
    }, []);
    const logout = useCallback(() => {
        setToken(null);
        setIsLoggedIn(false);
    }, []);

    const [value, setValue] = useState({});
    useEffect(() => {
        setValue({
            isLoggedIn: isLoggedIn,
            token: token,
            setToken: handleTokenChange,
            logout: logout
        });
    }, [isLoggedIn, token, handleTokenChange, logout]);

    return (
        <LoginContext.Provider value={value}>
            {children}
        </LoginContext.Provider>
    );
};