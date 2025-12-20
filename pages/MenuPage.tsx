
import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CATEGORIES, MOCK_FOODS, DetailedFoodItem } from '../constants';
import FoodCard from '../components/FoodCard';
import { apiService } from '../services/api';
import { GoogleGenAI } from "@google/genai";

const MenuPage: React.FC = () => {
  const [foods, setFoods] = useState<DetailedFoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const [aiExplorerText, setAiExplorerText] = useState('');
  const [aiExplorerLinks, setAiExplorerLinks] = useState<{title: string, uri: string}[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  
  const selectedCategory = searchParams.get('category') || 'All';

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const data = await apiService.get('/menu');
        if (data && Array.isArray(data) && data.length > 0) {
          const formatted = data.map((item: any) => ({
            ...item,
            id: item._id || item.id
          }));
          setFoods(formatted);
        } else {
          setFoods(MOCK_FOODS);
        }
      } catch (error) {
        setFoods(MOCK_FOODS);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  const handleAiExplore = async () => {
    if (!process.env.API_KEY) return;
    setIsAiLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: "What are the trending burgers or fast food innovations in the global culinary scene in late 2024 or 2025? Provide a concise summary for FOOD-GRID customers.",
        config: { tools: [{ googleSearch: {} }] },
      });

      setAiExplorerText(response.text || "");
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (chunks) {
        const links = chunks
          .filter((c: any) => c.web)
          .map((c: any) => ({
            title: c.web.title,
            uri: c.web.uri
          }));
        setAiExplorerLinks(links);
      }
    } catch (err) {
      console.error("AI Explore Error:", err);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleCategoryChange = (category: string) => {
    if (category === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', category);
    }
    setSearchParams(searchParams);
  };

  const filteredFoods = useMemo(() => {
    return foods.filter(food => {
      const matchesSearch = 
        food.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        food.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = 
        selectedCategory === 'All' || 
        food.category.toLowerCase() === selectedCategory.toLowerCase();
        
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory, foods]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center">
           <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-600 mb-4"></div>
           <p className="font-black text-gray-400 uppercase tracking-widest text-xs">Assembling Your Menu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-20 bg-gray-50 dark:bg-gray-950 min-h-screen">
      <div className="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-12">
        <header className="mb-20">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-12 mb-12">
            <div>
              <h1 className="text-5xl lg:text-7xl font-black text-gray-900 dark:text-white tracking-tighter mb-4 uppercase">
                The <span className="text-red-600">Daily</span> Archive
              </h1>
              <p className="text-xl text-gray-500 font-bold uppercase tracking-widest text-[10px]">Elite selection updated daily in Addis.</p>
            </div>
            <div className="relative group w-full md:max-w-md">
              <i className="ph ph-magnifying-glass absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-600 transition-colors text-xl"></i>
              <input 
                type="text" 
                placeholder="Find a Burger or Shake..." 
                className="w-full pl-14 pr-6 py-5 bg-white dark:bg-gray-900 rounded-3xl border-none shadow-xl ring-1 ring-gray-100 dark:ring-gray-800 focus:ring-4 focus:ring-red-600/10 transition-all outline-none text-lg font-black dark:text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4 overflow-x-auto pb-6 scrollbar-hide">
            {CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all duration-300 ${
                  selectedCategory.toLowerCase() === category.toLowerCase() 
                    ? 'bg-red-600 text-white shadow-xl shadow-red-500/20 scale-105' 
                    : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-red-50 hover:text-red-600 border border-gray-100 dark:border-gray-800'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </header>

        {/* AI Knowledge Hub Section */}
        <section className="mb-24">
           <div className="bg-gray-900 rounded-[4rem] p-12 border border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity">
                 <i className="ph-fill ph-sparkle text-[200px] text-white"></i>
              </div>
              <div className="relative z-10">
                 <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
                    <div>
                       <h2 className="text-3xl font-black text-white tracking-tighter uppercase mb-2">AI Food <span className="text-red-600">Explorer</span></h2>
                       <p className="text-gray-400 font-bold">Discover real-time culinary trends powered by satellite grounding.</p>
                    </div>
                    {!aiExplorerText && (
                      <button 
                        onClick={handleAiExplore}
                        disabled={isAiLoading}
                        className="px-10 py-4 bg-red-600 text-white rounded-full font-black text-xs uppercase tracking-widest hover:bg-red-700 transition-all shadow-xl shadow-red-500/20 disabled:opacity-50"
                      >
                        {isAiLoading ? 'Synthesizing...' : 'Initialize Search'}
                      </button>
                    )}
                 </div>

                 {aiExplorerText && (
                   <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <p className="text-xl text-gray-200 font-bold italic leading-relaxed mb-8 max-w-4xl">
                        "{aiExplorerText}"
                      </p>
                      <div className="flex flex-wrap gap-4">
                         {aiExplorerLinks.map((link, i) => (
                           <a 
                             key={i} 
                             href={link.uri} 
                             target="_blank" 
                             className="text-[10px] bg-white/5 hover:bg-white/10 text-red-600 px-4 py-2 rounded-full font-black uppercase tracking-widest transition-all border border-white/10"
                           >
                             {link.title} <i className="ph ph-arrow-up-right ml-1"></i>
                           </a>
                         ))}
                         <button onClick={() => setAiExplorerText('')} className="text-[10px] text-gray-500 uppercase font-black tracking-widest ml-4 hover:underline">Clear Hub</button>
                      </div>
                   </div>
                 )}
              </div>
           </div>
        </section>

        {filteredFoods.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-12">
            {filteredFoods.map(food => (
              <FoodCard key={food.id} food={food} />
            ))}
          </div>
        ) : (
          <div className="text-center py-40 bg-white dark:bg-gray-900 rounded-[4rem] shadow-xl border border-gray-100 dark:border-gray-800">
            <h3 className="text-4xl font-black text-gray-900 dark:text-white mb-4 tracking-tighter uppercase">No Match Found</h3>
            <button 
              onClick={() => { setSearchTerm(''); handleCategoryChange('All'); }}
              className="px-12 py-5 bg-red-600 text-white rounded-[2rem] font-black text-xl hover:bg-red-700 shadow-2xl transition-all uppercase tracking-widest"
            >
              Reset Archive
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuPage;
