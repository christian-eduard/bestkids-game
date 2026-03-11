"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, CheckCircle2, Circle, GripVertical, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface VisualExerciseFormProps {
    type: string;
    content: any;
    answer: any;
    onChange: (content: any, answer: any) => void;
}

export default function VisualExerciseForm({ type, content, answer, onChange }: VisualExerciseFormProps) {
    const [localContent, setLocalContent] = useState<any>(content || {});
    const [localAnswer, setLocalAnswer] = useState<any>(answer || {});

    useEffect(() => {
        if (Object.keys(localContent).length === 0) {
            handleTypeReset(type);
        }
    }, [type]);

    const handleTypeReset = (newType: string) => {
        let newContent: any = { question: "" };
        let newAnswer: any = { correctAnswer: null };

        switch (newType) {
            case 'multiple_choice':
                newContent = { question: "", options: [{ id: 1, text: "Opción A" }, { id: 2, text: "Opción B" }] };
                newAnswer = { correctOptionId: 1 };
                break;
            case 'true_false':
                newContent = { question: "" };
                newAnswer = { correctAnswer: true };
                break;
            case 'matching':
                newContent = { question: "Une los elementos", pairs: [{ id: 1, left: "A", right: "1" }] };
                newAnswer = { correctPairs: { "1": "1" } };
                break;
            case 'drag_drop':
                newContent = { question: "Ordena los elementos", items: ["Elemento 1", "Elemento 2"], zones: ["Zona 1", "Zona 2"] };
                newAnswer = { correctOrder: [0, 1] };
                break;
            case 'sequence':
                newContent = { question: "Ordena la secuencia", items: [{ id: 1, text: "Paso 1" }, { id: 2, text: "Paso 2" }] };
                newAnswer = { correctOrder: [1, 2] };
                break;
            case 'fill_blanks':
                newContent = { question: "Completa los espacios", sentence: "El ___ es grande", blanks: [{ id: 1, correctAnswer: "sol" }] };
                newAnswer = { answers: ["sol"] };
                break;
            case 'multi_select':
                newContent = { question: "Selecciona todas las correctas", options: [{ id: 1, text: "Opción A", isCorrect: true }, { id: 2, text: "Opción B", isCorrect: false }] };
                newAnswer = { correctIds: [1] };
                break;
        }
        setLocalContent(newContent);
        setLocalAnswer(newAnswer);
        onChange(newContent, newAnswer);
    };

    const updateContent = (fields: any) => {
        const next = { ...localContent, ...fields };
        setLocalContent(next);
        onChange(next, localAnswer);
    };

    const updateAnswer = (fields: any) => {
        const next = { ...localAnswer, ...fields };
        setLocalAnswer(next);
        onChange(localContent, next);
    };

    // ========== MULTIPLE CHOICE ==========
    if (type === 'multiple_choice') {
        const options = localContent.options || [];
        return (
            <div className="space-y-6">
                <div>
                    <Label className="text-white">Pregunta</Label>
                    <Input className="bg-slate-800 border-slate-700 text-white mt-1" value={localContent.question} onChange={e => updateContent({ question: e.target.value })} placeholder="Escribe la pregunta..." />
                </div>
                <div className="space-y-4">
                    <Label className="text-white flex justify-between items-center">
                        Opciones
                        <Button variant="outline" size="sm" onClick={() => {
                            const newId = options.length > 0 ? Math.max(...options.map((o: any) => o.id)) + 1 : 1;
                            updateContent({ options: [...options, { id: newId, text: `Opción ${newId}` }] });
                        }} className="h-8 border-dashed"><Plus className="w-4 h-4 mr-2" /> Añadir</Button>
                    </Label>
                    {options.map((opt: any, idx: number) => (
                        <div key={opt.id} className="flex items-center gap-3 bg-slate-800/50 p-3 rounded-xl border border-slate-700">
                            <div className={`cursor-pointer ${localAnswer.correctOptionId === opt.id ? 'text-emerald-500' : 'text-slate-500'}`} onClick={() => updateAnswer({ correctOptionId: opt.id })}>
                                {localAnswer.correctOptionId === opt.id ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                            </div>
                            <Input className="bg-transparent border-none text-white focus-visible:ring-0 p-0 h-auto" value={opt.text} onChange={e => {
                                const nextOpts = [...options]; nextOpts[idx] = { ...opt, text: e.target.value }; updateContent({ options: nextOpts });
                            }} />
                            {options.length > 2 && <Button variant="ghost" size="icon" className="text-slate-500 hover:text-rose-500" onClick={() => {
                                const nextOpts = options.filter((o: any) => o.id !== opt.id); updateContent({ options: nextOpts });
                                if (localAnswer.correctOptionId === opt.id) updateAnswer({ correctOptionId: nextOpts[0]?.id });
                            }}><Trash2 className="w-4 h-4" /></Button>}
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // ========== TRUE/FALSE ==========
    if (type === 'true_false') {
        return (
            <div className="space-y-6">
                <div>
                    <Label className="text-white">Pregunta</Label>
                    <Input className="bg-slate-800 border-slate-700 text-white mt-1" value={localContent.question} onChange={e => updateContent({ question: e.target.value })} placeholder="¿El enunciado es verdadero?" />
                </div>
                <div className="space-y-4">
                    <Label className="text-white">Respuesta Correcta</Label>
                    <div className="flex gap-4">
                        <div className={`flex-1 flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer ${localAnswer.correctAnswer === true ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500' : 'bg-slate-800 border-slate-700 text-white'}`} onClick={() => updateAnswer({ correctAnswer: true })}>
                            <Label className="font-black cursor-pointer">VERDADERO</Label>
                            {localAnswer.correctAnswer === true && <CheckCircle2 className="w-5 h-5" />}
                        </div>
                        <div className={`flex-1 flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer ${localAnswer.correctAnswer === false ? 'bg-rose-500/10 border-rose-500 text-rose-500' : 'bg-slate-800 border-slate-700 text-white'}`} onClick={() => updateAnswer({ correctAnswer: false })}>
                            <Label className="font-black cursor-pointer">FALSO</Label>
                            {localAnswer.correctAnswer === false && <CheckCircle2 className="w-5 h-5" />}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ========== MATCHING ==========
    if (type === 'matching') {
        const pairs = localContent.pairs || [];
        return (
            <div className="space-y-6">
                <div>
                    <Label className="text-white">Instrucción</Label>
                    <Input className="bg-slate-800 border-slate-700 text-white mt-1" value={localContent.question} onChange={e => updateContent({ question: e.target.value })} placeholder="Une cada elemento..." />
                </div>
                <div className="space-y-4">
                    <Label className="text-white flex justify-between items-center">
                        Pares a unir
                        <Button variant="outline" size="sm" onClick={() => {
                            const newId = pairs.length > 0 ? Math.max(...pairs.map((p: any) => p.id)) + 1 : 1;
                            updateContent({ pairs: [...pairs, { id: newId, left: `Izq ${newId}`, right: `Der ${newId}` }] });
                        }} className="h-8 border-dashed"><Plus className="w-4 h-4 mr-2" /> Añadir Par</Button>
                    </Label>
                    {pairs.map((pair: any, idx: number) => (
                        <div key={pair.id} className="flex items-center gap-3 bg-slate-800/50 p-3 rounded-xl border border-slate-700">
                            <Input className="bg-slate-700 border-none text-white rounded-lg flex-1" value={pair.left} onChange={e => {
                                const next = [...pairs]; next[idx] = { ...pair, left: e.target.value }; updateContent({ pairs: next });
                            }} placeholder="Izquierda" />
                            <ArrowRight className="w-5 h-5 text-blue-400 shrink-0" />
                            <Input className="bg-slate-700 border-none text-white rounded-lg flex-1" value={pair.right} onChange={e => {
                                const next = [...pairs]; next[idx] = { ...pair, right: e.target.value }; updateContent({ pairs: next });
                            }} placeholder="Derecha" />
                            {pairs.length > 1 && <Button variant="ghost" size="icon" className="text-slate-500 hover:text-rose-500" onClick={() => {
                                updateContent({ pairs: pairs.filter((p: any) => p.id !== pair.id) });
                            }}><Trash2 className="w-4 h-4" /></Button>}
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // ========== SEQUENCE ==========
    if (type === 'sequence') {
        const items = localContent.items || [];
        return (
            <div className="space-y-6">
                <div>
                    <Label className="text-white">Instrucción</Label>
                    <Input className="bg-slate-800 border-slate-700 text-white mt-1" value={localContent.question} onChange={e => updateContent({ question: e.target.value })} placeholder="Ordena los pasos..." />
                </div>
                <div className="space-y-4">
                    <Label className="text-white flex justify-between items-center">
                        Elementos (en orden correcto)
                        <Button variant="outline" size="sm" onClick={() => {
                            const newId = items.length > 0 ? Math.max(...items.map((i: any) => i.id)) + 1 : 1;
                            updateContent({ items: [...items, { id: newId, text: `Paso ${newId}` }] });
                            updateAnswer({ correctOrder: [...(localAnswer.correctOrder || []), newId] });
                        }} className="h-8 border-dashed"><Plus className="w-4 h-4 mr-2" /> Añadir</Button>
                    </Label>
                    {items.map((item: any, idx: number) => (
                        <div key={item.id} className="flex items-center gap-3 bg-slate-800/50 p-3 rounded-xl border border-slate-700">
                            <GripVertical className="w-5 h-5 text-slate-500" />
                            <span className="text-blue-400 font-black w-8">{idx + 1}</span>
                            <Input className="bg-transparent border-none text-white focus-visible:ring-0 flex-1" value={item.text} onChange={e => {
                                const next = [...items]; next[idx] = { ...item, text: e.target.value }; updateContent({ items: next });
                            }} />
                            {items.length > 2 && <Button variant="ghost" size="icon" className="text-slate-500 hover:text-rose-500" onClick={() => {
                                const next = items.filter((i: any) => i.id !== item.id);
                                updateContent({ items: next });
                                updateAnswer({ correctOrder: next.map((i: any) => i.id) });
                            }}><Trash2 className="w-4 h-4" /></Button>}
                        </div>
                    ))}
                    <p className="text-xs text-slate-500">💡 El orden en que añades los elementos es el orden correcto.</p>
                </div>
            </div>
        );
    }

    // ========== FILL BLANKS ==========
    if (type === 'fill_blanks') {
        const blanks = localContent.blanks || [];
        return (
            <div className="space-y-6">
                <div>
                    <Label className="text-white">Instrucción</Label>
                    <Input className="bg-slate-800 border-slate-700 text-white mt-1" value={localContent.question} onChange={e => updateContent({ question: e.target.value })} placeholder="Completa la oración..." />
                </div>
                <div>
                    <Label className="text-white">Oración con espacios (usa ___ para cada hueco)</Label>
                    <Textarea className="bg-slate-800 border-slate-700 text-white mt-1 min-h-[80px]" value={localContent.sentence} onChange={e => updateContent({ sentence: e.target.value })} placeholder="El ___ es el rey de la ___" />
                </div>
                <div className="space-y-4">
                    <Label className="text-white flex justify-between items-center">
                        Respuestas correctas (en orden)
                        <Button variant="outline" size="sm" onClick={() => {
                            const newId = blanks.length > 0 ? Math.max(...blanks.map((b: any) => b.id)) + 1 : 1;
                            updateContent({ blanks: [...blanks, { id: newId, correctAnswer: "" }] });
                        }} className="h-8 border-dashed"><Plus className="w-4 h-4 mr-2" /> Añadir</Button>
                    </Label>
                    {blanks.map((blank: any, idx: number) => (
                        <div key={blank.id} className="flex items-center gap-3 bg-slate-800/50 p-3 rounded-xl border border-slate-700">
                            <span className="text-blue-400 font-black w-8">#{idx + 1}</span>
                            <Input className="bg-slate-700 border-none text-white rounded-lg flex-1" value={blank.correctAnswer} onChange={e => {
                                const next = [...blanks]; next[idx] = { ...blank, correctAnswer: e.target.value }; updateContent({ blanks: next });
                                updateAnswer({ answers: next.map((b: any) => b.correctAnswer) });
                            }} placeholder="Respuesta correcta" />
                            {blanks.length > 1 && <Button variant="ghost" size="icon" className="text-slate-500 hover:text-rose-500" onClick={() => {
                                const next = blanks.filter((b: any) => b.id !== blank.id);
                                updateContent({ blanks: next }); updateAnswer({ answers: next.map((b: any) => b.correctAnswer) });
                            }}><Trash2 className="w-4 h-4" /></Button>}
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // ========== MULTI SELECT ==========
    if (type === 'multi_select') {
        const options = localContent.options || [];
        return (
            <div className="space-y-6">
                <div>
                    <Label className="text-white">Pregunta</Label>
                    <Input className="bg-slate-800 border-slate-700 text-white mt-1" value={localContent.question} onChange={e => updateContent({ question: e.target.value })} placeholder="Selecciona todas las correctas..." />
                </div>
                <div className="space-y-4">
                    <Label className="text-white flex justify-between items-center">
                        Opciones (marca las correctas)
                        <Button variant="outline" size="sm" onClick={() => {
                            const newId = options.length > 0 ? Math.max(...options.map((o: any) => o.id)) + 1 : 1;
                            updateContent({ options: [...options, { id: newId, text: `Opción ${newId}`, isCorrect: false }] });
                        }} className="h-8 border-dashed"><Plus className="w-4 h-4 mr-2" /> Añadir</Button>
                    </Label>
                    {options.map((opt: any, idx: number) => (
                        <div key={opt.id} className="flex items-center gap-3 bg-slate-800/50 p-3 rounded-xl border border-slate-700">
                            <div className={`cursor-pointer ${opt.isCorrect ? 'text-emerald-500' : 'text-slate-500'}`} onClick={() => {
                                const next = [...options]; next[idx] = { ...opt, isCorrect: !opt.isCorrect }; updateContent({ options: next });
                                updateAnswer({ correctIds: next.filter((o: any) => o.isCorrect).map((o: any) => o.id) });
                            }}>
                                {opt.isCorrect ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                            </div>
                            <Input className="bg-transparent border-none text-white focus-visible:ring-0 flex-1" value={opt.text} onChange={e => {
                                const next = [...options]; next[idx] = { ...opt, text: e.target.value }; updateContent({ options: next });
                            }} />
                            {options.length > 2 && <Button variant="ghost" size="icon" className="text-slate-500 hover:text-rose-500" onClick={() => {
                                const next = options.filter((o: any) => o.id !== opt.id); updateContent({ options: next });
                                updateAnswer({ correctIds: next.filter((o: any) => o.isCorrect).map((o: any) => o.id) });
                            }}><Trash2 className="w-4 h-4" /></Button>}
                        </div>
                    ))}
                    <p className="text-xs text-slate-500">💡 Puedes marcar múltiples opciones como correctas.</p>
                </div>
            </div>
        );
    }

    // ========== DRAG DROP (simplified) ==========
    if (type === 'drag_drop') {
        const items = localContent.items || [];
        return (
            <div className="space-y-6">
                <div>
                    <Label className="text-white">Instrucción</Label>
                    <Input className="bg-slate-800 border-slate-700 text-white mt-1" value={localContent.question} onChange={e => updateContent({ question: e.target.value })} placeholder="Arrastra los elementos..." />
                </div>
                <div className="space-y-4">
                    <Label className="text-white flex justify-between items-center">
                        Elementos (en orden correcto)
                        <Button variant="outline" size="sm" onClick={() => {
                            updateContent({ items: [...items, `Elemento ${items.length + 1}`] });
                            updateAnswer({ correctOrder: [...items, `Elemento ${items.length + 1}`].map((_: any, i: number) => i) });
                        }} className="h-8 border-dashed"><Plus className="w-4 h-4 mr-2" /> Añadir</Button>
                    </Label>
                    {items.map((item: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-3 bg-slate-800/50 p-3 rounded-xl border border-slate-700">
                            <GripVertical className="w-5 h-5 text-slate-500" />
                            <span className="text-blue-400 font-black w-8">{idx + 1}</span>
                            <Input className="bg-transparent border-none text-white focus-visible:ring-0 flex-1" value={item} onChange={e => {
                                const next = [...items]; next[idx] = e.target.value; updateContent({ items: next });
                            }} />
                            {items.length > 2 && <Button variant="ghost" size="icon" className="text-slate-500 hover:text-rose-500" onClick={() => {
                                const next = items.filter((_: any, i: number) => i !== idx);
                                updateContent({ items: next }); updateAnswer({ correctOrder: next.map((_: any, i: number) => i) });
                            }}><Trash2 className="w-4 h-4" /></Button>}
                        </div>
                    ))}
                    <p className="text-xs text-slate-500">💡 El orden en que añades los elementos es el orden correcto.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center h-64 border-2 border-dashed border-slate-700 rounded-3xl text-slate-500 text-center p-8 bg-slate-800/10">
            <div>
                <Label className="text-lg font-black block mb-2">Editor Visual No Disponible</Label>
                <p className="text-sm">Tipo de ejercicio no reconocido: {type}</p>
            </div>
        </div>
    );
}
