
import React, { useState } from 'react';
import { MOCK_FOODS, CATEGORIES } from '../../constants.js';
import { GoogleGenAI } from '@google/genai';
import { useToast } from '../../context/ToastContext.jsx';

const ManageProducts = () => {
  const [foods, setFoods] = useState(MOCK_FOODS);
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedVisual, setGeneratedVisual] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const { showToast } = useToast();

  // New Product State
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    category: 'Burgers',
    price: '',
    imageURL: '',
    calories: 500,
    prepTime: '10-15 min'
  });

  const handleAddProduct = (e) => {
    e.preventDefault();
    const product = {
      ...newProduct,
      id: Date.now().toString(),
      isAvailable: true,
      rating: 5.0,
      price: parseFloat(newProduct.price)
    };
    setFoods([product, ...foods]);
    setShowAddModal(false);
    showToast(`${product.name} added to the catalog!`, 'success');
    setNewProduct({ name: '', description: '', category: 'Burgers', price: '', imageURL: '', calories: 500, prepTime: '10-15 min' });
  };

  const handleGenerateVisual = async (foodName) => {
    setIsProcessing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: { parts: [{ text: `Cinematic gourmet photography of ${foodName}, ultra detailed, studio lighting, 4k.` }] },
        config: { imageConfig: { aspectRatio: '1:1', imageSize: '1K' } }
      });
      const imgPart = response.candidates[0].content.parts.find(p => p.inlineData);
      if (imgPart) {
        setGeneratedVisual(`data:image/png;base64,${imgPart.inlineData.data}`);
        showToast('Marketing asset prepared.', 'success');
      }
    } catch (error) {
      showToast('Action failed.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleAvailability = (id) => {
    setFoods(prev => prev.map(f => f.id === id ? { ...f, isAvailable: !f.isAvailable } : f));
  };

  const deleteProduct = (id) => {
    setFoods(foods.filter(f => f.id !== id));
    showToast('Product removed from active catalog.', 'info');
  };

  return (
    <div className="py-20 bg-gray-50 dark:bg-black min-h-screen">
      <div className="max-w-ultra mx-auto px-6 sm:px-10 lg:px-16">
        <header className="flex justify-between items-end mb-16">
          <div>
            <h1 className="text-6xl font-black text-gray-900 dark:text-white tracking-tighter uppercase">Inventory <span className="text-ino-red">Hub</span></h1>
            <p className="text-gray-500 font-bold mt-2">Manage neighborhood menu items.</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="px-10 py-4 bg-ino-red text-white rounded-2xl font-black uppercase tracking-widest shadow-xl hover:bg-red-700 transition-all active:scale-95"
          >
            <i className="ph-bold ph-plus mr-2"></i> Add Item
          </button>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {foods.map(food => (
            <div key={food.id} className="warm-card p-8 rounded-[3rem] shadow-xl border border-gray-100 dark:border-white/5 flex flex-col relative group">
              <div className="relative h-40 overflow-hidden rounded-2xl mb-6">
                <img src={food.imageURL} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" alt="" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                   <button onClick={() => handleGenerateVisual(food.name)} className="w-10 h-10 bg-white rounded-lg text-ino-clay hover:bg-ino-red hover:text-white transition-all" title="Prepare Visual"><i className="ph-fill ph-sparkle"></i></button>
                </div>
              </div>
              <h3 className="text-xl font-black dark:text-white uppercase leading-tight mb-2">{food.name}</h3>
              <p className="text-ino-red font-black text-2xl mb-8">${food.price.toFixed(2)}</p>
              
              <div className="mt-auto pt-6 border-t border-ino-clay/5 flex items-center justify-between">
                <button 
                  onClick={() => toggleAvailability(food.id)}
                  className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${food.isAvailable ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}
                >
                  {food.isAvailable ? 'Available' : 'Unavailable'}
                </button>
                <button onClick={() => deleteProduct(food.id)} className="text-gray-300 hover:text-ino-red transition-colors">
                  <i className="ph-bold ph-trash text-xl"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
          <div className="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-[3rem] p-10 shadow-3xl border border-gray-100 dark:border-white/5">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-3xl font-black uppercase tracking-tighter dark:text-white">New <span className="text-ino-red">Product</span></h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-ino-red"><i className="ph ph-x text-2xl"></i></button>
            </div>
            <form onSubmit={handleAddProduct} className="grid grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Item Name</label>
                <input required type="text" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 p-4 rounded-xl border-none outline-none dark:text-white" placeholder="e.g. Avocado Crunch Burger" />
              </div>
              <div className="col-span-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Description</label>
                <textarea required value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 p-4 rounded-xl border-none outline-none dark:text-white" rows="3" placeholder="Description..."></textarea>
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Category</label>
                <select value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 p-4 rounded-xl border-none outline-none dark:text-white">
                  {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Price (ETB)</label>
                <input required type="number" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 p-4 rounded-xl border-none outline-none dark:text-white" placeholder="0.00" />
              </div>
              <div className="col-span-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Image Link</label>
                <input required type="text" value={newProduct.imageURL} onChange={e => setNewProduct({...newProduct, imageURL: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 p-4 rounded-xl border-none outline-none dark:text-white" placeholder="https://..." />
              </div>
              <button type="submit" className="col-span-2 py-5 bg-ino-red text-white rounded-xl font-black uppercase tracking-widest hover:bg-red-700 transition-all mt-4 shadow-xl">Confirm Product</button>
            </form>
          </div>
        </div>
      )}

      {generatedVisual && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-10 bg-black/90 backdrop-blur-xl">
           <div className="max-w-xl w-full text-center">
              <img src={generatedVisual} className="w-full rounded-[3rem] shadow-3xl mb-10" alt="Asset Preview" />
              <button onClick={() => setGeneratedVisual(null)} className="px-12 py-5 bg-ino-red text-white rounded-full font-black uppercase tracking-widest">Discard Asset</button>
           </div>
        </div>
      )}
    </div>
  );
};

export default ManageProducts;
