
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { GoogleGenAI } from "@google/genai";
import { apiService } from '../services/api.js';

const OrderTracking = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [riderPos, setRiderPos] = useState({ lat: 9.0300, lng: 38.7400 }); 
  const [insightLinks, setInsightLinks] = useState([]);
  const [nearbyContext, setNearbyContext] = useState("");
  const [eta, setEta] = useState(15);
  const [progress, setProgress] = useState(20);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await apiService.get(`/orders/${id}`);
        setOrder(data || { id, orderStatus: 'Out for Delivery' });
      } catch (e) {
        setOrder({ id: id || 'demo', orderStatus: 'Out for Delivery' });
      }
    };
    fetchOrder();

    const moveInterval = setInterval(() => {
      setRiderPos(prev => ({
        lat: prev.lat + 0.0003,
        lng: prev.lng + 0.0003
      }));
      setEta(prev => Math.max(1, prev - 0.1));
      setProgress(prev => Math.min(100, prev + 0.4));
    }, 5000);
    return () => clearInterval(moveInterval);
  }, [id]);

  useEffect(() => {
    const fetchContext = async () => {
      if (!process.env.API_KEY) return;
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: `Provide a quick status update on the rider's progress through Addis Ababa near coordinates ${riderPos.lat}, ${riderPos.lng}. Keep it under 10 words.`,
          config: {
            tools: [{ googleMaps: {} }],
            toolConfig: { retrievalConfig: { latLng: { latitude: riderPos.lat, longitude: riderPos.lng } } }
          },
        });
        setNearbyContext(response.text || "Courier in motion...");
      } catch (err) {
        console.error("Context Update Error:", err);
      }
    };
    const debounce = setTimeout(fetchContext, 5000);
    return () => clearTimeout(debounce);
  }, [riderPos]);

  if (!order) return <div className="h-screen flex items-center justify-center bg-gray-950 text-white uppercase font-black text-xs">Connecting to Network...</div>;

  return (
    <div className="min-h-screen bg-gray-950 text-white p-10 flex flex-col">
      <header className="max-w-ultra mx-auto w-full mb-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
           <Link to="/orders" className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-ino-red transition-all">
             <i className="ph ph-arrow-left text-2xl"></i>
           </Link>
           <div>
             <h1 className="text-4xl font-black uppercase tracking-tighter">Live Track</h1>
             <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">ID: #{id?.slice(-8).toUpperCase()}</p>
           </div>
        </div>
      </header>

      <div className="max-w-ultra mx-auto w-full grid lg:grid-cols-3 gap-16 flex-grow">
        <div className="lg:col-span-2 bg-gray-900 rounded-[4rem] relative overflow-hidden border border-white/5 flex items-center justify-center min-h-[500px]">
           <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#ffffff11 1px, transparent 1px), linear-gradient(90deg, #ffffff11 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
           <div className="relative text-center z-10">
              <div className="w-20 h-20 bg-ino-red rounded-3xl flex items-center justify-center animate-pulse shadow-3xl mx-auto mb-8">
                 <i className="ph-fill ph-moped text-4xl"></i>
              </div>
              <p className="text-2xl font-black text-gray-400 italic">"{nearbyContext || 'Updating position...'}"</p>
           </div>
        </div>

        <div className="bg-white/5 rounded-[4rem] p-12 border border-white/10">
           <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-10">Real-time Progress</p>
           <div className="flex justify-between items-end mb-12">
              <div>
                 <span className="text-6xl font-black text-ino-yellow">{Math.ceil(eta)}</span>
                 <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mt-2">Mins Remaining</p>
              </div>
              <div className="text-right">
                 <span className="text-6xl font-black text-white">{Math.ceil(progress)}%</span>
                 <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mt-2">Route Progress</p>
              </div>
           </div>
           <div className="h-4 bg-white/5 rounded-full overflow-hidden mb-12">
              <div className="h-full bg-ino-red transition-all duration-1000" style={{ width: `${progress}%` }}></div>
           </div>
           <div className="space-y-6">
              <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                 <h4 className="font-black text-xs uppercase tracking-widest mb-1">Dispatch Hub</h4>
                 <p className="text-gray-500 text-xs font-bold italic">Rider Dawit is navigating the best route to you.</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
