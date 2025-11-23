# 🔧 Extension Guide - Scaling NutriCoach Pro

## 📝 Tutorial: Añadir un Nuevo Suplemento (5 minutos)

### **Ejemplo: Añadir "Vitamina K2"**

#### **Paso 1: Editar supplements-db.json**

```json
{
  "id": "vitamina-k2",
  "name": "Vitamina K2 (MK-7)",
  "dosage": "100-200mcg/día",
  "timing": "Con comida que contenga grasa",
  "tags": ["huesos", "cardiovascular", "senior", "general"],
  "profiles": ["senior", "activo", "deportista"],
  "benefits": "Dirige el calcio a los huesos y dientes, previene calcificación arterial. Sinergiza con vitamina D3 para salud ósea óptima.",
  "warnings": "Consultar si tomas anticoagulantes. Mejor forma MK-7 (mayor biodisponibilidad).",
  "interactions": ["anticoagulantes"]
}
```

#### **Paso 2: Actualizar metadata (opcional)**

```json
"tags_available": [
  ...,
  "cardiovascular"  // Si es un tag nuevo
]
```

#### **Paso 3: Actualizar extractTagsFromNeeds() (si añadiste tags nuevos)**

```javascript
const tagMap = {
  // ... tags existentes
  'corazon': ['corazon', 'cardiovascular', 'omega'],
  'arterias': ['cardiovascular', 'corazon'],
  // ... resto
};
```

#### **¡Listo!** 

El sistema automáticamente:
- ✅ Incluirá K2 en búsquedas RAG
- ✅ Lo puntuará según relevancia
- ✅ Lo considerará en análisis de interacciones
- ✅ Lo mostrará en recomendaciones si aplica

---

## 🧪 Tutorial: Crear un Nuevo Tag Category (10 minutos)

### **Ejemplo: Añadir categoría "Hormonas Femeninas"**

#### **1. Definir los tags**

```json
// En supplements-db.json > metadata
"tags_available": [
  ...,
  "hormonas-mujer",
  "ciclo-menstrual",
  "menopausia"
]
```

#### **2. Añadir suplementos relevantes**

```json
{
  "id": "vitex",
  "name": "Vitex (Sauzgatillo)",
  "dosage": "400mg/día",
  "timing": "Mañana en ayunas",
  "tags": ["hormonas-mujer", "ciclo-menstrual", "estres"],
  "profiles": ["mujer", "activo"],
  "benefits": "Regula ciclo menstrual, reduce SPM, balancea progesterona naturalmente.",
  "warnings": "Evitar si tomas anticonceptivos hormonales o durante embarazo.",
  "interactions": ["anticonceptivos", "hormonas"]
},
{
  "id": "sage-extract",
  "name": "Extracto de Salvia",
  "dosage": "300-600mg/día",
  "timing": "Mañana y noche",
  "tags": ["hormonas-mujer", "menopausia", "sueno"],
  "profiles": ["mujer", "senior"],
  "benefits": "Reduce sofocos, mejora sueño durante menopausia, efecto estrogénico leve.",
  "warnings": "No usar con terapia hormonal sin supervisión médica.",
  "interactions": ["hormonas"]
}
```

#### **3. Actualizar keyword extraction**

```javascript
// En extractTagsFromNeeds()
const tagMap = {
  // ... existentes
  'menstruacion': ['hormonas-mujer', 'ciclo-menstrual'],
  'regla': ['hormonas-mujer', 'ciclo-menstrual'],
  'spm': ['hormonas-mujer', 'ciclo-menstrual', 'estres'],
  'menopausia': ['hormonas-mujer', 'menopausia', 'senior'],
  'sofocos': ['hormonas-mujer', 'menopausia']
};
```

#### **4. Test**

Usuario: "Tengo 52 años y sufro de sofocos"  
→ Tags: `["hormonas-mujer", "menopausia", "senior"]`  
→ Top match: **Extracto de Salvia**

---

## 🎯 Tutorial: Mejorar un Prompt (A/B Testing)

### **Ejemplo: Optimizar Phase 4 (Analysis)**

