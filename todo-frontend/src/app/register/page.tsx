"use client";

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/axios';
import Link from 'next/link';

export default function RegisterPage() {
    const { login } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        try {
            // Send the password twice to satisfy Laravel's "confirmed" validation rule
            const response = await api.post('/register', { 
                name, 
                email, 
                password, 
                password_confirmation: password 
            });
            
            const token = response.data.access_token;
            
            localStorage.setItem('access_token', token);
            const userResponse = await api.get('/user', {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            login(token, userResponse.data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to register.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Create Account</h2>
                
                {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input 
                            type="text" 
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input 
                            type="email" 
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input 
                            type="password" 
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            minLength={8}
                            required
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="w-full bg-green-600 text-white p-2 rounded-md hover:bg-green-700 transition"
                    >
                        Register
                    </button>
                </form>
                
                <p className="mt-4 text-sm text-center text-gray-600">
                    Already have an account? <Link href="/login" className="text-blue-600 hover:underline">Log in</Link>
                </p>
            </div>
        </div>
    );
}