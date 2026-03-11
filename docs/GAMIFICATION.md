# Sistema de Gamificación - BestKids

BestKids utiliza un sistema de gamificación completo para motivar a los estudiantes. Este documento describe todos los elementos.

---

## 1. Puntos y Niveles

### Puntos
- **Puntos Totales**: Acumulados desde el inicio.
- **Puntos Diarios**: Se reinician cada día (meta: 500).
- **Puntos Semanales/Mensuales**: Para rankings.

### Fórmula de Nivel
```
Puntos para siguiente nivel = Nivel Actual × 1000
```

| Nivel | Puntos Requeridos |
|-------|-------------------|
| 1 → 2 | 1,000 |
| 2 → 3 | 2,000 |
| 5 → 6 | 5,000 |
| 10 → 11 | 10,000 |

---

## 2. Sistema de Rachas (Streaks)

### Funcionamiento
- Entrar y completar al menos 1 ejercicio = +1 día de racha.
- Saltar un día = racha reiniciada a 0.

### Bonificación
```
Multiplicador = min(días_racha × 0.1, 0.5)
```
- 1 día = +10% puntos
- 5 días = +50% puntos (máximo)

---

## 3. Avatares

### Avatares Base (Desbloqueados)
| Avatar | Emoji | Requisitos |
|--------|-------|------------|
| Pollito | 🐥 | Gratis |
| Conejito | 🐰 | Gratis |

### Avatares Premium
| Avatar | Emoji | Puntos | Nivel |
|--------|-------|--------|-------|
| Robot B0T | 🤖 | 2,500 | 5 |
| Astronauta | 👨‍🚀 | 5,000 | 10 |
| Mago | 🧙 | 10,000 | 15 |
| Superhéroe | 🦸 | 15,000 | 20 |

---

## 4. Marcos de Perfil

Los marcos se desbloquean por puntos totales acumulados.

| Marco | Color | Puntos Mínimos |
|-------|-------|----------------|
| Novato | Gris | 0 |
| Explorador | Azul | 1,000 |
| Veterano | Púrpura | 5,000 |
| Leyenda | Dorado | 15,000 |
| BestKid Master | Rojo | 50,000 |

---

## 5. Mundos Temáticos

Los estudiantes progresan a través de mundos educativos.

| Mundo | Área | Puntos para Desbloquear |
|-------|------|------------------------|
| 🔢 Mundo de los Números | Matemáticas | 0 (inicial) |
| 📚 Reino de las Letras | Lengua | 500 |
| 🔬 Planeta Ciencias | Ciencias | 1,000 |
| 🎨 Galaxia Creativa | Arte | 1,500 |
| 🏛️ Imperio de la Historia | Sociales | 2,000 |
| 🇬🇧 Archipiélago de Inglés | Inglés | 3,000 |

---

## 6. Leaderboards

### Tipos
- **Global**: Todos los estudiantes.
- **Por Clase**: Compañeros de aula.
- **Por Centro**: Todo el colegio.

### Métricas
- Puntos totales.
- Puntos semanales.
- Ejercicios completados.
