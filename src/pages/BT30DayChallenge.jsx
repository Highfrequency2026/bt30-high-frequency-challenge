import React, { useState } from 'react';
import CoverPage from '@/components/bt30/CoverPage';
import CreditsPage from '@/components/bt30/CreditsPage';
import ContentsPage from '@/components/bt30/ContentsPage';
import DisclaimerPage from '@/components/bt30/DisclaimerPage';
import AboutBrePage from '@/components/bt30/AboutBrePage';
import AboutChallengePage from '@/components/bt30/AboutChallengePage';
import SharePage from '@/components/bt30/SharePage';
import EquipmentPage from '@/components/bt30/EquipmentPage';
import DefinitionsPage from '@/components/bt30/DefinitionsPage';
import FitnessKeyPage from '@/components/bt30/FitnessKeyPage';
import VideoReferencePage from '@/components/bt30/VideoReferencePage';
import DailyWorkoutsPage from '@/components/bt30/DailyWorkoutsPage';
import CongratulationsPage from '@/components/bt30/CongratulationsPage';

const SECTIONS = [
  'cover', 'credits', 'contents', 'disclaimer', 'about-bre',
  'about-challenge', 'share', 'equipment', 'definitions',
  'fitness-key', 'video-reference', 'workouts', 'congrats'
];

export default function BT30DayChallenge() {
  const [section, setSection] = useState('cover');
  const [selectedDay, setSelectedDay] = useState(1);
  const [isPrinting, setIsPrinting] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const nav = (s) => setSection(s);

  return (
    <div className="min-h-screen bg-black font-body">
      {/* Top Nav Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-zinc-800 px-4 py-2 flex items-center justify-between print:hidden">
        <div className="flex items-center gap-2">
          <span className="text-white font-black text-sm tracking-widest uppercase">BT30DAYCHALLENGE</span>
        </div>
        <div className="flex items-center gap-3 flex-wrap justify-end">
          {[
            { label: 'Cover', key: 'cover' },
            { label: 'About Bre', key: 'about-bre' },
            { label: 'The Challenge', key: 'about-challenge' },
            { label: 'Equipment', key: 'equipment' },
            { label: 'Fitness Key', key: 'fitness-key' },
            { label: '30 Days', key: 'workouts' },
          ].map(item => (
            <button
              key={item.key}
              onClick={() => nav(item.key)}
              className={`text-xs font-bold tracking-wider uppercase px-3 py-1 rounded transition-all ${section === item.key ? 'bg-sky-500 text-white' : 'text-zinc-400 hover:text-white'}`}
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={handlePrint}
            className="bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold tracking-wider uppercase px-4 py-2 rounded transition-all"
          >
            ⬇ Download PDF
          </button>
        </div>
      </nav>

      {/* Page Content */}
      <div className="pt-14 print:pt-0">
        {section === 'cover' && <CoverPage onNavigate={nav} />}
        {section === 'credits' && <CreditsPage onNavigate={nav} />}
        {section === 'contents' && <ContentsPage onNavigate={nav} />}
        {section === 'disclaimer' && <DisclaimerPage onNavigate={nav} />}
        {section === 'about-bre' && <AboutBrePage onNavigate={nav} />}
        {section === 'about-challenge' && <AboutChallengePage onNavigate={nav} />}
        {section === 'share' && <SharePage onNavigate={nav} />}
        {section === 'equipment' && <EquipmentPage onNavigate={nav} />}
        {section === 'definitions' && <DefinitionsPage onNavigate={nav} />}
        {section === 'fitness-key' && <FitnessKeyPage onNavigate={nav} />}
        {section === 'video-reference' && <VideoReferencePage onNavigate={nav} />}
        {section === 'workouts' && <DailyWorkoutsPage onNavigate={nav} selectedDay={selectedDay} setSelectedDay={setSelectedDay} />}
        {section === 'congrats' && <CongratulationsPage onNavigate={nav} />}
      </div>
    </div>
  );
}