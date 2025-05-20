import { useState, useEffect } from 'react';
import PriorityBadge from './components/PriorityBadge';
import UrgencyIndicator from './components/UrgencyIndicator';
import TaskForm from './components/TaskForm';
import { API_BASE_URL } from './config/api';
import './styles.css';

export default function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    // Inside the fetchTasks function
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/tasks`);
        if (!response.ok) {
          throw new Error('Failed to fetch tasks');
        }
        const data = await response.json();
        // Add console.log to debug the response
        console.log('Fetched data:', data);
        
        // Ensure data is an array
        const tasksArray = Array.isArray(data) ? data : data.tasks;
        
        const processed = tasksArray.map(task => ({
          ...task,
          urgencyScore: calculateUrgencyScore(task)
        }));
        setTasks(processed);
        setFilteredTasks(processed);
        setLoading(false);
      } catch (err) {
        console.error('Error details:', err);
        setError('Failed to fetch tasks: ' + err.message);
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  function calculateUrgencyScore(task) {
    const deadline = new Date(task.deadline);
    const now = new Date();
    const diffDays = Math.ceil((deadline - now) / (1000 * 3600 * 24));
    
    const priorityWeights = {
      high: 3,
      medium: 2,
      low: 1
    };

    // Calculate score: days-to-deadline ÷ priority weight
    const score = diffDays / priorityWeights[task.priority];
    
    // Determine urgency level based on score
    if (score < 0) return -10;  // Critical (overdue)
    if (score < 1) return 0;    // Urgent (due very soon)
    if (score < 3) return 2;    // High
    if (score < 7) return 5;    // Medium
    return 10;                  // Low
  }

  useEffect(() => {
    if (priorityFilter === 'all') {
      setFilteredTasks(tasks);
    } else {
      setFilteredTasks(tasks.filter(task => task.priority === priorityFilter));
    }
  }, [priorityFilter, tasks]);

  const handleFilterChange = (e) => {
    setPriorityFilter(e.target.value);
  };

  const isOverdue = (deadline) => new Date(deadline) < new Date();

  const formatDate = (str) => {
    return new Date(str).toLocaleString(undefined, {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const sortedTasks = [...filteredTasks].sort((a, b) => a.urgencyScore - b.urgencyScore);

  if (loading) return <div className="loading">Loading tasks...</div>;
  if (error) return <div className="error">{error}</div>;

  // Add new task
  const handleAddTask = async (newTask) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask)
      });
      if (!response.ok) throw new Error('Failed to add task');
      const task = await response.json();
      const processedTask = { ...task, urgencyScore: calculateUrgencyScore(task) };
      setTasks([...tasks, processedTask]);
    } catch (err) {
      setError('Failed to add task: ' + err.message);
    }
  };

  // Update task
  const handleUpdateTask = async (updatedTask) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${updatedTask.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTask)
      });
      if (!response.ok) throw new Error('Failed to update task');
      const task = await response.json();
      const processedTask = { ...task, urgencyScore: calculateUrgencyScore(task) };
      setTasks(tasks.map(t => t.id === task.id ? processedTask : t));
      setEditingTask(null);
    } catch (err) {
      setError('Failed to update task: ' + err.message);
    }
  };

  // Delete task
  const handleDeleteTask = async (taskId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete task');
      setTasks(tasks.filter(t => t.id !== taskId));
    } catch (err) {
      setError('Failed to delete task: ' + err.message);
    }
  };

  return (
    <div className="container">
      <h1>Task Manager Dashboard</h1>

      <TaskForm onSubmit={handleAddTask} />

      {editingTask && (
        <div className="edit-modal">
          <h2>Edit Task</h2>
          <TaskForm 
            initialData={editingTask} 
            onSubmit={handleUpdateTask}
          />
          <button onClick={() => setEditingTask(null)}>Cancel</button>
        </div>
      )}

      <div className="filter">
        <label>Filter by Priority:</label>
        <select value={priorityFilter} onChange={handleFilterChange}>
          <option value="all">All Priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      <div className="task-table">
        <div className="task-row header">
          <div>Task</div>
          <div>Deadline</div>
          <div>Priority</div>
          <div>Urgency</div>
          <div>Actions</div>
        </div>

        {sortedTasks.length === 0 ? (
          <div className="no-tasks">No tasks found</div>
        ) : (
          sortedTasks.map(task => (
            <div key={task.id} className={`task-row ${isOverdue(task.deadline) ? 'overdue' : ''}`}>
              <div className="task-title">{task.title}</div>
              <div>{formatDate(task.deadline)}</div>
              <div><PriorityBadge priority={task.priority} /></div>
              <div><UrgencyIndicator score={task.urgencyScore} /></div>
              <div className="task-actions">
                <button onClick={() => setEditingTask(task)}>Edit</button>
                <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}