#### **Versión Original (v2.1)**

```javascript
const prompt = `Eres un experto en suplementación. Analiza este perfil...

TAREA:
1. Selecciona los 3-5 suplementos MÁS importantes
2. Explica brevemente POR QUÉ
3. Detecta posibles interacciones

Responde SOLO con JSON...`;
```

#### **Versión Mejorada (v2.2-CoT)**

```javascript
const prompt = `Eres un experto en suplementación. Analiza este perfil usando razonamiento paso a paso.

PERFIL: ${JSON.stringify(userProfile)}
SUPLEMENTOS: ${JSON.stringify(matchedSupplements)}

PIENSA PASO A PASO:

Paso 1: PRIORIZACIÓN
- ¿Cuál es el objetivo #1 del usuario?
- ¿Qué suplementos impactan directamente ese objetivo?
- Ordena por: impacto esperado > seguridad > costo-efectividad

Paso 2: SINERGIA
- ¿Hay combinaciones que se potencian? (ej: D3+K2, cafeína+teanina)
- ¿Hay redundancias? (ej: multi + individuales)

Paso 3: SAFETY
- ¿Usuario mencionó medicación?
- ¿Hay interacciones conocidas?
- ¿Edad/género afectan dosis?

Paso 4: PRACTICIDAD
- ¿Cuántas píldoras/día es razonable?
- ¿Timing compatible con estilo de vida?

AHORA RESPONDE con JSON:
{
  "selected": ["id1", "id2", "id3"],
  "reasoning": {
    "id1": "razón basada en análisis anterior",
    ...
  },
  "synergies": ["D3+K2 mejoran absorción mutua"],
  "safety_flags": [],
  "confidence": 0-100,
  "step_by_step_summary": "resumen del razonamiento"
}`;
```

#### **Cómo Comparar:**

```javascript
// Trackear metrics por versión
const metrics_v21 = {
  avg_confidence: 88,
  safety_accuracy: 92,
  user_satisfaction: 4.2/5
};

const metrics_v22 = {
  avg_confidence: 94,  // +6%
  safety_accuracy: 98, // +6%
  user_satisfaction: 4.6/5 // +9%
};

// v2.2 gana! 🎉
setPromptVersion('v2.2-CoT');
```

---

## 🌐 Tutorial: Integrar Embeddings Reales (30 min)

### **Setup Cohere (Gratis)**

#### **1. Obtener API Key**
```bash
# Registro en https://cohere.ai
# Free tier: 1,000 calls/month
export COHERE_API_KEY="tu_key_aqui"
```

#### **2. Pre-computar Embeddings**

```javascript
// Script para embeddings (run once)
const computeEmbeddings = async () => {
  const embeddings = [];
  
  for (const supp of SUPPLEMENTS_DB.supplements) {
    const text = `${supp.name}. ${supp.benefits}. Tags: ${supp.tags.join(', ')}`;
    
    const response = await fetch('https://api.cohere.ai/v1/embed', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${COHERE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        texts: [text],
        model: 'embed-multilingual-v3.0',
        input_type: 'search_document'
      })
    });
    
    const data = await response.json();
    embeddings.push({
      id: supp.id,
      embedding: data.embeddings[0]
    });
  }
  
  // Guardar en supplements-embeddings.json
  return embeddings;
};
```

#### **3. Implementar Semantic Search**

```javascript
const searchSupplementsSemantic = async (userQuery) => {
  // 1. Embed user query
  const queryResponse = await fetch('https://api.cohere.ai/v1/embed', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${COHERE_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      texts: [userQuery],
      model: 'embed-multilingual-v3.0',
      input_type: 'search_query'
    })
  });
  
  const queryData = await queryResponse.json();
  const queryEmbedding = queryData.embeddings[0];
  
  // 2. Calcular cosine similarity
  const cosineSimilarity = (a, b) => {
    const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    return dotProduct / (magA * magB);
  };
  
  // 3. Score supplements
  const scored = supplementEmbeddings.map(({ id, embedding }) => ({
    id,
    similarity: cosineSimilarity(queryEmbedding, embedding)
  }));
  
  // 4. Return top matches
  return scored
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 5)
    .map(({ id }) => SUPPLEMENTS_DB.supplements.find(s => s.id === id));
};
```

