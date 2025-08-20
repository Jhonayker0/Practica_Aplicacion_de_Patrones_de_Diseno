import { AttendanceEvent, Observer } from '../../types';

// Clase base para manejar el patrón Observer
export class AttendanceSubject {
  private observers: Observer[] = [];
  
  // Agregar un observer
  addObserver(observer: Observer): void {
    this.observers.push(observer);
  }
  
  // Remover un observer
  removeObserver(observer: Observer): void {
    this.observers = this.observers.filter(obs => obs !== observer);
  }
  
  // Notificar a todos los observers
  notifyObservers(event: AttendanceEvent): void {
    this.observers.forEach(observer => observer.update(event));
  }
}

// Observer para mostrar notificaciones en la interfaz
export class NotificationObserver implements Observer {
  private notifications: string[] = [];
  private onNotificationChange: (notifications: string[]) => void;
  
  constructor(onNotificationChange: (notifications: string[]) => void) {
    this.onNotificationChange = onNotificationChange;
  }
  
  update(event: AttendanceEvent): void {
    const student = this.getStudentName(event.studentId);
    let message = '';
    
    switch (event.type) {
      case 'attendance_marked':
        message = `📝 ${student}: marcado como ${event.newStatus}`;
        break;
      case 'attendance_updated':
        message = `🔄 ${student}: cambiado de ${event.oldStatus} a ${event.newStatus}`;
        break;
      case 'stats_changed':
        message = `📊 Estadísticas actualizadas`;
        break;
    }
    
    // Agregar notificación con timestamp
    this.notifications.unshift(`${new Date().toLocaleTimeString()}: ${message}`);
    
    // Mantener solo las últimas 5 notificaciones
    if (this.notifications.length > 5) {
      this.notifications = this.notifications.slice(0, 5);
    }
    
    this.onNotificationChange([...this.notifications]);
  }
  
  private getStudentName(studentId: string): string {
    // En un caso real, buscarías en la base de datos
    const studentNames: Record<string, string> = {
      '1': 'Ana García',
      '2': 'Carlos Rodríguez',
      '3': 'María López',
      '4': 'David Martínez',
      '5': 'Sofia Hernández'
    };
    return studentNames[studentId] || 'Estudiante desconocido';
  }
  
  clearNotifications(): void {
    this.notifications = [];
    this.onNotificationChange([]);
  }
}

// Observer para detectar estudiantes con muchas faltas
export class AbsenteeAlertObserver implements Observer {
  private absentCounts: Record<string, number> = {};
  private onAlert: (alert: string) => void;
  
  constructor(onAlert: (alert: string) => void) {
    this.onAlert = onAlert;
  }
  
  update(event: AttendanceEvent): void {
    if (event.newStatus === 'ausente') {
      // Incrementar contador de faltas
      this.absentCounts[event.studentId] = (this.absentCounts[event.studentId] || 0) + 1;
      
      const studentName = this.getStudentName(event.studentId);
      const absentCount = this.absentCounts[event.studentId];
      
      // Alertas según número de faltas
      if (absentCount === 3) {
        this.onAlert(`⚠️ ATENCIÓN: ${studentName} tiene 3 faltas consecutivas`);
      } else if (absentCount === 5) {
        this.onAlert(`🚨 ALERTA CRÍTICA: ${studentName} tiene 5 faltas - Contactar inmediatamente`);
      } else if (absentCount > 5) {
        this.onAlert(`🔴 SITUACIÓN GRAVE: ${studentName} tiene ${absentCount} faltas - Intervención requerida`);
      }
    } else if (event.newStatus === 'presente' && this.absentCounts[event.studentId] > 0) {
      // Reset contador si vuelve a estar presente
      const studentName = this.getStudentName(event.studentId);
      if (this.absentCounts[event.studentId] >= 3) {
        this.onAlert(`✅ MEJORA: ${studentName} ha vuelto a clase`);
      }
      this.absentCounts[event.studentId] = 0;
    }
  }
  
  private getStudentName(studentId: string): string {
    const studentNames: Record<string, string> = {
      '1': 'Ana García',
      '2': 'Carlos Rodríguez',
      '3': 'María López',
      '4': 'David Martínez',
      '5': 'Sofia Hernández'
    };
    return studentNames[studentId] || 'Estudiante desconocido';
  }
  
  getAbsentCounts(): Record<string, number> {
    return { ...this.absentCounts };
  }
}

// Observer para estadísticas avanzadas
export class StatisticsObserver implements Observer {
  private stats = {
    totalMarked: 0,
    changesCount: 0,
    mostActiveTime: '',
    lastUpdate: new Date()
  };
  
  private onStatsChange: (stats: any) => void;
  
  constructor(onStatsChange: (stats: any) => void) {
    this.onStatsChange = onStatsChange;
  }
  
  update(event: AttendanceEvent): void {
    this.stats.lastUpdate = new Date();
    
    switch (event.type) {
      case 'attendance_marked':
        this.stats.totalMarked++;
        break;
      case 'attendance_updated':
        this.stats.changesCount++;
        break;
    }
    
    // Determinar hora más activa
    const hour = new Date().getHours();
    this.stats.mostActiveTime = `${hour}:00`;
    
    this.onStatsChange({ ...this.stats });
  }
  
  getStats() {
    return { ...this.stats };
  }
  
  resetStats(): void {
    this.stats = {
      totalMarked: 0,
      changesCount: 0,
      mostActiveTime: '',
      lastUpdate: new Date()
    };
    this.onStatsChange({ ...this.stats });
  }
}

// Factory para crear observers (combinando Factory Method con Observer)
export class ObserverFactory {
  static createNotificationObserver(callback: (notifications: string[]) => void): NotificationObserver {
    return new NotificationObserver(callback);
  }
  
  static createAbsenteeAlertObserver(callback: (alert: string) => void): AbsenteeAlertObserver {
    return new AbsenteeAlertObserver(callback);
  }
  
  static createStatisticsObserver(callback: (stats: any) => void): StatisticsObserver {
    return new StatisticsObserver(callback);
  }
}