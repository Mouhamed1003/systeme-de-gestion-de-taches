const TASKS_KEY = 'tasks';

export const getTasks = () => {
  const tasks = localStorage.getItem(TASKS_KEY);
  return tasks ? JSON.parse(tasks) : [];
};

export const saveTasks = (tasks) => {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
};

export const addTask = (task) => {
  const tasks = getTasks();
  tasks.push(task);
  saveTasks(tasks);
};

export const updateTask = (updatedTask) => {
  const tasks = getTasks();
  const taskIndex = tasks.findIndex(task => task.id === updatedTask.id);
  if (taskIndex >= 0) {
    tasks[taskIndex] = updatedTask;
    saveTasks(tasks);
  }
};

export const deleteTask = (taskId) => {
  const tasks = getTasks();
  const updatedTasks = tasks.filter(task => task.id !== taskId);
  saveTasks(updatedTasks);
};
