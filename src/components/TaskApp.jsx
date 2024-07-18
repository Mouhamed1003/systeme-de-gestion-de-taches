import React from 'react';
import TaskList from './TaskList';
import TaskForm from './TaskForm';
import { TaskProvider } from '../contexts/TaskContext';
import Marquee from 'react-fast-marquee';

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
