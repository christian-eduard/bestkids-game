import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CentersModule } from './modules/centers/centers.module';
import { ExercisesModule } from './modules/exercises/exercises.module';
import { GamificationModule } from './modules/gamification/gamification.module';
import { ProgressModule } from './modules/progress/progress.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { AssignmentsModule } from './modules/assignments/assignments.module';
import { MessagesModule } from './modules/messages/messages.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { EvaluationsModule } from './modules/evaluations/evaluations.module';
import { ClassesModule } from './modules/classes/classes.module';
import { CoursesModule } from './modules/courses/courses.module';
import { StoreModule } from './modules/store/store.module';
import { MentorshipModule } from './modules/mentorship/mentorship.module';
import { ModerationModule } from './modules/moderation/moderation.module';
import { InfraModule } from './modules/infra/infra.module';
import { AssessmentModule } from './modules/assessment/assessment.module';
import { WorldsModule } from './modules/worlds/worlds.module';
import { TeachersModule } from './modules/teachers/teachers.module';
import { ParentsModule } from './modules/parents/parents.module';
import { AdminModule } from './modules/admin/admin.module';
import { ReportsModule } from './modules/reports/reports.module';
import { FeedbackModule } from './modules/feedback/feedback.module';
import { ResourcesModule } from './modules/resources/resources.module';

@Module({
  imports: [
    // Configuration module
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../.env',
    }),

    // TypeORM configuration - PostgreSQL
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST') || 'localhost',
        port: parseInt(configService.get<string>('DB_PORT') || '5432'),
        username: configService.get<string>('DB_USERNAME') || 'cex',
        password: configService.get<string>('DB_PASSWORD') || '',
        database: configService.get<string>('DB_DATABASE') || 'bestkids_db',
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true, // Auto-create tables (Dev only)
        logging: true,
        migrations: [__dirname + '/database/migrations/*{.ts,.js}'],
        migrationsRun: false,
      }),
    }),

    // Feature modules
    AuthModule,
    UsersModule,
    CentersModule,
    ExercisesModule,
    GamificationModule,
    ProgressModule,
    NotificationsModule,
    AssignmentsModule,
    MessagesModule,
    AnalyticsModule,
    EvaluationsModule,
    ClassesModule,
    CoursesModule,
    StoreModule, // Economy
    MentorshipModule,
    ModerationModule,
    InfraModule,
    AssessmentModule,
    WorldsModule,
    TeachersModule,
    ParentsModule,
    AdminModule,
    ReportsModule,
    FeedbackModule,
    ResourcesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
