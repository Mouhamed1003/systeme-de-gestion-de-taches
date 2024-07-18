import React, { useReducer, useContext, useState, useEffect } from 'react';
import Marquee from 'react-fast-marquee';

// Contexte des tâches
const TaskContext = React.createContext();

const taskReducer = (state, action) => {
  switch (action.type) {
    case 'SET_TASKS':
      return action.payload;
    case 'ADD_TASK':
      return [...state, action.payload];
    case 'TOGGLE_COMPLETE':
      return state.map(task => 
        task.id === action.payload ? { ...task, completed: !task.completed } : task
      );
    case 'DELETE_TASK':
      return state.filter(task => task.id !== action.payload);
    case 'UPDATE_TASK':
      return state.map(task => 
        task.id === action.payload.id ? action.payload : task
      );
    default:
      return state;
  }
};

const TaskProvider = ({ children }) => {
  const [tasks, dispatch] = useReducer(taskReducer, []);
  return (
    <TaskContext.Provider value={{ tasks, dispatch }}>
      {children}
    </TaskContext.Provider>
  );
};

const useTaskContext = () => {
  return useContext(TaskContext);
};

// Services de gestion des tâches (simulé avec localStorage)
const getTasks = () => {
  const tasks = localStorage.getItem('tasks');
  return tasks ? JSON.parse(tasks) : [];
};

const saveTasks = (tasks) => {
  localStorage.setItem('tasks', JSON.stringify(tasks));
};

// Composant TaskForm
const TaskForm = () => {
  const [title, setTitle] = useState('');
  const { tasks, dispatch } = useTaskContext(); // Accéder aux tâches depuis le contexte

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim() === '') return; // Vérification que le titre n'est pas vide
    const newTask = { id: Date.now(), title, completed: false };
    dispatch({ type: 'ADD_TASK', payload: newTask }); // Envoyer l'action pour ajouter la nouvelle tâche
    setTitle(''); // Réinitialiser le champ titre après soumission
  };

  const taskCount = tasks.length;

  return (
    <div>
      <div className="tasks-count-and-title">
        <h2>Ajouter des Tâches :</h2>
        <h2>Nombre de tâches ajoutées : ({taskCount})</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nom de la tâche"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button type="submit">Ajouter une Tâche</button>
      </form>
    </div>
  );
};

// Composant TaskList
const TaskList = () => {
  const { tasks, dispatch } = useTaskContext();
  const [editingTask, setEditingTask] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const loadedTasks = getTasks();
    dispatch({ type: 'SET_TASKS', payload: loadedTasks });
  }, [dispatch]);

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const handleToggleComplete = (taskId) => {
    dispatch({ type: 'TOGGLE_COMPLETE', payload: taskId });
    const task = tasks.find(task => task.id === taskId);
    setNotification({ message: `Tâche ${task.completed ? 'décochée' : 'marquée comme complétée'}`, color: 'green' });
  };

  const handleDeleteTask = (taskId) => {
    dispatch({ type: 'DELETE_TASK', payload: taskId });
    setNotification({ message: 'Tâche supprimée', color: 'red' });
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setNewTitle(task.title);
  };

  const handleUpdateTask = () => {
    dispatch({ type: 'UPDATE_TASK', payload: { ...editingTask, title: newTitle } });
    setEditingTask(null);
    setNewTitle('');
    setNotification({ message: 'Tâche mise à jour', color: 'blue' });
  };

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 2000); // Clear notification after 2 seconds
      return () => clearTimeout(timer);
    }
  }, [notification]);

  return (
    <div>
      <h2>Liste des Tâches :</h2>
      {notification && (
        <div className="notification" style={{ backgroundColor: notification.color }}>
          {notification.message}
        </div>
      )}
      <table>
        <thead>
          <tr>
            <th>Titre</th>
            <th>Complétée</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map(task => (
            <tr key={task.id}>
              {editingTask?.id === task.id ? (
                <>
                  <td>
                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                    />
                  </td>
                  <td>
                    <button onClick={handleUpdateTask}>Sauvegarder</button>
                    <button onClick={() => setEditingTask(null)}>Annuler</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{task.title}</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => handleToggleComplete(task.id)}
                    />
                  </td>
                  <td>
                    <button onClick={() => handleEditTask(task)}>Modifier</button>
                    <button onClick={() => handleDeleteTask(task.id)}>Supprimer</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Composant principal TaskApp
const TaskApp = () => {
  return (
    <TaskProvider>
      <div>
        <Marquee className="welcome-marquee">Bienvenue et Merci de tester mon application en ajoutant des tâches...</Marquee>
        <h1>Application de Gestion des Tâches</h1>
        <TaskForm />
        <TaskList />
      </div>
    </TaskProvider>
  );
};

export default TaskApp;
