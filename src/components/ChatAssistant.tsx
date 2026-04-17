import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, ChevronRight } from 'lucide-react';
import { ChatMessage, ChatOption, MENU_PRODUCTS, Product } from '../types';
import { getGeminiResponse } from '../services/geminiService';

interface ChatAssistantProps {
  onAddToCart: (product: Product) => void;
}

export default function ChatAssistant({ onAddToCart }: ChatAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const initialMessage: ChatMessage = {
    id: '1',
    text: '🍗 ¡Hola! Soy Saborín, tu asistente de El Sabor Dorado. ¿Qué se te antoja hoy?',
    sender: 'bot',
    options: [
      { label: '🔥 Algo económico', value: 'económico', action: 'recommend' },
      { label: '🍗 Clásico', value: 'clásico', action: 'recommend' },
      { label: '🍛 Mostrito contundente', value: 'mostrito', action: 'recommend' },
      { label: '👨‍👩‍👧‍👦 Para compartir', value: 'compartir', action: 'recommend' },
    ],
  };

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setIsTyping(true);
      setTimeout(() => {
        setMessages([initialMessage]);
        setIsTyping(false);
      }, 1000);
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const addMessage = (text: string, sender: 'bot' | 'user', options?: ChatOption[]) => {
    let cleanText = text;
    let productId: string | undefined;

    // Parse [CART:id]
    const cartMatch = text.match(/\[CART:(\w+)\]/);
    if (cartMatch) {
      productId = cartMatch[1];
      cleanText = text.replace(/\[CART:\w+\]/, '').trim();
    }

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text: cleanText,
      sender,
      options,
      productId,
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const handleOptionClick = (option: ChatOption) => {
    if (option.action === 'cart') {
      const product = MENU_PRODUCTS.find(p => p.id === option.value);
      if (product) onAddToCart(product);
      return;
    }
    addMessage(option.label, 'user');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      switch (option.value) {
        case 'económico':
          addMessage(
            '👉 Te recomiendo nuestro 1/8 de Pollo. ¡Es perfecto para matar el hambre sin gastar mucho! (S/15.00)',
            'bot',
            [{ label: '🛒 Añadir al Carrito', value: 'p1', action: 'cart' }]
          );
          break;
        case 'clásico':
          addMessage(
            '👉 ¡Lo clásico nunca falla! El 1/4 de Pollo es nuestro balance perfecto entre sabor y precio.',
            'bot',
            [{ label: '🛒 Añadir al Carrito', value: 'p2', action: 'cart' }]
          );
          break;
        case 'mostrito':
          addMessage(
            '👉 ¡Esa es la actitud! El Mostrito Clásico te servirá pollo, chaufa y papas. ¡Espectacular!',
            'bot',
            [{ label: '🛒 Añadir al Carrito', value: 'm1', action: 'cart' }]
          );
          break;
        case 'compartir':
          addMessage(
            '👉 Para el grupo, nada mejor que el Combo Familiar Dorado. Viene con gaseosa, chicha y papas grandes.',
            'bot',
            [{ label: '🛒 Añadir al Carrito', value: 'co2', action: 'cart' }]
          );
          break;
        default:
          addMessage('¿Hay algo más en lo que pueda ayudarte?', 'bot', initialMessage.options);
      }
    }, 1500);
  };

  const handleAction = (option: ChatOption) => {
    if (option.action === 'cart') {
      const product = MENU_PRODUCTS.find(p => p.id === option.value);
      if (product) onAddToCart(product);
    } else if (option.action === 'link') {
      const message = encodeURIComponent(`Hola, quiero pedir: ${option.value}`);
      window.open(`https://wa.me/${option.target}?text=${message}`, '_blank');
    } else {
      handleSendMessage(option.label);
    }
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;
    
    // Add user message
    addMessage(text, 'user');
    setInputValue('');
    setIsTyping(true);

    try {
      // Prepare history for Gemini
      const history = messages.map(m => ({
        role: m.sender === 'user' ? 'user' : 'model' as 'user' | 'model',
        parts: [{ text: m.text }]
      }));

      const botReply = await getGeminiResponse(text, history);
      setIsTyping(false);
      addMessage(botReply, 'bot');
    } catch (error) {
      console.error(error);
      setIsTyping(false);
      addMessage("¡Uy! Se me quemó el cable del internet. ¿Me repites?", 'bot');
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0, rotate: -45 }}
        animate={{ scale: 1, rotate: 0 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 right-6 sm:bottom-6 sm:right-6 z-50 w-16 h-16 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center border-4 border-white overflow-hidden"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <X size={28} />
            </motion.div>
          ) : (
            <motion.div key="chat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <MessageSquare size={28} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-44 right-6 sm:bottom-24 sm:right-6 z-50 w-[280px] h-[400px] bg-white rounded-[20px] rounded-bl-none shadow-3xl overflow-hidden flex flex-col border border-gray-100"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                   🍗
                </div>
                <div>
                  <h4 className="font-bold text-primary text-sm">Asistente Dorado</h4>
                  <p className="text-[10px] text-gray-400">En línea</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-primary">
                <X size={18} />
              </button>
            </div>

            {/* Messages Area */}
            <div ref={scrollRef} className="flex-grow overflow-y-auto p-4 space-y-4 bg-gray-50/30">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-xl text-xs ${
                    msg.sender === 'user' 
                      ? 'bg-primary text-white rounded-tr-none' 
                      : 'bg-white border border-gray-100 rounded-tl-none shadow-sm text-dark'
                  }`}>
                    {msg.text}
                  </div>
                  
                  {msg.productId && (
                    <button
                      onClick={() => {
                        const product = MENU_PRODUCTS.find(p => p.id === msg.productId);
                        if (product) onAddToCart(product);
                      }}
                      className="mt-2 bg-success text-white px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-success/20 active:scale-95 transition-all"
                    >
                      🛒 Añadir al Carrito
                    </button>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-tl-none flex gap-1 items-center">
                    <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                    <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
              )}

              {/* Bot Options */}
              {!isTyping && messages[messages.length - 1]?.sender === 'bot' && messages[messages.length - 1]?.options && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {messages[messages.length - 1].options?.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAction(opt)}
                      className="bg-white border border-secondary text-accent px-3 py-2 rounded-xl text-xs font-semibold hover:bg-secondary transition-colors flex items-center gap-1 group shadow-sm"
                    >
                      {opt.label}
                      <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputValue); }} 
              className="p-4 bg-white border-t border-gray-100 flex items-center gap-2"
            >
               <input 
                 type="text"
                 value={inputValue}
                 onChange={(e) => setInputValue(e.target.value)}
                 placeholder="Pregúntame algo..."
                 className="flex-grow h-10 bg-gray-100 rounded-full px-4 text-xs text-dark focus:outline-none focus:ring-1 focus:ring-primary/20"
               />
               <button 
                 type="submit"
                 disabled={!inputValue.trim() || isTyping}
                 className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center disabled:opacity-50 transition-all active:scale-95"
               >
                 <Send size={16} />
               </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
