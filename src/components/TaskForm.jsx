import React, { useState } from 'react';
import { useTaskContext } from '../contexts/TaskContext';


const TaskForm = () => {
  const [title, setTitle] = useState('');
  const { tasks, dispatch } = useTaskContext();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim() === '') return;
    const newTask = { id: Date.now(), title, completed: false };
    dispatch({ type: 'ADD_TASK', payload: newTask });
    setTitle('');
  };

  const taskCount = tasks.length;

  return (
    <div>
      <div className='tasks-count-and-title'>
        <h2>Ajouter des Tâches : </h2>
        <h2>Nombre de taches ajoutées : {`( ${taskCount} )`}</h2>
      </div>
      <form id='input_button' onSubmit={handleSubmit}>
        <input
          className='input'
          type="text"
          placeholder="Nom de la tâche"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button className='button' type="submit">Ajouter une Tâche</button>
      </form>
    </div>
  );
};

export default TaskForm;
