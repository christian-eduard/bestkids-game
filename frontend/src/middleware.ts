import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Solo aplicar a rutas de estudiante (excepto la evaluación inicial)
    const isStudentRoute = pathname.startsWith('/dashboard/student');
    const isAssessmentRoute = pathname.startsWith('/dashboard/student/initial-assessment');

    if (isStudentRoute && !isAssessmentRoute) {
        // En producción, verificar desde el token/session si completó evaluación
        // Por ahora, permitimos acceso (el componente redirigirá si es necesario)

        // Mock: Si el usuario NO ha completado evaluación, redirigir
        // const hasCompletedAssessment = checkAssessmentStatus(); // Implementar según auth

        // if (!hasCompletedAssessment) {
        //   return NextResponse.redirect(new URL('/dashboard/student/initial-assessment', request.url));
        // }
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/dashboard/student/:path*',
};
