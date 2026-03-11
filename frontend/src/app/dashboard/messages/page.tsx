"use client";

import { useEffect, useState, useRef } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Loader2, MessageCircle } from "lucide-react";
import { useToast } from "@/contexts/ToastContext";

interface Message {
    id: number;
    senderId: number;
    senderName: string;
    receiverId: number;
    content: string;
    createdAt: Date;
    isRead: boolean;
}

interface Conversation {
    userId: number;
    userName: string;
    lastMessage: string;
    unreadCount: number;
}

export default function MessagesPage() {
    const { showToast } = useToast();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchConversations();
    }, []);

    useEffect(() => {
        if (selectedConversation) {
            fetchMessages(selectedConversation);
        }
    }, [selectedConversation]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const fetchConversations = async () => {
        try {
            const res = await api.get("/messages/conversations");
            setConversations(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async (userId: number) => {
        try {
            const res = await api.get(`/messages/conversation/${userId}`);
            setMessages(res.data);

            // Marcar como leídos
            await api.post(`/messages/mark-read/${userId}`);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newMessage.trim() || !selectedConversation) return;

        setSending(true);

        try {
            await api.post("/messages/send", {
                receiverId: selectedConversation,
                content: newMessage,
            });

            setNewMessage("");
            fetchMessages(selectedConversation);
            showToast("Mensaje enviado", "success");
        } catch (err: any) {
            showToast(err.response?.data?.message || "Error al enviar mensaje", "error");
        } finally {
            setSending(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-16 w-16 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-8rem)] max-w-7xl mx-auto">
            <Card className="h-full flex flex-col">
                <CardHeader>
                    <CardTitle className="text-2xl flex items-center gap-2">
                        <MessageCircle className="w-6 h-6" />
                        Mensajes
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex gap-4 p-4 overflow-hidden">
                    {/* Conversations List */}
                    <div className="w-80 border-r overflow-y-auto">
                        <div className="space-y-2">
                            {conversations.map((conv) => (
                                <button
                                    key={conv.userId}
                                    onClick={() => setSelectedConversation(conv.userId)}
                                    className={`w-full p-4 rounded-xl text-left transition-all ${selectedConversation === conv.userId
                                            ? 'bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-500'
                                            : 'hover:bg-gray-100 dark:hover:bg-gray-800 border-2 border-transparent'
                                        }`}
                                >
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold text-lg">
                                            {conv.userName.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold truncate">{conv.userName}</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                                                {conv.lastMessage}
                                            </p>
                                        </div>
                                        {conv.unreadCount > 0 && (
                                            <div className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                                                {conv.unreadCount}
                                            </div>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>

                        {conversations.length === 0 && (
                            <div className="text-center py-12">
                                <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                                <p className="text-gray-600">No hay conversaciones</p>
                            </div>
                        )}
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 flex flex-col">
                        {selectedConversation ? (
                            <>
                                {/* Messages List */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                    {messages.map((msg) => {
                                        const isOwn = msg.senderId !== selectedConversation;

                                        return (
                                            <div
                                                key={msg.id}
                                                className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div
                                                    className={`max-w-[70%] rounded-2xl px-4 py-3 ${isOwn
                                                            ? 'bg-blue-600 text-white'
                                                            : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
                                                        }`}
                                                >
                                                    <p className="text-sm font-semibold mb-1">
                                                        {msg.senderName}
                                                    </p>
                                                    <p>{msg.content}</p>
                                                    <p className="text-xs opacity-70 mt-1">
                                                        {new Date(msg.createdAt).toLocaleTimeString()}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Send Message Form */}
                                <form onSubmit={handleSendMessage} className="p-4 border-t">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            placeholder="Escribe un mensaje..."
                                            className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        />
                                        <button
                                            type="submit"
                                            disabled={sending || !newMessage.trim()}
                                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                        >
                                            {sending ? (
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                            ) : (
                                                <>
                                                    <Send className="w-5 h-5" />
                                                    Enviar
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </>
                        ) : (
                            <div className="flex-1 flex items-center justify-center">
                                <div className="text-center">
                                    <MessageCircle className="w-20 h-20 mx-auto mb-4 text-gray-400" />
                                    <p className="text-xl text-gray-600 dark:text-gray-300">
                                        Selecciona una conversación
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
