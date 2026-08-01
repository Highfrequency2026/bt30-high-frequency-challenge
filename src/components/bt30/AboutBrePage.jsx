import React from 'react';

const BRE_IMG = "https://media.base44.com/images/public/6a6d316d80e436e8127c02a4/9c7469afa_bre_tiesi_7d9eee9a48b34dc4b86475e32d9fe89d.jpg";

export default function AboutBrePage({ onNavigate }) {
  return (
    <div className="min-h-screen bg-white print:break-after-page">
      {/* Header */}
      <div className="relative h-48 bg-zinc-900 overflow-hidden flex items-end pb-6 px-8">
        <img src={BRE_IMG} alt="Bre Tiesi" className="absolute inset-0 w-full h-full object-cover object-top opacity-40" />
        <div className="relative z-10">
          <h1 className="text-white font-black text-5xl leading-none tracking-tight">BRE TIESI</h1>
          <p className="text-sky-400 text-lg mt-1">@bretiesi</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-8 py-10 text-zinc-700 leading-relaxed space-y-5 text-[15px]">
        <p>
          Bre Tiesi is a powerhouse entrepreneur, luxury real estate agent, model, and television personality best known for her role on Netflix's hit series <strong>Selling Sunset</strong> with The Oppenheim Group. Born on May 4, 1991, in California, Bre has carved out a remarkable career across entertainment, fitness, and real estate.
        </p>
        <p>
          Before dominating the luxury property market, Bre established herself as a successful model and television personality, appearing on shows including <strong>WAGS</strong> and <strong>Wild 'N Out</strong>. Her transition to real estate proved that her drive and charisma could conquer any industry she set her sights on.
        </p>
        <p>
          A dedicated fitness enthusiast, Bre has always maintained a rigorous approach to her health and physique — and it shows. Her commitment to staying in elite shape is matched only by her passion for empowering others to do the same. Her fitness-focused lifestyle and business ventures have inspired thousands to take control of their physical transformation.
        </p>
        <p>
          She is also the proud mother of <strong>Legendary Love Cannon</strong>, her son with Nick Cannon — and she proves every day that being a mother, businesswoman, and fitness icon are not mutually exclusive. Check out her Instagram for evidence of her intense workouts and legendary physique.
        </p>
        <p>
          She has recently completed the <strong>High Frequency BT30Day Challenge</strong> designed by Celebrity Trainer Mike T — and the results, as you will see, are absolutely stunning.
        </p>
      </div>

      {/* Quote page */}
      <div className="bg-white px-8 pb-6">
        <div className="relative">
          <img src={BRE_IMG} alt="Bre Tiesi" className="w-full max-w-sm mx-auto object-cover rounded" style={{ maxHeight: '400px', objectPosition: 'top' }} />
        </div>
        <div className="bg-black mt-0 p-8">
          <h2 className="text-white font-black text-3xl leading-tight uppercase tracking-wide">
            "YOUR BODY IS A<br />REFLECTION OF YOUR<br />LIFESTYLE. MAKE IT<br />COUNT."
          </h2>
          <p className="text-white italic mt-3 text-lg">Bre Tiesi</p>
        </div>
      </div>

      <div className="flex justify-between items-center px-8 py-4 border-t border-zinc-200">
        <span className="text-zinc-400 text-xs tracking-wider">BT30DAYCHALLENGE FT BRE TIESI</span>
        <span className="bg-black text-white font-black italic text-xl px-4 py-2">2</span>
      </div>
    </div>
  );
}