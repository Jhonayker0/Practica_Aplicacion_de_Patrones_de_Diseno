import React, { useState, useEffect, useRef } from 'react';
import { AttendanceComponentFactory } from '../patterns/factory/AttendanceComponentFactory';
import { AttendanceSubject, ObserverFactory } from '../patterns/observer/AttendanceObserver';
import NotificationPanel from '../components/common/NotificationPanel';
import { mockCourses, mockStudents, getCurrentWeekDates, getDayName } from '../services/mockData';
import { Course, Student, AttendanceStatus, AttendanceRecord, AttendanceEvent } from '../types';

const AttendancePage: React.FC = () => {
  // Estados para los dropdowns
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  
  // Estado para la asistencia de cada estudiante
  const [attendanceData, setAttendanceData] = useState<Record<string, AttendanceStatus>>({});
  
  // Estado para mostrar estadísticas
  const [stats, setStats] = useState({
    present: 0,
    absent: 0,
    late: 0,
    total: mockStudents.length
  });

  // Estados para el sistema Observer
  const [notifications, setNotifications] = useState<string[]>([]);
  const [alerts, setAlerts] = useState<string[]>([]);
  const [observerStats, setObserverStats] = useState<any>({});
  
  // Referencias para los observers
  const attendanceSubject = useRef<AttendanceSubject>(new AttendanceSubject());
  const notificationObserver = useRef(ObserverFactory.createNotificationObserver(setNotifications));
  const alertObserver = useRef(ObserverFactory.createAbsenteeAlertObserver((alert) => {
    setAlerts(prev => [alert, ...prev].slice(0, 10)); // Mantener últimas 10 alertas
  }));
  const statsObserver = useRef(ObserverFactory.createStatisticsObserver(setObserverStats));

  // Fechas de la semana actual
  const weekDates = getCurrentWeekDates();

  // Inicializar observers al montar el componente
  useEffect(() => {
    const subject = attendanceSubject.current;
    const notifObserver = notificationObserver.current;
    const alertObs = alertObserver.current;
    const statsObs = statsObserver.current;
    
    subject.addObserver(notifObserver);
    subject.addObserver(alertObs);
    subject.addObserver(statsObs);
    
    return () => {
      subject.removeObserver(notifObserver);
      subject.removeObserver(alertObs);
      subject.removeObserver(statsObs);
    };
  }, []);

  // Efecto para actualizar el curso seleccionado
  useEffect(() => {
    if (selectedCourseId) {
      const course = mockCourses.find(c => c.id === selectedCourseId);
      setSelectedCourse(course || null);
      // Limpiar asistencia al cambiar de curso
      setAttendanceData({});
    }
  }, [selectedCourseId]);

  // Efecto para calcular estadísticas
  useEffect(() => {
    const present = Object.values(attendanceData).filter(status => status === 'presente').length;
    const absent = Object.values(attendanceData).filter(status => status === 'ausente').length;
    const late = Object.values(attendanceData).filter(status => status === 'tardanza').length;
    
    setStats({ present, absent, late, total: mockStudents.length });
  }, [attendanceData]);

  // Función para manejar cambios en la asistencia CON OBSERVER
  const handleAttendanceChange = (studentId: string, status: AttendanceStatus) => {
    const oldStatus = attendanceData[studentId];
    
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: status
    }));
    
    // NOTIFICAR A LOS OBSERVERS
    const event: AttendanceEvent = {
      type: oldStatus ? 'attendance_updated' : 'attendance_marked',
      studentId,
      courseId: selectedCourse?.id || '',
      oldStatus,
      newStatus: status,
      timestamp: new Date()
    };
    
    attendanceSubject.current.notifyObservers(event);
  };

  // Función para guardar la asistencia
  const handleSaveAttendance = () => {
    if (!selectedCourse || !selectedDate) {
      alert('Por favor selecciona un curso y una fecha');
      return;
    }

    const records: AttendanceRecord[] = Object.entries(attendanceData).map(([studentId, status]) => ({
      id: `${studentId}-${selectedCourse.id}-${selectedDate}`,
      studentId,
      courseId: selectedCourse.id,
      date: selectedDate,
      status,
      timestamp: new Date(),
    }));

    // Por ahora solo mostramos una alerta, después conectaremos con el backend
    alert(`✅ Asistencia guardada para ${selectedCourse.name} - ${getDayName(selectedDate)}\n\nResumen:\n- Presentes: ${stats.present}\n- Ausentes: ${stats.absent}\n- Tardanzas: ${stats.late}`    );
    
    // Notificar cambio en estadísticas
    const statsEvent: AttendanceEvent = {
      type: 'stats_changed',
      studentId: '',
      courseId: selectedCourse?.id || '',
      newStatus: 'presente', // Placeholder
      timestamp: new Date()
    };
    attendanceSubject.current.notifyObservers(statsEvent);
  };

  // Función para marcar todos como presentes con notificaciones
  const markAllPresent = () => {
    mockStudents.forEach(student => {
      if (attendanceData[student.id] !== 'presente') {
        handleAttendanceChange(student.id, 'presente');
      }
    });
  };

  // Funciones para limpiar notificaciones
  const clearNotifications = () => {
    notificationObserver.current.clearNotifications();
  };

  const clearAlerts = () => {
    setAlerts([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          📚 Control de Asistencia
        </h1>

        {/* Controles principales */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            
            {/* Dropdown de Cursos */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seleccionar Curso
              </label>
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">-- Selecciona un curso --</option>
                {mockCourses.map(course => (
                  <option key={course.id} value={course.id}>
                    {course.name} ({course.code}) - {course.type.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            {/* Dropdown de Fechas */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seleccionar Fecha
              </label>
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">-- Selecciona una fecha --</option>
                {weekDates.map(date => (
                  <option key={date} value={date}>
                    {getDayName(date)} - {new Date(date).toLocaleDateString('es-ES')}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Información del curso seleccionado */}
          {selectedCourse && (
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-800">{selectedCourse.name}</h3>
                  <p className="text-sm text-gray-600">
                    {selectedCourse.faculty} - {selectedCourse.career} | Código: {selectedCourse.code}
                  </p>
                </div>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                  selectedCourse.type === 'presencial' ? 'bg-green-100 text-green-800' :
                  selectedCourse.type === 'virtual' ? 'bg-blue-100 text-blue-800' :
                  'bg-purple-100 text-purple-800'
                }`}>
                  {selectedCourse.type.toUpperCase()}
                </span>
              </div>
            </div>
          )}

          {/* Botones de utilidad */}
          {selectedCourse && selectedDate && (
            <div className="flex gap-2 mb-4">
              <button
                onClick={markAllPresent}
                className="px-4 py-2 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors"
              >
                Marcar Todos Presentes
              </button>
              <button
                onClick={() => setAttendanceData({})}
                className="px-4 py-2 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 transition-colors"
              >
                Limpiar Selecciones
              </button>
            </div>
          )}
        </div>

        {/* Estadísticas en tiempo real */}
        {selectedCourse && selectedDate && Object.keys(attendanceData).length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <h3 className="font-medium text-gray-700 mb-3">📊 Estadísticas en Tiempo Real</h3>
            <div className="grid grid-cols-4 gap-4 text-center">
              <div className="bg-green-50 p-3 rounded">
                <div className="text-2xl font-bold text-green-600">{stats.present}</div>
                <div className="text-sm text-green-800">Presentes</div>
              </div>
              <div className="bg-red-50 p-3 rounded">
                <div className="text-2xl font-bold text-red-600">{stats.absent}</div>
                <div className="text-sm text-red-800">Ausentes</div>
              </div>
              <div className="bg-yellow-50 p-3 rounded">
                <div className="text-2xl font-bold text-yellow-600">{stats.late}</div>
                <div className="text-sm text-yellow-800">Tardanzas</div>
              </div>
              <div className="bg-blue-50 p-3 rounded">
                <div className="text-2xl font-bold text-blue-600">
                  {((stats.present + stats.late) / stats.total * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-blue-800">Asistencia</div>
              </div>
            </div>
          </div>
        )}

        {/* Lista de estudiantes - AQUÍ SE USA EL FACTORY METHOD */}
        {selectedCourse && selectedDate ? (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Lista de Estudiantes
              </h2>
              <span className="text-sm text-gray-500">
                {mockStudents.length} estudiantes
              </span>
            </div>
            
            {/* FACTORY METHOD EN ACCIÓN */}
            {AttendanceComponentFactory.createAttendanceComponent(
              selectedCourse.type,
              {
                students: mockStudents,
                onAttendanceChange: handleAttendanceChange,
                attendanceData: attendanceData
              }
            )}

            {/* Botón para guardar */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSaveAttendance}
                disabled={Object.keys(attendanceData).length === 0}
                className={`px-6 py-3 text-white font-medium rounded-lg transition-colors ${
                  Object.keys(attendanceData).length > 0
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                💾 Guardar Asistencia ({Object.keys(attendanceData).length}/{mockStudents.length})
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-gray-400 text-6xl mb-4">📋</div>
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              Selecciona un curso y una fecha
            </h3>
            <p className="text-gray-500">
              Para comenzar a tomar asistencia, selecciona primero el curso y la fecha en los menús de arriba.
            </p>
          </div>
        )}
      </div>

      {/* SISTEMA OBSERVER: Panel de notificaciones */}
      <NotificationPanel
        notifications={notifications}
        alerts={alerts}
        stats={observerStats}
        onClearNotifications={clearNotifications}
        onClearAlerts={clearAlerts}
      />
    </div>
  );
};

export default AttendancePage;