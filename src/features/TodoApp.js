import React, { useState, useEffect } from 'react';
import { Loader2, Trash2, Edit, Check, X } from 'lucide-react';
import { Alert, AlertDescription } from '../components/ui/alert.js';
import { Button } from '../components/ui/button.js';
import { Input } from '../components/ui/input.js';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card.js';

const TodoApp = () => {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState('');

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/todos');
            if (!response.ok) throw new Error('Failed to fetch todos');
            const data = await response.json();
            setTodos(data.slice(0, 10)); // Limiting to 10 items for demo
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const addTodo = async (e) => {
        e.preventDefault();
        if (!newTodo.trim()) return;

        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/todos', {
                method: 'POST',
                body: JSON.stringify({
                    title: newTodo,
                    completed: false,
                    userId: 1
                }),
                headers: {
                    'Content-type': 'application/json'
                }
            });
            const data = await response.json();

            // Add to local state (with a real ID for our UI)
            setTodos([
                ...todos,
                { ...data, id: Date.now() }
            ]);
            setNewTodo('');
        } catch (err) {
            setError('Failed to add todo');
        }
    };

    const startEdit = (todo) => {
        setEditingId(todo.id);
        setEditText(todo.title);
    };

    const updateTodo = async (id) => {
        try {
            const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
                method: 'PUT',
                body: JSON.stringify({
                    title: editText,
                    completed: todos.find(todo => todo.id === id).completed,
                    userId: 1
                }),
                headers: {
                    'Content-type': 'application/json'
                }
            });
            await response.json();

            // Update local state
            setTodos(todos.map(todo =>
                todo.id === id ? { ...todo, title: editText } : todo
            ));
            setEditingId(null);
            setEditText('');
        } catch (err) {
            setError('Failed to update todo');
        }
    };

    const deleteTodo = async (id) => {
        try {
            await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
                method: 'DELETE'
            });

            // Remove from local state
            setTodos(todos.filter(todo => todo.id !== id));
        } catch (err) {
            setError('Failed to delete todo');
        }
    };

    const toggleComplete = async (id) => {
        const todo = todos.find(t => t.id === id);
        try {
            await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
                method: 'PUT',
                body: JSON.stringify({
                    ...todo,
                    completed: !todo.completed
                }),
                headers: {
                    'Content-type': 'application/json'
                }
            });

            // Update local state
            setTodos(todos.map(t =>
                t.id === id ? { ...t, completed: !t.completed } : t
            ));
        } catch (err) {
            setError('Failed to update todo status');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <Card className="w-full max-w-2xl mx-auto mt-8">
            <CardHeader>
                <CardTitle>Todo List</CardTitle>
            </CardHeader>
            <CardContent>
                {error && (
                    <Alert variant="destructive" className="mb-4">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <form onSubmit={addTodo} className="flex gap-2 mb-6">
                    <Input
                        type="text"
                        value={newTodo}
                        onChange={(e) => setNewTodo(e.target.value)}
                        placeholder="Add a new todo..."
                        className="flex-1"
                    />
                    <Button type="submit">Add Todo</Button>
                </form>

                <div className="space-y-2">
                    {todos.map(todo => (
                        <div
                            key={todo.id}
                            className="flex items-center gap-2 p-2 border rounded hover:bg-gray-50"
                        >
                            <input
                                type="checkbox"
                                checked={todo.completed}
                                onChange={() => toggleComplete(todo.id)}
                                className="h-4 w-4"
                            />

                            {editingId === todo.id ? (
                                <div className="flex flex-1 items-center gap-2">
                                    <Input
                                        type="text"
                                        value={editText}
                                        onChange={(e) => setEditText(e.target.value)}
                                        className="flex-1"
                                    />
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => updateTodo(todo.id)}
                                    >
                                        <Check className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => setEditingId(null)}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ) : (
                                <>
                                    <span
                                        className={`flex-1 ${todo.completed ? 'line-through text-gray-400' : ''}`}
                                    >
                                        {todo.title}
                                    </span>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => startEdit(todo)}
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => deleteTodo(todo.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default TodoApp;