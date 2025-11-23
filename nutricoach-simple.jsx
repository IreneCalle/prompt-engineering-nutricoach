import React, { useState, useRef, useEffect } from 'react';
import { Send, Activity, AlertCircle, CheckCircle, Download, Zap, Brain, Shield } from 'lucide-react';

// Custom CSS for Google Fonts - Modern Style
const customStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=Work+Sans:wght@400;500;600&display=swap');
  
  .font-display {
    font-family: 'Sora', sans-serif;
    letter-spacing: -0.02em;
  }
  
  .font-body {
    font-family: 'Work Sans', sans-serif;
  }
`;

const SUPPLEMENTS = [
  {
    id: "vitamin-d3",
    name: "Vitamina D3",
    dosage: "2000-4000 UI/dia",
    timing: "Con comida",
    tags: ["huesos", "inmunidad", "energia"],
    profiles: ["sedentario", "activo", "deportista"],
    benefits: "Salud osea, inmunidad, energia"
  },
  {
    id: "omega-3",
    name: "Omega-3",
    dosage: "1000-2000mg/dia",
    timing: "Con comida",
    tags: ["corazon", "cerebro", "deportista"],
    profiles: ["sedentario", "activo", "deportista"],
    benefits: "Salud cardiovascular, cerebral"
  },
  {
    id: "magnesio",
    name: "Magnesio",
    dosage: "300-400mg/dia",
    timing: "Noche",
    tags: ["sueno", "musculos", "estres"],
    profiles: ["activo", "deportista"],
    benefits: "Relajacion muscular, sueno"
  },
  {
    id: "proteina",
    name: "Proteina Whey",
    dosage: "20-40g post-entreno",
    timing: "Post-entrenamiento",
    tags: ["musculo", "deportista"],
    profiles: ["deportista", "activo"],
    benefits: "Construccion muscular"
  },
  {
    id: "creatina",
    name: "Creatina",
    dosage: "3-5g/dia",
    timing: "Post-entrenamiento",
    tags: ["musculo", "fuerza", "deportista"],
    profiles: ["deportista", "activo"],
    benefits: "Fuerza, masa muscular"
  },
  {
    id: "vitamina-c",
    name: "Vitamina C",
    dosage: "500-1000mg/dia",
    timing: "Manana",
    tags: ["inmunidad", "general"],
    profiles: ["sedentario", "activo", "deportista"],
    benefits: "Inmunidad, antioxidante"
  },
  {
    id: "zinc",
    name: "Zinc",
    dosage: "15-30mg/dia",
    timing: "Con comida",
    tags: ["inmunidad", "general"],
    profiles: ["activo", "deportista"],
    benefits: "Sistema inmune, recuperacion"
  },
  {
    id: "cafeina",
    name: "Cafeina",
    dosage: "100-200mg",
    timing: "Pre-entreno",
    tags: ["energia", "rendimiento", "deportista"],
    profiles: ["deportista", "activo"],
    benefits: "Rendimiento, energia"
  },
  {
    id: "melatonina",
    name: "Melatonina",
    dosage: "0.5-5mg",
    timing: "30-60min antes dormir",
    tags: ["sueno", "recuperacion"],
    profiles: ["deportista", "activo"],
    benefits: "Calidad del sueno"
  },
  {
    id: "multivitaminico",
    name: "Multivitaminico",
    dosage: "1 dosis",
    timing: "Desayuno",
    tags: ["general", "base"],
    profiles: ["sedentario", "activo"],
    benefits: "Cobertura nutricional basica"
  }
];

const NutriCoach = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [phase, setPhase] = useState(1);
  const [userProfile, setUserProfile] = useState({});
  const [recommendations, setRecommendations] = useState([]);
  const [confidence, setConfidence] = useState(0);
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    setMessages([{
      role: 'assistant',
      content: 'Hola! Soy NutriCoach. Te ayudare a encontrar los mejores suplementos para ti.\n\nCual es tu objetivo principal?\n\n1. Mejorar rendimiento deportivo\n2. Salud general\n3. Mejor descanso\n4. Perdida de peso\n5. Foco mental',
      phase: 1
    }]);
  }, []);

  const searchSupplements = (profile) => {
    const goal = (profile.goal || '').toLowerCase();
    const activityLevel = profile.profile || 'activo';
    
    let tags = [];
    if (goal.includes('deport') || goal.includes('gym') || goal.includes('musculo')) {
      tags = ['deportista', 'musculo', 'fuerza', 'rendimiento'];
    } else if (goal.includes('suen') || goal.includes('descan')) {
      tags = ['sueno', 'recuperacion'];
    } else if (goal.includes('peso') || goal.includes('adelgaz')) {
      tags = ['musculo', 'energia'];
    } else if (goal.includes('foco') || goal.includes('mental')) {
      tags = ['energia', 'cerebro'];
    } else {
      tags = ['general', 'base'];
    }

    const scored = SUPPLEMENTS.map(supp => {
      let score = 0;
      tags.forEach(tag => {
        if (supp.tags.includes(tag)) score += 3;
      });
      if (supp.profiles.includes(activityLevel)) score += 2;
      if (supp.tags.includes('general')) score += 1;
      return { ...supp, score };
    });

    return scored
      .filter(s => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);
  };

  const callClaude = async (prompt) => {
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1500,
          messages: [{ role: "user", content: prompt }]
        })
      });

      if (!response.ok) {
        throw new Error('API error: ' + response.status);
      }

      const data = await response.json();
      return data.content[0].text;
    } catch (error) {
      console.error("Error:", error);
      return "Error al procesar. Intenta de nuevo.";
    }
  };

  const handlePhase1 = async (userMessage) => {
    const prompt = `Analiza esta respuesta y extrae el objetivo del usuario.

