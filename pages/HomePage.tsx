import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MOCK_FOODS, CATEGORIES } from '../constants';
import FoodCard from '../components/FoodCard';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const featuredFoods = MOCK_FOODS.slice(0, 4); 
  
  const [stats, setStats] = useState({ orders: 0, cities: 0, rating: 0 });

  useEffect(() => {
    const timer = setTimeout(() => {
      setStats({ orders: 1284, cities: 1, rating: 4.9 });
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="overflow-hidden bg-[#fafafa]">
      {/* Cinematic Hero Section */}
      <header className="relative h-[95vh] min-h-[850px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gray-950">
           <img 
            src="https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&q=90&w=2000" 
            className="w-full h-full object-cover opacity-60 animate-slow-zoom"
            alt="Hero Background"
           />
           <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-950/40 to-gray-950"></div>
        </div>
        
        <div className="relative z-10 text-center max-w-[1600px] px-8">
          <div className="inline-flex items-center space-x-4 bg-white/5 backdrop-blur-3xl px-8 py-3 rounded-full mb-10 border border-white/10 animate-fade-in shadow-2xl">
             <span className="flex h-2.5 w-2.5 rounded-full bg-[#FFCA3A] animate-ping"></span>
             <span className="text-[10px] font-black text-white uppercase tracking-[0.5em]">Addis Ababa's Most Loved Burgers</span>
          </div>
          
          <h1 className="text-7xl md:text-[180px] font-black mb-8 text-white tracking-tighter leading-[0.85] uppercase select-none">
            Elite <span className="text-[#D62828]">Taste</span><br/>Delivered.
          </h1>

          <p className="text-lg md:text-2xl text-gray-300 font-medium mb-16 max-w-2xl mx-auto leading-relaxed italic opacity-90">
            Hand-crafted in our local hub. No microwaves. No freezers. Just fresh ingredients delivered from Bole to Piazza.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link 
              to="/menu" 
              className="group px-14 py-6 bg-[#D62828] text-white rounded-[2rem] font-black text-xl uppercase tracking-[0.2em] shadow-2xl hover:bg-red-700 transition-all hover:scale-105 active:scale-95 flex items-center gap-4 glow-red"
            >
              <span>Order Now</span>
              <i className="ph-bold ph-shopping-bag group-hover:translate-y-[-2px] transition-transform"></i>
            </Link>
            <button className="px-14 py-6 bg-white/10 backdrop-blur-xl text-white rounded-[2rem] font-black text-xl uppercase tracking-[0.2em] border border-white/20 hover:bg-white/20 transition-all">
              Our Legacy
            </button>
          </div>
        </div>
      </header>

      {/* Trust Signals Bar */}
      <div className="bg-white py-12 border-y border-gray-100">
        <div className="max-w-[1600px] mx-auto px-8 flex flex-wrap justify-center md:justify-between gap-12 text-gray-950">
           <div className="flex items-center gap-6">
              <i className="ph-fill ph-timer text-4xl text-[#D62828]"></i>
              <div>
                 <p className="font-black uppercase tracking-widest text-[10px]">45 Min Delivery</p>
                 <p className="text-gray-500 font-bold text-sm">Across Addis Grid</p>
              </div>
           </div>
           <div className="flex items-center gap-6">
              <i className="ph-fill ph-leaf text-4xl text-green-500"></i>
              <div>
                 <p className="font-black uppercase tracking-widest text-[10px]">100% Fresh</p>
                 <p className="text-gray-500 font-bold text-sm">No Freezers Used</p>
              </div>
           </div>
           <div className="flex items-center gap-6">
              <i className="ph-fill ph-shield-check text-4xl text-blue-500"></i>
              <div>
                 <p className="font-black uppercase tracking-widest text-[10px]">Elite Safety</p>
                 <p className="text-gray-500 font-bold text-sm">Sealed Packaging</p>
              </div>
           </div>
           <div className="flex items-center gap-6">
              <i className="ph-fill ph-star text-4xl text-[#FFCA3A]"></i>
              <div>
                 <p className="font-black uppercase tracking-widest text-[10px]">4.9 Rating</p>
                 <p className="text-gray-500 font-bold text-sm">Top Rated in Addis</p>
              </div>
           </div>
        </div>
      </div>

      {/* Featured Collection */}
      <section className="py-32 px-8">
        <div className="max-w-[1600px] mx-auto">
          <header className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
            <div className="max-w-4xl">
              <h2 className="text-5xl md:text-8xl font-black text-gray-900 tracking-tighter uppercase mb-6 leading-none">
                Addis <span className="text-[#D62828]">Favorites</span>
              </h2>
              <p className="text-xl text-gray-500 font-bold max-w-xl">The most ordered dishes from our central kitchen this week.</p>
            </div>
            <Link to="/menu" className="text-xl font-black text-[#D62828] uppercase tracking-widest hover:underline flex items-center gap-4 group">
              View Full Menu <i className="ph-bold ph-arrow-right group-hover:translate-x-2 transition-transform"></i>
            </Link>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {featuredFoods.map(food => (
              <FoodCard key={food.id} food={food} />
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-32 px-8 bg-gray-900 text-white rounded-[4rem] mx-4 md:mx-12 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[#D62828]/10 blur-[120px] rounded-full"></div>
        <div className="max-w-[1600px] mx-auto relative z-10">
          <div className="text-center mb-24">
            <p className="text-[#FFCA3A] font-black uppercase tracking-[0.5em] text-xs mb-4">The Pipeline</p>
            <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter">How we <span className="text-[#D62828]">Roll</span></h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-24">
            <div className="text-center group">
               <div className="w-24 h-24 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-10 group-hover:bg-[#D62828] transition-all rotate-3">
                  <i className="ph ph-hand-pointing text-4xl text-[#D62828] group-hover:text-white"></i>
               </div>
               <h3 className="text-2xl font-black uppercase mb-4 tracking-tighter">1. Select Dish</h3>
               <p className="text-gray-400 font-medium leading-relaxed">Browse our curated archive of burgers, shakes, and sides designed for Addis elite.</p>
            </div>
            <div className="text-center group">
               <div className="w-24 h-24 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-10 group-hover:bg-[#D62828] transition-all -rotate-6">
                  <i className="ph ph-cooking-pot text-4xl text-[#D62828] group-hover:text-white"></i>
               </div>
               <h3 className="text-2xl font-black uppercase mb-4 tracking-tighter">2. Expert Prep</h3>
               <p className="text-gray-400 font-medium leading-relaxed">Our chefs prepare your order fresh using 100% premium local ingredients and no heat lamps.</p>
            </div>
            <div className="text-center group">
               <div className="w-24 h-24 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-10 group-hover:bg-[#D62828] transition-all rotate-12">
                  <i className="ph ph-moped text-4xl text-[#D62828] group-hover:text-white"></i>
               </div>
               <h3 className="text-2xl font-black uppercase mb-4 tracking-tighter">3. Rapid Delivery</h3>
               <p className="text-gray-400 font-medium leading-relaxed">Our specialized Addis courier team navigates the fastest routes to reach your door in under 45 mins.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Local Testimonials */}
      <section className="py-40 px-8">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-24">
             <h2 className="text-5xl font-black text-gray-900 tracking-tighter uppercase mb-4 leading-tight">Word on the <span className="text-[#D62828]">Streets</span></h2>
             <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Verified Addis Critiques</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white p-12 rounded-[3rem] border border-gray-100 shadow-xl relative">
               <i className="ph-fill ph-quotes absolute top-10 right-10 text-gray-50 text-8xl -z-10"></i>
               <div className="flex items-center gap-6 mb-8">
                  <img src="https://ui-avatars.com/api/?name=Sara+K&background=D62828&color=fff&bold=true" className="w-16 h-16 rounded-2xl" alt="" />
                  <div>
                    <h4 className="font-black uppercase tracking-tighter">Sara K.</h4>
                    <p className="text-xs text-gray-400 font-bold uppercase">Bole Resident</p>
                  </div>
               </div>
               <p className="text-lg text-gray-600 font-medium italic leading-relaxed">"The Gomen Beef Burger is a revelation. I've lived in Addis all my life and this is the first time someone got local fusion perfectly right."</p>
            </div>
            <div className="bg-white p-12 rounded-[3rem] border border-gray-100 shadow-xl">
               <div className="flex items-center gap-6 mb-8">
                  <img src="https://ui-avatars.com/api/?name=Dawit+M&background=D62828&color=fff&bold=true" className="w-16 h-16 rounded-2xl" alt="" />
                  <div>
                    <h4 className="font-black uppercase tracking-tighter">Dawit M.</h4>
                    <p className="text-xs text-gray-400 font-bold uppercase">Piazza Office Hub</p>
                  </div>
               </div>
               <p className="text-lg text-gray-600 font-medium italic leading-relaxed">"Delivery is incredibly fast. They actually beat the 45-minute promise during rush hour near Meskel Square. Best lunch in the city."</p>
            </div>
          </div>
        </div>
      </section>

      {/* App Promo Section */}
      <section className="py-32 px-8 bg-[#D62828] text-white">
        <div className="max-w-[1600px] mx-auto grid lg:grid-cols-2 items-center gap-24">
           <div>
              <h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase mb-8 leading-none">The Kitchen in Your <span className="text-[#FFCA3A]">Pocket</span></h2>
              <p className="text-2xl font-bold opacity-90 mb-12 max-w-xl">Download the IN-N-OUT Addis app for exclusive secret menu access and real-time satellite tracking.</p>
              <div className="flex flex-wrap gap-6">
                 <button className="bg-gray-950 px-10 py-5 rounded-2xl flex items-center gap-4 hover:scale-105 transition-all">
                    <i className="ph-fill ph-app-store-logo text-3xl"></i>
                    <div className="text-left">
                       <p className="text-[10px] uppercase font-black opacity-60">Download on</p>
                       <p className="text-lg font-black uppercase">App Store</p>
                    </div>
                 </button>
                 <button className="bg-gray-950 px-10 py-5 rounded-2xl flex items-center gap-4 hover:scale-105 transition-all">
                    <i className="ph-fill ph-google-play-logo text-3xl"></i>
                    <div className="text-left">
                       <p className="text-[10px] uppercase font-black opacity-60">Get it on</p>
                       <p className="text-lg font-black uppercase">Google Play</p>
                    </div>
                 </button>
              </div>
           </div>
           <div className="relative">
              <div className="bg-white/10 backdrop-blur-3xl rounded-[4rem] p-12 border border-white/10 animate-float">
                 <img src="https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&q=80&w=800" className="rounded-[2.5rem] shadow-3xl" alt="Mobile App View" />
              </div>
           </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;