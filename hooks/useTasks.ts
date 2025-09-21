import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

export type Task = {
  id: string;
  title: string;
  completed: boolean;
  // dueAt?: string;
  // category?: string;
};

const STORAGE_KEY = 'tasks:v1';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        if (json) setTasks(JSON.parse(json));
      } catch (e) {
        console.warn('tasks load error', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (loading) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)).catch(e =>
      console.warn('tasks save error', e)
    );
  }, [tasks, loading]);

  const addTask = useCallback((title: string) => {
    const t: Task = { id: Date.now().toString(), title, completed: false };
    setTasks(prev => [t, ...prev]);
  }, []);

  const toggleTask = useCallback((id: string) => {
    setTasks(prev =>
      prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  }, []);

  const updateTask = useCallback((id: string, title: string) => {
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, title } : t)));
  }, []);

  const clearCompleted = useCallback(() => {
    setTasks(prev => prev.filter(t => !t.completed));
  }, []);

  return { tasks, loading, addTask, toggleTask, deleteTask, updateTask, clearCompleted };
}