Usuario: "${userMessage}"

Responde SOLO con JSON (sin texto extra):
{"goal": "deporte/salud/sueno/peso/foco", "profile": "sedentario/activo/deportista", "next_question": "pregunta de seguimiento"}`;

    const response = await callClaude(prompt);
    
    try {
      const clean = response.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(clean);
      setUserProfile(prev => ({ ...prev, ...parsed }));
      setConfidence(70);
      setPhase(2);
      return parsed.next_question || "Cuantos dias a la semana haces ejercicio?";
    } catch (e) {
      console.error("Parse error:", e);
      setPhase(2);
      return "Cuantos dias a la semana haces ejercicio?";
    }
  };

  const handlePhase2 = async (userMessage) => {
    setUserProfile(prev => ({ ...prev, activity: userMessage }));
    setConfidence(85);
    setPhase(3);
    return "Perfecto. Alguna restriccion dietetica o medicacion actual? (o responde 'ninguna')";
  };

  const handlePhase3 = async (userMessage) => {
    setUserProfile(prev => ({ ...prev, restrictions: userMessage }));
    
    const matched = searchSupplements(userProfile);
    console.log("Matched:", matched.length);

    if (matched.length === 0) {
      const fallback = SUPPLEMENTS.filter(s => s.tags.includes('general')).slice(0, 3);
      setRecommendations(fallback);
      setConfidence(75);
      setPhase(4);
      setTimeout(() => generateFinalPlan(fallback), 500);
      return "Generando recomendaciones...";
    }

    const simpleList = matched.map(s => `${s.id}: ${s.name} - ${s.benefits}`).join('\n');
    
    const prompt = `Selecciona los 3-5 mejores suplementos para este perfil:

PERFIL:
- Objetivo: ${userProfile.goal}
- Actividad: ${userProfile.activity}
- Restricciones: ${userProfile.restrictions}

OPCIONES:
${simpleList}

