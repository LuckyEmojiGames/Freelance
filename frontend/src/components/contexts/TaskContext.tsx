// contexts/TaskContext.tsx
import { createContext, useState, ReactNode } from 'react';

interface TaskData {
  description?: string;
  price?: number;
  currency?: 'TON' | 'USDT';
  deadline?: string;
  file?: File | null;
}

interface TaskContextProps {
  taskData: TaskData;
  updateTaskData: (data: Partial<TaskData>) => void;
}

export const TaskContext = createContext<TaskContextProps | null>(null);

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [taskData, setTaskData] = useState<TaskData>({});

  const updateTaskData = (data: Partial<TaskData>) => {
    setTaskData((prev) => ({ ...prev, ...data }));
  };

  return (
    <TaskContext.Provider value={{ taskData, updateTaskData }}>
      {children}
    </TaskContext.Provider>
  );
};
