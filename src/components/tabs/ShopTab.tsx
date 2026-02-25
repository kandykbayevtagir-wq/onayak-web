import { ShoppingBag, Package } from "lucide-react";

export default function ShopTab({ t, theme, triggerHaptic, setSelectedProduct, setIsDeliveryModalOpen }: any) {
  return (
    <div className="p-5 flex-1 flex flex-col pb-10">
      <div className="flex items-center gap-2 mb-6"><ShoppingBag className="text-pink-500" size={28}/><h2 className="text-2xl font-black">{t.shopTitle}</h2></div>
      <div className="flex flex-col gap-5">
        {t.products.map((prod: any) => (
          <div key={prod.id} className={`p-6 rounded-3xl border flex flex-col gap-4 ${theme === 'dark' ? 'bg-[#111] border-white/10' : 'bg-white border-gray-200'}`}>
            <div className="flex justify-between items-start">
              <div><h3 className="font-black text-base mb-2">{prod.name}</h3><p className="text-sm opacity-70 leading-relaxed">{prod.desc}</p></div>
              <div className={`p-3 rounded-2xl ${theme === 'dark' ? 'bg-pink-500/20' : 'bg-pink-50'} text-pink-500`}><Package size={24}/></div>
            </div>
            <button onClick={() => { triggerHaptic('medium'); setSelectedProduct(prod.name); setIsDeliveryModalOpen(true); }} className={`w-full py-4 mt-2 rounded-xl text-sm font-bold transition-all ${theme === 'dark' ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-100 hover:bg-gray-200'}`}>{t.orderBtn}</button>
          </div>
        ))}
      </div>
    </div>
  );
}