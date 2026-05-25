import React, { useState, useEffect } from 'react';
import { useStudents, Student } from '@/hooks/useStudents';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import Pagination from '@/components/common/Pagination';
import EnrollmentModal from './EnrollmentModal';

const StudentManagement = () => {
  const { studentsData, loading, fetchStudents, enrollStudent, unenrollStudent } = useStudents();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  useEffect(() => {
    fetchStudents(currentPage, searchTerm);
  }, [currentPage, searchTerm, fetchStudents]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleEnroll = async (courseId: number) => {
    if (!selectedStudent) return false;
    const success = await enrollStudent(selectedStudent.id, courseId);
    if (success) {
      fetchStudents(currentPage, searchTerm);
    }
    return success;
  };

  const handleUnenroll = async (courseId: number) => {
    if (!selectedStudent) return false;
    const success = await unenrollStudent(selectedStudent.id, courseId);
    if (success) {
      fetchStudents(currentPage, searchTerm);
    }
    return success;
  };

  return (
    <div className="space-y-6 animate-fade">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h2 className="text-2xl font-bold font-serif text-foreground">Alumnos Registrados</h2>
        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="Buscar por nombre, email o DNI..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full px-5 py-2.5 pl-11 rounded-full border border-white/60 bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm font-medium placeholder:text-foreground/45 text-foreground"
          />
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/60"
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
      </div>

      <div className="bg-white/40 backdrop-blur-md rounded-[2.5rem] rounded-tr-[0.75rem] rounded-bl-[0.75rem] border border-white/70 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="text-xs text-foreground/80 bg-primary/10 border-b border-white/60">
                <th className="px-6 py-4.5 font-bold uppercase tracking-wider">Alumno</th>
                <th className="px-6 py-4.5 font-bold uppercase tracking-wider">DNI</th>
                <th className="px-6 py-4.5 font-bold uppercase tracking-wider">Cursos Activos</th>
                <th className="px-6 py-4.5 font-bold uppercase tracking-wider text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/50">
              {loading && !studentsData ? (
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center text-foreground/60 font-medium italic animate-pulse">
                    Cargando comunidad de alumnos...
                  </td>
                </tr>
              ) : studentsData?.items.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center text-foreground/60 font-medium italic">
                    No se encontraron alumnos registrados.
                  </td>
                </tr>
              ) : (
                studentsData?.items.map((student) => (
                  <tr key={student.id} className="hover:bg-white/45 transition-colors duration-200">
                    <td className="px-6 py-5">
                      <div className="font-bold text-foreground text-base">{student.first_name} {student.last_name}</div>
                      <div className="text-foreground/60 text-xs mt-0.5">{student.email}</div>
                    </td>
                    <td className="px-6 py-5 text-foreground/75 font-medium">
                      {student.dni}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-wrap gap-1.5">
                        {student.active_courses.length > 0 ? (
                          student.active_courses.map((course) => (
                            <span key={course.id} className="text-xs font-bold bg-primary/10 text-primary px-3 py-1 rounded-full">
                              {course.title}
                            </span>
                          ))
                        ) : (
                          <span className="text-foreground/40 italic text-xs">Ningún curso activo</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedStudent(student)}
                        className="rounded-full text-xs font-bold px-4 py-1.5 shadow-sm transition-all h-auto"
                      >
                        Gestionar Accesos
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {studentsData && (
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={studentsData.pages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {selectedStudent && (
        <EnrollmentModal
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
          onEnroll={handleEnroll}
          onUnenroll={handleUnenroll}
        />
      )}
    </div>
  );
};

export default StudentManagement;
