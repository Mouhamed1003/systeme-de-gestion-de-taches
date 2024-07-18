import React, { createContext, useContext } from 'react';
import { useTasks } from '../hooks/useTasks';

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const { tasks, dispatch } = useTasks();

  return (
    <TaskContext.Provider value={{ tasks, dispatch }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  return useContext(TaskContext);
};
