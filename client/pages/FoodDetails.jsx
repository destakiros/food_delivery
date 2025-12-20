
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { apiService } from '../services/api.js';
import { GoogleGenAI } from "@google/genai";
import { MOCK_FOODS } from '../constants.js';

const FoodDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const { user } = useAuth();
  const [chefInsight, setChefInsight] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [instructions, setInstructions] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        let foodData = null;
        const apiData = await apiService.get(`/menu/${id}`);
        if (apiData) {
          foodData = { ...apiData, id: apiData._id || apiData.id };
        } else {
          foodData = MOCK_FOODS.find(f => f.id === id);
        }
        if (!foodData) throw new Error('Not found');
        setFood(foodData);
        if (foodData.options) {
          const defaults = {};
          foodData.options.forEach(opt => {
            defaults[opt.name] = opt.choices[0];
          });
          setSelectedOptions(defaults);
        }
        if (foodData) fetchChefInsight(foodData);
      } catch (error) {
        showToast('Looking for ingredients...', 'error');
        navigate('/menu');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  const fetchChefInsight = async (item) => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Recommend a drink pairing for "${item.name}". Keep it warm and under 12 words.`,
      });
      setChefInsight(response.text);
    } catch (error) {}
  };

  const handleOptionSelect = (optionName, choice) => {
    setSelectedOptions(prev => ({ ...prev, [optionName]: choice }));
  };

  const currentTotalPrice = useMemo(() => {
    if (!food) return 0;
    let total = food.price;
    if (food.options) {
      food.options.forEach(opt => {
        const selectedChoice = selectedOptions[opt.name];
        if (selectedChoice && opt.priceModifiers && opt.priceModifiers[selectedChoice]) {
          total += opt.priceModifiers[selectedChoice];
        }
      });
    }
    return total;
  }, [food, selectedOptions]);

  const handleAddToCart = () => {
    if (food) {
      addToCart(food, selectedOptions, currentTotalPrice, instructions);
      showToast('Added to your plate!', 'success');
      setInstructions('');
    }
  };

  if (loading || !food) return (
    <div className="h-screen flex items-center justify-center bg-white dark:bg-black">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-ino-red"></div>
    </div>
  );

  return (
    <div className="py-12 md:py-24 bg-gray-50 dark:bg-black min-h-screen">
      <div className="max-w-content mx-auto px-6 md:px-12">
        <Link to="/menu" className="inline-flex items-center text-[11px] font-black text-ino-clay/40 dark:text-gray-500 hover:text-ino-red uppercase tracking-[0.4em] mb-16 transition-all">
          <i className="ph-bold ph-arrow-left mr-3"></i> Back to Catalog
        </Link>

        <div className="warm-card rounded-6xl overflow-hidden flex flex-col xl:flex-row min-h-[750px] shadow-2xl border-none">
          <div className="xl:w-1/2 relative overflow-hidden bg-gray-100 dark:bg-gray-800">
            <img src={food.imageURL} alt={food.name} className="w-full h-full object-cover transition-transform duration-1000 hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
            <div className="absolute top-12 left-12 flex flex-col gap-4">
              {food.isSecretMenu && (
                <span className="bg-ino-yellow text-ino-red px-6 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] shadow-2xl glow-yellow">Elite Choice</span>
              )}
              <span className="bg-white/90 dark:bg-black/80 backdrop-blur-xl text-gray-900 dark:text-white px-6 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] shadow-xl border border-white/10">Est. {food.prepTime}</span>
            </div>
          </div>
          
          <div className="xl:w-1/2 p-10 md:p-24 flex flex-col justify-center bg-white dark:bg-gray-900">
            <header className="mb-12">
               <div className="flex items-center gap-4 mb-4">
                 <span className="text-[11px] font-black text-ino-clay dark:text-gray-400 uppercase tracking-[0.4em]">{food.category}</span>
                 <div className="h-1 w-1 bg-gray-300 rounded-full"></div>
                 <div className="flex items-center gap-1.5 text-ino-yellow">
                    <i className="ph-fill ph-star"></i>
                    <span className="font-black text-gray-900 dark:text-white text-sm">{food.rating}</span>
                 </div>
               </div>
               <h1 className="text-6xl md:text-8xl font-black text-gray-950 dark:text-white uppercase leading-none tracking-tighter mb-8">{food.name}</h1>
               <p className="text-2xl text-gray-500 dark:text-gray-400 font-medium italic leading-relaxed">"{food.description}"</p>
            </header>

            <div className="space-y-10 mb-16">
               {food.options && food.options.map(opt => (
                 <div key={opt.name}>
                    <p className="text-[10px] font-black text-ino-clay/40 dark:text-gray-500 uppercase tracking-[0.4em] mb-4">Choose {opt.name}</p>
                    <div className="flex flex-wrap gap-3">
                       {opt.choices.map(choice => (
                         <button 
                            key={choice}
                            onClick={() => handleOptionSelect(opt.name, choice)}
                            className={`px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all border-2 ${
                              selectedOptions[opt.name] === choice 
                                ? 'bg-ino-clay text-white border-ino-clay shadow-xl scale-105' 
                                : 'bg-transparent text-ino-clay dark:text-gray-300 border-ino-clay/10 hover:border-ino-clay/40'
                            }`}
                           >
                            {choice}
                           </button>
                       ))}
                    </div>
                 </div>
               ))}

               <div>
                  <p className="text-[10px] font-black text-ino-clay/40 dark:text-gray-500 uppercase tracking-[0.4em] mb-4">Kitchen Instruction</p>
                  <input 
                    type="text"
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder="Tell the chef something special..."
                    className="w-full bg-ino-cream dark:bg-white/5 border-none p-6 rounded-3xl text-lg font-bold outline-none focus:ring-8 focus:ring-ino-red/10 transition-all dark:text-white shadow-inner"
                  />
               </div>
            </div>

            {chefInsight && (
              <div className="p-8 bg-ino-yellow/5 border-l-8 border-ino-yellow rounded-4xl mb-16 shadow-lg">
                <p className="text-[10px] font-black text-ino-yellow uppercase tracking-[0.5em] mb-3">Kitchen Secret</p>
                <p className="text-xl md:text-2xl font-black text-gray-800 dark:text-gray-200 italic leading-snug">"{chefInsight}"</p>
              </div>
            )}

            <div className="mt-auto pt-12 border-t border-ino-clay/5">
               <div className="flex justify-between items-end mb-10">
                  <div>
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Total Valuation</p>
                     <p className="text-6xl font-black text-gray-950 dark:text-white tracking-tighter">${currentTotalPrice.toFixed(2)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Fuel Data</p>
                    <p className="text-2xl font-black text-ino-clay">{food.calories} <span className="text-xs uppercase opacity-50">Kcal</span></p>
                  </div>
               </div>
               <button 
                onClick={handleAddToCart}
                disabled={!food.isAvailable}
                className="w-full py-8 bg-ino-red text-white rounded-[2.5rem] font-black text-xl uppercase tracking-[0.3em] shadow-2xl shadow-ino-red/20 hover:bg-red-700 hover:scale-[1.02] transition-all active:scale-95 disabled:opacity-50"
               >
                 Add to My Selection
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodDetails;
