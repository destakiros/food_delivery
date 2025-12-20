
import React, { useState, useEffect } from 'react';
import { Review } from '../../types';
import { apiService } from '../../services/api';
import { useToast } from '../../context/ToastContext';

const ManageReviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const fetchReviews = async () => {
    setLoading(true);
    try {
      // Mocking fetch as real API might be empty
      const savedReviews = JSON.parse(localStorage.getItem('demo_reviews') || '[]');
      if (savedReviews.length > 0) {
        setReviews(savedReviews);
      } else {
        const mock: Review[] = [
          {
            id: '1',
            userId: 'cust-1',
            userName: 'Daniel T.',
            menuItemId: '1',
            rating: 5,
            comment: 'Best Double-Double in Addis. The sauce is perfectly balanced!',
            date: new Date().toISOString()
          },
          {
            id: '2',
            userId: 'cust-2',
            userName: 'Sara L.',
            menuItemId: '16',
            rating: 2,
            comment: 'The burger was a bit cold when it arrived.',
            date: new Date().toISOString()
          }
        ];
        setReviews(mock);
        localStorage.setItem('demo_reviews', JSON.stringify(mock));
      }
    } catch (e) {
      showToast('Offline Mode: Using local archives', 'info');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleModeration = (id: string, action: 'LIKE' | 'DISLIKE' | 'DELETE') => {
    if (action === 'DELETE') {
      const filtered = reviews.filter(r => r.id !== id);
      setReviews(filtered);
      localStorage.setItem('demo_reviews', JSON.stringify(filtered));
      showToast('Review Removed', 'success');
    } else {
      const updated = reviews.map(r => r.id === id ? { ...r, adminFeedback: action === 'LIKE' ? 'Like' as const : 'Dislike' as const } : r);
      setReviews(updated);
      localStorage.setItem('demo_reviews', JSON.stringify(updated));
      showToast(`Review marked as ${action === 'LIKE' ? 'Positive' : 'Concerning'}`, 'success');
    }
  };

  return (
    <div className="py-20 bg-gray-50 dark:bg-gray-950 min-h-screen">
      <div className="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-12">
        <header className="mb-16">
          <h1 className="text-6xl font-black text-gray-900 dark:text-white tracking-tighter uppercase">Critique <span className="text-red-600">Lab</span></h1>
          <p className="text-2xl text-gray-400 font-bold mt-4">Moderate and analyze customer culinary feedback.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {reviews.map(review => (
            <div key={review.id} className="bg-white dark:bg-gray-900 rounded-[3rem] p-10 shadow-xl border border-gray-100 dark:border-white/5 flex flex-col justify-between">
               <div>
                  <div className="flex justify-between items-start mb-8">
                     <div className="flex items-center gap-4">
                        <img src={`https://ui-avatars.com/api/?name=${review.userName}&background=D62828&color=fff&bold=true`} className="w-14 h-14 rounded-2xl" alt="" />
                        <div>
                           <p className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter">{review.userName}</p>
                           <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{new Date(review.date).toLocaleDateString()}</p>
                        </div>
                     </div>
                     <div className="flex text-yellow-400 text-sm">
                        {[...Array(5)].map((_, i) => (
                           <i key={i} className={`${i < review.rating ? 'ph-fill' : 'ph'} ph-star`}></i>
                        ))}
                     </div>
                  </div>
                  <p className="text-xl text-gray-600 dark:text-gray-300 font-bold italic mb-10 leading-relaxed">"{review.comment}"</p>
               </div>

               <div className="flex items-center justify-between pt-8 border-t border-gray-50 dark:border-white/5">
                  <div className="flex gap-4">
                     <button 
                        onClick={() => handleModeration(review.id, 'LIKE')}
                        className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${review.adminFeedback === 'Like' ? 'bg-green-500 text-white' : 'bg-gray-50 dark:bg-gray-800 text-gray-400 hover:text-green-500'}`}
                     >
                        <i className="ph-fill ph-thumbs-up text-xl"></i>
                     </button>
                     <button 
                        onClick={() => handleModeration(review.id, 'DISLIKE')}
                        className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${review.adminFeedback === 'Dislike' ? 'bg-red-600 text-white' : 'bg-gray-50 dark:bg-gray-800 text-gray-400 hover:text-red-600'}`}
                     >
                        <i className="ph-fill ph-thumbs-down text-xl"></i>
                     </button>
                  </div>
                  <button 
                     onClick={() => handleModeration(review.id, 'DELETE')}
                     className="text-[10px] font-black uppercase text-gray-400 hover:text-red-600 tracking-widest transition-all"
                  >
                     Delete Critique
                  </button>
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageReviews;
