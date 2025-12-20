
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

const FoodCard = ({ food }) => {
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!food.isAvailable) {
      showToast("Just ran out! Check back soon.", 'error');
      return;
    }

    addToCart(food, {});
    showToast(`Coming right up! ${food.name} added.`, 'success');
  };

  return (
    <div className="warm-card rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg flex flex-col h-full group relative">
      <Link to={`/food/${food.id}`} className="block flex flex-col h-full">
        <div className="relative h-48 md:h-56 overflow-hidden">
          <img 
            src={food.imageURL} 
            alt={food.name} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute bottom-3 right-3 bg-white/95 dark:bg-black/90 px-2 py-1 rounded-lg flex items-center gap-1 shadow-md border border-ino-clay/5">
            <i className="ph-fill ph-heart text-ino-red text-[10px]"></i>
            <span className="text-gray-900 dark:text-white font-black text-[10px]">{food.rating}</span>
          </div>
        </div>

        <div className="p-4 md:p-6 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-1">
             <div className="flex flex-col">
                <h3 className="text-lg font-black text-gray-950 dark:text-white tracking-tight uppercase leading-none">{food.name}</h3>
                <span className="text-[8px] font-black text-ino-clay/60 dark:text-gray-400 uppercase tracking-widest mt-1">Handcrafted {food.category}</span>
             </div>
             <span className="text-lg font-black text-ino-clay dark:text-ino-yellow tracking-tighter">${food.price.toFixed(2)}</span>
          </div>
          
          <p className="text-gray-500 dark:text-gray-400 text-[10px] font-medium mb-6 line-clamp-2 h-6 italic">
            "{food.description}"
          </p>

          <button 
            onClick={handleAddToCart}
            disabled={!food.isAvailable}
            className="mt-auto w-full py-3 bg-ino-cream dark:bg-white/5 text-ino-clay dark:text-white rounded-lg font-black text-[9px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 border border-ino-clay/10 hover:bg-ino-red hover:text-white hover:border-ino-red active:scale-95 disabled:opacity-50"
          >
            <i className="ph-bold ph-plus text-xs"></i>
            <span>{food.isAvailable ? 'Cook This For Me' : 'Resting'}</span>
          </button>
        </div>
      </Link>
    </div>
  );
};

export default FoodCard;
