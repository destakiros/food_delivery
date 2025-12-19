
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FoodItem, Review } from '../types';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import { GoogleGenAI } from "@google/genai";
import { MOCK_FOODS, DetailedFoodItem } from '../constants';

const FoodDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [food, setFood] = useState<DetailedFoodItem | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const { user } = useAuth();
  const [aiTip, setAiTip] = useState<string | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        let foodData;
        try {
          foodData = await apiService.get(`/menu/${id}`);
          foodData = { ...foodData, id: foodData._id };
        } catch (e) {
          foodData = MOCK_FOODS.find(f => f.id === id);
        }
        
        if (!foodData) throw new Error('Not found');
        
        setFood(foodData);
        if (foodData.options) {
          const defaults: Record<string, string> = {};
          foodData.options.forEach(opt => {
            defaults[opt.name] = opt.choices[0];
          });
          setSelectedOptions(defaults);
        }

        try {
          const reviewsData = await apiService.get(`/reviews/${id}`);
          setReviews(reviewsData);
        } catch (e) {
          setReviews([]);
        }
        
        if (foodData) fetchAiTip(foodData);
      } catch (error) {
        showToast('Item Unavailable', 'error');
        navigate('/menu');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  const fetchAiTip = async (item: any) => {
    try {
      // Direct initialization using process.env.API_KEY as per Google GenAI guidelines
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `You are a professional chef. Provide a 15-word sophisticated pairing or fact for "${item.name}". Be elegant.`,
      });
      // Correctly access .text property from GenerateContentResponse
      setAiTip(response.text);
    } catch (error) {
      console.error("AI fetch error:", error);
    }
  };

  const handleOptionSelect = (optionName: string, choice: string) => {
    setSelectedOptions(prev => ({ ...prev, [optionName]: choice }));
  };

  const handleAddToCart = () => {
    if (food) {
      addToCart(food, selectedOptions);
      showToast('Masterpiece added to order.', 'success');
    }
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      showToast('Elite access required for reviews.', 'error');
      return;
    }
    try {
      const review = await apiService.post('/reviews', {
        menuItemId: id,
        rating: newRating,
        comment: newComment
      });
      setReviews([review, ...reviews]);
      setNewComment('');
      showToast('Critique Published', 'success');
    } catch (error) {
      showToast('Failed to post critique', 'error');
    }
  };

  if (loading || !food) return (
    <div className="h-screen flex items-center justify-center bg-white">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#D62828]"></div>
    </div>
  );

  return (
    <div className="py-20 bg-gray-50 min-h-screen">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12">
        <Link to="/menu" className="inline-flex items-center text-[12px] font-black text-gray-400 hover:text-[#D62828] uppercase tracking-[0.4em] mb-12 transition-all">
          <i className="ph-bold ph-arrow-left mr-3"></i> Back to Archive
        </Link>

        <div className="bg-white rounded-[4rem] shadow-elite border border-gray-100 overflow-hidden lg:flex min-h-[700px]">
          {/* Hero Image Section */}
          <div className="lg:w-1/2 relative overflow-hidden bg-gray-100">
            <img src={food.imageURL} alt={food.name} className="w-full h-full object-cover animate-slow-zoom" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:hidden"></div>
            
            <div className="absolute top-10 left-10 flex flex-col gap-4">
              {food.isSecretMenu && (
                <span className="bg-[#FFCA3A] text-black premium-badge glow-yellow border border-white/20">Secret Menu</span>
              )}
              <span className="bg-white/90 backdrop-blur-md text-gray-900 premium-badge border border-gray-100">Est. {food.prepTime}</span>
            </div>
          </div>
          
          {/* Details Content Section */}
          <div className="lg:w-1/2 p-12 lg:p-24 flex flex-col justify-center">
            <div className="flex items-center space-x-6 mb-10">
              <span className="text-[12px] font-black text-[#D62828] uppercase tracking-[0.5em]">{food.category}</span>
              <div className="h-1 w-1 bg-gray-200 rounded-full"></div>
              <div className="flex items-center gap-2">
                <i className="ph-fill ph-star text-[#FFCA3A] text-xl"></i>
                <span className="text-gray-900 font-black text-lg tracking-tighter">{food.rating}</span>
                <span className="text-gray-400 font-bold text-sm">({reviews.length} Critiques)</span>
              </div>
            </div>
            
            <h1 className="text-6xl lg:text-8xl font-black text-gray-900 mb-8 tracking-tighter uppercase leading-none">{food.name}</h1>
            <p className="text-2xl text-gray-500 mb-12 leading-relaxed font-medium">{food.description}</p>
            
            <div className="grid grid-cols-2 gap-12 mb-12">
               <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Nutritional Data</p>
                  <p className="text-3xl font-black text-gray-900 tracking-tighter">{food.calories} <span className="text-sm text-gray-400">KCAL</span></p>
               </div>
               <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Valuation</p>
                  <p className="text-5xl font-black text-[#D62828] tracking-tighter">${food.price.toFixed(2)}</p>
               </div>
            </div>

            {aiTip && (
              <div className="mb-12 p-8 bg-gray-900 rounded-[2.5rem] border-l-8 border-[#D62828] shadow-2xl">
                <p className="text-lg font-bold text-gray-300 italic leading-relaxed">
                  <span className="text-[#D62828] uppercase font-black tracking-widest text-[10px] block mb-2">Chef's Master Note</span>
                  "{aiTip}"
                </p>
              </div>
            )}

            {food.options && food.options.length > 0 && (
              <div className="space-y-10 mb-16">
                {food.options.map((opt) => (
                  <div key={opt.name}>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-4">Customize {opt.name}</p>
                    <div className="flex flex-wrap gap-3">
                      {opt.choices.map((choice) => (
                        <button
                          key={choice}
                          onClick={() => handleOptionSelect(opt.name, choice)}
                          className={`px-8 py-4 rounded-2xl text-[12px] font-black tracking-widest uppercase transition-all border ${
                            selectedOptions[opt.name] === choice
                              ? 'bg-[#D62828] text-white border-[#D62828] shadow-xl glow-red scale-105'
                              : 'bg-white text-gray-600 border-gray-100 hover:border-[#D62828]/30'
                          }`}
                        >
                          {choice}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button 
              onClick={handleAddToCart}
              disabled={!food.isAvailable}
              className={`w-full py-8 rounded-[2.5rem] font-black text-2xl uppercase tracking-[0.2em] shadow-3xl transition-all flex items-center justify-center space-x-6 ${
                food.isAvailable 
                ? 'bg-gray-950 text-white hover:bg-black glow-red' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <i className="ph-bold ph-shopping-bag"></i>
              <span>{food.isAvailable ? 'Secure Your Order' : 'Inventory Depleted'}</span>
            </button>
          </div>
        </div>
        
        {/* Review Section Redesign */}
        <div className="mt-32">
          <h2 className="text-5xl font-black text-gray-900 mb-16 tracking-tighter uppercase">Culinary <span className="text-[#D62828]">Critiques</span></h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
            <div className="lg:col-span-2 space-y-8">
              {reviews.length === 0 ? (
                <div className="p-20 text-center bg-white rounded-[3rem] border border-gray-100">
                  <i className="ph ph-chat-centered-text text-6xl text-gray-100 mb-6 block"></i>
                  <p className="text-gray-400 font-bold uppercase tracking-widest">No critiques yet. Be the first to review.</p>
                </div>
              ) : (
                reviews.map(review => (
                  <div key={review.id || (review as any)._id} className="bg-white p-12 rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all">
                    <div className="flex justify-between items-start mb-8">
                      <div className="flex items-center space-x-6">
                        <img src={`https://ui-avatars.com/api/?name=${review.userName}&background=D62828&color=fff&bold=true`} className="w-16 h-16 rounded-[1.5rem]" alt="" />
                        <div>
                          <h4 className="text-xl font-black text-gray-900 tracking-tighter uppercase">{review.userName}</h4>
                          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{new Date(review.date || (review as any).createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex gap-1 text-[#FFCA3A]">
                        {[...Array(5)].map((_, i) => (
                          <i key={i} className={`ph-fill ph-star ${i < review.rating ? '' : 'text-gray-100'}`}></i>
                        ))}
                      </div>
                    </div>
                    <p className="text-xl text-gray-600 leading-relaxed font-medium italic">"{review.comment}"</p>
                  </div>
                ))
              )}
            </div>
            
            <div className="bg-gray-950 p-12 rounded-[4rem] shadow-2xl h-fit sticky top-32 border border-white/5">
              <h3 className="text-3xl font-black text-white mb-10 tracking-tighter uppercase">Leave a <span className="text-[#D62828]">Critique</span></h3>
              <form onSubmit={handleAddReview} className="space-y-8">
                <div>
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4 block">Select Rating</label>
                  <div className="flex gap-4 text-3xl text-[#FFCA3A]">
                    {[1, 2, 3, 4, 5].map(num => (
                      <button key={num} type="button" onClick={() => setNewRating(num)} className="focus:outline-none transition-transform hover:scale-125">
                        <i className={`${newRating >= num ? 'ph-fill' : 'ph'} ph-star`}></i>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4 block">Your Experience</label>
                  <textarea 
                    className="w-full p-8 bg-white/5 rounded-[2rem] border border-white/10 focus:ring-4 focus:ring-[#D62828]/20 transition-all outline-none text-white font-medium text-lg placeholder:text-gray-700"
                    rows={5}
                    placeholder="Refine your thoughts..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    required
                  ></textarea>
                </div>
                <button type="submit" className="w-full py-6 bg-[#D62828] text-white rounded-[2rem] font-black text-xl uppercase tracking-widest hover:bg-red-700 transition-all glow-red">Publish Review</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodDetails;
