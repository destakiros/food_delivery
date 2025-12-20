
import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CATEGORIES, MOCK_FOODS } from '../constants.js';
import FoodCard from '../components/FoodCard.jsx';
import { apiService } from '../services/api.js';
import { GoogleGenAI } from "@google/genai";

const MenuPage = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const [explorerText, setExplorerText] = useState('');
  const [explorerLinks, setExplorerLinks] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const selectedCategory = searchParams.get('category') || 'All';

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const data = await apiService.get('/menu');
        if (data && Array.isArray(data) && data.length > 0) {
          const formatted = data.map((item) => ({
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

  const handleExplore = async () => {
    if (!process.env.API_KEY) return;
    setIsSearching(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: "What are the latest gourmet burger trends and high-quality fast food innovations for 2025? Provide a summary for IN-N-OUT customers.",
        config: { tools: [{ googleSearch: {} }] },
      });

      setExplorerText(response.text || "");
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (chunks) {
        const links = chunks
          .filter((c) => c.web)
          .map((c) => ({
            title: c.web.title,
            uri: c.web.uri
          }));
        setExplorerLinks(links);
      }
    } catch (err) {
      console.error("Explore Error:", err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleCategoryChange = (category) => {
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
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
        <div className="flex flex-col items-center">
           <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-600 mb-4"></div>
           <p className="font-black text-gray-400 uppercase tracking-widest text-xs">Assembling Your Menu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-20 bg-gray-50 dark:bg-black min-h-screen pb-40">
      <div className="max-w-content mx-auto px-6 md:px-12 lg:px-20">
        <header className="mb-24">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-12 mb-16">
            <div>
              <h1 className="text-6xl md:text-[7rem] font-black text-gray-900 dark:text-white tracking-tighter mb-4 uppercase leading-none">
                THE <span className="text-red-600">DAILY</span> MENU
              </h1>
              <p className="text-lg text-gray-500 dark:text-gray-400 font-bold uppercase tracking-[0.4em] text-[11px]">Quality you can taste in every single order.</p>
            </div>
            <div className="relative group w-full md:max-w-lg">
              <i className="ph ph-magnifying-glass absolute left-7 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-600 transition-colors text-2xl"></i>
              <input 
                type="text" 
                placeholder="Find your favorite plate..." 
                className="w-full pl-16 pr-8 py-6 bg-white dark:bg-gray-900 rounded-[2.5rem] border-none shadow-2xl ring-1 ring-gray-100 dark:ring-gray-800 focus:ring-8 focus:ring-red-600/10 transition-all outline-none text-xl font-black dark:text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4 overflow-x-auto pb-8 scrollbar-hide">
            {CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-12 py-5 rounded-3xl text-[11px] font-black uppercase tracking-widest whitespace-nowrap transition-all duration-500 shadow-sm ${
                  selectedCategory.toLowerCase() === category.toLowerCase() 
                    ? 'bg-red-600 text-white shadow-2xl shadow-red-500/30 -translate-y-1' 
                    : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-red-50 hover:text-red-600 border border-gray-100 dark:border-white/5'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </header>

        {/* Global Insight Banner */}
        <section className="mb-24">
           <div className="bg-gray-900 rounded-6xl p-12 md:p-20 border border-white/5 relative overflow-hidden group shadow-2xl">
              <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:rotate-12 transition-all duration-1000">
                 <i className="ph-fill ph-sparkle text-[250px] text-white"></i>
              </div>
              <div className="relative z-10">
                 <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-12 mb-16">
                    <div className="max-w-3xl">
                       <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase mb-4 leading-none">Culinary <span className="text-red-600">Insight Hub</span></h2>
                       <p className="text-xl text-gray-400 font-bold leading-relaxed">Discover global innovations and neighborhood developments in fine fast-dining.</p>
                    </div>
                    {!explorerText && (
                      <button 
                        onClick={handleExplore}
                        disabled={isSearching}
                        className="px-12 py-5 bg-red-600 text-white rounded-full font-black text-xs uppercase tracking-widest hover:bg-red-700 transition-all shadow-2xl shadow-red-500/20 disabled:opacity-50 active:scale-95"
                      >
                        {isSearching ? 'Updating Hub...' : 'Explore Insights'}
                      </button>
                    )}
                 </div>

                 {explorerText && (
                   <div className="animate-fade-in">
                      <p className="text-2xl md:text-4xl text-gray-200 font-black italic leading-[1.2] mb-12 max-w-5xl">
                        "{explorerText}"
                      </p>
                      <div className="flex flex-wrap items-center gap-6">
                         {explorerLinks.map((link, i) => (
                           <a 
                             key={i} 
                             href={link.uri} 
                             target="_blank" 
                             className="text-[11px] bg-white/5 hover:bg-white/10 text-red-600 px-6 py-3 rounded-2xl font-black uppercase tracking-widest transition-all border border-white/10 flex items-center gap-2"
                           >
                             <span>{link.title}</span> <i className="ph ph-arrow-up-right"></i>
                           </a>
                         ))}
                         <button onClick={() => setExplorerText('')} className="text-[11px] text-gray-500 uppercase font-black tracking-[0.3em] ml-6 hover:text-white transition-colors">Dismiss</button>
                      </div>
                   </div>
                 )}
              </div>
           </div>
        </section>

        {filteredFoods.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 md:gap-12">
            {filteredFoods.map(food => (
              <FoodCard key={food.id} food={food} />
            ))}
          </div>
        ) : (
          <div className="text-center py-48 bg-white dark:bg-gray-900 rounded-6xl shadow-2xl border border-gray-100 dark:border-white/5">
            <h3 className="text-5xl font-black text-gray-900 dark:text-white mb-6 tracking-tighter uppercase">No Results Found</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-12 font-medium">Try adjusting your filters or search terms.</p>
            <button 
              onClick={() => { setSearchTerm(''); handleCategoryChange('All'); }}
              className="px-16 py-6 bg-red-600 text-white rounded-3xl font-black text-xl hover:bg-red-700 shadow-2xl transition-all uppercase tracking-widest active:scale-95"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuPage;
