import React from 'react';
import { mockCourses, mockStudents } from './services/mockData';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Sistema de Asistencia a Clases
      </h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Cursos Disponibles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockCourses.map(course => (
            <div key={course.id} className="border border-gray-200 rounded p-4">
              <h3 className="font-medium">{course.name}</h3>
              <p className="text-sm text-gray-600">{course.code}</p>
              <span className={`inline-block px-2 py-1 text-xs rounded mt-2 ${
                course.type === 'presencial' ? 'bg-green-100 text-green-800' :
                course.type === 'virtual' ? 'bg-blue-100 text-blue-800' :
                'bg-purple-100 text-purple-800'
              }`}>
                {course.type.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Estudiantes</h2>
        <div className="space-y-2">
          {mockStudents.map(student => (
            <div key={student.id} className="flex justify-between items-center p-3 border border-gray-200 rounded">
              <div>
                <span className="font-medium">{student.name}</span>
                <span className="ml-2 text-sm text-gray-600">({student.studentCode})</span>
              </div>
              <span className="text-sm text-gray-500">{student.email}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;