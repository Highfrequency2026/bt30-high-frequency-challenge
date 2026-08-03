import React, { useState, useEffect } from 'react';
import { Users, UserPlus, TrendingUp, AlertCircle, Snowflake, XCircle, FileX, Camera, Download, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';

export default function AdminMembershipDashboard() {
  const { user, isLoadingAuth } = useAuth();
  const [members, setMembers] = useState([]);
  const [checkIns, setCheckIns] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoadingAuth && !user) {
      base44.auth.redirectToLogin(window.location.href);
      return;
    }
    if (user) {
      if (user.role !== 'admin') { setLoading(false); return; }
      Promise.all([
        base44.entities.Members.list('-created_date', 500),
        base44.entities.CheckIns.list('-check_in_time', 20),
        base44.entities.MembershipPlans.filter({ active: true }, 'display_order'),
      ]).then(([m, ci, p]) => {
        setMembers(m || []);
        setCheckIns(ci || []);
        setPlans(p || []);
      }).catch(() => {}).finally(() => setLoading(false));
    }
  }, [user, isLoadingAuth]);

  if (isLoadingAuth || loading) {
    return <div className="flex items-center justify-center min-h-[60vh]"><div className="w-8 h-8 border-4 border-border border-t-teal rounded-full animate-spin" /></div>;
  }

  if (!user) return null;

  if (user.role !== 'admin') {
    return (
      <div className="max-w-lg mx-auto px-6 py-20 text-center">
        <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-4" />
        <h1 className="font-display text-2xl text-white mb-2">Admin Access Required</h1>
        <p className="text-sm text-zinc-400">This dashboard is restricted to administrators.</p>
      </div>
    );
  }

  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();

  const stats = {
    active: members.filter(m => m.membership_status === 'active').length,
    newThisMonth: members.filter(m => {
      const d = new Date(m.created_date);
      return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
    }).length,
    pastDue: members.filter(m => m.membership_status === 'past_due').length,
    canceled: members.filter(m => m.membership_status === 'canceled').length,
    frozen: members.filter(m => m.membership_status === 'frozen').length,
    missingWaivers: members.filter(m => m.waiver_status !== 'signed').length,
    missingPhotos: members.filter(m => !m.photo_url).length,
    deniedToday: checkIns.filter(ci => {
      const d = new Date(ci.check_in_time);
      return ci.status === 'denied' && d.toDateString() === now.toDateString();
    }).length,
  };

  const mrr = members.filter(m => m.membership_status === 'active').reduce((sum, m) => {
    const plan = plans.find(p => p.plan_id === m.selected_plan_id);
    return sum + (plan ? parseFloat(plan.monthly_price) || 0 : 0);
  }, 0);

  const statCards = [
    { label: 'Active Members', value: stats.active, icon: Users, color: 'text-teal' },
    { label: 'New This Month', value: stats.newThisMonth, icon: UserPlus, color: 'text-teal' },
    { label: 'Monthly Revenue', value: `$${mrr.toFixed(0)}`, icon: TrendingUp, color: 'text-teal' },
    { label: 'Past Due', value: stats.pastDue, icon: AlertCircle, color: 'text-yellow-500' },
    { label: 'Canceled', value: stats.canceled, icon: XCircle, color: 'text-red-500' },
    { label: 'Frozen', value: stats.frozen, icon: Snowflake, color: 'text-blue-500' },
    { label: 'Missing Waivers', value: stats.missingWaivers, icon: FileX, color: 'text-yellow-500' },
    { label: 'Missing Photos', value: stats.missingPhotos, icon: Camera, color: 'text-yellow-500' },
  ];

  const exportCSV = () => {
    const headers = ['Member Number', 'Name', 'Email', 'Phone', 'Status', 'Plan', 'Start Date', 'Waiver', 'Photo'];
    const rows = members.map(m => [
      m.member_number || '', `${m.first_name} ${m.last_name}`, m.email || '', m.phone || '',
      m.membership_status || '', m.selected_plan_id || '',
      m.membership_start_date ? new Date(m.membership_start_date).toLocaleDateString() : '',
      m.waiver_status || '', m.photo_url ? 'Yes' : 'No',
    ]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `members-${now.toISOString().split('T')[0]}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="animate-fade-in max-w-7xl mx-auto px-6 py-12 md:py-16">
      <div className="flex items-end justify-between mb-8">
        <div>
          <span className="text-[10px] tracking-[0.4em] uppercase text-teal font-bold">Admin</span>
          <h1 className="font-display text-3xl md:text-4xl text-white mt-2">Membership Dashboard</h1>
        </div>
        <button onClick={exportCSV} className="inline-flex items-center gap-2 border border-platinum/30 text-platinum font-bold text-xs tracking-wider uppercase px-5 py-2.5 rounded-lg hover:bg-white/5 transition-all">
          <Download className="w-4 h-4" /> Export Directory
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {statCards.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="rounded-xl border border-border bg-card p-5">
              <Icon className={`w-5 h-5 ${s.color} mb-3`} />
              <p className="text-3xl font-bold text-white leading-none">{s.value}</p>
              <p className="text-[10px] tracking-wide uppercase text-zinc-500 mt-2">{s.label}</p>
            </div>
          );
        })}
      </div>

      {/* Two column: Recent Check-ins + Plan Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Recent Check-ins */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="text-sm font-bold text-white mb-4">Recent Check-Ins</h3>
          {checkIns.length > 0 ? (
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {checkIns.map((ci) => (
                <div key={ci.id} className="flex items-center justify-between text-xs border-b border-border pb-2">
                  <span className="text-zinc-400">{new Date(ci.check_in_time).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                  <span className={`font-medium capitalize ${ci.status === 'approved' ? 'text-teal' : ci.status === 'denied' ? 'text-red-500' : 'text-yellow-500'}`}>{ci.status}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-zinc-600">No check-ins recorded.</p>
          )}
        </div>

        {/* Plan Performance */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="text-sm font-bold text-white mb-4">Plan Performance</h3>
          <div className="space-y-3">
            {plans.map((p) => {
              const count = members.filter(m => m.selected_plan_id === p.plan_id && m.membership_status === 'active').length;
              const maxCount = Math.max(...plans.map(pl => members.filter(m => m.selected_plan_id === pl.plan_id && m.membership_status === 'active').length), 1);
              return (
                <div key={p.id}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-zinc-300">{p.plan_name}</span>
                    <span className="text-zinc-500">{count} members</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-teal rounded-full" style={{ width: `${(count / maxCount) * 100}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Member Directory */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h3 className="text-sm font-bold text-white">Member Directory</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border text-zinc-500">
                <th className="text-left px-4 py-3 font-medium">Member #</th>
                <th className="text-left px-4 py-3 font-medium">Name</th>
                <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Email</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Waiver</th>
                <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Photo</th>
              </tr>
            </thead>
            <tbody>
              {members.slice(0, 50).map((m) => (
                <tr key={m.id} className="border-b border-border hover:bg-muted/30">
                  <td className="px-4 py-3 text-zinc-400">{m.member_number || '—'}</td>
                  <td className="px-4 py-3 text-white font-medium">{m.first_name} {m.last_name}</td>
                  <td className="px-4 py-3 text-zinc-400 hidden md:table-cell">{m.email}</td>
                  <td className="px-4 py-3"><span className={`capitalize ${m.membership_status === 'active' ? 'text-teal' : m.membership_status === 'canceled' || m.membership_status === 'expired' ? 'text-red-500' : 'text-yellow-500'}`}>{m.membership_status}</span></td>
                  <td className="px-4 py-3 hidden sm:table-cell"><span className={m.waiver_status === 'signed' ? 'text-teal' : 'text-yellow-500'}>{m.waiver_status === 'signed' ? '✓' : '✗'}</span></td>
                  <td className="px-4 py-3 hidden sm:table-cell"><span className={m.photo_url ? 'text-teal' : 'text-yellow-500'}>{m.photo_url ? '✓' : '✗'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {members.length > 50 && <p className="text-center text-xs text-zinc-600 py-3">Showing 50 of {members.length} members. Export for full directory.</p>}
      </div>
    </div>
  );
}