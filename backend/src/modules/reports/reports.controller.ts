import { Controller, Get, Param, UseGuards, Request, Res, Query } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import type { Response } from 'express';

@ApiTags('reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('reports')
export class ReportsController {
    constructor(private readonly reportsService: ReportsService) { }

    @Get('student/:id/weekly')
    @ApiOperation({ summary: 'Get weekly report for student' })
    async getWeeklyReport(@Param('id') id: string) {
        return this.reportsService.generateWeeklyReport(+id);
    }

    @Get('student/:id/monthly')
    @ApiOperation({ summary: 'Get monthly report for student' })
    async getMonthlyReport(@Param('id') id: string) {
        return this.reportsService.generateMonthlyReport(+id);
    }

    @Get('student/:id/weekly/pdf')
    @ApiOperation({ summary: 'Download weekly report as PDF' })
    async downloadWeeklyPDF(@Param('id') id: string, @Res() res: Response) {
        const reportData = await this.reportsService.generateWeeklyReport(+id);
        const pdfBuffer = await this.reportsService.generatePDFReport(reportData);

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=reporte-semanal-${id}-${Date.now()}.pdf`,
            'Content-Length': pdfBuffer.length,
        });

        res.send(pdfBuffer);
    }

    @Get('student/:id/monthly/pdf')
    @ApiOperation({ summary: 'Download monthly report as PDF' })
    async downloadMonthlyPDF(@Param('id') id: string, @Res() res: Response) {
        const reportData = await this.reportsService.generateMonthlyReport(+id);
        const pdfBuffer = await this.reportsService.generatePDFReport(reportData);

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=reporte-mensual-${id}-${Date.now()}.pdf`,
            'Content-Length': pdfBuffer.length,
        });

        res.send(pdfBuffer);
    }

    @Get('student/:id/weekly/excel')
    @ApiOperation({ summary: 'Download weekly report as Excel' })
    async downloadWeeklyExcel(@Param('id') id: string, @Res() res: Response) {
        const reportData = await this.reportsService.generateWeeklyReport(+id);
        const excelBuffer = await this.reportsService.generateExcelReport(reportData);

        res.set({
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': `attachment; filename=reporte-semanal-${id}-${Date.now()}.xlsx`,
            'Content-Length': excelBuffer.length,
        });

        res.send(excelBuffer);
    }

    @Get('student/:id/monthly/excel')
    @ApiOperation({ summary: 'Download monthly report as Excel' })
    async downloadMonthlyExcel(@Param('id') id: string, @Res() res: Response) {
        const reportData = await this.reportsService.generateMonthlyReport(+id);
        const excelBuffer = await this.reportsService.generateExcelReport(reportData);

        res.set({
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': `attachment; filename=reporte-mensual-${id}-${Date.now()}.xlsx`,
            'Content-Length': excelBuffer.length,
        });

        res.send(excelBuffer);
    }

    @Get('my-child/:id/weekly')
    @ApiOperation({ summary: 'Get weekly report for my child (parent)' })
    async getMyChildWeeklyReport(@Param('id') id: string) {
        return this.reportsService.generateWeeklyReport(+id);
    }

    @Get('my-child/:id/weekly/pdf')
    @ApiOperation({ summary: 'Download weekly PDF report for my child (parent)' })
    async downloadMyChildWeeklyPDF(@Param('id') id: string, @Res() res: Response) {
        const reportData = await this.reportsService.generateWeeklyReport(+id);
        const pdfBuffer = await this.reportsService.generatePDFReport(reportData);

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=reporte-hijo-${id}-${Date.now()}.pdf`,
            'Content-Length': pdfBuffer.length,
        });

        res.send(pdfBuffer);
    }

    @Get('class/:id')
    @ApiOperation({ summary: 'Get report for entire class' })
    async getClassReport(@Param('id') id: string) {
        return this.reportsService.generateClassReport(+id);
    }

    @Get('class/:id/pdf')
    @ApiOperation({ summary: 'Download class report as PDF' })
    async downloadClassPDF(@Param('id') id: string, @Res() res: Response) {
        const reportData = await this.reportsService.generateClassReport(+id);
        const pdfBuffer = await this.reportsService.generateClassPDFReport(reportData);

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=reporte-aula-${id}-${Date.now()}.pdf`,
            'Content-Length': pdfBuffer.length,
        });

        res.send(pdfBuffer);
    }

    @Get('center/:id')
    @ApiOperation({ summary: 'Get analytics for an entire center' })
    async getCenterReport(@Param('id') id: string) {
        return this.reportsService.generateCenterReport(+id);
    }

    @Get('center/:id/pdf')
    @ApiOperation({ summary: 'Download center report as PDF' })
    async downloadCenterPDF(@Param('id') id: string, @Res() res: Response) {
        const reportData = await this.reportsService.generateCenterReport(+id);
        const pdfBuffer = await this.reportsService.generateCenterPDFReport(reportData);

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=Reporte_Centro_${reportData.centerName.replace(/\s+/g, '_')}.pdf`,
            'Content-Length': pdfBuffer.length,
        });

        res.send(pdfBuffer);
    }
}
