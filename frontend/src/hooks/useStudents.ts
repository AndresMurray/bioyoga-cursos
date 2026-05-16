import { useState, useCallback } from 'react';
import { api } from '@/lib/api';

export interface StudentCourse {
  id: number;
  title: string;
  end_date: string;
}

export interface Student {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  dni: string;
  active_courses: StudentCourse[];
}

export interface PaginatedStudents {
  total: number;
  page: number;
  size: number;
  pages: number;
  items: Student[];
}

export const useStudents = () => {
  const [studentsData, setStudentsData] = useState<PaginatedStudents | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStudents = useCallback(async (page: number = 1, search?: string) => {
    setLoading(true);
    setError(null);
    try {
      let url = `/admin/students?page=${page}&size=5`;
      if (search) {
        url += `&search=${encodeURIComponent(search)}`;
      }
      const data = await api.get(url);
      setStudentsData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const enrollStudent = async (userId: number, courseId: number) => {
    setLoading(true);
    setError(null);
    try {
      await api.post(`/admin/students/${userId}/enroll/${courseId}`, {});
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const unenrollStudent = async (userId: number, courseId: number) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/admin/students/${userId}/courses/${courseId}`);
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    studentsData,
    loading,
    error,
    fetchStudents,
    enrollStudent,
    unenrollStudent
  };
};
