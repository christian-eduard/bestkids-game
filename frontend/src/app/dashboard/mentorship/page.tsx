"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; // Assuming exists, else check
import { useToast } from "@/contexts/ToastContext";
import { Calendar, Clock, User, Video } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface MentoringSession {
    id: number;
    studentId: number;
    tutorId: number;
    scheduledDate: string;
    durationMinutes: number;
    status: 'scheduled' | 'completed' | 'cancelled';
    notes?: string;
    meetingLink?: string;
    tutor?: {
        firstName: string;
        lastName: string;
    };
    student?: {
        firstName: string;
        lastName: string;
    };
}

export default function MentorshipPage() {
    const [sessions, setSessions] = useState<MentoringSession[]>([]);
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();

    // Form State
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [notes, setNotes] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchSessions();
    }, []);

    const fetchSessions = async () => {
        try {
            const res = await api.get("/mentorship/sessions");
            setSessions(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSchedule = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Combine date and time
        const scheduledDate = new Date(`${date}T${time}`);

        try {
            // Hardcoded studentId logic for now (tutor scheduling for a specific student? 
            // Or Student requesting? The Endpoint expects studentId. 
            // If I am a student, I can't book myself?
            // The controller `scheduleSession` says: "Assume req.user is the tutor for now". 
            // This means ONLY TUTORS can book. 
            // Students probably just view.
            // Let's assume the user is a Tutor for the booking tab.
            // But if I am a student, I want to request?

            // For this UI, I will implement it as if I am the Tutor booking a session for a student.
            // I need a student ID. Let's add a simple input for student ID for MVP.

            const studentId = 1; // Placeholder: In real app, select from list of my students

            await api.post("/mentorship/sessions", {
                studentId: studentId,
                date: scheduledDate.toISOString(),
                notes
            });

            showToast("Sesión agendada con éxito", "success");
            fetchSessions();
            setDate("");
            setTime("");
            setNotes("");
        } catch (error) {
            showToast("Error al agendar sesión. Verifica que eres Tutor.", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-8 p-6">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                    <User className="w-8 h-8 text-blue-500" />
                    Mentoría Académica
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                    Gestiona tus sesiones de tutoría y apoyo escolar.
                </p>
            </header>

            <Tabs defaultValue="upcoming" className="w-full">
                <TabsList className="mb-6">
                    <TabsTrigger value="upcoming">Próximas Sesiones</TabsTrigger>
                    <TabsTrigger value="schedule">Agendar Nueva</TabsTrigger>
                    <TabsTrigger value="history">Historial</TabsTrigger>
                </TabsList>

                <TabsContent value="upcoming" className="space-y-4">
                    {sessions.filter(s => s.status === 'scheduled').length === 0 ? (
                        <Card className="p-8 text-center bg-gray-50 dark:bg-gray-800 border-dashed">
                            <p className="text-gray-500">No tienes sesiones próximas.</p>
                        </Card>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {sessions.filter(s => s.status === 'scheduled').map(session => (
                                <SessionCard key={session.id} session={session} />
                            ))}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="schedule">
                    <Card className="max-w-2xl mx-auto">
                        <CardHeader>
                            <CardTitle>Agendar Sesión</CardTitle>
                            <CardDescription>
                                Programa una nueva sesión de tutoría. (Solo Tutores)
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSchedule} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Fecha</Label>
                                        <Input
                                            type="date"
                                            required
                                            value={date}
                                            onChange={(e) => setDate(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Hora</Label>
                                        <Input
                                            type="time"
                                            required
                                            value={time}
                                            onChange={(e) => setTime(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Notas / Temas a tratar</Label>
                                    <Textarea
                                        placeholder="Ej: Repaso de Matemáticas - Unidad 3"
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>ID del Estudiante (Temporal)</Label>
                                    <Input
                                        type="number"
                                        placeholder="ID Estudiante"
                                        // Simple hardcoded input for MVP since we don't have a student selector here yet
                                        disabled
                                        value={1}
                                    />
                                    <p className="text-xs text-muted-foreground">Selección de estudiante simplificada para demo (ID: 1).</p>
                                </div>
                                <Button type="submit" className="w-full" disabled={isSubmitting}>
                                    {isSubmitting ? "Agendando..." : "Confirmar Sesión"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="history">
                    <div className="space-y-4">
                        {sessions.filter(s => s.status !== 'scheduled').map(session => (
                            <SessionCard key={session.id} session={session} isHistory />
                        ))}
                        {sessions.filter(s => s.status !== 'scheduled').length === 0 && (
                            <p className="text-center text-gray-500 py-8">No hay historial disponible.</p>
                        )}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}

function SessionCard({ session, isHistory = false }: { session: MentoringSession, isHistory?: boolean }) {
    return (
        <Card className={`overflow-hidden transition-all hover:shadow-md ${isHistory ? 'opacity-75' : 'border-l-4 border-l-blue-500'}`}>
            <CardContent className="p-5">
                <div className="flex justify-between items-start mb-4">
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                        <Video className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-bold uppercase ${session.status === 'scheduled' ? 'bg-green-100 text-green-700' :
                            session.status === 'completed' ? 'bg-gray-100 text-gray-700' : 'bg-red-100 text-red-700'
                        }`}>
                        {session.status === 'scheduled' ? 'Programada' : session.status}
                    </span>
                </div>

                <h3 className="font-bold text-lg mb-1">Sesión de Tutoría</h3>
                <div className="text-sm text-gray-500 mb-4 space-y-1">
                    <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>Con: {session.tutor?.firstName || 'Tutor'} {session.tutor?.lastName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{format(new Date(session.scheduledDate), "PPP", { locale: es })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{format(new Date(session.scheduledDate), "p", { locale: es })} ({session.durationMinutes} min)</span>
                    </div>
                </div>

                {session.notes && (
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-md text-sm italic text-gray-600 dark:text-gray-400 mb-4">
                        "{session.notes}"
                    </div>
                )}

                {!isHistory && (
                    <Button className="w-full" variant="outline">
                        Unirse a la llamada
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}
