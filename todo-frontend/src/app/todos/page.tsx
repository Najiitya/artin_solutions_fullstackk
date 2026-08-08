"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';

// Define what a Todo object looks like based on your Laravel database
interface Todo {
    id: number;
    title: string;
    description: string;
    is_completed: boolean;
}

export default function TodosPage() {
    const { user, logout, loading } = useAuth();
    const router = useRouter();
    
    // State for managing our lists and forms
    const [todos, setTodos] = useState<Todo[]>([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    
    // State for the Search and Filter requirements
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // Security check: Boot them back to login if they aren't authenticated
    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    // The function to talk to Laravel and grab the tasks
    const fetchTodos = async () => {
        try {
            let url = '/todos?';
            if (search) url += `search=${search}&`;
            if (statusFilter !== 'all') url += `status=${statusFilter}&`;
            
            const response = await api.get(url);
            setTodos(response.data);
        } catch (error) {
            console.error("Failed to fetch todos", error);
        }
    };

    // Re-run the fetch automatically whenever the user types a search or changes a filter
    useEffect(() => {
        if (user) {
            fetchTodos();
        }
    }, [user, search, statusFilter]);

    // Handle form submission to create a new task
    const handleAddTodo = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;
        
        try {
            await api.post('/todos', { title, description });
            setTitle(''); // Clear the form
            setDescription('');
            fetchTodos(); // Refresh the list from the database
        } catch (error) {
            console.error("Failed to add todo", error);
        }
    };

    // Flip a task between Pending and Completed
    const toggleComplete = async (todo: Todo) => {
        try {
            await api.put(`/todos/${todo.id}`, { is_completed: !todo.is_completed });
            fetchTodos();
        } catch (error) {
            console.error("Failed to update status", error);
        }
    };

    // Nuke a task entirely
    const handleDelete = async (id: number) => {
        try {
            await api.delete(`/todos/${id}`);
            fetchTodos();
        } catch (error) {
            console.error("Failed to delete todo", error);
        }
    };

    // Show a blank screen while Next.js figures out if we are logged in
    if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">Loading...</div>;
    if (!user) return null; // Will trigger the redirect above

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto">
                
                {/* Header Navbar */}
                <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-lg shadow">
                    <h1 className="text-2xl font-bold text-gray-800">Welcome, {user.name}</h1>
                    <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition">Logout</button>
                </div>

                {/* Add New Task Block */}
                <div className="bg-white p-6 rounded-lg shadow mb-8">
                    <h2 className="text-lg font-bold mb-4 text-gray-800">Add New Task</h2>
                    <form onSubmit={handleAddTodo} className="space-y-4">
                        <input 
                            type="text" 
                            placeholder="Task Title" 
                            className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                        <textarea 
                            placeholder="Description (Optional)" 
                            className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">Create Task</button>
                    </form>
                </div>

                {/* Search & Filter Controls */}
                <div className="flex gap-4 mb-6">
                    <input 
                        type="text" 
                        placeholder="Search your tasks..." 
                        className="flex-1 p-2 border border-gray-300 rounded shadow-sm text-gray-900"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <select 
                        className="p-2 border border-gray-300 rounded shadow-sm text-gray-900 bg-white"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">All Tasks</option>
                        <option value="pending">Pending Only</option>
                        <option value="completed">Completed Only</option>
                    </select>
                </div>

                {/* The Actual Todo List */}
                <div className="space-y-4">
                    {todos.map(todo => (
                        <div key={todo.id} className={`p-4 rounded-lg shadow flex justify-between items-center transition ${todo.is_completed ? 'bg-gray-200 border-l-4 border-green-500' : 'bg-white border-l-4 border-blue-500'}`}>
                            <div>
                                <h3 className={`text-lg font-bold ${todo.is_completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                                    {todo.title}
                                </h3>
                                {todo.description && (
                                    <p className={`text-sm mt-1 ${todo.is_completed ? 'text-gray-400' : 'text-gray-600'}`}>
                                        {todo.description}
                                    </p>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => toggleComplete(todo)}
                                    className={`px-4 py-2 rounded text-white font-medium transition ${todo.is_completed ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'}`}
                                >
                                    {todo.is_completed ? 'Undo' : 'Complete'}
                                </button>
                                <button 
                                    onClick={() => handleDelete(todo.id)}
                                    className="px-4 py-2 bg-red-500 text-white rounded font-medium hover:bg-red-600 transition"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                    
                    {/* Empty State message */}
                    {todos.length === 0 && (
                        <div className="text-center bg-white p-8 rounded-lg shadow text-gray-500">
                            No tasks found matching your criteria. Time to add some!
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}