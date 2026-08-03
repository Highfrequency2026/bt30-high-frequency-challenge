import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, CreditCard, FileText, Camera, Snowflake, XCircle, RefreshCw, HelpCircle, Calendar, Radio } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { Image } from '@/components/ui/image';
import QRCode from '@/components/membership/QRCode';
import { useToast } from '@/components/ui/use-toast';

const statusColors = {
  active: 'bg-teal/10 text-teal border-teal/30',
  pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30',
  past_due: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30',
  suspended: 'bg-red-500/10 text-red-500 border-red-500/30',
  frozen: 'bg-blue-500/10 text-blue-500 border-blue-500/30',
  canceled: 'bg-red-500/10 text-red-500 border-red-500/30',
  expired: 'bg-red-500/10 text-red-500 border-red-500/30',
};

export default function MemberDashboard() {
  const { user, isLoadingAuth } = useAuth();
  const { toast } = useToast();
  const [member, setMember] = useState(null);
  const [plan, setPlan] = useState(null);
  const [checkIns, setCheckIns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoadingAuth && !user) {
      base44.auth.redirectToLogin(window.location.href);
      return;
    }
    if (user) {
      Promise.all([
        base44.entities.Members.filter({ user_id: user.id }),
      ]).then(async ([members]) => {
        if (members.length > 0) {
          const m = members[0];
          setMember(m);
          if (m.selected_plan_id) {
            const plans = await base44.entities.MembershipPlans.filter({ plan_id: m.selected_plan_id });
            if (plans.length > 0) setPlan(plans[0]);
          }
          const ci = await base44.entities.CheckIns.filter({ member_id: m.id }, '-check_in_time', 10);
          setCheckIns(ci || []);
        }
      }).catch(() => {}).finally(() => setLoading(false));
    }
  }, [user, isLoadingAuth]);

  if (isLoadingAuth || loading || !user) {
    return <div className="flex items-center justify-center min-h-[60vh]"><div className="w-8 h-8 border-4 border-border border-t-teal rounded-full animate-spin" /></div>;
  }

  if (!member) {
    return (
      <div className="max-w-lg mx-auto px-6 py-20 text-center">
        <p className="text-sm text-zinc-400 mb-4">No membership found. Complete your registration to get started.</p>
        <Link to="/join" className="bg-teal text-white font-bold text-sm tracking-wider uppercase px-6 py-3 rounded-lg">Start Membership</Link>
      </div>
    );
  }

  const status = member.membership_status || 'pending';
  const nextBilling = member.next_billing_date ? new Date(member.next_billing_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—';
  const startDate = member.membership_start_date ? new Date(member.membership_start_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—';

  const actions = [
    { label: 'Manage Billing', icon: CreditCard, action: () => toast({ title: 'Billing management', description: 'Contact support to manage billing.' }) },
    { label: 'Update Profile', icon: User, to: '/profile-setup' },
    { label: 'Replace Photo', icon: Camera, to: '/member-photo' },
    { label: 'View Agreements', icon: FileText, to: '/agreements' },
    { label: 'Freeze Membership', icon: Snowflake, action: () => toast({ title: 'Freeze request', description: 'Contact support to freeze your membership.' }) },
    { label: 'Cancel Membership', icon: XCircle, action: () => toast({ title: 'Cancellation', description: 'Contact support to cancel your membership.' }) },
    { label: 'Update Payment', icon: RefreshCw, action: () => toast({ title: 'Payment method', description: 'Contact support to update your payment method.' }) },
    { label: 'Contact Support', icon: HelpCircle, action: () => toast({ title: 'Support', description: 'Call (310) 555-0199 or email support.' }) },
  ];

  return (
    <div className="animate-fade-in max-w-5xl mx-auto px-6 py-12 md:py-16">
      <div className="mb-8">
        <span className="text-[10px] tracking-[0.4em] uppercase text-teal font-bold">Member Dashboard</span>
        <h1 className="font-display text-3xl md:text-4xl text-white mt-2">Welcome, {member.preferred_name || member.first_name}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Membership Card */}
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6">
          <div className="flex flex-col sm:flex-row gap-6 items-center">
            {member.photo_url ? (
              <div className="w-24 h-24 rounded-xl overflow-hidden border-2 border-teal/30 flex-shrink-0">
                <Image src={member.photo_url} alt="Member" fittingType="fill" className="w-full h-full" />
              </div>
            ) : (
              <div className="w-24 h-24 rounded-xl bg-muted border-2 border-border flex items-center justify-center flex-shrink-0">
                <Camera className="w-6 h-6 text-zinc-600" />
              </div>
            )}
            <div className="flex-1 text-center sm:text-left">
              <h2 className="font-display text-xl text-white">{member.first_name} {member.last_name}</h2>
              <p className="text-xs text-zinc-500 mt-0.5">Member ID: {member.member_number || '—'}</p>
              <div className="flex flex-wrap gap-3 mt-3">
                <span className={`inline-block text-[10px] tracking-widest uppercase font-bold border px-3 py-1 rounded-full ${statusColors[status] || statusColors.pending}`}>
                  {status.replace('_', ' ')}
                </span>
                <span className="inline-block text-[10px] tracking-widest uppercase font-bold border border-border text-zinc-400 px-3 py-1 rounded-full">
                  Waiver: {member.waiver_status === 'signed' ? 'Signed' : 'Pending'}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <QRCode value={member.member_number} size={110} />
              <span className="text-[8px] tracking-widest uppercase text-zinc-600">Access Pass</span>
            </div>
          </div>

          {/* Membership Details */}
          <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-border">
            <div>
              <p className="text-[10px] tracking-wide uppercase text-zinc-500">Plan</p>
              <p className="text-sm text-white font-medium mt-1">{plan?.plan_name || member.selected_plan_id || '—'}</p>
            </div>
            <div>
              <p className="text-[10px] tracking-wide uppercase text-zinc-500">Next Payment</p>
              <p className="text-sm text-white font-medium mt-1">{nextBilling}</p>
            </div>
            <div>
              <p className="text-[10px] tracking-wide uppercase text-zinc-500">Start Date</p>
              <p className="text-sm text-white font-medium mt-1">{startDate}</p>
            </div>
            <div>
              <p className="text-[10px] tracking-wide uppercase text-zinc-500">Access Status</p>
              <p className="text-sm text-white font-medium mt-1 capitalize">{member.access_status || 'pending'}</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="text-sm font-bold text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-2">
            {actions.map((a) => {
              const Icon = a.icon;
              return a.to ? (
                <Link key={a.label} to={a.to} className="flex flex-col items-center gap-2 p-3 rounded-lg border border-border hover:border-teal/30 transition-all text-center">
                  <Icon className="w-5 h-5 text-teal" />
                  <span className="text-[10px] text-zinc-400 leading-tight">{a.label}</span>
                </Link>
              ) : (
                <button key={a.label} onClick={a.action} className="flex flex-col items-center gap-2 p-3 rounded-lg border border-border hover:border-teal/30 transition-all text-center">
                  <Icon className="w-5 h-5 text-teal" />
                  <span className="text-[10px] text-zinc-400 leading-tight">{a.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Check-in History & Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="text-sm font-bold text-white mb-4">Check-In History</h3>
          {checkIns.length > 0 ? (
            <div className="space-y-3">
              {checkIns.map((ci) => (
                <div key={ci.id} className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400">{new Date(ci.check_in_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                  <span className={`font-medium capitalize ${ci.status === 'approved' ? 'text-teal' : ci.status === 'denied' ? 'text-red-500' : 'text-yellow-500'}`}>{ci.status}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-zinc-600">No check-ins yet.</p>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="text-sm font-bold text-white mb-4">Announcements & Classes</h3>
          <div className="space-y-3">
            <Link to="/live" className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-teal/30 transition-all">
              <Radio className="w-4 h-4 text-teal" />
              <span className="text-xs text-zinc-300">Live Training Sessions</span>
            </Link>
            <Link to="/events" className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-teal/30 transition-all">
              <Calendar className="w-4 h-4 text-teal" />
              <span className="text-xs text-zinc-300">Upcoming Events & Retreats</span>
            </Link>
            <div className="p-3 rounded-lg border border-teal/20 bg-teal/5">
              <p className="text-xs text-teal font-medium mb-1">New Class Schedule</p>
              <p className="text-[10px] text-zinc-500">Check the Live page for this week's class times.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}