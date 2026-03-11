'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    // Check system preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className={`min-h-screen overflow-y-auto ${darkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-slate-900' : 'bg-gradient-to-br from-indigo-50 via-white to-emerald-50'}`}>
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? (darkMode ? 'bg-gray-900/90 backdrop-blur-xl shadow-lg' : 'bg-white/90 backdrop-blur-xl shadow-lg') : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="material-symbols-outlined text-white text-xl">child_care</span>
            </div>
            <span className={`text-xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent`}>
              BestKids
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className={`${darkMode ? 'text-gray-300 hover:text-emerald-400' : 'text-gray-600 hover:text-emerald-600'} transition-colors font-medium`}>Características</a>
            <a href="#how-it-works" className={`${darkMode ? 'text-gray-300 hover:text-emerald-400' : 'text-gray-600 hover:text-emerald-600'} transition-colors font-medium`}>Cómo Funciona</a>
            <a href="#roles" className={`${darkMode ? 'text-gray-300 hover:text-emerald-400' : 'text-gray-600 hover:text-emerald-600'} transition-colors font-medium`}>Usuarios</a>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-xl transition-colors ${darkMode ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              aria-label="Toggle dark mode"
            >
              <span className="material-symbols-outlined">{darkMode ? 'light_mode' : 'dark_mode'}</span>
            </button>
            <Link
              href="/login"
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 hover:-translate-y-0.5"
            >
              Iniciar Sesión
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className={`inline-flex items-center gap-2 px-4 py-2 ${darkMode ? 'bg-emerald-900/50 text-emerald-300' : 'bg-emerald-100 text-emerald-700'} rounded-full text-sm font-medium`}>
                <span className="material-symbols-outlined text-base">verified</span>
                Plataforma Educativa Gamificada
              </div>
              <h1 className={`text-5xl lg:text-6xl font-black leading-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Aprender es{' '}
                <span className="bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 bg-clip-text text-transparent">
                  más divertido
                </span>{' '}
                con BestKids
              </h1>
              <p className={`text-xl leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Ejercicios interactivos, mundos por explorar, avatares coleccionables y un sistema de progreso que motiva a los niños a aprender mientras juegan.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/login"
                  className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold text-lg rounded-2xl hover:shadow-xl hover:shadow-emerald-500/30 transition-all duration-300 hover:-translate-y-1 flex items-center gap-2"
                >
                  <span className="material-symbols-outlined">play_arrow</span>
                  Comenzar Ahora
                </Link>
                <a
                  href="#features"
                  className={`px-8 py-4 font-bold text-lg rounded-2xl hover:shadow-lg border-2 transition-all duration-300 flex items-center gap-2 ${darkMode ? 'bg-gray-800 text-gray-200 border-gray-700 hover:border-emerald-500' : 'bg-white text-gray-700 border-gray-200 hover:border-emerald-300'}`}
                >
                  <span className="material-symbols-outlined">info</span>
                  Saber Más
                </a>
              </div>
              <div className="flex items-center gap-8 pt-4">
                <div className="flex -space-x-2">
                  {['bg-emerald-400', 'bg-cyan-400', 'bg-blue-400', 'bg-purple-400'].map((bg, i) => (
                    <div key={i} className={`w-10 h-10 ${bg} rounded-full border-3 border-white flex items-center justify-center`}>
                      <span className="material-symbols-outlined text-white text-sm">face</span>
                    </div>
                  ))}
                </div>
                <div>
                  <p className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>+500 Estudiantes</p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>ya están aprendiendo</p>
                </div>
              </div>
            </div>
            <div className="relative lg:pl-8">
              <div className="relative bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-3xl p-8 shadow-2xl shadow-emerald-500/20">
                <div className="bg-white rounded-2xl p-6 shadow-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
                      <span className="material-symbols-outlined text-white">calculate</span>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">Matemáticas</p>
                      <p className="text-sm text-gray-500">Nivel 1 · 8 ejercicios</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full w-3/4 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full"></div>
                    </div>
                    <p className="text-sm text-gray-600">75% completado · ¡Excelente progreso!</p>
                  </div>
                </div>
                {/* Floating cards */}
                <div className="absolute -top-4 -right-4 bg-white p-4 rounded-xl shadow-xl animate-bounce-slow">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-amber-500">star</span>
                    <span className="font-bold">+50 XP</span>
                  </div>
                </div>
                <div className="absolute -bottom-4 -left-4 bg-white p-4 rounded-xl shadow-xl">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-emerald-500">emoji_events</span>
                    <span className="font-bold text-sm">¡Nuevo logro!</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-emerald-100 to-cyan-100 text-emerald-700 rounded-full text-sm font-bold mb-4">
              CARACTERÍSTICAS
            </span>
            <h2 className="text-4xl font-black text-gray-900 mb-4">
              Todo lo que necesitas para aprender
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Una plataforma completa diseñada para hacer del aprendizaje una experiencia emocionante
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: 'extension', title: '7 Tipos de Ejercicios', desc: 'Selección múltiple, arrastrar y soltar, emparejar, secuencias, rellenar espacios y más.', color: 'from-violet-500 to-purple-600' },
              { icon: 'public', title: '3 Mundos Temáticos', desc: 'Explora Matemáticas, Lenguaje y Ciencias a través de mundos virtuales interactivos.', color: 'from-emerald-500 to-teal-600' },
              { icon: 'face', title: 'Avatares Coleccionables', desc: '10 avatares únicos para personalizar tu perfil. Desbloquea más mientras progresas.', color: 'from-amber-500 to-orange-600' },
              { icon: 'trending_up', title: 'Sistema de Progreso', desc: 'Gana puntos, sube de nivel y desbloquea nuevos contenidos a medida que aprendes.', color: 'from-cyan-500 to-blue-600' },
              { icon: 'family_restroom', title: 'Panel para Padres', desc: 'Monitorea el progreso de tus hijos y recibe informes detallados de su aprendizaje.', color: 'from-pink-500 to-rose-600' },
              { icon: 'school', title: 'Gestión de Centros', desc: 'Administra colegios, profesores, clases y estudiantes desde un solo lugar.', color: 'from-indigo-500 to-violet-600' },
            ].map((feature, i) => (
              <div key={i} className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                  <span className="material-symbols-outlined text-white text-2xl">{feature.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-20 px-6 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 rounded-full text-sm font-bold mb-4">
              CÓMO FUNCIONA
            </span>
            <h2 className="text-4xl font-black text-gray-900 mb-4">
              Aprender nunca fue tan fácil
            </h2>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '1', icon: 'login', title: 'Inicia Sesión', desc: 'Accede con tu cuenta de estudiante' },
              { step: '2', icon: 'face', title: 'Elige Avatar', desc: 'Personaliza tu perfil con un avatar' },
              { step: '3', icon: 'explore', title: 'Explora Mundos', desc: 'Navega por mundos temáticos' },
              { step: '4', icon: 'emoji_events', title: 'Gana Premios', desc: 'Completa ejercicios y sube de nivel' },
            ].map((item, i) => (
              <div key={i} className="text-center relative">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/20">
                  <span className="material-symbols-outlined text-white text-3xl">{item.icon}</span>
                </div>
                <div className="absolute top-8 left-1/2 w-full h-0.5 bg-gradient-to-r from-emerald-300 to-cyan-300 -z-10 hidden md:block" style={{ display: i === 3 ? 'none' : undefined }}></div>
                <span className="inline-block w-8 h-8 bg-white text-emerald-600 font-bold rounded-full mb-3 leading-8 shadow border border-emerald-200">{item.step}</span>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* User Roles */}
      <section id="roles" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full text-sm font-bold mb-4">
              PARA TODOS
            </span>
            <h2 className="text-4xl font-black text-gray-900 mb-4">
              Diseñado para cada usuario
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: 'child_care', title: 'Estudiantes', desc: 'Aprende jugando con ejercicios interactivos', color: 'from-emerald-400 to-emerald-600', bg: 'bg-emerald-50' },
              { icon: 'family_restroom', title: 'Padres', desc: 'Monitorea el progreso de tus hijos', color: 'from-purple-400 to-purple-600', bg: 'bg-purple-50' },
              { icon: 'school', title: 'Profesores', desc: 'Gestiona clases y asigna tareas', color: 'from-blue-400 to-blue-600', bg: 'bg-blue-50' },
              { icon: 'admin_panel_settings', title: 'Administradores', desc: 'Control total del sistema', color: 'from-orange-400 to-orange-600', bg: 'bg-orange-50' },
            ].map((role, i) => (
              <div key={i} className={`${role.bg} rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}>
                <div className={`w-16 h-16 bg-gradient-to-br ${role.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                  <span className="material-symbols-outlined text-white text-3xl">{role.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{role.title}</h3>
                <p className="text-gray-600">{role.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6 bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center text-white">
            {[
              { value: '30+', label: 'Ejercicios' },
              { value: '7', label: 'Tipos de Actividades' },
              { value: '3', label: 'Mundos' },
              { value: '10', label: 'Avatares' },
            ].map((stat, i) => (
              <div key={i}>
                <p className="text-5xl font-black mb-2">{stat.value}</p>
                <p className="text-lg font-medium text-white/80">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-black mb-6">
            ¿Listo para comenzar la aventura?
          </h2>
          <p className="text-xl text-gray-400 mb-10">
            Únete a cientos de estudiantes que ya están aprendiendo de forma divertida
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold text-xl rounded-2xl hover:shadow-2xl hover:shadow-emerald-500/30 transition-all duration-300 hover:-translate-y-1"
          >
            <span className="material-symbols-outlined text-2xl">rocket_launch</span>
            Acceder a BestKids
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-gray-950 text-gray-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-sm">child_care</span>
            </div>
            <span className="font-bold text-white">BestKids</span>
          </div>
          <p className="text-sm">© 2024 BestKids. Plataforma Educativa Gamificada.</p>
        </div>
      </footer>

      <style jsx>{`
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                .animate-bounce-slow {
                    animation: bounce-slow 3s ease-in-out infinite;
                }
            `}</style>
    </div>
  );
}
