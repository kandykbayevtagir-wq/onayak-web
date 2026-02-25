import { Banknote } from "lucide-react";
import { PRICE_LIST } from "../../config/constants";

export default function PricesTab({ t, theme }: any) {
  return (
    <div className="p-5 flex-1 flex flex-col pb-10">
      <div className="flex items-center gap-2 mb-6">
        <Banknote className="text-indigo-500" size={28}/>
        <h2 className="text-2xl font-black">{t.priceTitle}</h2>
      </div>
      
      <div className="flex flex-col gap-5">
        {PRICE_LIST.map((category, idx) => (
          <div key={idx} className={`rounded-3xl border overflow-hidden shadow-sm ${theme === 'dark' ? 'bg-[#111] border-white/10' : 'bg-white border-gray-200'}`}>
            <div className={`p-5 font-black text-base border-b ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
              {category.category}
            </div>
            <div className="flex flex-col">
              {category.items.map((item, i) => (
                <div key={i} className={`p-5 flex justify-between items-center text-sm border-b last:border-0 ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'}`}>
                  <span className="opacity-90 font-medium pr-4 leading-relaxed">{item.name}</span>
                  <span className="font-black whitespace-nowrap text-indigo-500 text-base">{item.price}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <p className="text-center text-xs opacity-60 mt-6 px-4 font-medium">{t.priceDisclaimer}</p>
    </div>
  );
}