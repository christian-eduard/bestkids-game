'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '@/lib/api';

interface Role {
    id: number;
    name: string;
}

interface User {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    roleId: number;
    centerId?: number; // Añadido
    role?: Role;
    fullName?: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (username: string, password: string) => Promise<User>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check for existing session
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        if (storedUser && token) {
            setUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
    }, []);



    const login = async (username: string, password: string) => {
        try {
            const response = await api.post('/auth/login', { username, password });

            // Check status code, although axios throws on error usually.
            // if response.status !== 201 created...

            const data = response.data;
            // Expecting { access_token: string, user: User }

            console.log('Login response user:', data.user);
            console.log('User roleId:', data.user.roleId);

            const userData = {
                ...data.user,
                // Ensure roleId aligns with logic if backend returns it
                roleId: data.user.role?.id || data.user.roleId
            };

            localStorage.setItem('token', data.access_token);
            localStorage.setItem('user', JSON.stringify(userData));

            setUser(userData);
            return userData;
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        // Clear cookies if needed
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                login,
                logout,
                isAuthenticated: !!user
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
