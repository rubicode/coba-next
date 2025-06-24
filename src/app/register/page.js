'use client'

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { request } from "@/api/request";

export default function Register() {
    const router = useRouter();

    const [user, setUser] = useState({
        username: '',
        password: '',
        rePassword: ''
    });

    const [error, setError] = useState('');

    const register = async (e) => {
        e.preventDefault();

        if (user.password !== user.rePassword) {
            setError("Passwords don't match");
            return;
        }

        try {
            await request.post('auth/register', user);
            router.push("/todos");
        } catch (e) {
            console.error(e);
            setError(e?.response?.data?.message || "Registration failed");
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-6 text-center">Sign Up</h1>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded" data-testid="register-error">
                        {error}
                    </div>
                )}

                <form onSubmit={register} className="space-y-4" data-testid="register-form">
                    <div>
                        <label htmlFor="username" className="block mb-1 font-medium text-gray-700">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={user.username}
                            onChange={e => setUser({ ...user, username: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>



                    <div>
                        <label htmlFor="password" className="block mb-1 font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={user.password}
                            onChange={e => setUser({ ...user, password: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="rePassword" className="block mb-1 font-medium text-gray-700">Confirm Password</label>
                        <input
                            type="password"
                            id="rePassword"
                            name="rePassword"
                            value={user.rePassword}
                            onChange={e => setUser({ ...user, rePassword: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">
                        Sign Up
                    </button>
                </form>

                <p className="mt-4 text-center text-sm text-gray-600">
                    Already have an account? <a href="/" className="text-blue-600 hover:underline">Sign In</a>
                </p>
            </div>
        </div>
    );
}
