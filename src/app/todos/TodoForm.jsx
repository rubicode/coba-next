'use client';

import { useState } from "react";
import { useDispatch } from "react-redux";
import { addTodo } from "@/redux/todoSlice";

export default function TodoForm() {
    const dispatch = useDispatch();

    const [title, setTitle] = useState('');

    const submit = (e) => {
        e.preventDefault();
        if (!title.trim()) return;
        dispatch(addTodo(title));
        setTitle('');
    };

    return (
        <form onSubmit={submit} className="flex items-center space-x-2 mb-4">
            <input
                type="text"
                id="title"
                placeholder="Tambahkan kerjaan di sini"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="flex-grow px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
                Simpan
            </button>
        </form>
    );
}