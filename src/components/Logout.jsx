'use client';

import { useRouter } from 'next/navigation';

export default function Logout() {
    const router = useRouter();

    const logout = () => {
        localStorage.clear();
        router.push('/');
    };

    return (
        <button
            type="button"
            onClick={logout}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
        >
            Logout
        </button>
    );
}