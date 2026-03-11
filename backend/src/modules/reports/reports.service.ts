import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual, In } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { ExerciseAttempt } from '../exercises/entities/exercise-attempt.entity';
import { Class } from '../classes/entities/class.entity';
import { Center } from '../centers/entities/center.entity';
import PDFDocument from 'pdfkit';
import * as ExcelJS from 'exceljs';

export interface ReportData {
    student: User;
    period: {
        start: Date;
        end: Date;
    };
    summary: {
        totalExercises: number;
        correctExercises: number;
        totalPoints: number;
        studyTime: number;
        successRate: number;
    };
    subjectBreakdown: Array<{
        subject: string;
        exercises: number;
        successRate: number;
    }>;
    rtiClassification: {
        tier: 1 | 2 | 3;
        recommendation: string;
    };
    strengths: string[];
    areasForImprovement: string[];
    attempts?: ExerciseAttempt[];
}

export interface ClassReportData {
    className: string;
    grade: string;
    totalStudents: number;
    avgSuccessRate: number;
    tierDistribution: {
        tier1: number;
        tier2: number;
        tier3: number;
    };
    atRiskStudents: User[];
    topStudents: User[];
    fullStats: Array<{
        student: User;
        successRate: number;
        tier: 1 | 2 | 3;
        totalExercises: number;
    }>;
}

export interface CenterReportData {
    centerName: string;
    totalTeachers: number;
    totalStudents: number;
    totalClasses: number;
    avgSuccessRate: number;
    tierDistribution: {
        tier1: number;
        tier2: number;
        tier3: number;
    };
    classBreakdown: Array<{
        id: number;
        name: string;
        successRate: number;
        studentsCount: number;
    }>;
}