#### **4. Comparar con Tag-Based**

```javascript
// Hybrid approach (mejor de ambos mundos)
const hybridSearch = async (userProfile) => {
  const tagResults = searchSupplements(userProfile); // Tag-based
  const semanticResults = await searchSupplementsSemantic(
    `${userProfile.goal} ${userProfile.profile} ${userProfile.additionalInfo}`
  );
  
  // Merge y re-rank
  const combined = [...new Set([...tagResults, ...semanticResults])];
  return combined.slice(0, 5);
};
```

---

## 🔐 Tutorial: Añadir Safety Checks Avanzados

### **Ejemplo: Detector de Embarazo/Lactancia**

```javascript
// En Phase 2, añadir pregunta específica
const detectPregnancy = (userMessage) => {
  const keywords = ['embarazada', 'embarazo', 'lactando', 'amamantando', 'bebe'];
  return keywords.some(kw => userMessage.toLowerCase().includes(kw));
};

// En Phase 4, filtrar suplementos unsafe
const PREGNANCY_UNSAFE = [
  'ashwagandha',
  'vitex',
  'cafeina', // dosis altas
  'melatonina' // debatible
];

if (userProfile.isPregnant) {
  recommendations = recommendations.filter(r => 
    !PREGNANCY_UNSAFE.includes(r.id)
  );
  
  metrics.safety_flags.push(
    "Usuario embarazada/lactando - suplementos filtrados por seguridad"
  );
}
```

### **Ejemplo: Detector de Interacciones Medicamentosas**

```javascript
const checkDrugInteractions = (supplements, medications) => {
  const interactions = [];
  
  supplements.forEach(supp => {
    medications.forEach(med => {
      if (supp.interactions.includes(med)) {
        interactions.push({
          supplement: supp.name,
          medication: med,
          severity: 'moderate', // en producción: lookup table
          warning: `${supp.name} puede interactuar con ${med}`
        });
      }
    });
  });
  
  return interactions;
};

// En Phase 4:
const detectedInteractions = checkDrugInteractions(
  recommendations,
  userProfile.medications || []
);

if (detectedInteractions.length > 0) {
  metrics.safety = false;
  metrics.safety_flags = detectedInteractions.map(i => i.warning);
}
```

---

## 📊 Tutorial: Implementar Analytics Dashboard

### **Ejemplo: Trackear Usage Patterns**

```javascript
// Estado adicional
const [analytics, setAnalytics] = useState({
  totalConversations: 0,
  avgTurnsToRecommendation: 0,
  mostRecommendedSupplements: {},
  avgConfidence: 0,
  safetyFlagRate: 0
});

// Al finalizar conversación
const trackConversation = () => {
  setAnalytics(prev => ({
    ...prev,
    totalConversations: prev.totalConversations + 1,
    avgTurnsToRecommendation: 
      (prev.avgTurnsToRecommendation * prev.totalConversations + messages.length) / 
      (prev.totalConversations + 1),
    avgConfidence: 
      (prev.avgConfidence * prev.totalConversations + metrics.confidence) /
      (prev.totalConversations + 1)
  }));
  
  // Incrementar contador de suplementos recomendados
  recommendations.forEach(rec => {
    setAnalytics(prev => ({
      ...prev,
      mostRecommendedSupplements: {
        ...prev.mostRecommendedSupplements,
        [rec.id]: (prev.mostRecommendedSupplements[rec.id] || 0) + 1
      }
    }));
  });
};
```

### **Visualizar en Dashboard**

