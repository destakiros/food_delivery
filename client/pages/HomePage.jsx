
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MOCK_FOODS } from '../constants.js';
import FoodCard from '../components/FoodCard.jsx';
import { GoogleGenAI } from "@google/genai";

const HomePage = () => {
  const featuredFoods = MOCK_FOODS.slice(0, 4); 
  const [moodRecommendation, setMoodRecommendation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleMoodSelect = async (mood) => {
    setIsLoading(true);
    setMoodRecommendation(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const menuStr = MOCK_FOODS.map(f => f.name).join(', ');
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `A neighbor in Addis Ababa is feeling "${mood}". Based on our neighborhood restaurant menu: ${menuStr}, pick ONE item and write a warm, smile-filled 12-word recommendation like a family restaurant owner.`,
      });
      setMoodRecommendation(response.text || "Come in, neighbor! We have a special plate for you.");
    } catch (error) {
      setMoodRecommendation("Whatever your mood, we'll cook you something wonderful.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="overflow-hidden">
      {/* Immersive Wide Hero */}
      <header className="relative min-h-[90vh] flex items-center justify-center py-20">
        <div className="absolute inset-0 bg-ino-cream dark:bg-black overflow-hidden">
           <img 
            src="https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80&w=2400" 
            className="w-full h-full object-cover opacity-20 dark:opacity-10 scale-105"
            alt="Warm Kitchen"
           />
           <div className="absolute inset-0 bg-gradient-to-b from-ino-cream/40 via-ino-cream to-ino-cream dark:from-black/60 dark:via-black dark:to-black"></div>
        </div>
        
        <div className="relative z-10 text-center max-w-content mx-auto px-6 animate-fade-in">
          <div className="inline-flex items-center space-x-3 bg-white dark:bg-white/5 px-6 py-2.5 rounded-full mb-10 border border-ino-clay/10 shadow-sm">
             <span className="flex h-2 w-2 rounded-full bg-ino-red animate-pulse"></span>
             <span className="text-[11px] font-black text-ino-clay dark:text-gray-400 uppercase tracking-[0.3em]">Hand-crafted in Addis Ababa</span>
          </div>
          <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-black mb-8 text-gray-950 dark:text-white tracking-tighter leading-[0.9] select-none">
            COOKED <span className="text-ino-red">FRESH.</span> <br/> <span className="italic font-light">Delivered</span> FAST.
          </h1>
          <p className="text-xl md:text-3xl text-gray-600 dark:text-gray-400 font-medium mb-12 max-w-3xl mx-auto leading-relaxed">
            Premium beef, hand-cut potatoes, and Habesha hospitality. Sourced locally, served with passion.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link 
              to="/menu" 
              className="w-full sm:w-auto px-16 py-6 bg-ino-red text-white rounded-3xl font-black text-lg uppercase tracking-widest shadow-2xl shadow-ino-red/20 hover:bg-red-700 hover:scale-105 transition-all active:scale-95"
            >
              See Today's Menu
            </Link>
            <button 
              onClick={() => document.getElementById('personalized-match')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto px-16 py-6 bg-white dark:bg-white/5 text-ino-clay dark:text-white border border-ino-clay/10 rounded-3xl font-black text-lg uppercase tracking-widest hover:bg-gray-100 transition-all shadow-xl"
            >
              Smart Match
            </button>
          </div>
        </div>
      </header>

      {/* Feature Strip */}
      <div className="bg-white dark:bg-gray-900/50 py-12 border-y border-ino-clay/5">
        <div className="max-w-content mx-auto px-12 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-ino-red/5 rounded-3xl flex items-center justify-center text-ino-red text-3xl">
              <i className="ph-fill ph-leaf"></i>
            </div>
            <div>
              <p className="font-black uppercase tracking-widest text-[10px] text-gray-400 mb-1">100% Organic</p>
              <p className="text-lg font-black dark:text-white">Locally Sourced</p>
            </div>
          </div>
          <div className="flex items-center gap-6 border-x border-ino-clay/5 px-12">
            <div className="w-16 h-16 bg-ino-yellow/5 rounded-3xl flex items-center justify-center text-ino-yellow text-3xl">
              <i className="ph-fill ph-timer"></i>
            </div>
            <div>
              <p className="font-black uppercase tracking-widest text-[10px] text-gray-400 mb-1">Lightning Fast</p>
              <p className="text-lg font-black dark:text-white">Bole in 15 Mins</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-green-500/5 rounded-3xl flex items-center justify-center text-green-500 text-3xl">
              <i className="ph-fill ph-seal-check"></i>
            </div>
            <div>
              <p className="font-black uppercase tracking-widest text-[10px] text-gray-400 mb-1">Certified Quality</p>
              <p className="text-lg font-black dark:text-white">Elite Standards</p>
            </div>
          </div>
        </div>
      </div>

      {/* Personalized Section */}
      <section id="personalized-match" className="py-32 px-6 bg-gray-50 dark:bg-black/40">
        <div className="max-w-content mx-auto">
          <div className="warm-card rounded-6xl p-12 md:p-24 flex flex-col xl:flex-row items-center gap-20">
            <div className="xl:w-2/5 text-center xl:text-left">
              <h2 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white tracking-tighter uppercase mb-6 leading-none">Craving <span className="text-ino-red">Something?</span></h2>
              <p className="text-xl text-gray-500 dark:text-gray-400 font-medium mb-12 italic leading-relaxed">Select your current vibe and let our digital host recommend your next favorite plate.</p>
              
              <div className="grid grid-cols-2 gap-4">
                {['Hungry', 'Tired', 'Happy', 'Adventurous', 'Healthy', 'Late Night'].map(mood => (
                  <button 
                    key={mood}
                    onClick={() => handleMoodSelect(mood)}
                    className="py-5 bg-ino-cream dark:bg-white/5 rounded-2xl font-black text-[11px] uppercase tracking-widest text-gray-600 dark:text-gray-400 hover:bg-ino-red hover:text-white transition-all border border-ino-clay/5 shadow-sm active:scale-95"
                  >
                    {mood}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="xl:w-3/5 w-full min-h-[400px] bg-gray-900 dark:bg-black rounded-5xl p-12 flex flex-col items-center justify-center relative border border-white/5 overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-ino-red/10 blur-[100px] rounded-full"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-ino-yellow/5 blur-[100px] rounded-full"></div>
              
              {isLoading ? (
                <div className="flex flex-col items-center gap-6">
                  <div className="animate-spin w-12 h-12 border-t-2 border-ino-red rounded-full"></div>
                  <p className="text-gray-400 font-black uppercase tracking-[0.3em] text-[10px]">Consulting the Chef...</p>
                </div>
              ) : moodRecommendation ? (
                <div className="animate-fade-in text-center">
                  <i className="ph-fill ph-sparkle text-ino-yellow text-6xl mb-8"></i>
                  <p className="text-3xl md:text-5xl font-black text-white tracking-tighter mb-12 italic leading-tight max-w-2xl mx-auto">"{moodRecommendation}"</p>
                  <Link to="/menu" className="inline-flex items-center gap-4 px-12 py-5 bg-ino-red text-white rounded-full font-black text-sm uppercase tracking-widest hover:scale-110 transition-all shadow-xl shadow-ino-red/20">
                    <span>That Sounds Perfect</span><i className="ph-bold ph-heart"></i>
                  </Link>
                </div>
              ) : (
                <div className="text-center opacity-30">
                  <i className="ph ph-hand-pointing text-white text-6xl mb-6"></i>
                  <p className="text-white font-black text-2xl uppercase tracking-widest">Select a mood to begin</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Favorites Section */}
      <section className="py-32 px-6 dark:bg-black">
        <div className="max-w-content mx-auto">
          <header className="flex flex-col md:flex-row items-end justify-between mb-20 gap-10">
            <div className="max-w-2xl">
              <h2 className="text-6xl md:text-8xl font-black text-gray-900 dark:text-white tracking-tighter uppercase leading-none mb-6">Today's <span className="text-ino-red">Hall of Fame</span></h2>
              <p className="text-xl text-gray-500 dark:text-gray-400 font-medium">The local favorites everyone is talking about in Addis right now.</p>
            </div>
            <Link to="/menu" className="px-12 py-4 border-2 border-ino-clay text-ino-clay dark:text-white dark:border-white/10 rounded-full font-black uppercase tracking-widest text-xs hover:bg-ino-red hover:text-white hover:border-ino-red transition-all">Full Archives</Link>
          </header>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {featuredFoods.map(food => (<FoodCard key={food.id} food={food} />))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
