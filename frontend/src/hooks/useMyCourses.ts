import { useState, useCallback } from 'react';
import { api } from '@/lib/api';
import { Course } from './useCourses';

export interface MyCourse extends Course {
  end_date: string;
}

export const useMyCourses = () => {
  const [courses, setCourses] = useState<MyCourse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMyCourses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.get('/courses/my-courses');
      setCourses(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    courses,
    loading,
    error,
    fetchMyCourses
  };
};
