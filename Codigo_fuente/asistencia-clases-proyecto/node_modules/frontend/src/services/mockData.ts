import { Student, Course, AcademicNode } from '../types';

// Datos mock de estudiantes
export const mockStudents: Student[] = [
  {
    id: '1',
    name: 'Ana García',
    email: 'ana.garcia@universidad.edu',
    studentCode: 'EST001'
  },
  {
    id: '2',
    name: 'Carlos Rodríguez',
    email: 'carlos.rodriguez@universidad.edu',
    studentCode: 'EST002'
  },
  {
    id: '3',
    name: 'María López',
    email: 'maria.lopez@universidad.edu',
    studentCode: 'EST003'
  },
  {
    id: '4',
    name: 'David Martínez',
    email: 'david.martinez@universidad.edu',
    studentCode: 'EST004'
  },
  {
    id: '5',
    name: 'Sofia Hernández',
    email: 'sofia.hernandez@universidad.edu',
    studentCode: 'EST005'
  }
];

// Datos mock de cursos (diferentes tipos para demostrar Factory Method)
export const mockCourses: Course[] = [
  {
    id: '1',
    name: 'Matemáticas I',
    code: 'MAT101',
    type: 'presencial',
    faculty: 'Ingeniería',
    career: 'Sistemas'
  },
  {
    id: '2',
    name: 'Programación Web',
    code: 'PRG201',
    type: 'virtual',
    faculty: 'Ingeniería',
    career: 'Sistemas'
  },
  {
    id: '3',
    name: 'Base de Datos',
    code: 'BDD301',
    type: 'hibrido',
    faculty: 'Ingeniería',
    career: 'Sistemas'
  },
  {
    id: '4',
    name: 'Historia Medieval',
    code: 'HIS101',
    type: 'presencial',
    faculty: 'Humanidades',
    career: 'Historia'
  },
  {
    id: '5',
    name: 'Literatura Digital',
    code: 'LIT201',
    type: 'virtual',
    faculty: 'Humanidades',
    career: 'Literatura'
  }
];

// Estructura académica para el patrón Composite
export const mockAcademicStructure: AcademicNode = {
  id: 'univ-1',
  name: 'Universidad Nacional',
  type: 'universidad',
  children: [
    {
      id: 'fac-1',
      name: 'Facultad de Ingeniería',
      type: 'facultad',
      children: [
        {
          id: 'car-1',
          name: 'Carrera de Sistemas',
          type: 'carrera',
          children: [
            {
              id: '1',
              name: 'Matemáticas I',
              type: 'curso'
            },
            {
              id: '2',
              name: 'Programación Web',
              type: 'curso'
            },
            {
              id: '3',
              name: 'Base de Datos',
              type: 'curso'
            }
          ]
        }
      ]
    },
    {
      id: 'fac-2',
      name: 'Facultad de Humanidades',
      type: 'facultad',
      children: [
        {
          id: 'car-2',
          name: 'Carrera de Historia',
          type: 'carrera',
          children: [
            {
              id: '4',
              name: 'Historia Medieval',
              type: 'curso'
            }
          ]
        },
        {
          id: 'car-3',
          name: 'Carrera de Literatura',
          type: 'carrera',
          children: [
            {
              id: '5',
              name: 'Literatura Digital',
              type: 'curso'
            }
          ]
        }
      ]
    }
  ]
};

// Función helper para obtener fechas de la semana
export const getCurrentWeekDates = (): string[] => {
  const today = new Date();
  const currentDay = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - currentDay + 1);
  
  const weekDates = [];
  for (let i = 0; i < 5; i++) { // Lunes a Viernes
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    weekDates.push(date.toISOString().split('T')[0]);
  }
  
  return weekDates;
};

// Nombres de días para mostrar en la interfaz
export const getDayName = (date: string): string => {
  const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const dayIndex = new Date(date).getDay();
  return dayNames[dayIndex];
};