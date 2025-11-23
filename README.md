# 🌱 NutriCoach - AI  advisor

Asistente conversacional de suplementación personalizada con IA.
Es un proyecto cuyo objetivo es recrear un flujo de chatbot completo con el que interiorizar el flujo y la terminología del prompting.

Siéntete libre de copiarlo, ampliarlo, mejorarlo, compartirlo, y enviar cualuqier feedback o crítica que consideres oportuna.
Está hecho con la ayuda de la IA, te invito a versionarlo y compartur el resultado conmigo: ireneccprogramacion@gmail.com

---

##  ¿Qué es esto?

Un chatbot inteligente que te ayuda a elegir suplementos basándose en:
- Tu objetivo (deporte, salud, sueño, pérdida de peso, etc.)
- Tu nivel de actividad física
- Tus restricciones dietéticas o medicación

**Tecnologías:**
- React + Tailwind CSS
- Fuentes modernas: Sora + Work Sans
- Claude Sonnet 4 (LLM)
- Sistema RAG (sencillo) basado en tags
- Prompt chaining en 4 fases

---

##  Cómo usarlo

Te dejo varias opciones.
En este proyecto la prioridad es el código, así que todas son simples.
Si tienes otra manera sencilla y completa que aportar, ¡no te cortes!

### **Opción 1: En Claude.ai (Sin configuración)**

1. Ve a [claude.ai](https://claude.ai)
2. Copia el contenido de `nutricoach-simple.jsx`
3. Pega en un mensaje
4. ¡Empieza a chatear!

**Ventaja:** Cero configuración, funciona inmediatamente

---

### **Opción 2: HTML Standalone (Deploy fácil)**

1. Descarga `nutricoach-standalone.html`
2. Opciones:
   - **Local:** Doble click → abre en navegador
   - **Deploy:** Arrastra a [Netlify Drop](https://app.netlify.com/drop)

**Ventaja:** No necesita servidor, solo HTML

⚠️ **Nota:** Para deploy fuera de Claude.ai necesitas tu propia [API key de Anthropic](https://console.anthropic.com)

---

### **Opción 3: Proyecto React (Desarrollo)**

```bash
# Crear proyecto
npm create vite@latest nutricoach -- --template react

# Copiar archivo
cp nutricoach-simple.jsx src/App.jsx

# Instalar dependencias
npm install lucide-react
npm install

# Desarrollar
npm run dev

# Build para producción
npm run build
```

**Ventaja:** Control total, editable, integrable

---

## 📦 Archivos del Proyecto

```
nutricoach-pro/
├── nutricoach-simple.jsx       # Versión simplificada (React)
├── nutricoach-standalone.html  # Versión todo-en-uno (HTML)
├── supplements-db.json         # Base de datos (10 suplementos)
├── README.md                   # Este archivo
├── QUICK_START.md             # Guía rápida
└── DEPLOY_GUIDE.md            # Guía de deployment
```

---

## 🧠 Qué podrías aprender con este proyecto

### **1. Prompt Engineering**
```javascript
// Fase 1: Clasificación de intención
const prompt = `Analiza esta respuesta y extrae el objetivo.
Usuario: "${userMessage}"
Responde SOLO con JSON...`;
```
→ Aprende a estructurar prompts para obtener JSON parseable

### **2. RAG (simple, pero funcional)**
```javascript
// Sistema de scoring basado en tags
if (goal.includes('deport')) tags = ['deportista', 'musculo'];
// Luego puntúa cada suplemento según coincidencia
```
→ No siempre necesitas embeddings complejos

### **3. El manejo de estado en react**
Esta parte puede ser poco intuitiva, dedica tu tiemplo a ella si vienes de otros lenguajes back
```javascript
const [phase, setPhase] = useState(1);  // Flujo conversacional
const [userProfile, setUserProfile] = useState({});  // Contexto
const [recommendations, setRecommendations] = useState([]);
```
→ Gestión de conversaciones multi-turno

### **4. Integración con APIs**
```javascript
const response = await fetch("https://api.anthropic.com/v1/messages", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ model: "claude-sonnet-4-20250514", ... })
});
```
→ Llamadas a LLMs de forma práctica

### **5. Diseño UI Moderno**
- Fuentes Google Fonts custom
- Gradientes y colores flat
- Responsive design
- Tailwind CSS utility-first

---

## 🎨 Personalización

### **Cambiar Colores**
```javascript
// Busca y reemplaza:
from-orange-400 to-pink-400  →  from-blue-400 to-purple-400
border-orange-200            →  border-blue-200
```

### **Añadir Suplementos**
Edita `supplements-db.json` (en el HTML standalone, está embebido):
```json
{
  "id": "nuevo-suplemento",
  "name": "Nombre",
  "dosage": "X mg/dia",
  "tags": ["tag1", "tag2"],
  "profiles": ["deportista"],
  "benefits": "Descripción"
}
```

### **Cambiar Fuentes**
```javascript
// En customStyles:
@import url('https://fonts.googleapis.com/css2?family=TuFuente');
```

---

## 🔐 Seguridad y API Keys

### **Para Testing:**
- Usa el artifact en Claude.ai (API key incluida)

### **Para Producción:**
1. Obtén API key en [console.anthropic.com](https://console.anthropic.com)
2. Añade al código:
```javascript
headers: {
  "x-api-key": "tu-api-key-aqui",
  "anthropic-version": "2023-06-01"
}
```

⚠️ **Importante:** No expongas API keys en frontend público. Usa Netlify Functions o un backend.

---

## 📊 Arquitectura Simplificada

```
Usuario escribe mensaje
    ↓
Fase 1: Claude extrae objetivo → JSON
    ↓
Fase 2: Pregunta seguimiento
    ↓
Fase 3: RAG busca suplementos + Claude selecciona los mejores
    ↓
Fase 4: Claude genera plan personalizado
    ↓
Usuario puede enviar por email
```

---

## 🚀 Deploy rápido

### **Netlify (30 segundos):**
1. [app.netlify.com/drop](https://app.netlify.com/drop)
2. Arrastra `nutricoach-standalone.html`
3. Listo: `https://tu-app.netlify.app`

### **Vercel:**
```bash
npm i -g vercel
vercel
```

### **GitHub Pages:**
1. Sube archivo como `index.html`
2. Settings → Pages → Enable
3. Listo: `https://tuusuario.github.io/repo`

---

## 🎓 Casos de Uso

- **Portfolio:** Demo de habilidades en LLMs y React
- **Aprendizaje:** Estudiar prompt engineering práctico
- **Prototipo:** Base para app de salud real
- **Hackathon:** Proyecto completo y funcional

---

## ⚠️ Disclaimer

Este proyecto es educativo. Las recomendaciones son orientativas y no sustituyen el consejo de un profesional de la salud. Siempre consulta con un nutricionista o médico antes de iniciar suplementación.

---

## 📝 Licencia

MIT - Úsalo como quieras, aprende, modifica, despliega.

---

**Creado con 💗 | Powered by learning sth new**
