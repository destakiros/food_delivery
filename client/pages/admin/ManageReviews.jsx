
import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api.js';
import { useToast } from '../../context/ToastContext.jsx';

const ManageReviews = () => {
  const [reviews, setReviews] = useState([]);
  const { showToast } = useToast();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('demo_reviews') || '[]');
    if (saved.length > 0) {
      setReviews(saved);
    } else {
      setReviews([
        { id: '1', userName: 'Daniel T.', rating: 5, comment: 'Always fresh, always perfect.', date: new Date().toISOString() }
      ]);
    }
  }, []);

  const handleAction = (id, action) => {
    if (action === 'DELETE') {
      const filtered = reviews.filter(r => r.id !== id);
      setReviews(filtered);
      localStorage.setItem('demo_reviews', JSON.stringify(filtered));
      showToast('Critique removed.', 'success');
    }
  };

  return (
    <div className="py-20 bg-gray-50 dark:bg-black min-h-screen">
      <div className="max-w-ultra mx-auto px-6 sm:px-10 lg:px-16">
        <h1 className="text-6xl font-black text-gray-900 dark:text-white mb-16 tracking-tighter uppercase">Critique <span className="text-ino-red">Lab</span></h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {reviews.map(r => (
            <div key={r.id} className="bg-white dark:bg-gray-900 p-10 rounded-[3rem] shadow-xl border border-gray-100 dark:border-white/5">
              <div className="flex justify-between items-start mb-8">
                <h4 className="font-black dark:text-white uppercase">{r.userName}</h4>
                <div className="text-ino-yellow flex gap-1"><i className="ph-fill ph-star"></i> {r.rating}</div>
              </div>
              <p className="text-gray-500 font-bold italic mb-10">"{r.comment}"</p>
              <button onClick={() => handleAction(r.id, 'DELETE')} className="text-[10px] font-black uppercase text-gray-400 hover:text-ino-red transition-colors">Discard Review</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageReviews;
