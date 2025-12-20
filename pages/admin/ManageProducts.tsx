
import React, { useState } from 'react';
import { MOCK_FOODS } from '../../constants';
import { GoogleGenAI } from '@google/genai';
import { useToast } from '../../context/ToastContext';

const ManageProducts: React.FC = () => {
  const [foods, setFoods] = useState(MOCK_FOODS);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [generatedVisual, setGeneratedVisual] = useState<string | null>(null);
  const [visualType, setVisualType] = useState<'IMAGE' | 'VIDEO' | null>(null);
  const { showToast } = useToast();

  const toggleAvailability = (id: string) => {
    setFoods(prev => prev.map(f => f.id === id ? { ...f, isAvailable: !f.isAvailable } : f));
  };

  const handleGenerateVisual = async (foodName: string, type: 'IMAGE' | 'VIDEO') => {
    // Standard key selection check
    if (!(window as any).aistudio?.hasSelectedApiKey()) {
      await (window as any).aistudio?.openSelectKey();
    }

    setIsAiLoading(true);
    setVisualType(type);
    setGeneratedVisual(null);

    try {
      // Create a new instance right before the call
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      if (type === 'IMAGE') {
        const response = await ai.models.generateContent({
          model: 'gemini-3-pro-image-preview',
          contents: { parts: [{ text: `Professional gourmet studio photography of ${foodName}, cinematic lighting, highly detailed food styling, 4k resolution.` }] },
          config: { imageConfig: { aspectRatio: '1:1', imageSize: '1K' } }
        });
        
        const imgPart = response.candidates[0].content.parts.find((p: any) => p.inlineData);
        if (imgPart) {
          setGeneratedVisual(`data:image/png;base64,${imgPart.inlineData.data}`);
          showToast('Marketing asset generated.', 'success');
        } else {
          throw new Error("No image data returned from model.");
        }
      } else {
        showToast('Synthesizing cinematic video...', 'info');
        let operation = await ai.models.generateVideos({
          model: 'veo-3.1-fast-generate-preview',
          prompt: `Cinematic slow motion reveal of ${foodName}, high quality professional food commercial style, steaming hot.`,
          config: { numberOfVideos: 1, resolution: '720p', aspectRatio: '1:1' }
        });

        while (!operation.done) {
          await new Promise(resolve => setTimeout(resolve, 5000));
          operation = await ai.operations.getVideosOperation({ operation: operation });
        }

        const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
        const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
        if (!response.ok) throw new Error("Failed to download synthesized video.");
        const blob = await response.blob();
        setGeneratedVisual(URL.createObjectURL(blob));
        showToast('Promo video synthesized.', 'success');
      }
    } catch (error: any) {
      console.error("AI Error:", error);
      
      // If the request fails with 404/500 related to key/project issues
      if (error.message?.includes("Requested entity was not found") || error.message?.includes("Rpc failed") || error.message?.includes("API key")) {
        showToast('Configuration error. Please re-select your API Key.', 'error');
        await (window as any).aistudio?.openSelectKey();
      } else {
        showToast('Generation interrupted. Please check your project billing.', 'error');
      }
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="py-20 bg-gray-50 dark:bg-gray-950 min-h-screen">
      <div className="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-12">
        <header className="flex flex-col sm:flex-row justify-between items-end gap-8 mb-20">
          <div>
            <h1 className="text-6xl font-black text-gray-900 dark:text-white tracking-tighter uppercase">Inventory <span className="text-red-600">Grid</span></h1>
            <p className="text-2xl text-gray-400 font-bold mt-4">Manage the digital shelf and generate AI marketing assets.</p>
          </div>
          <button className="px-10 py-5 bg-red-600 text-white rounded-3xl font-black text-xl uppercase tracking-widest shadow-xl shadow-red-500/20 hover:bg-red-700 transition-all">
            <i className="ph-bold ph-plus mr-2"></i> New Product
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {foods.map(food => (
            <div key={food.id} className="bg-white dark:bg-gray-900 p-8 rounded-[3rem] shadow-xl border border-gray-100 dark:border-white/5 flex flex-col">
              <div className="relative h-48 mb-8 group overflow-hidden rounded-[2rem]">
                <img src={food.imageURL} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" alt={food.name} />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-4">
                   <button onClick={() => handleGenerateVisual(food.name, 'IMAGE')} className="w-12 h-12 bg-white rounded-xl text-gray-900 hover:bg-red-600 hover:text-white transition-all" title="Generate Image"><i className="ph-fill ph-image"></i></button>
                   <button onClick={() => handleGenerateVisual(food.name, 'VIDEO')} className="w-12 h-12 bg-white rounded-xl text-gray-900 hover:bg-red-600 hover:text-white transition-all" title="Generate Video"><i className="ph-fill ph-video-camera"></i></button>
                </div>
              </div>
              
              <div className="flex-grow mb-8">
                <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-2">{food.name}</h3>
                <p className="text-red-600 font-black text-2xl tracking-tighter">${food.price.toFixed(2)}</p>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-gray-50 dark:border-white/5">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => toggleAvailability(food.id)}
                    className={`w-12 h-7 rounded-full relative transition-all ${food.isAvailable ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-800'}`}
                  >
                    <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${food.isAvailable ? 'left-6' : 'left-1'}`}></div>
                  </button>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{food.isAvailable ? 'On Grid' : 'Offline'}</span>
                </div>
                <div className="flex gap-2">
                   <button className="p-3 text-gray-400 hover:text-red-600 transition-all"><i className="ph-bold ph-pencil-simple text-xl"></i></button>
                   <button className="p-3 text-gray-400 hover:text-red-600 transition-all"><i className="ph-bold ph-trash text-xl"></i></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {(isAiLoading || generatedVisual) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-3xl animate-in fade-in duration-300">
           <div className="bg-gray-900 rounded-[4rem] p-16 w-full max-w-2xl border border-white/10 shadow-3xl text-center">
              <h3 className="text-4xl font-black text-white mb-4 tracking-tighter uppercase">AI Marketing <span className="text-red-600">Lab</span></h3>
              <p className="text-gray-500 font-bold mb-12 uppercase tracking-widest text-xs">Synthesis for {visualType}</p>
              
              <div className="aspect-square w-full bg-black/50 rounded-[3rem] overflow-hidden flex items-center justify-center mb-12 border border-white/5">
                 {isAiLoading ? (
                   <div className="flex flex-col items-center gap-6">
                      <div className="animate-spin w-16 h-16 border-t-4 border-red-600 rounded-full"></div>
                      <p className="text-red-600 font-black uppercase tracking-[0.5em] text-[10px] animate-pulse">Processing Pixels...</p>
                   </div>
                 ) : generatedVisual && visualType === 'IMAGE' ? (
                   <img src={generatedVisual} className="w-full h-full object-cover" alt="Gen" />
                 ) : generatedVisual && visualType === 'VIDEO' ? (
                   <video src={generatedVisual} autoPlay loop muted className="w-full h-full object-cover" />
                 ) : null}
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => { setGeneratedVisual(null); setIsAiLoading(false); }}
                  className="flex-grow py-6 bg-white/10 text-white rounded-[2rem] font-black text-xl uppercase tracking-widest hover:bg-white/20 transition-all"
                >
                  Discard
                </button>
                <button 
                  onClick={() => { setGeneratedVisual(null); setIsAiLoading(false); showToast('Asset saved to database!', 'success'); }}
                  className="flex-grow py-6 bg-red-600 text-white rounded-[2rem] font-black text-xl uppercase tracking-widest hover:bg-red-700 transition-all shadow-xl shadow-red-500/20"
                >
                  Save to Product
                </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ManageProducts;
