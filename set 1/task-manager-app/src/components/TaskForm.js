import { useState } from 'react';

export default function TaskForm({ onSubmit, initialData = null }) {
  const [task, setTask] = useState(initialData || {
    title: '',
    deadline: '',
    priority: 'medium'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(task);
    if (!initialData) {
      setTask({ title: '', deadline: '', priority: 'medium' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <input
        type="text"
        value={task.title}
        onChange={(e) => setTask({ ...task, title: e.target.value })}
        placeholder="Task title"
        required
      />
      <input
        type="datetime-local"
        value={task.deadline}
        onChange={(e) => setTask({ ...task, deadline: e.target.value })}
        required
      />
      <select
        value={task.priority}
        onChange={(e) => setTask({ ...task, priority: e.target.value })}
      >
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>
      <button type="submit">{initialData ? 'Update Task' : 'Add Task'}</button>
    </form>
  );
}