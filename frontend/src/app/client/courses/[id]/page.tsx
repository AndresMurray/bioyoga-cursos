'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLessons, Lesson } from '@/hooks/useLessons';
import { useCourses, Course } from '@/hooks/useCourses';
import { api } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

const CourseViewer = () => {
  const params = useParams();
  const router = useRouter();
  const courseId = Number(params.id);
  
  const { lessons, loading: loadingLessons, fetchLessons, error: lessonError } = useLessons(courseId);
  const { courses, fetchCourses } = useCourses();
  const [course, setCourse] = useState<Course | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (courseId && !isNaN(courseId)) {
        try {
          console.log("Fetching data for course:", courseId);
          await fetchLessons(courseId);
          const data = await api.get(`/courses/${courseId}`);
          setCourse(data);
        } catch (err: any) {
          console.error("Error loading course viewer data:", err);
        }
      } else {
        console.warn("Invalid courseId:", params.id);
      }
    };
    loadData();
  }, [courseId, fetchLessons, params.id]);

  useEffect(() => {
    if (lessons.length > 0 && !selectedLesson) {
      setSelectedLesson(lessons[0]);
    }
  }, [lessons, selectedLesson]);

  if (lessonError) {
    return (
      <div className="container py-20 text-center">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Error de Acceso</h2>
        <p className="text-muted-foreground mb-8">{lessonError}</p>
        <Button onClick={() => router.push('/client')}>Volver a Mis Cursos</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container py-10">
        <Button 
          variant="ghost" 
          className="mb-6 flex items-center gap-2 text-muted-foreground hover:text-foreground"
          onClick={() => router.push('/client')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Volver a Mis Cursos
        </Button>
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar - Lessons List */}
          <aside className="w-full lg:w-80 shrink-0">
            <Card className="sticky top-24 overflow-hidden border-border">
              <div className="p-5 border-b border-border bg-muted/50">
                <h2 className="font-bold text-lg line-clamp-1">{course?.title || 'Cargando...'}</h2>
                <div className="text-xs text-muted-foreground mt-1">
                  {lessons.length} clases disponibles
                </div>
              </div>
              <div className="max-h-[60vh] overflow-y-auto">
                {loadingLessons ? (
                  <div className="p-8 text-center text-sm text-muted-foreground">Cargando clases...</div>
                ) : (
                  <div className="flex flex-col">
                    {lessons.map((lesson, index) => (
                      <button
                        key={lesson.id}
                        onClick={() => setSelectedLesson(lesson)}
                        className={`p-4 text-left border-b border-border last:border-0 transition-all hover:bg-primary/5 ${
                          selectedLesson?.id === lesson.id 
                            ? 'bg-primary/10 border-l-4 border-l-primary' 
                            : 'bg-transparent'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                            selectedLesson?.id === lesson.id ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                          }`}>
                            {index + 1}
                          </span>
                          <div>
                            <div className={`font-semibold text-sm ${selectedLesson?.id === lesson.id ? 'text-primary' : 'text-foreground'}`}>
                              {lesson.title}
                            </div>
                            {lesson.description && (
                              <div className="text-xs text-muted-foreground line-clamp-1 mt-1">
                                {lesson.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </aside>

          {/* Main Content - Lesson Player */}
          <main className="flex-1">
            {selectedLesson ? (
              <div className="animate-fade space-y-6">
                <Card className="overflow-hidden border-border shadow-md">
                  {/* Content Placeholder (could be video player) */}
                  <div className="aspect-video bg-black flex items-center justify-center relative group">
                    {selectedLesson.image_url ? (
                      <img 
                        src={selectedLesson.image_url} 
                        alt={selectedLesson.title} 
                        className="w-full h-full object-contain opacity-60"
                      />
                    ) : (
                      <div className="text-white/20 text-9xl">🎬</div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center">
                       {selectedLesson.link_drive ? (
                         <a 
                          href={selectedLesson.link_drive} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="bg-primary text-white p-6 rounded-full shadow-2xl transform hover:scale-110 transition-transform flex items-center justify-center"
                         >
                           <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                         </a>
                       ) : (
                         <span className="text-white/50 font-semibold italic">Contenido de video próximamente</span>
                       )}
                    </div>
                  </div>

                  <div className="p-8">
                    <div className="flex justify-between items-start gap-4 mb-6">
                      <h1 className="text-3xl font-bold">{selectedLesson.title}</h1>
                      <Badge variant="outline">Clase {lessons.indexOf(selectedLesson) + 1}</Badge>
                    </div>
                    
                    {selectedLesson.description && (
                      <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed whitespace-pre-wrap mb-8">
                        {selectedLesson.description}
                      </div>
                    )}

                    {/* Resources Section */}
                    {selectedLesson.pdfs && selectedLesson.pdfs.length > 0 && (
                      <div className="border-t border-border pt-8 mt-8">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                          Material Complementario (PDFs)
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {selectedLesson.pdfs.map((pdf, idx) => (
                            <a 
                              key={idx} 
                              href={pdf.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center gap-3 p-4 rounded-xl border border-border bg-muted/30 hover:bg-primary/5 hover:border-primary/30 transition-all group"
                            >
                              <div className="w-10 h-10 rounded-lg bg-red-100 text-red-600 flex items-center justify-center shrink-0 group-hover:bg-red-500 group-hover:text-white transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                              </div>
                              <div className="flex-1 overflow-hidden">
                                <div className="text-sm font-semibold truncate">{pdf.title}</div>
                                <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Documento PDF</div>
                              </div>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-20 text-center">
                <div className="text-6xl mb-6 opacity-20">📚</div>
                <h2 className="text-2xl font-bold mb-2">Seleccioná una clase</h2>
                <p className="text-muted-foreground">Elegí uno de los temas del lateral para comenzar a aprender.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default CourseViewer;
