import React, { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const data = jwtDecode(token);
                setUser(data.user);
                setIsLoggedIn(true);
            } catch (e) {
                localStorage.removeItem('token');
                toast.error("Nu ești autentificat!");
            }
        }
        setIsLoggedIn(localStorage.getItem('token') !== null);
    }, [isLoggedIn]);

    const login = (data) => {
        localStorage.setItem('token', data.accessToken);
        setIsLoggedIn(true);
        setUser(data.accessToken);
    };

    const logout = () => {
        setIsLoggedIn(false);
        setUser(null);
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const auth = useContext(AuthContext);
    if (!auth) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return auth;
};
