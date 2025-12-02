import { GoogleGenAI, Type } from "@google/genai";
import { SecurityLog, AiAnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

// Helper to simulate a delay for better UX
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const analyzeSecurityLogs = async (logs: SecurityLog[]): Promise<AiAnalysisResult> => {
  if (!process.env.API_KEY) {
    // Return a mock response if no API key is present for demo purposes
    await delay(1500);
    return {
      threatLevel: 'MEDIUM',
      summary: "API Key manquante. Mode simulation activé. Plusieurs tentatives de connexion échouées détectées sur le port SSH.",
      recommendations: [
        "Vérifier la configuration de la clé API.",
        "Bloquer l'IP source 192.168.1.105 temporairement.",
        "Activer l'authentification à deux facteurs."
      ],
      affectedProtocols: ["SSH", "TCP"]
    };
  }

  const logData = JSON.stringify(logs.slice(0, 20)); // Analyze last 20 logs

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are a Cybersecurity AI Expert analyzing IoT Gateway logs. 
      Analyze the following JSON logs and provide a security assessment.
      
      Logs:
      ${logData}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            threatLevel: { type: Type.STRING, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] },
            summary: { type: Type.STRING },
            recommendations: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            affectedProtocols: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as AiAnalysisResult;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return {
      threatLevel: 'LOW',
      summary: "Erreur lors de l'analyse IA. Veuillez vérifier votre connexion ou votre clé API.",
      recommendations: ["Consulter les logs manuellement."],
      affectedProtocols: []
    };
  }
};

export const generateOptimizationTips = async (stats: any): Promise<string> => {
   if (!process.env.API_KEY) return "Mode démo: Optimisez le cache et réduisez la fréquence de polling des capteurs.";

   try {
     const response = await ai.models.generateContent({
       model: "gemini-2.5-flash",
       contents: `Given these IoT Gateway stats: ${JSON.stringify(stats)}, suggest 1 concise performance optimization tip in French.`,
     });
     return response.text || "Aucune suggestion disponible.";
   } catch (e) {
     return "Impossible de générer des conseils pour le moment.";
   }
};
