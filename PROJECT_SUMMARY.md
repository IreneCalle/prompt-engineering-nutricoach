# 📦 NutriCoach Pro - Resumen del Proyecto

---

## 🎯 ¿Qué es?

**NutriCoach Pro** es un asistente conversacional que recomienda suplementos personalizados usando IA.

**Tecnologías:** React, Claude Sonnet 4, Tailwind CSS

---

## 📁 Archivos Incluidos

### **1. nutricoach-simple.jsx** (~19KB)
**Qué es:** Componente React simplificado y limpio

**Características:**
- 4 fases conversacionales
- 10 suplementos en base de datos embebida
- Sistema RAG basado en tags
- Diseño moderno (colores salmón/coral, fuentes Sora + Work Sans)
- Función de envío por email

**Cómo usar:**
- Pega en Claude.ai → funciona como artifact
- O integra en tu proyecto React

---

### **2. nutricoach-standalone.html** (~22KB)
**Qué es:** Archivo HTML completo con todo incluido

**Características:**
- React + Tailwind via CDN
- Cero configuración necesaria
- Funciona offline después de primera carga

**Cómo usar:**
- Doble click → abre en navegador
- Arrastra a Netlify Drop → deploy en 30 segundos
- Sube a cualquier hosting

---

### **3. supplements-db.json** (~12KB)
**Qué es:** Base de datos de 10 suplementos comunes

**Estructura:**
```json
{
  "id": "omega-3",
  "name": "Omega-3",
  "dosage": "1000-2000mg/dia",
  "timing": "Con comida",
  "tags": ["corazon", "cerebro"],
  "profiles": ["activo", "deportista"],
  "benefits": "Salud cardiovascular"
}
```

**Cómo extender:** Añade más objetos con la misma estructura

---

## 🚀 3 Formas de Usar

### **Opción 1: Testing Rápido (0 min setup)**
1. Abre `nutricoach-standalone.html` en tu navegador
2. Chatea con el bot
3. Listo

**Ideal para:** Probar funcionamiento, demos rápidas

---

### **Opción 2: Deploy Web (30 seg)**
1. Ve a [app.netlify.com/drop](https://app.netlify.com/drop)
2. Arrastra `nutricoach-standalone.html`
3. Obtén tu link público

**Ideal para:** Portfolio, compartir con otros

⚠️ Necesitas API key de Anthropic para uso fuera de Claude.ai

---

### **Opción 3: Desarrollo React (5 min)**
1. Crea proyecto Vite: `npm create vite@latest`
2. Copia `nutricoach-simple.jsx` a `src/App.jsx`
3. Instala dependencias: `npm install lucide-react`
4. Run: `npm run dev`

**Ideal para:** Customización, integración en proyecto mayor

---

## 🧠 Qué Aprendes con Este Código

### **Prompt Engineering:**
- Cómo estructurar prompts para obtener JSON
- Manejo de respuestas de LLMs
- Prompt chaining (secuencia de prompts)

### **RAG Simple:**
- Búsqueda por tags (sin necesidad de embeddings)
- Sistema de scoring
- Matching usuario-contenido

### **React Patterns:**
- Estado conversacional
- Manejo de fases
- Integración con APIs externas

### **UI/UX:**
- Diseño moderno sin librerías pesadas
- Tipografía custom con Google Fonts
- Colores flat y alegres

---

## 📊 Flujo de la App

```
Usuario: "Quiero mejorar en el gym"
    ↓
Fase 1: Claude extrae → objetivo: deporte, profile: activo
    ↓
Fase 2: Bot pregunta → "¿Cuantos dias entrenas?"
    ↓
Fase 3: Sistema RAG busca → encuentra proteina, creatina, omega-3
         Claude selecciona → los 3 mejores
    ↓
Fase 4: Claude genera plan → "Tu Stack Personalizado: ..."
    ↓
Usuario puede enviar plan por email
```

---

## ⚙️ Configuración Necesaria

### **Para Claude.ai:**
- ✅ Ninguna (funciona out-of-the-box)

### **Para Deploy Web:**
- ⚠️ API key de Anthropic
- Obtén en: [console.anthropic.com](https://console.anthropic.com)
- Costo: $5 crédito inicial, luego ~$0.02 por conversación

### **Para Desarrollo Local:**
```bash
npm install react react-dom lucide-react
```

---

## 🎨 Personalización Fácil

### **Cambiar Colores:**
Busca en el código:
```
from-orange-400 to-pink-400  →  tus colores
```

### **Cambiar Fuentes:**
Edita el import de Google Fonts:
```javascript
@import url('https://fonts.googleapis.com/css2?family=TuFuente');
```

### **Añadir Suplementos:**
En la constante `SUPPLEMENTS`, añade objetos con la estructura existente

---

## 📈 Stats del Proyecto

- **Líneas de código:** ~450 (versión simple)
- **Dependencias:** 3 (React, ReactDOM, Lucide)
- **Tamaño final:** 22KB (HTML standalone)
- **Tiempo de desarrollo:** ~2 horas
- **Complejidad:** Media-Baja (perfecto para aprender)

---

## 💡 Ideas para Extender

1. **Backend propio:** Netlify Functions para ocultar API key
2. **Más suplementos:** Expande la base de datos
3. **Historial:** Guarda conversaciones en localStorage
4. **Auth:** Login para usuarios recurrentes
5. **PDF Export:** Genera PDF bonito del plan
6. **Multi-idioma:** Añade inglés, francés, etc.

---

## 🎯 Casos de Uso

✅ **Portfolio de developer:** Muestra skills en React + IA  
✅ **Aprendizaje:** Estudia prompt engineering real  
✅ **Hackathon:** Base rápida para proyecto de salud  
✅ **Prototipo:** Valida idea antes de hacer app completa  
✅ **Demo:** Muestra capacidades de Claude a clientes  

---

## ⚠️ Disclaimer Legal

Este proyecto es **educativo y demostrativo**. Las recomendaciones generadas son orientativas y no sustituyen el consejo médico profesional. Siempre consulta con un nutricionista o médico antes de iniciar suplementación.

---

## 📞 Soporte

- **Issues:** Revisa el código, está comentado
- **Preguntas:** El código es simple, puedes entenderlo leyéndolo
- **Bugs:** Verifica la consola del navegador (F12)

---

**Creado con 💗 | Powered by learning sth new**
