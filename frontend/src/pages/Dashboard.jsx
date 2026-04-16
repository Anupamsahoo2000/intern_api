import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

export default function Dashboard() {
    const { user, logout } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchTasks = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/tasks');
            setTasks(res.data);
        } catch (error) {
            console.error('Error fetching tasks', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleCreateTask = async (e) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;
        try {
            await axios.post('http://localhost:5000/api/tasks', { title: newTaskTitle });
            setNewTaskTitle('');
            fetchTasks();
        } catch (error) {
            console.error('Error creating task', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/tasks/${id}`);
            fetchTasks();
        } catch (error) {
            console.error('Error deleting task', error);
        }
    };

    const handleStatusUpdate = async (id, currentStatus) => {
        const statuses = ['pending', 'in_progress', 'completed'];
        const nextStatus = statuses[(statuses.indexOf(currentStatus) + 1) % statuses.length];
        try {
            await axios.put(`http://localhost:5000/api/tasks/${id}`, { status: nextStatus });
            fetchTasks();
        } catch (error) {
            console.error('Error updating task', error);
        }
    };

    return (
        <div>
            <div className="dashboard-header">
                <div>
                    <h1>Dashboard</h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                        Welcome, <strong>{user?.username}</strong>
                    </p>
                </div>
                <button onClick={logout} style={{ width: 'auto', padding: '0.5rem 1rem', background: 'transparent', border: '1px solid var(--primary-color)' }}>
                    Sign Out
                </button>
            </div>

            <div className="glass-card" style={{ maxWidth: '100%', marginBottom: '2rem' }}>
                <form onSubmit={handleCreateTask} style={{ display: 'flex', gap: '1rem' }}>
                    <input 
                        type="text" 
                        placeholder="What needs to be done?" 
                        value={newTaskTitle} 
                        onChange={(e) => setNewTaskTitle(e.target.value)} 
                        style={{ flex: 1 }}
                    />
                    <button type="submit" style={{ width: 'auto', whiteSpace: 'nowrap' }}>Add Task</button>
                </form>
            </div>

            {loading ? (
                <div>Loading tasks...</div>
            ) : (
                <div className="tasks-grid">
                    {tasks.map(task => (
                        <div key={task.id} className="glass-card task-card">
                            <h3>{task.title}</h3>
                            {task.description && <p>{task.description}</p>}
                            <div className="task-meta">
                                <span className={`status-badge status-${task.status}`}>
                                    {task.status.replace('_', ' ')}
                                </span>
                                <span style={{ color: 'var(--text-secondary)' }}>
                                    {new Date(task.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="task-actions">
                                <button className="btn-small" onClick={() => handleStatusUpdate(task.id, task.status)}>
                                    Next Status
                                </button>
                                <button className="btn-small btn-danger" onClick={() => handleDelete(task.id)}>
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                    {tasks.length === 0 && (
                        <div style={{ color: 'var(--text-secondary)' }}>No tasks found. Create one above!</div>
                    )}
                </div>
            )}
        </div>
    );
}
