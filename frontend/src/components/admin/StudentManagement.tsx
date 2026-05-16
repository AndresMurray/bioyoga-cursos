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
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h2 className="text-2xl font-semibold">Alumnos Registrados</h2>
        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="Buscar por nombre, email o DNI..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full px-4 py-2 pl-10 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-semibold">Alumno</th>
                <th className="px-6 py-4 font-semibold">DNI</th>
                <th className="px-6 py-4 font-semibold">Cursos Activos</th>
                <th className="px-6 py-4 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading && !studentsData ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground italic">
                    Cargando alumnos...
                  </td>
                </tr>
              ) : studentsData?.items.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground italic">
                    No se encontraron alumnos.
                  </td>
                </tr>
              ) : (
                studentsData?.items.map((student) => (
                  <tr key={student.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-foreground">{student.first_name} {student.last_name}</div>
                      <div className="text-muted-foreground">{student.email}</div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {student.dni}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        {student.active_courses.length > 0 ? (
                          student.active_courses.map((course) => (
                            <Badge key={course.id} variant="secondary">
                              {course.title}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-muted-foreground italic">Ninguno</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedStudent(student)}
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
      </Card>

      {studentsData && (
        <Pagination
          currentPage={currentPage}
          totalPages={studentsData.pages}
          onPageChange={setCurrentPage}
        />
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
