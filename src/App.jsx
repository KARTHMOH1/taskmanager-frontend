import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './index.css';

const API_URL = 'http://localhost:3000/tasks'

function App() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ title: '', description: '' });
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
  try {
    const res = await axios.get(API_URL);
    console.log('Fetched Tasks:', res.data); // Log response
    setTasks(res.data);
  } catch (error) {
    console.error('Error fetching tasks:', error);
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      await axios.put(`${API_URL}/${editId}`, { task: form });
    } else {
      await axios.post(API_URL, { task: form });
    }
    setForm({ title: '', description: '' });
    setEditId(null);
    fetchTasks();
  };

  const handleEdit = (task) => {
    setForm({ title: task.title, description: task.description });
    setEditId(task.id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    fetchTasks();
  };

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      <h1>📋 Task Manager</h1>

      <input
        className="search"
        placeholder="🔍 Search tasks by title..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <form onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="📝 Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <input
          name="description"
          placeholder="📄 Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
        />
        <button type="submit">
          {editId ? '💾 Update Task' : '➕ Add Task'}
        </button>
      </form>

      <ul>
  {filteredTasks.map((task, index) => (
    <li key={task.id}>
      <span>
        {index + 1}. ✅ <strong>{task.title}</strong>
      </span>
      <p className="description">📄 {task.description}</p>
      <div className="actions">
        <button onClick={() => handleEdit(task)}>✏️ Edit</button>
        <button onClick={() => handleDelete(task.id)}>🗑️ Delete</button>
      </div>
    </li>
  ))}
</ul>

    </div>
  );
}

export default App;
