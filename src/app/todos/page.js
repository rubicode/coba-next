import Logout from "@/components/Logout";
import TodoForm from "./TodoForm";
import TodoList from "./TodoList";

export default function Page() {
    return (
        <div className="max-w-3xl mx-auto mt-10 p-4">
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="bg-blue-600 text-white text-center py-4">
                    <h1 className="text-2xl font-bold">TODO</h1>
                </div>
                <div className="p-4 border-b">
                    <TodoForm />
                </div>
                <div className="p-4 overflow-x-auto">
                    <TodoList />
                </div>
                <div className="bg-gray-100 px-4 py-3 text-center">
                    <Logout />
                </div>
            </div>
        </div>
    )
}