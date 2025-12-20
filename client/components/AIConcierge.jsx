
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import { MOCK_FOODS } from '../constants.js';

const AIConcierge = ({ isOpen, onClose }) => {
  const [isActive, setIsActive] = useState(false);
  const [history, setHistory] = useState([]);
  const [isConnecting, setIsConnecting] = useState(false);

  const audioContextRef = useRef(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef(new Set());
  const sessionRef = useRef(null);

  function decode(base64) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }

  function encode(bytes) {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  async function decodeAudioData(data, ctx, sampleRate, numChannels) {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  }

  function createBlob(data) {
    const l = data.length;
    const int16 = new Int16Array(l);
    for (let i = 0; i < l; i++) {
      int16[i] = data[i] * 32768;
    }
    return {
      data: encode(new Uint8Array(int16.buffer)),
      mimeType: 'audio/pcm;rate=16000',
    };
  }

  const startSession = async () => {
    if (isActive) return;
    setIsConnecting(true);
    setHistory([]);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const inputAudioContext = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 16000 });
      const outputAudioContext = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = outputAudioContext;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const menuStr = MOCK_FOODS.map(f => `${f.name}: ${f.description}`).join('\n');

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            setIsConnecting(false);
            setIsActive(true);
            const source = inputAudioContext.createMediaStreamSource(stream);
            const scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              sessionPromise.then(session => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputAudioContext.destination);
          },
          onmessage: async (message) => {
            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio && audioContextRef.current) {
              const ctx = audioContextRef.current;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              const audioBuffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
              const source = ctx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(ctx.destination);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
            }

            if (message.serverContent?.outputTranscription) {
              const text = message.serverContent.outputTranscription.text;
              setHistory(prev => {
                const last = prev[prev.length - 1];
                if (last && last.role === 'ai') {
                  return [...prev.slice(0, -1), { role: 'ai', text: last.text + text }];
                }
                return [...prev, { role: 'ai', text }];
              });
            }
          },
          onerror: (e) => setIsActive(false),
          onclose: () => setIsActive(false),
        },
        config: {
          responseModalities: [Modality.AUDIO],
          outputAudioTranscription: {},
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
          systemInstruction: `You are a digital concierge for our Ethiopian kitchen IN-N-OUT. 
          Treat customers like friends. Start with "Selam, welcome!" 
          The Menu: ${menuStr}
          Be helpful and use a local friendly tone. Focus on the handcrafted nature of the food.`,
        },
      });

      sessionRef.current = await sessionPromise;
    } catch (error) {
      setIsConnecting(false);
    }
  };

  const stopSession = () => {
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    setIsActive(false);
  };

  useEffect(() => {
    if (!isOpen) stopSession();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-ino-clay/90 backdrop-blur-sm md:p-6">
      <div className="bg-white dark:bg-gray-950 w-full md:max-w-lg h-full md:h-[600px] md:rounded-3xl shadow-2xl overflow-hidden flex flex-col relative transition-all">
        <div className="p-6 border-b border-ino-clay/5 flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-ino-clay rounded-full flex items-center justify-center text-white">
               <i className="ph-fill ph-user-circle text-2xl"></i>
             </div>
             <div>
                <h3 className="text-lg font-black uppercase text-gray-950 dark:text-white tracking-tighter leading-none">Digital Concierge</h3>
                <span className="text-[9px] font-black text-green-500 uppercase tracking-widest">Active Hub</span>
             </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 bg-ino-cream dark:bg-white/5 rounded-full flex items-center justify-center text-ino-clay">
            <i className="ph ph-x text-xl"></i>
          </button>
        </div>

        <div className="flex-grow p-6 flex flex-col justify-center text-center">
          {!isActive && !isConnecting ? (
            <div className="space-y-6">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight uppercase">Selam! Welcome</h2>
              <p className="text-sm text-gray-500 max-w-xs mx-auto font-medium">I can help you find your perfect meal today. Simply use your voice to browse the neighborhood catalog.</p>
              <button onClick={startSession} className="px-10 py-4 bg-ino-red text-white rounded-xl font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all">Start Voice Session</button>
            </div>
          ) : isConnecting ? (
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin w-10 h-10 border-t-2 border-ino-clay rounded-full"></div>
              <p className="text-ino-clay font-black uppercase tracking-widest text-[9px]">Establishing Secure Link...</p>
            </div>
          ) : (
            <div className="h-full flex flex-col">
               <div className="flex-grow overflow-y-auto space-y-4 text-left p-2 scrollbar-hide">
                {history.length === 0 && <p className="text-center text-gray-400 italic text-sm py-10">Listening for your request...</p>}
                {history.map((h, i) => (
                  <div key={i} className="animate-in fade-in slide-in-from-bottom-2">
                    <div className="max-w-[85%] p-4 rounded-2xl text-xs font-medium bg-ino-cream dark:bg-white/5 text-gray-800 dark:text-gray-100 rounded-tl-none border border-ino-clay/5">
                      {h.text}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-auto py-6 flex flex-col items-center border-t border-ino-clay/5">
                 <button onClick={stopSession} className="w-16 h-16 bg-ino-red rounded-full flex items-center justify-center text-white shadow-xl active:scale-90 border-4 border-white"><i className="ph-fill ph-microphone-slash text-2xl"></i></button>
                 <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-4">Tap to end session</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIConcierge;