Responde SOLO con los IDs separados por comas (ej: vitamin-d3,omega-3,magnesio)`;

    const response = await callClaude(prompt);
    console.log("Claude response:", response);

    const selectedIds = response
      .replace(/```/g, '')
      .split(',')
      .map(id => id.trim())
      .filter(id => id);

    console.log("Selected IDs:", selectedIds);

    let finalRecs = matched.filter(s => selectedIds.includes(s.id));
    
    if (finalRecs.length === 0) {
      console.log("No matches, using top 3");
      finalRecs = matched.slice(0, 3);
    }

    console.log("Final recs:", finalRecs.length);

    setRecommendations(finalRecs);
    setConfidence(90);
    setPhase(4);
    
    setTimeout(() => generateFinalPlan(finalRecs), 500);
    
    return "Perfecto! Generando tu plan personalizado...";
  };

  const generateFinalPlan = async (recs) => {
    if (!recs || recs.length === 0) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'No pude generar recomendaciones. Intenta de nuevo.',
        phase: 4
      }]);
      return;
    }

    const recsList = recs.map(r => `- ${r.name}: ${r.dosage} (${r.timing})`).join('\n');

    const prompt = `Crea un plan breve de suplementacion:

PERFIL: ${JSON.stringify(userProfile)}

SUPLEMENTOS:
${recsList}

Formato:
### Tu Stack Personalizado
[intro breve]

**Manana:**
- Suplemento + dosis

**Noche:**
- Suplemento + dosis

**Nota:** Consulta a un profesional antes de iniciar.`;

    const response = await callClaude(prompt);
    setConfidence(95);
    
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: response,
      phase: 4,
      isRecommendation: true
    }]);
  };

  const sendEmail = () => {
    if (!email.includes('@')) {
      alert('Por favor ingresa un email valido');
      return;
    }

    // Simulated email sending
    const planText = messages
      .filter(m => m.isRecommendation)
      .map(m => m.content)
      .join('\n\n');

    const recsList = recommendations
      .map(r => `${r.name}: ${r.dosage} (${r.timing})`)
      .join('\n');

    const fullPlan = `Tu Plan NutriCoach:\n\n${planText}\n\nSuplementos:\n${recsList}`;

    // In a real app, you'd call an API here
    console.log('Sending to:', email);
    console.log('Content:', fullPlan);

    // Create a mailto link as fallback
    const subject = encodeURIComponent('Mi Plan NutriCoach');
    const body = encodeURIComponent(fullPlan);
    window.open(`mailto:${email}?subject=${subject}&body=${body}`);

    setEmailSent(true);
    setTimeout(() => setEmailSent(false), 3000);
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input, phase };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    let response;
    try {
      if (phase === 1) {
        response = await handlePhase1(input);
      } else if (phase === 2) {
        response = await handlePhase2(input);
      } else if (phase === 3) {
        response = await handlePhase3(input);
      }

      if (response) {
        setMessages(prev => [...prev, { role: 'assistant', content: response, phase }]);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Error. Intenta de nuevo.', 
        phase 
      }]);
    }

    setLoading(false);
  };

  return (
    <>
      <style>{customStyles}</style>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-orange-100 p-4 font-body">
      <div className="max-w-6xl mx-auto">
        <div className="bg-gradient-to-r from-pink-100 via-orange-50 to-pink-100 rounded-3xl shadow-lg p-8 mb-6 border-4 border-orange-200">
          <div className="flex items-center gap-4">
            <div className="text-6xl">🌱</div>
            <div>
              <h1 className="text-5xl font-display font-black text-gray-900 tracking-tight">NutriCoach Pro ✨</h1>
              <p className="text-gray-700 text-lg font-medium mt-1">Tu asistente de suplementacion personalizada</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-orange-200">
            <p className="text-sm text-gray-600 font-medium text-center">
              ⚠️ Recuerda consultar siempre con un profesional sanitario o nutricionista especializado.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl flex flex-col h-[600px] border-4 border-orange-100">
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-3xl px-5 py-4 ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-orange-400 to-pink-400 text-white shadow-lg'
                        : msg.isRecommendation
                        ? 'bg-gradient-to-r from-orange-50 to-pink-50 border-3 border-orange-300 text-gray-900 shadow-md'
                        : 'bg-orange-50 text-gray-900'
                    }`}
                  >
                    <div className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</div>
                    {msg.phase && msg.role === 'assistant' && (
                      <div className="text-xs mt-2 opacity-70 font-medium">
                        Fase {msg.phase}/4 🎯
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-orange-50 rounded-3xl px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}} />
                      <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="p-4 border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Escribe tu respuesta..."
                  className="flex-1 px-4 py-3 border-2 border-orange-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                  disabled={loading || phase >= 5}
                />
                <button
                  onClick={handleSend}
                  disabled={loading || phase >= 5}
                  className="bg-gradient-to-r from-orange-400 to-pink-400 text-white p-3 rounded-2xl hover:from-orange-500 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-3xl shadow-xl p-6 border-4 border-orange-100">
              <h2 className="text-2xl font-display font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-2xl">📊</span>
                Metricas
              </h2>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 font-medium">Confianza</span>
                    <span className="font-bold text-orange-600">{confidence}%</span>
                  </div>
                  <div className="w-full bg-orange-100 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-orange-400 to-pink-400 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${confidence}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 font-medium">Fase</span>
                  <span className="font-bold text-gray-900">{phase}/4</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 font-medium">Suplementos</span>
                  <span className="font-bold text-gray-900">{recommendations.length}</span>
                </div>
              </div>
            </div>

            {recommendations.length > 0 && (
              <div className="bg-white rounded-3xl shadow-xl p-6 border-4 border-orange-100">
                <h2 className="text-2xl font-display font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="text-2xl">🎁</span>
                  Tu Stack
                </h2>
                <div className="space-y-2">
                  {recommendations.map((rec) => (
                    <div
                      key={rec.id}
                      className="p-3 bg-gradient-to-r from-orange-50 to-pink-50 rounded-2xl border-2 border-orange-200"
                    >
                      <div className="font-semibold text-sm text-gray-900">{rec.name}</div>
                      <div className="text-xs text-gray-600 mt-1 font-medium">{rec.dosage}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {phase >= 4 && recommendations.length > 0 && (
          <div className="bg-white rounded-3xl shadow-xl p-6 border-4 border-orange-100">
            <h2 className="text-3xl font-display font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-3xl">📧</span>
              Enviame mi plan por email
            </h2>
            <div className="flex gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="flex-1 px-4 py-3 border-2 border-orange-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-400 font-medium"
              />
              <button
                onClick={sendEmail}
                className="bg-gradient-to-r from-orange-400 to-pink-400 text-white px-6 py-3 rounded-2xl hover:from-orange-500 hover:to-pink-500 transition-all shadow-lg font-bold"
              >
                Enviar ✉️
              </button>
            </div>
            {emailSent && (
              <p className="text-green-600 mt-3 text-sm font-semibold">
                ✓ Se abrio tu cliente de email! Revisa tu bandeja de salida.
              </p>
            )}
          </div>
        )}

        <div className="mt-6 text-center text-sm text-gray-600">
          <p className="font-display font-medium text-base">Powered by learning sth new 💗</p>
        </div>
      </div>
    </div>
    </>
  );
};

export default NutriCoach;