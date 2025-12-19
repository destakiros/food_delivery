
import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CATEGORIES, MOCK_FOODS, DetailedFoodItem } from '../constants';
import FoodCard from '../components/FoodCard';
import { apiService } from '../services/api';

const MenuPage: React.FC = () => {
  // Use DetailedFoodItem instead of FoodItem to ensure all properties like prepTime and calories are present for FoodCard
  const [foods, setFoods] = useState<DetailedFoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  
  const selectedCategory = searchParams.get('category') || 'All';

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const data = await apiService.get('/menu');
        if (data && data.length > 0) {
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
           <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#D62828] mb-4"></div>
           <p className="font-black text-gray-400 uppercase tracking-widest text-xs">Assembling Your Menu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-20 bg-gray-50 min-h-screen">
      <div className="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-12">
        <header className="mb-20">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-12 mb-12">
            <div>
              <h1 className="text-5xl lg:text-7xl font-black text-gray-900 tracking-tighter mb-4 uppercase">
                The <span className="text-[#D62828]">Daily</span> Menu
              </h1>
              <p className="text-xl text-gray-500 font-bold uppercase tracking-widest text-xs">Quality You Can Taste.</p>
            </div>
            <div className="relative group w-full md:max-w-md">
              <i className="ph ph-magnifying-glass absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#D62828] transition-colors text-xl"></i>
              <input 
                type="text" 
                placeholder="Find a Burger or Shake..." 
                className="w-full pl-14 pr-6 py-5 bg-white rounded-3xl border-none shadow-xl shadow-gray-200/50 ring-1 ring-gray-100 focus:ring-4 focus:ring-red-500/10 transition-all outline-none text-lg font-bold"
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
                className={`px-10 py-4 rounded-2xl text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all duration-300 ${
                  selectedCategory.toLowerCase() === category.toLowerCase() 
                    ? 'bg-[#D62828] text-white shadow-xl shadow-red-200 scale-105' 
                    : 'bg-white text-gray-600 hover:bg-red-50 hover:text-[#D62828] border border-gray-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </header>

        {filteredFoods.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-12">
            {filteredFoods.map(food => (
              // food is now typed as DetailedFoodItem, satisfying FoodCard's props
              <FoodCard key={food.id} food={food} />
            ))}
          </div>
        ) : (
          <div className="text-center py-40 bg-white rounded-[4rem] shadow-xl border border-gray-100">
            <h3 className="text-4xl font-black text-gray-900 mb-4 tracking-tighter uppercase">No Match Found</h3>
            <button 
              onClick={() => { setSearchTerm(''); handleCategoryChange('All'); }}
              className="px-12 py-5 bg-[#D62828] text-white rounded-[2rem] font-black text-xl hover:bg-red-700 shadow-2xl transition-all"
            >
              Show All Items
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuPage;
