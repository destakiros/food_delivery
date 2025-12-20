
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { DetailedFoodItem } from '../constants';

interface FoodCardProps {
  food: DetailedFoodItem;
}

const FoodCard: React.FC<FoodCardProps> = ({ food }) => {
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!food.isAvailable) {
      showToast('Sorry, this item is currently unavailable.', 'error');
      return;
    }

    const defaultOptions: Record<string, string> = {};
    if (food.options) {
      food.options.forEach(opt => {
        defaultOptions[opt.name] = opt.choices[0];
      });
    }

    addToCart(food, defaultOptions);
    showToast(`${food.name} added!`, 'success');
  };

  return (
    <div className="food-card-premium group">
      <Link to={`/food/${food.id}`} className="block h-full flex flex-col">
        {/* Image Section */}
        <div className="relative h-72 overflow-hidden bg-gray-100">
          <img 
            src={food.imageURL} 
            alt={food.name} 
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800';
            }}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          />
          
          {/* Detailed Badges */}
          <div className="absolute top-6 left-6 flex flex-col gap-2">
            {food.isSecretMenu && (
              <span className="bg-[#FFCA3A] text-[#D62828] premium-badge glow-yellow border border-white/20">
                Secret Menu
              </span>
            )}
            <span className="bg-white/90 backdrop-blur-md text-gray-900 premium-badge border border-gray-100">
              {food.prepTime}
            </span>
          </div>

          {!food.isAvailable && (
            <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px] flex items-center justify-center">
              <span className="bg-white text-black font-black px-8 py-3 rounded-full text-xs uppercase tracking-[0.3em] shadow-2xl">
                Kitchen Closed
              </span>
            </div>
          )}
          
          <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center gap-2 shadow-xl border border-gray-100">
            <i className="ph-fill ph-star text-[#FFCA3A] text-lg"></i>
            <span className="text-gray-900 font-black text-sm">{food.rating}</span>
          </div>

          {/* Bottom Fade Gradient */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white via-white/40 to-transparent"></div>
        </div>

        {/* Content Section */}
        <div className="p-10 pt-4 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-4">
            <div className="flex flex-col">
              <h3 className="text-3xl font-black text-gray-900 tracking-tighter uppercase leading-none mb-2">
                {food.name}
              </h3>
              <div className="flex items-center gap-4">
                 <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{food.category}</span>
                 <span className="h-1 w-1 rounded-full bg-gray-200"></span>
                 <span className="text-[10px] font-black text-[#D62828] uppercase tracking-widest">{food.calories} kcal</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-[#D62828] tracking-tighter block">
                ${food.price.toFixed(2)}
              </span>
            </div>
          </div>
          
          <p className="text-gray-500 text-sm font-medium mb-10 line-clamp-2 leading-relaxed h-10">
            {food.description}
          </p>

          <div className="mt-auto flex items-center gap-4">
            <button 
              onClick={handleAddToCart}
              disabled={!food.isAvailable}
              className={`flex-grow py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 ${
                food.isAvailable 
                ? 'bg-[#D62828] text-white hover:bg-red-700 glow-red shadow-xl active:scale-95' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <i className="ph-bold ph-plus-circle text-lg"></i>
              <span>{food.isAvailable ? 'Quick Add' : 'Out of Stock'}</span>
            </button>
            
            <div className="w-14 h-14 bg-gray-50 rounded-[1.2rem] flex items-center justify-center text-gray-400 hover:text-[#D62828] transition-colors border border-gray-100">
               <i className="ph-bold ph-arrow-up-right text-xl"></i>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default FoodCard;