@Injectable()
export class ReportsService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(ExerciseAttempt)
        private attemptRepository: Repository<ExerciseAttempt>,
        @InjectRepository(Class)
        private classRepository: Repository<Class>,
        @InjectRepository(Center)
        private centerRepository: Repository<Center>,
    ) { }

    async generateWeeklyReport(studentId: number): Promise<ReportData> {
        const student = await this.userRepository.findOne({
            where: { id: studentId },
        });

        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const attempts = await this.attemptRepository.find({
            where: {
                userId: studentId,
                createdAt: MoreThanOrEqual(oneWeekAgo),
            },
            relations: ['exercise'],
        });

        return this.buildReportData(student, attempts, oneWeekAgo, new Date());
    }

    async generateMonthlyReport(studentId: number): Promise<ReportData> {
        const student = await this.userRepository.findOne({
            where: { id: studentId },
        });

        const oneMonthAgo = new Date();
        oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);

        const attempts = await this.attemptRepository.find({
            where: {
                userId: studentId,
                createdAt: MoreThanOrEqual(oneMonthAgo),
            },
            relations: ['exercise'],
        });

        return this.buildReportData(student, attempts, oneMonthAgo, new Date());
    }

    private buildReportData(student: User, attempts: ExerciseAttempt[], start: Date, end: Date): ReportData {
        const correctAttempts = attempts.filter(a => a.isCorrect);
        const totalPoints = attempts.reduce((sum, a) => sum + (a.pointsEarned || 0), 0);
        const totalTime = attempts.reduce((sum, a) => sum + (a.timeSpentSeconds || 0), 0);
        const successRate = attempts.length > 0
            ? Math.round((correctAttempts.length / attempts.length) * 100)
            : 0;

        // Subject breakdown
        const subjectMap = new Map<string, { total: number; correct: number }>();
        attempts.forEach(attempt => {
            const subject = attempt.exercise?.instruction?.split(' ')[0] || 'General';
            if (!subjectMap.has(subject)) {
                subjectMap.set(subject, { total: 0, correct: 0 });
            }
            const stats = subjectMap.get(subject)!;
            stats.total++;
            if (attempt.isCorrect) stats.correct++;
        });

        const subjectBreakdown = Array.from(subjectMap.entries()).map(([subject, stats]) => ({
            subject,
            exercises: stats.total,
            successRate: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
        }));

        // RtI Classification
        let rtiTier: 1 | 2 | 3 = 1;
        let recommendation = 'Excelente progreso. Continuar con el nivel actual.';

        if (successRate < 40) {
            rtiTier = 3;
            recommendation = 'Se recomienda intervención intensiva y apoyo adicional.';
        } else if (successRate < 60) {
            rtiTier = 2;
            recommendation = 'Se recomienda apoyo moderado y seguimiento cercano.';
        }

        // Strengths and areas for improvement
        const strengths: string[] = [];
        const areasForImprovement: string[] = [];

        subjectBreakdown.forEach(subject => {
            if (subject.successRate >= 70) {
                strengths.push(`Excelente desempeño en ${subject.subject}`);
            } else if (subject.successRate < 50) {
                areasForImprovement.push(`Necesita mejorar en ${subject.subject}`);
            }
        });

        if (attempts.length >= 20) {
            strengths.push('Muy activo/a en la plataforma');
        }

        return {
            student,
            period: { start, end },
            summary: {
                totalExercises: attempts.length,
                correctExercises: correctAttempts.length,
                totalPoints,
                studyTime: Math.round(totalTime / 60),
                successRate,
            },
            subjectBreakdown,
            rtiClassification: { tier: rtiTier, recommendation },
            strengths,
            areasForImprovement,
            attempts,
        };
    }

    async generateClassReport(classId: number): Promise<ClassReportData> {
        const classEntity = await this.classRepository.findOne({
            where: { id: classId },
            relations: ['students', 'students.class'],
        });

        if (!classEntity) {
            throw new Error('Class not found');
        }

        const studentIDs = classEntity.students.map((s: User) => s.id);
        const attempts = await this.attemptRepository.find({
            where: {
                userId: In(studentIDs),
            },
            relations: ['exercise', 'user'],
        });

        const studentsStats = classEntity.students.map((student: User) => {
            const studentAttempts = attempts.filter(a => a.userId === student.id);
            const correct = studentAttempts.filter(a => a.isCorrect).length;
            const successRate = studentAttempts.length > 0 ? Math.round((correct / studentAttempts.length) * 100) : 0;

            let tier: 1 | 2 | 3 = 1;
            if (successRate < 40) tier = 3;
            else if (successRate < 60) tier = 2;

            return {
                student,
                successRate,
                tier,
                totalExercises: studentAttempts.length,
            };
        });

        const avgSuccessRate = studentsStats.length > 0
            ? Math.round(studentsStats.reduce((sum: number, s: any) => sum + s.successRate, 0) / studentsStats.length)
            : 0;

        const tierDistribution = {
            tier1: studentsStats.filter((s: any) => s.tier === 1).length,
            tier2: studentsStats.filter((s: any) => s.tier === 2).length,
            tier3: studentsStats.filter((s: any) => s.tier === 3).length,
        };

        return {
            className: classEntity.name,
            grade: classEntity.grade,
            totalStudents: studentsStats.length,
            avgSuccessRate,
            tierDistribution,
            atRiskStudents: studentsStats.filter((s: any) => s.tier === 3).map((s: any) => s.student),
            topStudents: studentsStats
                .sort((a: any, b: any) => b.successRate - a.successRate)
                .slice(0, 5)
                .map((s: any) => s.student),
            fullStats: studentsStats,
        };
    }

    async generatePDFReport(reportData: ReportData): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            const doc = new PDFDocument({ margin: 50, size: 'A4' });
            const chunks: Buffer[] = [];

            doc.on('data', (chunk: Buffer) => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.on('error', reject);

            // Header
            doc.fontSize(24).fillColor('#6366F1').text('BestKids', { align: 'center' });
            doc.fontSize(16).fillColor('#374151').text('Reporte de Progreso', { align: 'center' });
            doc.moveDown();

            // Student Info
            doc.fontSize(12).fillColor('#1F2937');
            doc.text(`Estudiante: ${reportData.student?.firstName || 'N/A'} ${reportData.student?.lastName || ''}`, { underline: true });
            doc.text(`Período: ${reportData.period.start.toLocaleDateString('es-ES')} - ${reportData.period.end.toLocaleDateString('es-ES')}`);
            doc.moveDown();

            // Summary Box
            doc.rect(50, doc.y, 495, 100).fillAndStroke('#F3F4F6', '#E5E7EB');
            const summaryY = doc.y + 15;
            doc.fillColor('#1F2937').fontSize(14).text('RESUMEN', 60, summaryY, { underline: true });
            doc.fontSize(11);
            doc.text(`Ejercicios completados: ${reportData.summary.totalExercises}`, 60, summaryY + 25);
            doc.text(`Ejercicios correctos: ${reportData.summary.correctExercises}`, 60, summaryY + 40);
            doc.text(`Tasa de éxito: ${reportData.summary.successRate}%`, 300, summaryY + 25);
            doc.text(`Puntos ganados: ${reportData.summary.totalPoints}`, 300, summaryY + 40);
            doc.text(`Tiempo de estudio: ${reportData.summary.studyTime} min`, 300, summaryY + 55);

            doc.y = summaryY + 110;
            doc.moveDown();

            // RTI Classification
            const tierColors = { 1: '#22C55E', 2: '#F59E0B', 3: '#EF4444' };
            doc.fontSize(14).fillColor('#1F2937').text('Clasificación RTI', { underline: true });
            doc.fontSize(12).fillColor(tierColors[reportData.rtiClassification.tier]);
            doc.text(`Tier ${reportData.rtiClassification.tier}`);
            doc.fillColor('#6B7280').text(reportData.rtiClassification.recommendation);
            doc.moveDown();

            // Strengths
            if (reportData.strengths.length > 0) {
                doc.fillColor('#1F2937').fontSize(14).text('✅ Fortalezas', { underline: true });
                doc.fontSize(11).fillColor('#374151');
                reportData.strengths.forEach(s => doc.text(`• ${s}`));
                doc.moveDown();
            }

            // Areas for Improvement
            if (reportData.areasForImprovement.length > 0) {
                doc.fillColor('#1F2937').fontSize(14).text('📈 Áreas de Mejora', { underline: true });
                doc.fontSize(11).fillColor('#374151');
                reportData.areasForImprovement.forEach(a => doc.text(`• ${a}`));
                doc.moveDown();
            }

            // Subject Breakdown Table
            if (reportData.subjectBreakdown.length > 0) {
                doc.addPage();
                doc.fillColor('#1F2937').fontSize(14).text('Desglose por Área', { underline: true });
                doc.moveDown(0.5);

                // Table header
                const tableTop = doc.y;
                doc.fontSize(10).fillColor('#6B7280');
                doc.text('Área', 50, tableTop);
                doc.text('Ejercicios', 200, tableTop);
                doc.text('Tasa de Éxito', 300, tableTop);

                let tableY = tableTop + 20;
                doc.fontSize(11).fillColor('#1F2937');
                reportData.subjectBreakdown.forEach(subject => {
                    doc.text(subject.subject, 50, tableY);
                    doc.text(subject.exercises.toString(), 200, tableY);
                    doc.text(`${subject.successRate}%`, 300, tableY);
                    tableY += 20;
                });
            }

            // Footer
            doc.fontSize(8).fillColor('#9CA3AF');
            doc.text(
                `Generado el ${new Date().toLocaleDateString('es-ES')} - BestKids`,
                50,
                doc.page.height - 50,
                { align: 'center' }
            );

            doc.end();
        });
    }

    async generateExcelReport(reportData: ReportData): Promise<Buffer> {
        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'BestKids';
        workbook.created = new Date();

        // Summary Sheet
        const summarySheet = workbook.addWorksheet('Resumen');
        summarySheet.columns = [
            { header: 'Campo', key: 'field', width: 30 },
            { header: 'Valor', key: 'value', width: 40 },
        ];

        summarySheet.addRows([
            { field: 'Estudiante', value: `${reportData.student?.firstName || 'N/A'} ${reportData.student?.lastName || ''}` },
            { field: 'Período Inicio', value: reportData.period.start.toLocaleDateString('es-ES') },
            { field: 'Período Fin', value: reportData.period.end.toLocaleDateString('es-ES') },
            { field: '', value: '' },
            { field: 'Ejercicios Completados', value: reportData.summary.totalExercises },
            { field: 'Ejercicios Correctos', value: reportData.summary.correctExercises },
            { field: 'Tasa de Éxito', value: `${reportData.summary.successRate}%` },
            { field: 'Puntos Ganados', value: reportData.summary.totalPoints },
            { field: 'Tiempo de Estudio (min)', value: reportData.summary.studyTime },
            { field: '', value: '' },
            { field: 'Clasificación RTI', value: `Tier ${reportData.rtiClassification.tier}` },
            { field: 'Recomendación', value: reportData.rtiClassification.recommendation },
        ]);

        // Style header
        summarySheet.getRow(1).font = { bold: true };
        summarySheet.getRow(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF6366F1' },
        };
        summarySheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };

        // Subject Breakdown Sheet
        const subjectSheet = workbook.addWorksheet('Por Área');
        subjectSheet.columns = [
            { header: 'Área', key: 'subject', width: 25 },
            { header: 'Ejercicios', key: 'exercises', width: 15 },
            { header: 'Tasa de Éxito (%)', key: 'successRate', width: 20 },
        ];

        reportData.subjectBreakdown.forEach(subject => {
            subjectSheet.addRow(subject);
        });

        subjectSheet.getRow(1).font = { bold: true };
        subjectSheet.getRow(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF22C55E' },
        };
        subjectSheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };

        // Attempts Detail Sheet (if available)
        if (reportData.attempts && reportData.attempts.length > 0) {
            const attemptsSheet = workbook.addWorksheet('Detalle Ejercicios');
            attemptsSheet.columns = [
                { header: 'Fecha', key: 'date', width: 15 },
                { header: 'Ejercicio', key: 'exercise', width: 30 },
                { header: 'Correcto', key: 'correct', width: 12 },
                { header: 'Puntos', key: 'points', width: 12 },
                { header: 'Tiempo (seg)', key: 'time', width: 15 },
            ];

            reportData.attempts.forEach(attempt => {
                attemptsSheet.addRow({
                    date: attempt.createdAt?.toLocaleDateString('es-ES') || 'N/A',
                    exercise: attempt.exercise?.instruction || 'N/A',
                    correct: attempt.isCorrect ? 'Sí' : 'No',
                    points: attempt.pointsEarned || 0,
                    time: attempt.timeSpentSeconds || 0,
                });
            });

            attemptsSheet.getRow(1).font = { bold: true };
            attemptsSheet.getRow(1).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFF59E0B' },
            };
            attemptsSheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
        }

        // Generate buffer
        const buffer = await workbook.xlsx.writeBuffer();
        return Buffer.from(buffer);
    }

    async generateClassPDFReport(reportData: ClassReportData): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            const doc = new PDFDocument({ margin: 50, size: 'A4' });
            const chunks: Buffer[] = [];

            doc.on('data', (chunk: Buffer) => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.on('error', reject);

            // Header
            doc.fontSize(26).fillColor('#10B981').text('BestKids Academia', { align: 'center' });
            doc.fontSize(16).fillColor('#374151').text(`Reporte de Aula: ${reportData.className}`, { align: 'center' });
            doc.moveDown();

            // General Info
            doc.rect(50, doc.y, 495, 80).fill('#F8FAFC');
            doc.fillColor('#1E293B').fontSize(12);
            doc.text(`Grado: ${reportData.grade || 'N/A'}`, 70, doc.y - 65);
            doc.text(`Total Estudiantes: ${reportData.totalStudents}`, 70, doc.y - 45);
            doc.text(`Éxito Promedio: ${reportData.avgSuccessRate}%`, 300, doc.y - 65);
            doc.text(`Generado el: ${new Date().toLocaleDateString('es-ES')}`, 300, doc.y - 45);

            doc.y += 30;
            doc.moveDown();

            // RTI Distribution Table
            doc.fontSize(14).fillColor('#1E293B').text('Distribución RtI (Response to Intervention)', { underline: true });
            doc.moveDown(0.5);

            const tableTop = doc.y;
            doc.fontSize(10).fillColor('#64748B');
            doc.text('Nivel', 70, tableTop);
            doc.text('Estudiantes', 200, tableTop);
            doc.text('Porcentaje', 350, tableTop);

            const total = reportData.totalStudents || 1;
            const tiers = [
                { label: 'Tier 1 (Base)', count: reportData.tierDistribution.tier1, color: '#22C55E' },
                { label: 'Tier 2 (Refuerzo)', count: reportData.tierDistribution.tier2, color: '#F59E0B' },
                { label: 'Tier 3 (Intensivo)', count: reportData.tierDistribution.tier3, color: '#EF4444' },
            ];

            let tableY = tableTop + 20;
            tiers.forEach(tier => {
                doc.fillColor(tier.color).fontSize(11).text(tier.label, 70, tableY);
                doc.fillColor('#1E293B').text(tier.count.toString(), 200, tableY);
                doc.text(`${Math.round((tier.count / total) * 100)}%`, 350, tableY);
                tableY += 20;
            });

            doc.y = tableY + 20;
            doc.moveDown();

            // Top Students
            if (reportData.topStudents.length > 0) {
                doc.fillColor('#10B981').fontSize(14).text('⭐ Alumnos Destacados', { underline: true });
                doc.fontSize(11).fillColor('#374151');
                reportData.topStudents.forEach((s: User) => doc.text(`• ${s.firstName} ${s.lastName}`));
                doc.moveDown();
            }

            // At Risk Students
            if (reportData.atRiskStudents.length > 0) {
                doc.fillColor('#EF4444').fontSize(14).text('⚠️ Prioridad de Intervención (Tier 3)', { underline: true });
                doc.fontSize(11).fillColor('#374151');
                reportData.atRiskStudents.forEach((s: User) => doc.text(`• ${s.firstName} ${s.lastName}`));
                doc.moveDown();
            }

            // Footer
            doc.fontSize(8).fillColor('#94A3B8');
            doc.text(
                'Confidencial - Uso Educativo Exclusivo para BestKids Platform',
                50,
                doc.page.height - 50,
                { align: 'center' }
            );

            doc.end();
        });
    }

    async generateCenterReport(centerId: number): Promise<CenterReportData> {
        const center = await this.centerRepository.findOne({
            where: { id: centerId },
            relations: ['users'],
        });

        if (!center) throw new Error('Center not found');

        const classes = await this.classRepository.find({
            where: { centerId },
            relations: ['students'],
        });

        const teachers = center.users.filter(u => u.roleId === 3);
        const students = center.users.filter(u => u.roleId === 5);

        const studentIDs = students.map(s => s.id);
        const attempts = await this.attemptRepository.find({
            where: { userId: In(studentIDs) },
            relations: ['user']
        });

        const studentStats = students.map(student => {
            const sAttempts = attempts.filter(a => a.userId === student.id);
            const correct = sAttempts.filter(a => a.isCorrect).length;
            const successRate = sAttempts.length > 0 ? Math.round((correct / sAttempts.length) * 100) : 0;
            let tier: 1 | 2 | 3 = 1;
            if (successRate < 40) tier = 3;
            else if (successRate < 60) tier = 2;
            return { tier, successRate };
        });

        const classBreakdown = classes.map(cls => {
            const clsStudentIDs = cls.students.map(s => s.id);
            const clsAttempts = attempts.filter(a => clsStudentIDs.includes(a.userId));
            const correct = clsAttempts.filter(a => a.isCorrect).length;
            const successRate = clsAttempts.length > 0 ? Math.round((correct / clsAttempts.length) * 100) : 0;
            return {
                id: cls.id,
                name: cls.name,
                successRate,
                studentsCount: cls.students.length
            };
        });

        const avgSuccessRate = studentStats.length > 0
            ? Math.round(studentStats.reduce((sum, s) => sum + s.successRate, 0) / studentStats.length)
            : 0;

        const tierDistribution = {
            tier1: studentStats.filter(s => s.tier === 1).length,
            tier2: studentStats.filter(s => s.tier === 2).length,
            tier3: studentStats.filter(s => s.tier === 3).length,
        };

        return {
            centerName: center.name,
            totalTeachers: teachers.length,
            totalStudents: students.length,
            totalClasses: classes.length,
            avgSuccessRate,
            tierDistribution,
            classBreakdown
        };
    }

    async generateCenterPDFReport(reportData: CenterReportData): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            const doc = new PDFDocument({ margin: 50, size: 'A4' });
            const chunks: Buffer[] = [];
            doc.on('data', chunks.push.bind(chunks));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.on('error', reject);

            doc.fontSize(28).fillColor('#4F46E5').text('BestKids Global', { align: 'center' });
            doc.fontSize(18).fillColor('#374151').text(`Informe Ejecutivo: ${reportData.centerName}`, { align: 'center' });
            doc.moveDown();

            doc.rect(50, doc.y, 495, 100).fill('#F1F5F9');
            doc.fillColor('#1E293B').fontSize(12);
            doc.text(`Institución: ${reportData.centerName}`, 70, doc.y - 85);
            doc.text(`Total Docentes: ${reportData.totalTeachers}`, 70, doc.y - 65);
            doc.text(`Total Estudiantes: ${reportData.totalStudents}`, 70, doc.y - 45);
            doc.text(`Total Aulas: ${reportData.totalClasses}`, 300, doc.y - 85);
            doc.text(`Éxito Global: ${reportData.avgSuccessRate}%`, 300, doc.y - 65);
            doc.text(`Fecha: ${new Date().toLocaleDateString('es-ES')}`, 300, doc.y - 45);

            doc.y += 30; doc.moveDown();

            doc.fontSize(16).fillColor('#1E293B').text('Rendimiento por Nivel de Apoyo (RtI)', { underline: true });
            doc.moveDown(0.5);
            const total = reportData.totalStudents || 1;
            const rows = [
                { label: 'Tier 1 (En objetivo)', count: reportData.tierDistribution.tier1, color: '#22C55E' },
                { label: 'Tier 2 (En seguimiento)', count: reportData.tierDistribution.tier2, color: '#F59E0B' },
                { label: 'Tier 3 (Criticos)', count: reportData.tierDistribution.tier3, color: '#EF4444' }
            ];

            rows.forEach(row => {
                doc.fillColor(row.color).fontSize(12).text(`${row.label}: ${row.count} alumnos (${Math.round((row.count / total) * 100)}%)`);
            });

            doc.addPage();
            doc.fillColor('#1E293B').fontSize(16).text('Desglose por Aulas', { underline: true });
            doc.moveDown();

            reportData.classBreakdown.forEach(cls => {
                doc.fontSize(12).fillColor('#334155').text(`• ${cls.name}: ${cls.successRate}% de éxito (${cls.studentsCount} alumnos)`);
                doc.moveDown(0.2);
            });

            doc.end();
        });
    }
}
