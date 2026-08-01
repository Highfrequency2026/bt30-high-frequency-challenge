import React from 'react';

const BRE_IMG = "https://media.base44.com/images/public/6a6d316d80e436e8127c02a4/9c7469afa_bre_tiesi_7d9eee9a48b34dc4b86475e32d9fe89d.jpg";

const items = [
  { num: '01', label: 'DISCLAIMER', key: 'disclaimer' },
  { num: '02', label: 'ABOUT BRE', key: 'about-bre' },
  { num: '03', label: 'ABOUT BRE', key: 'about-bre' },
  { num: '04', label: 'ABOUT MIKE', key: 'about-challenge' },
  { num: '05', label: 'ABOUT THE CHALLENGE', key: 'about-challenge' },
  { num: '06', label: 'SHARE YOUR PROGRESS!', key: 'share' },
  { num: '07', label: 'EQUIPMENT', key: 'equipment' },
  { num: '08', label: 'DEFINITIONS', key: 'definitions' },
  { num: '09', label: 'FITNESS KEY', key: 'fitness-key' },
  { num: '10', label: 'VIDEO REFERENCES', key: 'video-reference' },
  { num: '11', label: '30 DAY STARTS!', key: 'workouts' },
];

export default function ContentsPage({ onNavigate }) {
  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row print:break-after-page">
      <div className="flex-1 p-10 flex flex-col justify-center">
        <div className="mb-8">
          <div className="h-1 bg-black w-full mb-4" />
          <h1 className="text-black font-black text-4xl tracking-widest text-center">C O N T E N T S</h1>
          <div className="h-1 bg-black w-full mt-4" />
        </div>

        <div className="grid grid-cols-2 gap-x-12 gap-y-4">
          {items.map(item => (
            <button
              key={item.num}
              onClick={() => onNavigate(item.key)}
              className="text-left group"
            >
              <span className="font-black text-4xl italic text-black group-hover:text-sky-500 transition-colors">{item.num}</span>
              <p className="text-xs tracking-widest uppercase text-zinc-600 group-hover:text-sky-500 transition-colors mt-1">{item.label}</p>
            </button>
          ))}
        </div>
      </div>
      <div className="w-full md:w-72 overflow-hidden">
        <img src={BRE_IMG} alt="Bre Tiesi" className="w-full h-full object-cover object-top" style={{ minHeight: '400px' }} />
      </div>
    </div>
  );
}