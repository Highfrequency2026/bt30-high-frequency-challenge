import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import ProgressSteps from '@/components/membership/ProgressSteps';
import { useToast } from '@/components/ui/use-toast';

const inputClass = 'w-full h-12 bg-input border border-border rounded-lg px-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-teal transition-colors';
const labelClass = 'text-xs text-zinc-400 font-medium mb-1.5 block';
const textareaClass = 'w-full bg-input border border-border rounded-lg px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-teal transition-colors min-h-[80px]';

export default function MemberProfileSetup() {
  const navigate = useNavigate();
  const { user, isLoadingAuth } = useAuth();
  const { toast } = useToast();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    legal_first_name: '', legal_last_name: '', preferred_name: '',
    address: '', city: '', state: '', zip_code: '', phone: '',
    emergency_contact_name: '', emergency_contact_phone: '',
    fitness_goals: '', health_notes: '', referral_source: '',
  });

  useEffect(() => {
    if (!isLoadingAuth && !user) {
      base44.auth.redirectToLogin(window.location.href);
      return;
    }
    if (user) {
      base44.entities.Members.filter({ user_id: user.id })
        .then((members) => {
          if (members.length > 0) {
            const m = members[0];
            setMember(m);
            setForm({
              legal_first_name: m.first_name || '', legal_last_name: m.last_name || '',
              preferred_name: m.preferred_name || '', address: m.address || '',
              city: m.city || '', state: m.state || '', zip_code: m.zip_code || '',
              phone: m.phone || '', emergency_contact_name: m.emergency_contact_name || '',
              emergency_contact_phone: m.emergency_contact_phone || '',
              fitness_goals: m.fitness_goals || '', health_notes: m.health_notes || '',
              referral_source: m.referral_source || '',
            });
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [user, isLoadingAuth]);

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSave = async () => {
    setSaving(true);
    try {
      await base44.entities.Members.update(member.id, {
        first_name: form.legal_first_name, last_name: form.legal_last_name,
        preferred_name: form.preferred_name, address: form.address,
        city: form.city, state: form.state, zip_code: form.zip_code,
        phone: form.phone, emergency_contact_name: form.emergency_contact_name,
        emergency_contact_phone: form.emergency_contact_phone,
        fitness_goals: form.fitness_goals, health_notes: form.health_notes,
        referral_source: form.referral_source,
      });
      toast({ title: 'Profile saved', description: 'Continuing to agreements.' });
      navigate('/agreements');
    } catch (err) {
      toast({ title: 'Save failed', description: err.message || 'Please try again.', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  if (isLoadingAuth || loading || !user) {
    return <div className="flex items-center justify-center min-h-[60vh]"><div className="w-8 h-8 border-4 border-border border-t-teal rounded-full animate-spin" /></div>;
  }

  return (
    <div className="animate-fade-in max-w-2xl mx-auto px-6 py-12 md:py-16">
      <ProgressSteps current="Profile" />
      <div className="mb-8">
        <span className="text-[10px] tracking-[0.4em] uppercase text-teal font-bold">Step 3</span>
        <h1 className="font-display text-3xl md:text-4xl text-white mt-2">Member Profile</h1>
        <p className="text-sm text-zinc-400 mt-2">Tell us about yourself so we can personalize your experience.</p>
      </div>

      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Legal First Name</label>
            <input className={inputClass} value={form.legal_first_name} onChange={set('legal_first_name')} />
          </div>
          <div>
            <label className={labelClass}>Legal Last Name</label>
            <input className={inputClass} value={form.legal_last_name} onChange={set('legal_last_name')} />
          </div>
        </div>
        <div>
          <label className={labelClass}>Preferred Name</label>
          <input className={inputClass} value={form.preferred_name} onChange={set('preferred_name')} placeholder="What should we call you?" />
        </div>
        <div>
          <label className={labelClass}>Street Address</label>
          <input className={inputClass} value={form.address} onChange={set('address')} />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <label className={labelClass}>City</label>
            <input className={inputClass} value={form.city} onChange={set('city')} />
          </div>
          <div>
            <label className={labelClass}>State</label>
            <input className={inputClass} value={form.state} onChange={set('state')} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>ZIP Code</label>
            <input className={inputClass} value={form.zip_code} onChange={set('zip_code')} />
          </div>
          <div>
            <label className={labelClass}>Phone Number</label>
            <input type="tel" className={inputClass} value={form.phone} onChange={set('phone')} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Emergency Contact Name</label>
            <input className={inputClass} value={form.emergency_contact_name} onChange={set('emergency_contact_name')} />
          </div>
          <div>
            <label className={labelClass}>Emergency Contact Phone</label>
            <input type="tel" className={inputClass} value={form.emergency_contact_phone} onChange={set('emergency_contact_phone')} />
          </div>
        </div>
        <div>
          <label className={labelClass}>Fitness Goals</label>
          <textarea className={textareaClass} value={form.fitness_goals} onChange={set('fitness_goals')} placeholder="What do you want to achieve?" />
        </div>
        <div>
          <label className={labelClass}>Health or Accessibility Notes <span className="text-zinc-600">(optional)</span></label>
          <textarea className={textareaClass} value={form.health_notes} onChange={set('health_notes')} placeholder="Any injuries, conditions, or accessibility needs we should know about?" />
          <p className="text-[10px] text-zinc-600 mt-1">This information is optional and access-restricted. It is used only to ensure your safety during training.</p>
        </div>
        <div>
          <label className={labelClass}>How did you hear about High Frequency?</label>
          <select className={inputClass} value={form.referral_source} onChange={set('referral_source')}>
            <option value="">Select an option</option>
            <option value="friend">Friend or Family</option>
            <option value="social">Social Media</option>
            <option value="search">Google Search</option>
            <option value="driveby">Walked / Drove By</option>
            <option value="event">Event or Class</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <button onClick={handleSave} disabled={saving}
        className="w-full mt-8 inline-flex items-center justify-center gap-2 bg-teal text-white font-bold text-sm tracking-wider uppercase px-8 py-4 rounded-lg hover:bg-teal/90 transition-all disabled:opacity-60">
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Save & Continue <ArrowRight className="w-4 h-4" /></>}
      </button>
    </div>
  );
}