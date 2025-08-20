import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { AttendanceModule } from './modules/attendance/attendance.module';
import { AcademicStructureModule } from './modules/academic-structure/academic-structure.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { ReportsModule } from './modules/reports/reports.module';
import { ClassesModule } from './modules/classes/classes.module';

@Module({
  imports: [AuthModule, UsersModule, AttendanceModule, AcademicStructureModule, NotificationsModule, ReportsModule, ClassesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