```jsx
<div className="bg-white p-6 rounded-xl">
  <h3>📈 Analytics</h3>
  <div className="grid grid-cols-2 gap-4 mt-4">
    <div>
      <p className="text-sm text-gray-600">Total Conversations</p>
      <p className="text-2xl font-bold">{analytics.totalConversations}</p>
    </div>
    <div>
      <p className="text-sm text-gray-600">Avg Confidence</p>
      <p className="text-2xl font-bold">{analytics.avgConfidence.toFixed(1)}%</p>
    </div>
  </div>
  
  <h4 className="mt-4 font-bold">Top Recommended</h4>
  {Object.entries(analytics.mostRecommendedSupplements)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([id, count]) => (
      <div key={id} className="flex justify-between text-sm mt-2">
        <span>{SUPPLEMENTS_DB.supplements.find(s => s.id === id)?.name}</span>
        <span className="font-bold">{count}x</span>
      </div>
    ))}
</div>
```

---

## 🎨 Tutorial: Personalizar UI para Cliente

### **Ejemplo: Tema Ecommerce (Tienda de Nutrición)**

```jsx
// Cambiar colores brand
const BRAND_COLORS = {
  primary: 'emerald', // default
  // Para cliente fitness:
  // primary: 'orange'
  // Para cliente salud mental:
  // primary: 'purple'
};

// Añadir CTAs de compra
{phase === 5 && (
  <div className="mt-6 bg-gradient-to-r from-emerald-500 to-blue-500 p-6 rounded-xl text-white">
    <h3 className="text-xl font-bold mb-4">💰 Tu Stack Completo</h3>
    {recommendations.map(rec => (
      <div key={rec.id} className="flex justify-between items-center bg-white/20 p-3 rounded-lg mb-2">
        <span>{rec.name}</span>
        <button className="bg-white text-emerald-600 px-4 py-2 rounded-lg font-bold hover:bg-emerald-50">
          Añadir al carrito
        </button>
      </div>
    ))}
    
    <div className="mt-4 pt-4 border-t border-white/30">
      <div className="flex justify-between text-lg font-bold">
        <span>Total estimado:</span>
        <span>€89.99/mes</span>
      </div>
      <button className="w-full mt-4 bg-white text-emerald-600 py-3 rounded-lg font-bold text-lg hover:bg-emerald-50">
        Comprar Stack Completo
      </button>
    </div>
  </div>
)}
```

---

## 🌍 Tutorial: Soporte Multi-idioma

### **Ejemplo: Español + Inglés**

```javascript
// i18n config
const TRANSLATIONS = {
  es: {
    title: "NutriCoach Pro",
    subtitle: "Asistente de Suplementación IA",
    phase1: "Clasificación de Intención",
    phase2: "Preguntas Profundas",
    // ... resto
  },
  en: {
    title: "NutriCoach Pro",
    subtitle: "AI Supplement Advisor",
    phase1: "Intent Classification",
    phase2: "Deep Dive Questions",
    // ... resto
  }
};

// Estado
const [language, setLanguage] = useState('es');

// Uso
<h1>{TRANSLATIONS[language].title}</h1>

// Prompts también traducidos
const getPrompt = (phase, lang) => {
  if (lang === 'en') {
    return `You are an expert in supplementation...`;
  } else {
    return `Eres un experto en suplementación...`;
  }
};
```

---

## 🚀 Next Steps: Production Deployment

### **1. Backend (FastAPI)**

```python
# main.py
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class UserProfile(BaseModel):
    goal: str
    profile: str
    age_group: str

@app.post("/api/analyze")
async def analyze_profile(profile: UserProfile):
    # Llamar a Claude
    # Ejecutar RAG
    # Retornar recomendaciones
    pass
```

### **2. Database (PostgreSQL + pgvector)**

```sql
CREATE EXTENSION vector;

CREATE TABLE supplements (
  id TEXT PRIMARY KEY,
  name TEXT,
  dosage TEXT,
  benefits TEXT,
  embedding vector(1024)
);

-- Búsqueda semántica
SELECT id, name, 
  1 - (embedding <=> query_embedding) as similarity
FROM supplements
ORDER BY embedding <=> query_embedding
LIMIT 5;
```

### **3. Deploy (Vercel + Supabase)**

```bash
# Frontend
npm run build
vercel deploy

# Backend
# Deploy en Railway/Render/Fly.io

# DB
# Supabase (gratis para MVP)
```

---

**¡Con estas guías puedes extender NutriCoach Pro infinitamente! 🚀**
