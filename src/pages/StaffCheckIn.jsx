import React, { useState, useEffect } from 'react';
import { Search, Check, X, AlertTriangle, Loader2, ScanLine } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { Image } from '@/components/ui/image';
import { useToast } from '@/components/ui/use-toast';

export default function StaffCheckIn() {
  const { user, isLoadingAuth } = useAuth();
  const { toast } = useToast();
  const [allMembers, setAllMembers] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [denyReason, setDenyReason] = useState('');
  const [note, setNote] = useState('');
  const [showDeny, setShowDeny] = useState(false);

  useEffect(() => {
    if (!isLoadingAuth && !user) {
      base44.auth.redirectToLogin(window.location.href);
      return;
    }
    if (user) {
      if (user.role !== 'admin') { setLoading(false); return; }
      base44.entities.Members.list('-created_date', 200)
        .then(setAllMembers)
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [user, isLoadingAuth]);

  if (isLoadingAuth || loading) {
    return <div className="flex items-center justify-center min-h-[60vh]"><div className="w-8 h-8 border-4 border-border border-t-teal rounded-full animate-spin" /></div>;
  }

  if (!user) return null;

  if (user.role !== 'admin') {
    return (
      <div className="max-w-lg mx-auto px-6 py-20 text-center">
        <AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-4" />
        <h1 className="font-display text-2xl text-white mb-2">Access Restricted</h1>
        <p className="text-sm text-zinc-400">This page is restricted to staff and administrators.</p>
      </div>
    );
  }

  const results = query.trim()
    ? allMembers.filter(m => {
        const q = query.toLowerCase();
        return (m.first_name?.toLowerCase().includes(q) || m.last_name?.toLowerCase().includes(q) ||
          m.email?.toLowerCase().includes(q) || m.phone?.includes(q) || m.member_number?.toLowerCase().includes(q));
      })
    : [];

  const getCheckInStatus = (m) => {
    if (m.membership_status === 'active' && m.access_status === 'approved' && m.waiver_status === 'signed') return 'green';
    if (m.membership_status === 'pending' || m.waiver_status !== 'signed' || !m.photo_url) return 'yellow';
    return 'red';
  };

  const statusConfig = {
    green: { bg: 'bg-teal/10', border: 'border-teal/40', text: 'text-teal', label: 'Active & Approved', icon: Check },
    yellow: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/40', text: 'text-yellow-500', label: 'Review Required', icon: AlertTriangle },
    red: { bg: 'bg-red-500/10', border: 'border-red-500/40', text: 'text-red-500', label: 'Access Denied', icon: X },
  };

  const handleCheckIn = async (member) => {
    try {
      await base44.entities.CheckIns.create({
        member_id: member.id,
        check_in_time: new Date().toISOString(),
        location: 'Main Entrance',
        entry_method: 'search',
        status: 'approved',
        verified_by: user.id,
        internal_note: note || null,
      });
      toast({ title: 'Checked in', description: `${member.first_name} ${member.last_name} has been checked in.` });
      setSelected(null); setNote('');
    } catch (err) {
      toast({ title: 'Check-in failed', description: err.message, variant: 'destructive' });
    }
  };

  const handleDeny = async (member) => {
    try {
      await base44.entities.CheckIns.create({
        member_id: member.id,
        check_in_time: new Date().toISOString(),
        location: 'Main Entrance',
        entry_method: 'search',
        status: 'denied',
        verified_by: user.id,
        denial_reason: denyReason || 'No reason provided',
        internal_note: note || null,
      });
      toast({ title: 'Entry denied', description: `${member.first_name} ${member.last_name} denied entry.` });
      setShowDeny(false); setDenyReason(''); setNote(''); setSelected(null);
    } catch (err) {
      toast({ title: 'Failed', description: err.message, variant: 'destructive' });
    }
  };

  return (
    <div className="animate-fade-in max-w-5xl mx-auto px-6 py-12 md:py-16">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <ScanLine className="w-6 h-6 text-teal" />
          <h1 className="font-display text-3xl text-white">Staff Check-In</h1>
        </div>
        <p className="text-sm text-zinc-400">Search members by name, phone, email, or member ID to verify and check in.</p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, phone, email, or member ID..."
          className="w-full h-14 bg-input border border-border rounded-xl pl-12 pr-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-teal transition-colors"
        />
      </div>

      {/* Results */}
      {query.trim() && results.length === 0 && (
        <p className="text-center text-zinc-500 text-sm py-8">No members found.</p>
      )}

      <div className="space-y-3">
        {results.slice(0, 10).map((m) => {
          const checkInStatus = getCheckInStatus(m);
          const cfg = statusConfig[checkInStatus];
          const Icon = cfg.icon;
          return (
            <div key={m.id} className={`rounded-xl border ${cfg.border} ${cfg.bg} p-5`}>
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                {m.photo_url ? (
                  <div className="w-16 h-16 rounded-lg overflow-hidden border border-border flex-shrink-0">
                    <Image src={m.photo_url} alt="Member" fittingType="fill" className="w-full h-full" />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-muted border border-border flex items-center justify-center flex-shrink-0">
                    <span className="text-[9px] text-zinc-600">No photo</span>
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-bold text-white">{m.first_name} {m.last_name}</h3>
                    <span className={`inline-flex items-center gap-1 text-[9px] tracking-widest uppercase font-bold ${cfg.text}`}>
                      <Icon className="w-3 h-3" /> {cfg.label}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                    <p className="text-zinc-500">Member ID: <span className="text-zinc-300">{m.member_number || '—'}</span></p>
                    <p className="text-zinc-500">Status: <span className="text-zinc-300 capitalize">{m.membership_status}</span></p>
                    <p className="text-zinc-500">Waiver: <span className={m.waiver_status === 'signed' ? 'text-teal' : 'text-yellow-500'}>{m.waiver_status === 'signed' ? 'Signed' : 'Missing'}</span></p>
                    <p className="text-zinc-500">Photo: <span className={m.photo_url ? 'text-teal' : 'text-yellow-500'}>{m.photo_url ? 'On file' : 'Missing'}</span></p>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  {checkInStatus !== 'red' && (
                    <button onClick={() => handleCheckIn(m)} className="bg-teal text-white font-bold text-xs tracking-wide uppercase px-4 py-2 rounded-lg hover:bg-teal/90 transition-all inline-flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5" /> Check In
                    </button>
                  )}
                  <button onClick={() => { setSelected(m); setShowDeny(true); }} className="border border-red-500/30 text-red-500 font-bold text-xs tracking-wide uppercase px-4 py-2 rounded-lg hover:bg-red-500/10 transition-all inline-flex items-center gap-1.5">
                    <X className="w-3.5 h-3.5" /> Deny
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Deny Modal */}
      {showDeny && selected && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={() => setShowDeny(false)}>
          <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-display text-xl text-white mb-1">Deny Entry</h3>
            <p className="text-xs text-zinc-500 mb-4">{selected.first_name} {selected.last_name}</p>
            <label className="text-xs text-zinc-400 font-medium mb-1.5 block">Reason for denial</label>
            <input value={denyReason} onChange={(e) => setDenyReason(e.target.value)} placeholder="e.g. Expired membership, missing waiver..."
              className="w-full h-12 bg-input border border-border rounded-lg px-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-teal mb-3" />
            <label className="text-xs text-zinc-400 font-medium mb-1.5 block">Internal note (optional)</label>
            <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Staff note..."
              className="w-full h-12 bg-input border border-border rounded-lg px-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-teal mb-5" />
            <div className="flex gap-3">
              <button onClick={() => handleDeny(selected)} className="flex-1 bg-red-500 text-white font-bold text-sm uppercase px-4 py-3 rounded-lg hover:bg-red-500/90 transition-all">Deny Entry</button>
              <button onClick={() => setShowDeny(false)} className="flex-1 border border-border text-zinc-400 font-bold text-sm uppercase px-4 py-3 rounded-lg hover:bg-white/5 transition-all">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}