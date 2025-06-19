'use client'

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { request } from "@/api/request";

export default function Login() {

  const router = useRouter();

  const [user, setUser] = useState({ username: '', password: '' });

  const login = async (e) => {
    e.preventDefault();
    try {
      await request.post('auth/login', user);
      router.push("/todos");
    } catch (e) {
      console.error(e);
      alert(e?.response?.data?.message || "Login failed");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Sign In</h1>
        <form onSubmit={login} className="space-y-4">
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
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">
            Sign In
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Don’t have an account? <a href="/register" className="text-blue-600 hover:underline">Sign Up</a>
        </p>
      </div>
    </div>
  );
}
