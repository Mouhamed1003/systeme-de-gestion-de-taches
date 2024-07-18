import { useReducer } from 'react';

const tasksReducer = (state, action) => {
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
        task.id === action.payload.id ? { ...task, title: action.payload.title } : task
      );
    default:
      return state;
  }
};

const useTasks = () => {
  const [tasks, dispatch] = useReducer(tasksReducer, []);

  return { tasks, dispatch };
};

export { useTasks };
