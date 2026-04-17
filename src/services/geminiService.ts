import { GoogleGenAI } from "@google/genai";
import { MENU_PRODUCTS } from "../types";

const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

const SYSTEM_PROMPT = `
Eres "Saborín", el asistente virtual experto de "Pollería El Sabor Dorado" en Abancay, Perú. 
Tu objetivo es ayudar a los clientes a elegir el mejor pollo a la brasa y guiarles hacia la compra por WhatsApp.

DETALLES DEL MENÚ:
${JSON.stringify(MENU_PRODUCTS, null, 2)}

REGLAS DE PERSONALIDAD:
1. Habla con confianza, entusiasmo y un toque abanquino/Peruano amigable (usa palabras como "casero", "buen diente", "recién salidito").
2. Si te preguntan por recomendaciones, ofrece los combos o el pollo entero si es para grupos.
3. Eres experto en las guarniciones: papas fritas crocantes y ensalada fresca.
4. Siempre menciona que el pedido se finaliza por WhatsApp.
5. Mantén tus respuestas breves (máximo 3 frases).
6. Si el usuario está listo para pedir o te pide una recomendación, incluye al final el tag [CART:ID_PRODUCTO] (ej: [CART:p1] para el 1/8 de pollo). Esto activará un botón de compra. IDs: p1,p2,p3,p4 (pollos), m1,m2,m3 (mostritos), co1,co2 (combos), b1,b2 (bebidas).

REGLAS TÉCNICAS:
- Responde siempre en formato de texto plano, sin markdown pesado.
- Sé servicial y resolutivo.
`;

export async function getGeminiResponse(userMessage: string, history: { role: 'user' | 'model', parts: [{ text: string }] }[]) {
  if (!ai) {
    return "¡Hola casero! Mi 'chip' de inteligencia no está configurado todavía (falta API Key), pero el Pollo Dorado sigue saliendo rico. ¿En qué plato puedo ayudarte?";
  }
  try {
    const model = "gemini-3-flash-preview";
    
    // We can use chat session for history
    const chat = ai.chats.create({
      model,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.7,
      },
      history: history.length > 0 ? history : [],
    });

    const result = await chat.sendMessage({
        message: userMessage,
    });
    
    return result.text || "¡Lo siento casero, me distraje con el olor del pollo! ¿Me repites?";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "¡Uy casero! Tenemos un pequeño problemita técnico, pero el pollo sigue saliendo rico. ¿Te ayudo con algo más?";
  }
}
