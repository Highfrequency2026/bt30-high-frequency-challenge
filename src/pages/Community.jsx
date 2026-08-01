import React from 'react';
import { Trophy, Flame, Heart, MessageCircle, TrendingUp, Users, ChevronRight } from 'lucide-react';
import { Image } from '@/components/ui/image';
import { BRE_IMG } from '@/data/challengeData';

const leaderboard = [
  { rank: 1, name: 'Sarah M.', streak: 28, workouts: 26, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80' },
  { rank: 2, name: 'Jessica K.', streak: 25, workouts: 24, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80' },
  { rank: 3, name: 'Maria L.', streak: 22, workouts: 22, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80' },
  { rank: 4, name: 'Ashley T.', streak: 20, workouts: 19, avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&q=80' },
  { rank: 5, name: 'You', streak: 1, workouts: 0, avatar: BRE_IMG, isYou: true },
];

const feed = [
  { name: 'Sarah M.', time: '2h ago', text: 'Day 28 DONE! 🔥 Feeling stronger than ever. The HIIT 4 video nearly killed me but I pushed through!', likes: 24, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80' },
  { name: 'Jessica K.', time: '5h ago', text: 'Week 4 complete! Down 6 lbs and feeling incredible. Thank you Mike T and Bre for this program!', likes: 18, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80' },
  { name: 'Maria L.', time: '1d ago', text: 'Glute day is my favorite day. That burn is addictive! 💪', likes: 12, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80' },
];

const challenges = [
  { name: '30-Day Streak', desc: 'Complete all 30 workouts', progress: 3, total: 30, participants: 1240 },
  { name: 'Hydration Hero', desc: 'Drink 1 gallon daily for 7 days', progress: 2, total: 7, participants: 890 },
  { name: 'Mindful Mornings', desc: 'Complete morning routine 5 days', progress: 1, total: 5, participants: 567 },
];

export default function Community() {
  return (
    <div className="animate-fade-in max-w-7xl mx-auto px-6 md:px-12 py-12">
      <div className="mb-10">
        <span className="text-[10px] tracking-[0.3em] uppercase text-teal font-bold">Connect</span>
        <h1 className="font-display text-4xl md:text-5xl text-white mt-2">Community</h1>
        <p className="text-zinc-400 text-sm mt-2 max-w-xl">You're not in this alone. Train alongside thousands of High Frequency members worldwide.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Feed */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="font-display text-2xl text-white mb-2">Activity Feed</h2>
          {feed.map((post, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <img src={post.avatar} alt={post.name} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <p className="font-bold text-white text-sm">{post.name}</p>
                  <p className="text-xs text-zinc-500">{post.time}</p>
                </div>
              </div>
              <p className="text-sm text-zinc-300 mb-4 leading-relaxed">{post.text}</p>
              <div className="flex items-center gap-4 text-xs text-zinc-500">
                <button className="flex items-center gap-1.5 hover:text-teal transition-colors">
                  <Heart className="w-3.5 h-3.5" /> {post.likes}
                </button>
                <button className="flex items-center gap-1.5 hover:text-teal transition-colors">
                  <MessageCircle className="w-3.5 h-3.5" /> Comment
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Leaderboard */}
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="w-5 h-5 text-teal" />
              <h3 className="font-bold text-white">Leaderboard</h3>
            </div>
            <div className="space-y-3">
              {leaderboard.map(member => (
                <div key={member.rank} className={`flex items-center gap-3 ${member.isYou ? 'bg-teal/5 border border-teal/20 rounded-lg p-2 -mx-2' : ''}`}>
                  <span className={`text-sm font-black w-5 text-center ${member.rank === 1 ? 'text-teal' : 'text-zinc-600'}`}>{member.rank}</span>
                  <img src={member.avatar} alt={member.name} className="w-8 h-8 rounded-full object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${member.isYou ? 'text-teal' : 'text-white'}`}>{member.name}</p>
                    <p className="text-[10px] text-zinc-500">{member.workouts} workouts · {member.streak} day streak</p>
                  </div>
                  <Flame className="w-3.5 h-3.5 text-zinc-600" />
                </div>
              ))}
            </div>
          </div>

          {/* Challenges */}
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-teal" />
              <h3 className="font-bold text-white">Active Challenges</h3>
            </div>
            <div className="space-y-4">
              {challenges.map(ch => (
                <div key={ch.name}>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-white">{ch.name}</p>
                    <span className="text-[10px] text-zinc-500">{ch.progress}/{ch.total}</span>
                  </div>
                  <div className="h-1.5 bg-muted/30 rounded-full overflow-hidden mb-1">
                    <div className="h-full bg-teal rounded-full" style={{ width: `${(ch.progress / ch.total) * 100}%` }} />
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] text-zinc-500">{ch.desc}</p>
                    <span className="text-[10px] text-zinc-600 flex items-center gap-0.5"><Users className="w-2.5 h-2.5" /> {ch.participants}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}