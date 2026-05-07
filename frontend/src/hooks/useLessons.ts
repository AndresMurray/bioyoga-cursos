import { useState, useCallback } from 'react';
import { api } from '@/lib/api';
import { Lesson } from './useCourses';

export function useLessons(courseId?: number) {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchLessons = useCallback(async (id?: number) => {
    const targetId = id || courseId;
    if (!targetId) return;
    setLoading(true);
    setError('');
    try {
      const data = await api.get(`/courses/${targetId}/lessons`);
      setLessons(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  const createLesson = async (cId: number, data: Partial<Lesson>) => {
    setError('');
    try {
      const created = await api.post(`/courses/${cId}/lessons`, data);
      setLessons(prev => [...prev, created]);
      return created;
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  };

  const updateLesson = async (lessonId: number, data: Partial<Lesson>) => {
    setError('');
    try {
      const updated = await api.put(`/lessons/${lessonId}`, data);
      setLessons(prev => prev.map(l => (l.id === lessonId ? updated : l)));
      return updated;
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  };

  const deleteLesson = async (lessonId: number) => {
    setError('');
    try {
      await api.delete(`/lessons/${lessonId}`);
      setLessons(prev => prev.filter(l => l.id !== lessonId));
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  return { lessons, loading, error, fetchLessons, createLesson, updateLesson, deleteLesson };
}
