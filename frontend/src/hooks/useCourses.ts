import { useState, useCallback } from 'react';
import { api } from '@/lib/api';

export interface CourseImage {
  id?: number;
  course_id?: number;
  url: string;
  order?: number;
  is_cover?: boolean;
}

export interface LessonPdf {
  id?: number;
  lesson_id?: number;
  title: string;
  url: string;
}

export interface Course {
  id: number;
  title: string;
  description: string | null;
  images: CourseImage[];
  duracion_dias: number;
  link_pago: string | null;
  price: number;
  discount_percentage: number;
  is_visible: boolean;
  lessons?: Lesson[];
}

export interface Lesson {
  id: number;
  course_id: number;
  title: string;
  description: string | null;
  image_url: string | null;
  link_drive: string | null;
  pdfs: LessonPdf[];
  order: number;
}

export function useCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchCourses = useCallback(async (onlyVisible: boolean = false) => {
    setLoading(true);
    setError('');
    try {
      const url = onlyVisible ? '/courses?visible_only=true' : '/courses';
      const data = await api.get(url);
      setCourses(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createCourse = async (data: Partial<Course>) => {
    setError('');
    try {
      const created = await api.post('/courses', data);
      setCourses(prev => [created, ...prev]);
      return created;
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  };

  const updateCourse = async (id: number, data: Partial<Course>) => {
    setError('');
    try {
      const updated = await api.put(`/courses/${id}`, data);
      setCourses(prev => prev.map(c => (c.id === id ? updated : c)));
      return updated;
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  };

  const deleteCourse = async (id: number) => {
    setError('');
    try {
      await api.delete(`/courses/${id}`);
      setCourses(prev => prev.filter(c => c.id !== id));
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  return { courses, loading, error, fetchCourses, createCourse, updateCourse, deleteCourse };
}
