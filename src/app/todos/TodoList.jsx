'use client';

import { useEffect } from "react";
import TodoItem from "./TodoItem";
import { useSelector, useDispatch } from 'react-redux';
import { getTodos, loadTodoAsync } from "@/redux/todoSlice";

export default function TodoList() {
    const todos = useSelector(getTodos);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(loadTodoAsync());
    }, [dispatch]);

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="text-left px-4 py-2 border-b">No.</th>
                        <th className="text-left px-4 py-2 border-b">Title</th>
                        <th className="text-left px-4 py-2 border-b">Complete</th>
                        <th className="text-left px-4 py-2 border-b">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {todos.map((todo, index) => (
                        <TodoItem key={todo._id} no={index + 1} item={todo} />
                    ))}
                </tbody>
            </table>
        </div>
    );
}