import React, { useState } from 'react';
import { Trophy, Flame, Heart, MessageCircle, TrendingUp, Users, Send, Image as ImageIcon } from 'lucide-react';
import { BRE_IMG } from '@/data/challengeData';

const leaderboard = [
  { rank: 1, name: 'Sarah M.', streak: 28, workouts: 26, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80' },
  { rank: 2, name: 'Jessica K.', streak: 25, workouts: 24, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80' },
  { rank: 3, name: 'Maria L.', streak: 22, workouts: 22, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80' },
  { rank: 4, name: 'Ashley T.', streak: 20, workouts: 19, avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&q=80' },
  { rank: 5, name: 'You', streak: 1, workouts: 0, avatar: BRE_IMG, isYou: true },
];

const initialFeed = [
  { id: 1, name: 'Sarah M.', time: '2h ago', text: 'Day 28 DONE! 🔥 Feeling stronger than ever. The HIIT 4 video nearly killed me but I pushed through!', likes: 24, liked: false, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80', comments: [] },
  { id: 2, name: 'Jessica K.', time: '5h ago', text: 'Week 4 complete! Down 6 lbs and feeling incredible. Thank you Mike T and Bre for this program!', likes: 18, liked: false, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80', comments: [] },
  { id: 3, name: 'Maria L.', time: '1d ago', text: 'Glute day is my favorite day. That burn is addictive! 💪', likes: 12, liked: false, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80', comments: [] },
];

const challenges = [
  { name: '30-Day Streak', desc: 'Complete all 30 workouts', progress: 3, total: 30, participants: 1240 },
  { name: 'Hydration Hero', desc: 'Drink 1 gallon daily for 7 days', progress: 2, total: 7, participants: 890 },
  { name: 'Mindful Mornings', desc: 'Complete morning routine 5 days', progress: 1, total: 5, participants: 567 },
];

export default function Community() {
  const [posts, setPosts] = useState(initialFeed);
  const [newPost, setNewPost] = useState('');
  const [openComments, setOpenComments] = useState({});
  const [commentDrafts, setCommentDrafts] = useState({});

  const handlePublish = () => {
    const text = newPost.trim();
    if (!text) return;
    setPosts(prev => [
      { id: Date.now(), name: 'You', time: 'just now', text, likes: 0, liked: false, avatar: BRE_IMG, comments: [] },
      ...prev,
    ]);
    setNewPost('');
  };

  const toggleLike = (id) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p));
  };

  const toggleComments = (id) => {
    setOpenComments(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const submitComment = (id) => {
    const text = (commentDrafts[id] || '').trim();
    if (!text) return;
    setPosts(prev => prev.map(p => p.id === id ? { ...p, comments: [...p.comments, { name: 'You', text, avatar: BRE_IMG }] } : p));
    setCommentDrafts(prev => ({ ...prev, [id]: '' }));
  };

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
          {/* Create Post */}
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-start gap-3">
              <img src={BRE_IMG} alt="You" className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
              <div className="flex-1">
                <textarea
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  placeholder="Share your progress, wins, or motivation..."
                  rows={3}
                  className="w-full bg-muted/30 border border-border rounded-lg px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-teal/50 resize-none"
                />
                <div className="flex items-center justify-between mt-3">
                  <button className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-teal transition-colors">
                    <ImageIcon className="w-3.5 h-3.5" /> Photo
                  </button>
                  <button
                    onClick={handlePublish}
                    disabled={!newPost.trim()}
                    className="flex items-center gap-2 bg-teal text-white font-bold text-xs tracking-wider uppercase px-5 py-2.5 rounded-lg hover:bg-teal/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Send className="w-3.5 h-3.5" /> Publish
                  </button>
                </div>
              </div>
            </div>
          </div>

          <h2 className="font-display text-2xl text-white mb-2">Activity Feed</h2>
          {posts.map(post => (
            <div key={post.id} className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <img src={post.avatar} alt={post.name} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <p className="font-bold text-white text-sm">{post.name}</p>
                  <p className="text-xs text-zinc-500">{post.time}</p>
                </div>
              </div>
              <p className="text-sm text-zinc-300 mb-4 leading-relaxed">{post.text}</p>
              <div className="flex items-center gap-4 text-xs text-zinc-500">
                <button
                  onClick={() => toggleLike(post.id)}
                  className={`flex items-center gap-1.5 transition-colors ${post.liked ? 'text-teal' : 'hover:text-teal'}`}
                >
                  <Heart className={`w-3.5 h-3.5 ${post.liked ? 'fill-teal text-teal' : ''}`} /> {post.likes}
                </button>
                <button
                  onClick={() => toggleComments(post.id)}
                  className={`flex items-center gap-1.5 transition-colors ${openComments[post.id] ? 'text-teal' : 'hover:text-teal'}`}
                >
                  <MessageCircle className="w-3.5 h-3.5" /> {post.comments.length > 0 ? `${post.comments.length} Comment${post.comments.length > 1 ? 's' : ''}` : 'Comment'}
                </button>
              </div>

              {/* Comments */}
              {openComments[post.id] && (
                <div className="mt-4 pt-4 border-t border-border space-y-3">
                  {post.comments.length > 0 && (
                    <div className="space-y-3">
                      {post.comments.map((c, ci) => (
                        <div key={ci} className="flex items-start gap-2.5">
                          <img src={c.avatar} alt={c.name} className="w-7 h-7 rounded-full object-cover flex-shrink-0" />
                          <div className="bg-muted/30 rounded-lg px-3 py-2 flex-1">
                            <p className="text-xs font-bold text-white mb-0.5">{c.name}</p>
                            <p className="text-xs text-zinc-300 leading-relaxed">{c.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <img src={BRE_IMG} alt="You" className="w-7 h-7 rounded-full object-cover flex-shrink-0" />
                    <input
                      type="text"
                      value={commentDrafts[post.id] || ''}
                      onChange={(e) => setCommentDrafts(prev => ({ ...prev, [post.id]: e.target.value }))}
                      onKeyDown={(e) => { if (e.key === 'Enter') submitComment(post.id); }}
                      placeholder="Write a comment..."
                      className="flex-1 bg-muted/30 border border-border rounded-full px-4 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-teal/50"
                    />
                    <button
                      onClick={() => submitComment(post.id)}
                      disabled={!(commentDrafts[post.id] || '').trim()}
                      className="w-8 h-8 rounded-full bg-teal flex items-center justify-center hover:bg-teal/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
                    >
                      <Send className="w-3.5 h-3.5 text-white" />
                    </button>
                  </div>
                </div>
              )}
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