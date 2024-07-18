import React, { useEffect, useState } from 'react';
import { useTaskContext } from '../contexts/TaskContext';
import { getTasks, saveTasks } from '../services/taskService';
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { MdSaveAs } from "react-icons/md";
import { MdCancel } from "react-icons/md";


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
    const task = tasks.find(task => task.id === taskId);
    const isComplete = !task.completed;
    dispatch({ type: 'TOGGLE_COMPLETE', payload: taskId });
    setNotification({
      message: `Tâche ${isComplete ? 'marquée comme complétée' : 'marquée comme incomplétée'}`,
      colorClass: isComplete ? 'notification-green' : 'notification-red'
    });
  };

  const handleDeleteTask = (taskId) => {
    dispatch({ type: 'DELETE_TASK', payload: taskId });
    setNotification({ message: 'Tâche supprimée avec succès', colorClass: 'notification-red' });
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setNewTitle(task.title);
  };

  const handleUpdateTask = () => {
    dispatch({ type: 'UPDATE_TASK', payload: { ...editingTask, title: newTitle } });
    setEditingTask(null);
    setNewTitle('');
    setNotification({ message: 'Tâche mise à jour avec succès', colorClass: 'notification-blue' });
  };

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  return (
    <div>
      <h2>Liste des Tâches : </h2>
      <small>
        {notification && (
          <div className={`notification ${notification.colorClass}`}>
            {notification.message}
          </div>
        )}
      </small>
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
                    className='input'
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                    />
                  </td>
                  <td>
                    <button className='Color-save' onClick={handleUpdateTask}> Save <MdSaveAs /></button>
                    <button className='Color-cancel' onClick={() => setEditingTask(null)}> Cancel <MdCancel /></button>
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
                    <button className='icons-size-edit' onClick={() => handleEditTask(task)}><FaEdit className='icons-size-edit'/></button>
                    <button className='icons-size-delet' onClick={() => handleDeleteTask(task.id)}><MdDelete className='icons-size-delet'/></button>
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

export default TaskList;
