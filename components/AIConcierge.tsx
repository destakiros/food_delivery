
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { MOCK_FOODS } from '../constants';

interface AIConciergeProps {
  isOpen: boolean;
  onClose: () => void;
}

const AIConcierge: React.FC<AIConciergeProps> = ({ isOpen, onClose }) => {
  const [isActive, setIsActive] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [history, setHistory] = useState<{ role: 'user' | 'ai'; text: string }[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef(new Set<AudioBufferSourceNode>());
  const sessionRef = useRef<any>(null);

  // Helper functions for decoding/encoding as required by Gemini Live API
  function decode(base64: string) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }

  function encode(bytes: Uint8Array) {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  async function decodeAudioData(
    data: Uint8Array,
    ctx: AudioContext,
    sampleRate: number,
    numChannels: number,
  ): Promise<AudioBuffer> {
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

  function createBlob(data: Float32Array): { data: string; mimeType: string } {
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
      const inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
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
          onmessage: async (message: LiveServerMessage) => {
            // Handle Audio Playback
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
              source.onended = () => sourcesRef.current.delete(source);
            }

            // Handle Transcriptions
            // Use inputTranscription and outputTranscription as per Gemini Live API specs for LiveServerContent message
            if (message.serverContent?.inputTranscription) {
              const text = message.serverContent.inputTranscription.text;
              setTranscription(prev => prev + text);
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

            if (message.serverContent?.turnComplete) {
              setTranscription('');
            }

            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e) => console.error("Live API Error:", e),
          onclose: () => setIsActive(false),
        },
        config: {
          responseModalities: [Modality.AUDIO],
          inputAudioTranscription: {},
          outputAudioTranscription: {},
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
          systemInstruction: `You are the FOOD-GRID Voice Concierge in Addis Ababa. 
          Help users find food from this menu:
          ${menuStr}
          Be sophisticated, helpful, and concise. Speak clearly as an elite digital sommelier.`,
        },
      });

      sessionRef.current = await sessionPromise;
    } catch (error) {
      console.error("Session failed:", error);
      setIsConnecting(false);
    }
  };

  const stopSession = () => {
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    setIsActive(false);
    setTranscription('');
  };

  useEffect(() => {
    if (isOpen) {
      // Optional: Auto-start or wait for user click
    } else {
      stopSession();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-2xl animate-in fade-in duration-500">
      <div className="bg-white dark:bg-gray-950 rounded-[4rem] w-full max-w-2xl shadow-3xl overflow-hidden border border-white/10 flex flex-col h-[700px] relative">
        <div className="absolute top-0 right-0 p-10 z-10">
          <button onClick={onClose} className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-all">
            <i className="ph ph-x text-2xl"></i>
          </button>
        </div>

        <div className="flex-grow p-12 flex flex-col items-center justify-center text-center">
          {!isActive && !isConnecting ? (
            <div className="space-y-10">
              <div className="w-32 h-32 bg-red-600 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-red-500/30">
                <i className="ph-fill ph-microphone text-5xl text-white"></i>
              </div>
              <div>
                <h2 className="text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-4">Voice <span className="text-red-600">Concierge</span></h2>
                <p className="text-gray-500 font-bold max-w-sm mx-auto">Access our elite Addis menu via real-time voice interaction. Simply speak to order.</p>
              </div>
              <button 
                onClick={startSession}
                className="px-12 py-5 bg-gray-950 dark:bg-red-600 text-white rounded-full font-black text-lg uppercase tracking-widest hover:scale-105 transition-all"
              >
                Initiate Link
              </button>
            </div>
          ) : isConnecting ? (
            <div className="flex flex-col items-center gap-6">
              <div className="animate-spin w-16 h-16 border-t-4 border-red-600 rounded-full"></div>
              <p className="text-gray-400 font-black uppercase tracking-widest text-xs">Syncing Satellite Data...</p>
            </div>
          ) : (
            <div className="w-full flex flex-col h-full">
              <div className="flex-grow overflow-y-auto space-y-6 text-left mb-8 px-4 scrollbar-hide">
                {history.map((h, i) => (
                  <div key={i} className={`flex ${h.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-6 rounded-[2rem] text-sm font-medium ${
                      h.role === 'user' ? 'bg-red-600 text-white rounded-tr-none' : 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 rounded-tl-none border border-white/5'
                    }`}>
                      {h.text}
                    </div>
                  </div>
                ))}
                {transcription && (
                  <div className="flex justify-end opacity-60">
                    <div className="max-w-[85%] p-6 rounded-[2rem] bg-red-400 text-white italic text-sm">
                      "{transcription}"
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col items-center gap-4">
                 <div className="flex items-center gap-3">
                    <div className="h-1.5 w-1.5 bg-red-600 rounded-full animate-ping"></div>
                    <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">Listening Active</span>
                 </div>
                 <button 
                    onClick={stopSession}
                    className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center text-white shadow-3xl hover:bg-red-700 transition-all border-4 border-white dark:border-gray-900"
                 >
                    <i className="ph-fill ph-microphone-slash text-3xl"></i>
                 </button>
                 <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-2">Tap to disconnect</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIConcierge;
