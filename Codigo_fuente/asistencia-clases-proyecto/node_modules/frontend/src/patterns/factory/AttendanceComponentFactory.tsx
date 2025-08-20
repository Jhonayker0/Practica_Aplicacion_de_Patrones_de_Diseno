import React from 'react';
import { CourseType, Student, AttendanceStatus } from '../../types';

// Interfaz común para todos los componentes de asistencia
interface AttendanceComponentProps {
  students: Student[];
  onAttendanceChange: (studentId: string, status: AttendanceStatus) => void;
  attendanceData: Record<string, AttendanceStatus>;
}

// Componente para cursos PRESENCIALES
const PresencialAttendanceComponent: React.FC<AttendanceComponentProps> = ({ 
  students, 
  onAttendanceChange, 
  attendanceData 
}) => {
  return (
    <div className="space-y-4">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
        <h3 className="text-green-800 font-medium">📍 Clase Presencial</h3>
        <p className="text-green-600 text-sm">Verificar presencia física en el aula</p>
      </div>
      
      <div className="space-y-2">
        {students.map(student => (
          <div key={student.id} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
            <div>
              <span className="font-medium">{student.name}</span>
              <span className="ml-2 text-sm text-gray-500">({student.studentCode})</span>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => onAttendanceChange(student.id, 'presente')}
                className={`px-3 py-1 rounded text-sm font-medium ${
                  attendanceData[student.id] === 'presente'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-600 hover:bg-green-100'
                }`}
              >
                Presente
              </button>
              <button
                onClick={() => onAttendanceChange(student.id, 'ausente')}
                className={`px-3 py-1 rounded text-sm font-medium ${
                  attendanceData[student.id] === 'ausente'
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-200 text-gray-600 hover:bg-red-100'
                }`}
              >
                Ausente
              </button>
              <button
                onClick={() => onAttendanceChange(student.id, 'tardanza')}
                className={`px-3 py-1 rounded text-sm font-medium ${
                  attendanceData[student.id] === 'tardanza'
                    ? 'bg-yellow-500 text-white'
                    : 'bg-gray-200 text-gray-600 hover:bg-yellow-100'
                }`}
              >
                Tardanza
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Componente para cursos VIRTUALES
const VirtualAttendanceComponent: React.FC<AttendanceComponentProps> = ({ 
  students, 
  onAttendanceChange, 
  attendanceData 
}) => {
  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <h3 className="text-blue-800 font-medium">💻 Clase Virtual</h3>
        <p className="text-blue-600 text-sm">Verificar conexión y participación online</p>
      </div>
      
      <div className="space-y-2">
        {students.map(student => (
          <div key={student.id} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
            <div>
              <span className="font-medium">{student.name}</span>
              <span className="ml-2 text-sm text-gray-500">({student.studentCode})</span>
              <div className="text-xs text-gray-400">
                💻 Tiempo conexión: {Math.floor(Math.random() * 90 + 10)} min
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => onAttendanceChange(student.id, 'presente')}
                className={`px-3 py-1 rounded text-sm font-medium ${
                  attendanceData[student.id] === 'presente'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-600 hover:bg-blue-100'
                }`}
              >
                Conectado
              </button>
              <button
                onClick={() => onAttendanceChange(student.id, 'ausente')}
                className={`px-3 py-1 rounded text-sm font-medium ${
                  attendanceData[student.id] === 'ausente'
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-200 text-gray-600 hover:bg-red-100'
                }`}
              >
                Desconectado
              </button>
              <button
                onClick={() => onAttendanceChange(student.id, 'tardanza')}
                className={`px-3 py-1 rounded text-sm font-medium ${
                  attendanceData[student.id] === 'tardanza'
                    ? 'bg-yellow-500 text-white'
                    : 'bg-gray-200 text-gray-600 hover:bg-yellow-100'
                }`}
              >
                Tarde
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Componente para cursos HÍBRIDOS
const HybridAttendanceComponent: React.FC<AttendanceComponentProps> = ({ 
  students, 
  onAttendanceChange, 
  attendanceData 
}) => {
  return (
    <div className="space-y-4">
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
        <h3 className="text-purple-800 font-medium">🔄 Clase Híbrida</h3>
        <p className="text-purple-600 text-sm">Algunos presenciales, otros virtuales</p>
      </div>
      
      <div className="space-y-2">
        {students.map(student => {
          const isVirtual = Math.random() > 0.5; // Simulamos modalidad aleatoria
          return (
            <div key={student.id} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
              <div>
                <span className="font-medium">{student.name}</span>
                <span className="ml-2 text-sm text-gray-500">({student.studentCode})</span>
                <div className="text-xs text-gray-400">
                  {isVirtual ? '💻 Modalidad: Virtual' : '📍 Modalidad: Presencial'}
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => onAttendanceChange(student.id, 'presente')}
                  className={`px-3 py-1 rounded text-sm font-medium ${
                    attendanceData[student.id] === 'presente'
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-200 text-gray-600 hover:bg-purple-100'
                  }`}
                >
                  {isVirtual ? 'Conectado' : 'Presente'}
                </button>
                <button
                  onClick={() => onAttendanceChange(student.id, 'ausente')}
                  className={`px-3 py-1 rounded text-sm font-medium ${
                    attendanceData[student.id] === 'ausente'
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-200 text-gray-600 hover:bg-red-100'
                  }`}
                >
                  {isVirtual ? 'Desconectado' : 'Ausente'}
                </button>
                <button
                  onClick={() => onAttendanceChange(student.id, 'tardanza')}
                  className={`px-3 py-1 rounded text-sm font-medium ${
                    attendanceData[student.id] === 'tardanza'
                      ? 'bg-yellow-500 text-white'
                      : 'bg-gray-200 text-gray-600 hover:bg-yellow-100'
                  }`}
                >
                  Tarde
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// FACTORY METHOD: La función principal que decide qué componente crear
export class AttendanceComponentFactory {
  static createAttendanceComponent(
    courseType: CourseType, 
    props: AttendanceComponentProps
  ): React.ReactElement {
    switch (courseType) {
      case 'presencial':
        return <PresencialAttendanceComponent {...props} />;
      case 'virtual':
        return <VirtualAttendanceComponent {...props} />;
      case 'hibrido':
        return <HybridAttendanceComponent {...props} />;
      default:
        return <PresencialAttendanceComponent {...props} />;
    }
  }
}