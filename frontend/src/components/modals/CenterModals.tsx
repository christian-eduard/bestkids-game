"use client";

import { useState } from "react";
import { Modal, FormField } from "@/components/ui/modal";
import api from "@/lib/api";
import { useToast } from "@/contexts/ToastContext";

interface CreateTeacherModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function CreateTeacherModal({ isOpen, onClose, onSuccess }: CreateTeacherModalProps) {
    const { showToast } = useToast();
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "password123", // Default password
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<any>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.post("/centers/teachers", formData);
            showToast("Profesor creado exitosamente", "success");
            onSuccess();
            onClose();
            setFormData({ firstName: "", lastName: "", email: "", password: "password123" });
        } catch (err: any) {
            showToast(err.response?.data?.message || "Error al crear profesor", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Nuevo Profesor">
            <form onSubmit={handleSubmit}>
                <FormField
                    label="Nombre"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                />
                <FormField
                    label="Apellidos"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                />
                <FormField
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <FormField
                    label="Contraseña"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />

                <div className="flex gap-4 mt-6">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 rounded-lg font-bold transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold transition-colors disabled:opacity-50"
                    >
                        {loading ? "Creando..." : "Crear Profesor"}
                    </button>
                </div>
            </form>
        </Modal>
    );
}

interface CreateStudentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function CreateStudentModal({ isOpen, onClose, onSuccess }: CreateStudentModalProps) {
    const { showToast } = useToast();
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "password123",
        gradeLevel: "",
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<any>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.post("/centers/students", formData);
            showToast("Estudiante creado exitosamente", "success");
            onSuccess();
            onClose();
            setFormData({ firstName: "", lastName: "", email: "", password: "password123", gradeLevel: "" });
        } catch (err: any) {
            showToast(err.response?.data?.message || "Error al crear estudiante", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Nuevo Estudiante">
            <form onSubmit={handleSubmit}>
                <FormField
                    label="Nombre"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                />
                <FormField
                    label="Apellidos"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                />
                <FormField
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <FormField
                    label="Grado"
                    name="gradeLevel"
                    value={formData.gradeLevel}
                    onChange={handleChange}
                    required
                    options={[
                        { value: "1º Primaria", label: "1º Primaria" },
                        { value: "2º Primaria", label: "2º Primaria" },
                        { value: "3º Primaria", label: "3º Primaria" },
                        { value: "4º Primaria", label: "4º Primaria" },
                        { value: "5º Primaria", label: "5º Primaria" },
                        { value: "6º Primaria", label: "6º Primaria" },
                    ]}
                />
                <FormField
                    label="Contraseña"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />

                <div className="flex gap-4 mt-6">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 rounded-lg font-bold transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-colors disabled:opacity-50"
                    >
                        {loading ? "Creando..." : "Crear Estudiante"}
                    </button>
                </div>
            </form>
        </Modal>
    );
}

interface CreateClassModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function CreateClassModal({ isOpen, onClose, onSuccess }: CreateClassModalProps) {
    const { showToast } = useToast();
    const [formData, setFormData] = useState({
        name: "",
        gradeLevel: "",
        description: "",
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<any>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.post("/centers/classes", formData);
            showToast("Aula creada exitosamente", "success");
            onSuccess();
            onClose();
            setFormData({ name: "", gradeLevel: "", description: "" });
        } catch (err: any) {
            showToast(err.response?.data?.message || "Error al crear aula", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Nueva Aula">
            <form onSubmit={handleSubmit}>
                <FormField
                    label="Nombre del Aula"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
                <FormField
                    label="Grado"
                    name="gradeLevel"
                    value={formData.gradeLevel}
                    onChange={handleChange}
                    required
                    options={[
                        { value: "1º Primaria", label: "1º Primaria" },
                        { value: "2º Primaria", label: "2º Primaria" },
                        { value: "3º Primaria", label: "3º Primaria" },
                        { value: "4º Primaria", label: "4º Primaria" },
                        { value: "5º Primaria", label: "5º Primaria" },
                        { value: "6º Primaria", label: "6º Primaria" },
                    ]}
                />
                <FormField
                    label="Descripción"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    textarea
                />

                <div className="flex gap-4 mt-6">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 rounded-lg font-bold transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold transition-colors disabled:opacity-50"
                    >
                        {loading ? "Creando..." : "Crear Aula"}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
