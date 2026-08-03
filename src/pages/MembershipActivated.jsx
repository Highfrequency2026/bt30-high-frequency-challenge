import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, MapPin, Clock, Phone, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { Image } from '@/components/ui/image';
import QRCode from '@/components/membership/QRCode';

export default function MembershipActivated() {
  const navigate = useNavigate();
  const { user, isLoadingAuth } = useAuth();
  const [member, setMember] = useState(null);
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoadingAuth && !user) {
      base44.auth.redirectToLogin(window.location.href);
      return;
    }
    if (user) {
      base44.entities.Members.filter({ user_id: user.id })
        .then(async (members) => {
          if (members.length > 0) {
            const m = members[0];
            setMember(m);
            if (m.selected_plan_id) {
              const plans = await base44.entities.MembershipPlans.filter({ plan_id: m.selected_plan_id });
              if (plans.length > 0) setPlan(plans[0]);
            }
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [user, isLoadingAuth]);

  if (isLoadingAuth || loading || !user) {
    return <div className="flex items-center justify-center min-h-[60vh]"><div className="w-8 h-8 border-4 border-border border-t-teal rounded-full animate-spin" /></div>;
  }

  // Not yet active — payment still processing
  if (!member || member.membership_status !== 'active') {
    return (
      <div className="animate-fade-in max-w-lg mx-auto px-6 py-20 text-center">
        <Loader2 className="w-10 h-10 text-teal animate-spin mx-auto mb-6" />
        <h1 className="font-display text-2xl text-white mb-3">Payment Processing</h1>
        <p className="text-sm text-zinc-400 mb-8">Your membership is being activated. This usually takes a few moments. If your membership is not activated shortly, please contact support.</p>
        <Link to="/dashboard" className="inline-flex items-center gap-2 border border-platinum/30 text-platinum font-bold text-sm tracking-wider uppercase px-8 py-3.5 rounded-lg hover:bg-white/5 transition-all">
          Check Dashboard
        </Link>
      </div>
    );
  }

  const startDate = member.membership_start_date ? new Date(member.membership_start_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—';
  const nextBilling = member.next_billing_date ? new Date(member.next_billing_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—';

  return (
    <div className="animate-fade-in max-w-2xl mx-auto px-6 py-12 md:py-16">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-teal/10 border border-teal/30 mb-6">
          <CheckCircle2 className="w-10 h-10 text-teal" />
        </div>
        <span className="text-[10px] tracking-[0.4em] uppercase text-teal font-bold">Welcome to High Frequency</span>
        <h1 className="font-display text-3xl md:text-5xl text-white mt-3">Membership Activated</h1>
        <p className="text-sm text-zinc-400 mt-3">Your membership is now active. Here's your digital access pass.</p>
      </div>

      {/* Digital Membership Card */}
      <div className="rounded-2xl border border-teal/30 bg-gradient-to-br from-teal/10 to-transparent p-6 md:p-8 mb-6">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          {/* Photo */}
          {member.photo_url ? (
            <div className="w-28 h-28 rounded-xl overflow-hidden border-2 border-teal/30 flex-shrink-0">
              <Image src={member.photo_url} alt="Member" fittingType="fill" className="w-full h-full" />
            </div>
          ) : (
            <div className="w-28 h-28 rounded-xl bg-muted border-2 border-border flex items-center justify-center flex-shrink-0">
              <span className="text-xs text-zinc-600">No photo</span>
            </div>
          )}

          {/* Member Info */}
          <div className="flex-1 text-center md:text-left">
            <p className="text-xs text-zinc-400">Member</p>
            <h2 className="font-display text-xl text-white">{member.first_name} {member.last_name}</h2>
            <div className="mt-3 space-y-1 text-xs">
              <p className="text-zinc-400">Member ID: <span className="text-white font-medium">{member.member_number || '—'}</span></p>
              <p className="text-zinc-400">Plan: <span className="text-white font-medium">{plan?.plan_name || member.selected_plan_id}</span></p>
              <p className="text-zinc-400">Status: <span className="text-teal font-medium">Active</span></p>
              <p className="text-zinc-400">Start Date: <span className="text-white font-medium">{startDate}</span></p>
              <p className="text-zinc-400">Next Billing: <span className="text-white font-medium">{nextBilling}</span></p>
            </div>
          </div>

          {/* QR Code */}
          <div className="flex flex-col items-center gap-2">
            <QRCode value={member.member_number} size={140} />
            <span className="text-[9px] tracking-widest uppercase text-zinc-500">Scan at Door</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <Link to="/dashboard" className="flex-1 inline-flex items-center justify-center gap-2 bg-teal text-white font-bold text-sm tracking-wider uppercase px-8 py-4 rounded-lg hover:bg-teal/90 transition-all">
          Open Member Dashboard
        </Link>
        <button disabled className="flex-1 inline-flex items-center justify-center gap-2 border border-platinum/30 text-platinum font-bold text-sm tracking-wider uppercase px-8 py-4 rounded-lg opacity-50 cursor-not-allowed">
          Add Pass to Phone
        </button>
      </div>

      {/* Gym Info */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="text-sm font-bold text-white mb-4">High Frequency — Gym Location</h3>
        <div className="space-y-3 text-xs text-zinc-400">
          <div className="flex items-start gap-3"><MapPin className="w-4 h-4 text-teal flex-shrink-0 mt-0.5" /><span>123 Fitness Avenue, Los Angeles, CA 90001</span></div>
          <div className="flex items-start gap-3"><Clock className="w-4 h-4 text-teal flex-shrink-0 mt-0.5" /><span>Open 24/7 — Staffed Mon–Fri 6am–8pm, Sat–Sun 8am–4pm</span></div>
          <div className="flex items-start gap-3"><Phone className="w-4 h-4 text-teal flex-shrink-0 mt-0.5" /><span>(310) 555-0199</span></div>
        </div>
      </div>
    </div>
  );
}