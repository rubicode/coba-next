'use client';

import { useState } from "react";
import { useDispatch } from "react-redux";
import { removeTodoAsync, resendTodoAsync } from "@/redux/todoSlice";

export default function TodoItem({ no, item }) {
    const dispatch = useDispatch();
    const [isEdit, setIsEdit] = useState(false);
    const [todo, setTodo] = useState({ title: item.title, complete: item.complete });

    const save = () => {
        // implement update logic here
        setIsEdit(false);
    };

    if (isEdit) {
        return (
            <tr className="border-b">
                <td className="p-2">{no}</td>
                <td className="p-2">
                    <input
                        type="text"
                        value={todo.title}
                        onChange={(e) => setTodo({ ...todo, title: e.target.value })}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </td>
                <td className="p-2">
                    <select
                        value={todo.complete ? "true" : "false"}
                        onChange={(e) => setTodo({ ...todo, complete: e.target.value === "true" })}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="false">Belum</option>
                        <option value="true">Sudah</option>
                    </select>
                </td>
                <td className="p-2 space-x-2">
                    <button
                        type="button"
                        onClick={() => setIsEdit(false)}
                        className="px-4 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={save}
                        className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Save
                    </button>
                </td>
            </tr>
        );
    } else {
        if (item.sent) {
            return (
                <tr className="border-b">
                    <td className="p-2">{no}</td>
                    <td className="p-2">{item.title}</td>
                    <td className="p-2">{item.complete ? 'Sudah' : 'Belum'}</td>
                    <td className="p-2 space-x-2">
                        <button
                            type="button"
                            onClick={() => setIsEdit(true)}
                            className="px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                            Edit
                        </button>
                        <button
                            type="button"
                            onClick={() => dispatch(removeTodoAsync(item.id))}
                            className="px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                            Delete
                        </button>
                    </td>
                </tr>
            );
        } else {
            return (
                <tr className="border-b">
                    <td className="p-2">{no}</td>
                    <td className="p-2">{item.title}</td>
                    <td className="p-2">{item.complete ? 'Sudah' : 'Belum'}</td>
                    <td className="p-2">
                        <button
                            type="button"
                            onClick={() => dispatch(resendTodoAsync(item))}
                            className="px-4 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                        >
                            Resend
                        </button>
                    </td>
                </tr>
            );
        }
    }
}