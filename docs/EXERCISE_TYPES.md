# Tipos de Ejercicios - BestKids

Esta guía documenta los 7 tipos de ejercicios disponibles en la plataforma, sus estructuras de datos y cómo crearlos visualmente.

---

## 1. Opción Múltiple (`multiple_choice`)

El estudiante selecciona **una única** respuesta correcta.

### Estructura JSON
```json
{
  "content": {
    "question": "¿Cuál es la capital de España?",
    "options": [
      { "id": 1, "text": "Madrid" },
      { "id": 2, "text": "Barcelona" },
      { "id": 3, "text": "Valencia" }
    ]
  },
  "correctAnswer": {
    "correctOptionId": 1
  }
}
```

### Editor Visual
- Campo de texto para la pregunta.
- Lista de opciones con botón "Añadir".
- Click en el círculo para marcar la correcta.

---

## 2. Verdadero/Falso (`true_false`)

El estudiante indica si un enunciado es verdadero o falso.

### Estructura JSON
```json
{
  "content": {
    "question": "El sol es una estrella"
  },
  "correctAnswer": {
    "correctAnswer": true
  }
}
```

### Editor Visual
- Campo de texto para el enunciado.
- Dos botones grandes: VERDADERO / FALSO.

---

## 3. Unir Líneas (`matching`)

El estudiante conecta elementos de dos columnas.

### Estructura JSON
```json
{
  "content": {
    "question": "Une cada país con su capital",
    "pairs": [
      { "id": 1, "left": "España", "right": "Madrid" },
      { "id": 2, "left": "Francia", "right": "París" }
    ]
  },
  "correctAnswer": {
    "correctPairs": { "1": "1", "2": "2" }
  }
}
```

### Editor Visual
- Dos columnas de inputs: Izquierda ↔ Derecha.
- Botón "Añadir Par".

---

## 4. Arrastrar y Soltar (`drag_drop`)

El estudiante ordena elementos arrastrándolos.

### Estructura JSON
```json
{
  "content": {
    "question": "Ordena de menor a mayor",
    "items": ["Elefante", "Ratón", "Perro"]
  },
  "correctAnswer": {
    "correctOrder": [0, 1, 2]
  }
}
```

### Editor Visual
- Lista de elementos con grip handles.
- El orden de inserción es el orden correcto.

---

## 5. Ordenar Secuencia (`sequence`)

El estudiante ordena pasos en una secuencia lógica.

### Estructura JSON
```json
{
  "content": {
    "question": "Ordena los pasos para hacer un sandwich",
    "items": [
      { "id": 1, "text": "Untar mantequilla" },
      { "id": 2, "text": "Poner el jamón" },
      { "id": 3, "text": "Cerrar el pan" }
    ]
  },
  "correctAnswer": {
    "correctOrder": [1, 2, 3]
  }
}
```

### Editor Visual
- Lista numerada con grip handles.
- El orden visual es el orden correcto.

---

## 6. Completar Huecos (`fill_blanks`)

El estudiante rellena espacios en blanco.

### Estructura JSON
```json
{
  "content": {
    "question": "Completa la oración",
    "sentence": "El ___ es el rey de la ___",
    "blanks": [
      { "id": 1, "correctAnswer": "león" },
      { "id": 2, "correctAnswer": "selva" }
    ]
  },
  "correctAnswer": {
    "answers": ["león", "selva"]
  }
}
```

### Editor Visual
- Textarea con marcadores `___`.
- Lista de respuestas correctas en orden.

---

## 7. Selección Múltiple (`multi_select`)

El estudiante selecciona **varias** respuestas correctas.

### Estructura JSON
```json
{
  "content": {
    "question": "Selecciona todos los mamíferos",
    "options": [
      { "id": 1, "text": "Perro", "isCorrect": true },
      { "id": 2, "text": "Serpiente", "isCorrect": false },
      { "id": 3, "text": "Gato", "isCorrect": true }
    ]
  },
  "correctAnswer": {
    "correctIds": [1, 3]
  }
}
```

### Editor Visual
- Lista de opciones con checkboxes.
- Múltiples opciones pueden marcarse como correctas.
