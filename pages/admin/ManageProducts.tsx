
import React, { useState } from 'react';
import { MOCK_FOODS } from '../../constants';

const ManageProducts: React.FC = () => {
  const [foods, setFoods] = useState(MOCK_FOODS);

  const toggleAvailability = (id: string) => {
    setFoods(prev => prev.map(f => f.id === id ? { ...f, isAvailable: !f.isAvailable } : f));
  };

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Manage Menu</h1>
            <p className="text-gray-500">Edit products, update prices, and control stock.</p>
          </div>
          <button className="bg-orange-500 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-orange-100 hover:bg-orange-600 transition-all flex items-center">
            <i className="fas fa-plus mr-2"></i> Add New Product
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {foods.map(food => (
            <div key={food.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center space-x-6">
              <img src={food.imageURL} className="w-20 h-20 rounded-2xl object-cover shadow-sm" alt={food.name} />
              <div className="flex-grow">
                <h3 className="font-bold text-gray-900 mb-1">{food.name}</h3>
                <p className="text-sm font-bold text-orange-500 mb-2">${food.price.toFixed(2)}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      onClick={() => toggleAvailability(food.id)}
                      className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${food.isAvailable ? 'bg-green-500' : 'bg-gray-200'}`}
                    >
                      <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${food.isAvailable ? 'left-5.5' : 'left-0.5'}`}></div>
                    </div>
                    <span className="ml-2 text-xs font-bold text-gray-400">{food.isAvailable ? 'On Menu' : 'Hidden'}</span>
                  </div>
                  <div className="flex space-x-2">
                     <button className="p-2 text-gray-400 hover:text-indigo-500 transition-colors"><i className="fas fa-edit"></i></button>
                     <button className="p-2 text-gray-400 hover:text-red-500 transition-colors"><i className="fas fa-trash"></i></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageProducts;
