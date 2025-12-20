
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { GoogleGenAI } from "@google/genai";
import { Order, OrderStatus, Coordinates } from '../types';
import { apiService } from '../services/api';

const OrderTracking: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [riderPos, setRiderPos] = useState<Coordinates>({ lat: 9.0300, lng: 38.7400 }); 
  const [groundingLinks, setGroundingLinks] = useState<{title: string, uri: string}[]>([]);
  const [nearbyLandmark, setNearbyLandmark] = useState<string>("");
  const [eta, setEta] = useState<number>(15);
  const [progress, setProgress] = useState<number>(20);

  const fetchOrder = async () => {
    try {
      const data = await apiService.get(`/orders/${id}`);
      setOrder(data);
    } catch (e) {
      setOrder({
        id: id || 'demo',
        customerId: '1',
        items: [],
        totalAmount: 42.50,
        paymentStatus: 'Paid',
        orderStatus: OrderStatus.OUT_FOR_DELIVERY,
        deliveryAddress: 'Bole Medhanialem, Addis Ababa',
        createdAt: new Date().toISOString()
      });
    }
  };

  useEffect(() => {
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
    const fetchGrounding = async () => {
      if (!process.env.API_KEY) return;
      
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
          // Use standard gemini-2.5-flash for Maps grounding as per instructions
          model: "gemini-2.5-flash",
          contents: `What interesting landmarks or prominent buildings are at these coordinates in Addis Ababa: ${riderPos.lat}, ${riderPos.lng}? Give a brief, sophisticated summary for a hungry customer tracking their food.`,
          config: {
            tools: [{ googleMaps: {} }],
            toolConfig: {
              retrievalConfig: {
                latLng: {
                  latitude: riderPos.lat,
                  longitude: riderPos.lng
                }
              }
            }
          },
        });

        setNearbyLandmark(response.text || "Scanning local landmarks...");
        
        const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
        if (chunks) {
           const links = chunks
            .filter((c: any) => c.maps)
            .map((c: any) => ({
              title: c.maps.title,
              uri: c.maps.uri
            }));
           setGroundingLinks(links);
        }
      } catch (err) {
        console.error("Grounding error:", err);
      }
    };

    const debounce = setTimeout(fetchGrounding, 3000);
    return () => clearTimeout(debounce);
  }, [riderPos]);

  if (!order) return <div className="h-screen flex items-center justify-center bg-gray-950 text-white font-black tracking-widest uppercase text-xs">Accessing Addis Grid...</div>;

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8 flex flex-col">
      <header className="max-w-[1600px] mx-auto w-full mb-12 flex items-center justify-between">
        <div className="flex items-center gap-8">
           <Link to="/orders" className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-[#D62828] transition-all">
             <i className="ph ph-arrow-left text-2xl"></i>
           </Link>
           <div>
             <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-1">Addis Delivery Pipeline</p>
             <h1 className="text-4xl font-black tracking-tighter uppercase">Order #{id?.slice(-8).toUpperCase()}</h1>
           </div>
        </div>
        
        <div className="flex items-center gap-4 bg-white/5 px-8 py-4 rounded-3xl border border-white/10">
           <span className="flex h-3 w-3 rounded-full bg-green-500 animate-ping"></span>
           <span className="text-xs font-black uppercase tracking-widest">Addis Satellite Active</span>
        </div>
      </header>

      <div className="max-w-[1600px] mx-auto w-full grid lg:grid-cols-3 gap-12 flex-grow">
        <div className="lg:col-span-2 bg-gray-900 rounded-[4rem] relative overflow-hidden border border-white/5 shadow-2xl min-h-[500px]">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#ffffff11 1px, transparent 1px), linear-gradient(90deg, #ffffff11 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>
          <div 
            className="absolute z-20 transition-all duration-1000 ease-linear"
            style={{ 
              left: `${progress}%`, 
              top: `${Math.min(progress * 1.2, 80)}%`,
              transform: 'translate(-50%, -50%)' 
            }}
          >
            <div className="relative">
              <div className="absolute -inset-8 bg-[#D62828]/30 blur-2xl rounded-full animate-pulse"></div>
              <div className="w-16 h-16 bg-[#D62828] rounded-[1.2rem] flex items-center justify-center shadow-3xl rotate-45 border-4 border-white">
                <i className="ph-fill ph-moped text-3xl -rotate-45"></i>
              </div>
            </div>
          </div>

          <div className="absolute right-20 bottom-20 z-10">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-3xl border-4 border-gray-950">
               <i className="ph-fill ph-house text-gray-950 text-xl"></i>
            </div>
          </div>

          <div className="absolute bottom-10 left-10 z-30 flex flex-col gap-4">
             <div className="bg-gray-950/80 backdrop-blur-xl p-6 rounded-[2rem] border border-white/10 shadow-2xl max-w-sm">
                <p className="text-[10px] font-black text-[#D62828] uppercase tracking-[0.3em] mb-3">Addis Grounding Context</p>
                <p className="text-sm font-bold text-gray-300 italic mb-4">
                  {nearbyLandmark || "Triangulating local context..."}
                </p>
                {groundingLinks.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {groundingLinks.map((link, i) => (
                      <a 
                        key={i} 
                        href={link.uri} 
                        target="_blank" 
                        className="text-[10px] bg-white/5 hover:bg-[#D62828] px-3 py-1 rounded-full font-black uppercase tracking-widest transition-all border border-white/10"
                      >
                        {link.title} <i className="ph ph-arrow-up-right ml-1"></i>
                      </a>
                    ))}
                  </div>
                )}
             </div>
          </div>
        </div>

        <div className="space-y-12">
           <div className="bg-white/5 rounded-[4rem] p-12 border border-white/10">
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.5em] mb-8">Delivery Status</p>
              <div className="flex items-center justify-between mb-12">
                 <div>
                    <h4 className="text-5xl font-black tracking-tighter text-[#FFCA3A]">{Math.ceil(eta)}</h4>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Mins to Bole</p>
                 </div>
                 <div className="text-right">
                    <h4 className="text-5xl font-black tracking-tighter text-white">{progress.toFixed(0)}%</h4>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Complete</p>
                 </div>
              </div>
              <div className="relative h-4 bg-white/5 rounded-full overflow-hidden mb-12">
                 <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#D62828] to-[#FFCA3A] transition-all duration-1000" style={{ width: `${progress}%` }}></div>
              </div>
              <div className="space-y-6">
                 <div className="flex items-center gap-6 p-6 bg-white/5 rounded-[2rem] border border-white/5">
                    <div className="w-14 h-14 bg-[#D62828] rounded-2xl flex items-center justify-center text-2xl">
                       <i className="ph-fill ph-cooking-pot"></i>
                    </div>
                    <div>
                       <h5 className="font-black uppercase tracking-widest text-sm">Chef Prep</h5>
                       <p className="text-xs text-gray-500 font-bold">Kitchen completed your order</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-6 p-6 bg-[#D62828]/10 rounded-[2rem] border border-[#D62828]/20">
                    <div className="w-14 h-14 bg-[#FFCA3A] rounded-2xl flex items-center justify-center text-black text-2xl">
                       <i className="ph-fill ph-truck"></i>
                    </div>
                    <div>
                       <h5 className="font-black uppercase tracking-widest text-sm text-white">Transit Hub</h5>
                       <p className="text-xs text-[#FFCA3A] font-bold">Courier navigating Addis traffic</p>
                    </div>
                 </div>
              </div>
           </div>
           <div className="bg-gray-900 rounded-[4rem] p-12 border border-white/5 flex items-center gap-8">
              <img src="https://ui-avatars.com/api/?name=Swift&background=D62828&color=fff&bold=true" className="w-24 h-24 rounded-[2.5rem] shadow-2xl" alt="Rider" />
              <div>
                 <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.5em] mb-2">Elite Courier</p>
                 <h4 className="text-2xl font-black tracking-tighter text-white uppercase">Dawit</h4>
                 <div className="flex gap-2 text-[#FFCA3A] mt-2">
                    <i className="ph-fill ph-star"></i><i className="ph-fill ph-star"></i><i className="ph-fill ph-star"></i><i className="ph-fill ph-star"></i><i className="ph-fill ph-star"></i>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
