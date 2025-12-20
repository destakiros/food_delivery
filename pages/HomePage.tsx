
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MOCK_FOODS } from '../constants';
import FoodCard from '../components/FoodCard';
import { GoogleGenAI } from "@google/genai";

const HomePage: React.FC = () => {
  const featuredFoods = MOCK_FOODS.slice(0, 4); 
  const [moodRecommendation, setMoodRecommendation] = useState<string | null>(null);
  const [isMoodLoading, setIsMoodLoading] = useState(false);

  const handleMoodSelect = async (mood: string) => {
    setIsMoodLoading(true);
    setMoodRecommendation(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const menuStr = MOCK_FOODS.map(f => f.name).join(', ');
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `A customer is feeling "${mood}". Based on this menu: ${menuStr}, pick ONE item and write a persuasive 15-word endorsement focusing on taste and freshness.`,
      });
      setMoodRecommendation(response.text || "Discover your perfect match on our menu today.");
    } catch (error) {
      console.error("AI Mood Error:", error);
      setMoodRecommendation("Whatever your mood, we have the perfect dish waiting for you.");
    } finally {
      setIsMoodLoading(false);
    }
  };

  return (
    <div className="overflow-hidden">
      {/* Cinematic Food-Centric Hero */}
      <header className="relative h-screen min-h-[900px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gray-950">
           <img 
            src="https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&q=90&w=2400" 
            className="w-full h-full object-cover opacity-60 dark:opacity-40 animate-slow-zoom"
            alt="Hero Background"
           />
           <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-950/20 to-gray-950"></div>
        </div>
        
        <div className="relative z-10 text-center max-w-ultra px-10">
          <div className="inline-flex items-center space-x-6 bg-white/5 backdrop-blur-3xl px-10 py-4 rounded-full mb-12 border border-white/10 animate-fade-in shadow-2xl">
             <span className="flex h-3 w-3 rounded-full bg-ino-yellow animate-ping"></span>
             <span className="text-[11px] font-black text-white uppercase tracking-[0.5em]">The IN-N-OUT Addis Legacy</span>
          </div>
          <h1 className="text-[8vw] lg:text-[9rem] font-black mb-10 text-white tracking-tighter leading-[0.85] uppercase select-none">
            ALWAYS <span className="text-ino-red">FRESH.</span><br/>NEVER FROZEN.<br/><span className="text-ino-yellow">PURE ADDIS PRIDE.</span>
          </h1>
          <p className="text-xl lg:text-3xl text-gray-300 font-medium mb-20 max-w-4xl mx-auto leading-relaxed italic opacity-80">
            Sizzling beef, toasted buns, and garden-fresh produce. Hand-crafted in our local hub and delivered to your coordinates in record time.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
            <Link 
              to="/menu" 
              className="group px-16 py-7 bg-ino-red text-white rounded-[2.5rem] font-black text-2xl uppercase tracking-[0.2em] shadow-2xl hover:bg-red-700 transition-all hover:scale-105 active:scale-95 flex items-center gap-6"
            >
              <span>Order Now</span>
              <i className="ph-bold ph-arrow-right group-hover:translate-x-2 transition-transform"></i>
            </Link>
            <button 
              onClick={() => document.getElementById('ai-recommender')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-16 py-7 bg-white/10 backdrop-blur-xl text-white border border-white/20 rounded-[2.5rem] font-black text-2xl uppercase tracking-[0.2em] hover:bg-white/20 transition-all"
            >
              AI Cravings
            </button>
          </div>
        </div>
      </header>

      {/* Brand Strips */}
      <div className="bg-white dark:bg-gray-950 py-16 border-y border-gray-100 dark:border-white/5">
        <div className="max-w-ultra mx-auto px-10 grid grid-cols-1 md:grid-cols-3 gap-16 text-gray-950 dark:text-white">
           <div className="flex items-center gap-8 border-r border-gray-100 dark:border-white/5">
              <i className="ph-fill ph-fire text-5xl text-ino-red"></i>
              <div><p className="font-black uppercase tracking-widest text-[11px] mb-1">Flame-Grilled</p><p className="text-gray-500 dark:text-gray-400 font-bold text-lg tracking-tight">Char-Broiled Perfection</p></div>
           </div>
           <div className="flex items-center gap-8 border-r border-gray-100 dark:border-white/5">
              <i className="ph-fill ph-bowl-food text-5xl text-green-500"></i>
              <div><p className="font-black uppercase tracking-widest text-[11px] mb-1">Local Sourcing</p><p className="text-gray-500 dark:text-gray-400 font-bold text-lg tracking-tight">Addis-Grown Organic Greens</p></div>
           </div>
           <div className="flex items-center gap-8">
              <i className="ph-fill ph-crown text-5xl text-ino-yellow"></i>
              <div><p className="font-black uppercase tracking-widest text-[11px] mb-1">Elite Quality</p><p className="text-gray-500 dark:text-gray-400 font-bold text-lg tracking-tight">The #1 Choice in Ethiopia</p></div>
           </div>
        </div>
      </div>

      {/* AI Recommendation Section */}
      <section id="ai-recommender" className="py-40 px-10 bg-gray-50 dark:bg-black">
        <div className="max-w-ultra mx-auto">
          <div className="bg-white dark:bg-gray-950 rounded-[5rem] p-20 shadow-3xl border border-gray-100 dark:border-white/5 flex flex-col xl:flex-row items-center gap-24">
            <div className="xl:w-1/3 text-center xl:text-left">
              <h2 className="text-6xl font-black text-gray-900 dark:text-white tracking-tighter uppercase mb-8 leading-tight">Pick Your <span className="text-ino-red">Vibe.</span></h2>
              <p className="text-2xl text-gray-500 dark:text-gray-400 font-bold italic mb-12">How are you feeling today? Let our AI Chef match your mood to the perfect meal.</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-2 gap-6">
                {['Hungry', 'Healthy', 'Adventurous', 'Comfort', 'Late Night', 'Sweet'].map(mood => (
                  <button 
                    key={mood}
                    onClick={() => handleMoodSelect(mood)}
                    className="py-6 bg-gray-50 dark:bg-white/5 rounded-3xl font-black text-xs uppercase tracking-widest text-gray-400 hover:text-ino-red dark:hover:text-white hover:bg-red-50 dark:hover:bg-red-600 transition-all border border-transparent"
                  >
                    {mood}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="xl:w-2/3 w-full min-h-[500px] bg-gray-900 rounded-[4rem] p-16 relative overflow-hidden flex items-center justify-center text-center">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-ino-red/10 blur-[150px] rounded-full"></div>
              {isMoodLoading ? (
                <div className="flex flex-col items-center gap-8">
                  <div className="animate-spin w-20 h-20 border-t-4 border-ino-red rounded-full"></div>
                  <p className="text-gray-500 font-black uppercase tracking-widest text-sm">Matching Cravings...</p>
                </div>
              ) : moodRecommendation ? (
                <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                  <i className="ph-fill ph-cooking-pot text-ino-yellow text-7xl mb-10"></i>
                  <p className="text-4xl lg:text-7xl font-black text-white tracking-tighter mb-12 leading-[1.1]">{moodRecommendation}</p>
                  <Link to="/menu" className="inline-flex items-center gap-4 px-14 py-6 bg-ino-red text-white rounded-full font-black text-xl uppercase tracking-widest hover:scale-110 transition-all">
                    <span>Grab It Now</span><i className="ph-bold ph-arrow-right"></i>
                  </Link>
                </div>
              ) : (
                <div className="text-gray-600 italic font-black text-3xl opacity-30 uppercase tracking-tighter">"Awaiting Cravings..."</div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-40 px-10 dark:bg-black">
        <div className="max-w-ultra mx-auto">
          <header className="flex flex-col md:flex-row items-end justify-between mb-24 gap-12">
            <div className="max-w-5xl">
              <h2 className="text-7xl md:text-9xl font-black text-gray-900 dark:text-white tracking-tighter uppercase mb-8 leading-none">The <span className="text-ino-red">Hall of Taste</span></h2>
              <p className="text-2xl text-gray-500 dark:text-gray-400 font-bold max-w-2xl">Daily favorites hand-picked for their exceptional flavor profiles.</p>
            </div>
            <Link to="/menu" className="px-12 py-5 border-2 border-ino-red text-ino-red dark:text-white dark:border-white/20 rounded-full font-black uppercase tracking-widest hover:bg-ino-red hover:text-white transition-all">Full Menu</Link>
          </header>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16">
            {featuredFoods.map(food => (<FoodCard key={food.id} food={food} />))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
