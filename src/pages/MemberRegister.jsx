import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import ProgressSteps from '@/components/membership/ProgressSteps';

const inputClass = 'w-full h-12 bg-input border border-border rounded-lg px-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-teal transition-colors';
const labelClass = 'text-xs text-zinc-400 font-medium mb-1.5 block';

export default function MemberRegister() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', password: '',
    confirmPassword: '', dob: '', emergencyName: '', emergencyPhone: '',
    communication: 'email', agreeComms: false, certify18: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [under18, setUnder18] = useState(false);

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });
  const setCheck = (field) => (e) => setForm({ ...form, [field]: e.target.checked });

  const calculateAge = (dob) => {
    const birth = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!form.certify18) {
      setError('You must certify that you are at least 18 years old to continue.');
      return;
    }
    if (calculateAge(form.dob) < 18) {
      setUnder18(true);
      return;
    }

    setLoading(true);
    try {
      await base44.auth.register({
        email: form.email,
        password: form.password,
        full_name: `${form.firstName} ${form.lastName}`,
      });
      setShowOtp(true);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setError('');
    setLoading(true);
    try {
      const result = await base44.auth.verifyOtp({ email: form.email, otpCode });
      if (result?.access_token) {
        base44.auth.setToken(result.access_token);
      }
      const user = await base44.auth.me();
      await base44.entities.Members.create({
        user_id: user.id,
        first_name: form.firstName,
        last_name: form.lastName,
        email: form.email,
        phone: form.phone,
        date_of_birth: form.dob,
        emergency_contact_name: form.emergencyName,
        emergency_contact_phone: form.emergencyPhone,
        preferred_communication: form.communication,
        selected_plan_id: localStorage.getItem('selectedPlanId'),
        membership_status: 'pending',
        access_status: 'pending',
        waiver_status: 'pending',
      });
      navigate('/profile-setup');
    } catch (err) {
      setError(err.message || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (under18) {
    return (
      <div className="animate-fade-in max-w-lg mx-auto px-6 py-20">
        <ProgressSteps current="Account" />
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-teal mx-auto mb-6" />
          <h1 className="font-display text-2xl text-white mb-3">Parent or Guardian Authorization Required</h1>
          <p className="text-sm text-zinc-400 leading-relaxed mb-8">
            You must be at least 18 years old to create a High Frequency membership account. If you are under 18, a parent or legal guardian must complete the registration on your behalf and provide authorization.
          </p>
          <p className="text-sm text-zinc-400 leading-relaxed mb-8">
            Please have your parent or guardian contact us to begin the authorized minor enrollment process.
          </p>
          <Link to="/join" className="inline-flex items-center gap-2 border border-platinum/30 text-platinum font-bold text-sm tracking-wider uppercase px-8 py-3.5 rounded-lg hover:bg-white/5 transition-all">
            Back to Join
          </Link>
        </div>
      </div>
    );
  }

  if (showOtp) {
    return (
      <div className="animate-fade-in max-w-md mx-auto px-6 py-20">
        <ProgressSteps current="Account" />
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl text-white mb-2">Verify Your Email</h1>
          <p className="text-sm text-zinc-400">We sent a 6-digit code to {form.email}</p>
        </div>
        {error && <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>}
        <div className="flex justify-center mb-6">
          <InputOTP maxLength={6} value={otpCode} onChange={setOtpCode} autoFocus>
            <InputOTPGroup>
              {[0, 1, 2, 3, 4, 5].map(i => <InputOTPSlot key={i} index={i} />)}
            </InputOTPGroup>
          </InputOTP>
        </div>
        <button onClick={handleVerify} disabled={loading || otpCode.length < 6}
          className="w-full bg-teal text-white font-bold text-sm tracking-wider uppercase py-3.5 rounded-lg hover:bg-teal/90 transition-all disabled:opacity-60">
          {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Verify & Continue'}
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in max-w-2xl mx-auto px-6 py-12 md:py-16">
      <ProgressSteps current="Account" />
      <div className="mb-8">
        <span className="text-[10px] tracking-[0.4em] uppercase text-teal font-bold">Step 1</span>
        <h1 className="font-display text-3xl md:text-4xl text-white mt-2">Create Your Account</h1>
        <p className="text-sm text-zinc-400 mt-2">Sign up to start your High Frequency membership.</p>
      </div>

      {error && <div className="mb-6 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>First Name</label>
            <input className={inputClass} value={form.firstName} onChange={set('firstName')} required />
          </div>
          <div>
            <label className={labelClass}>Last Name</label>
            <input className={inputClass} value={form.lastName} onChange={set('lastName')} required />
          </div>
        </div>
        <div>
          <label className={labelClass}>Email</label>
          <input type="email" className={inputClass} value={form.email} onChange={set('email')} required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Mobile Phone</label>
            <input type="tel" className={inputClass} value={form.phone} onChange={set('phone')} required />
          </div>
          <div>
            <label className={labelClass}>Date of Birth</label>
            <input type="date" className={inputClass} value={form.dob} onChange={set('dob')} required />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Password</label>
            <input type="password" className={inputClass} value={form.password} onChange={set('password')} required />
          </div>
          <div>
            <label className={labelClass}>Confirm Password</label>
            <input type="password" className={inputClass} value={form.confirmPassword} onChange={set('confirmPassword')} required />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Emergency Contact Name</label>
            <input className={inputClass} value={form.emergencyName} onChange={set('emergencyName')} required />
          </div>
          <div>
            <label className={labelClass}>Emergency Contact Phone</label>
            <input type="tel" className={inputClass} value={form.emergencyPhone} onChange={set('emergencyPhone')} required />
          </div>
        </div>
        <div>
          <label className={labelClass}>Preferred Communication Method</label>
          <select className={inputClass} value={form.communication} onChange={set('communication')}>
            <option value="email">Email</option>
            <option value="sms">SMS / Text</option>
            <option value="phone">Phone</option>
          </select>
        </div>

        <div className="space-y-3 pt-2">
          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" checked={form.agreeComms} onChange={setCheck('agreeComms')} className="w-4 h-4 mt-0.5 rounded border-border accent-teal" />
            <span className="text-xs text-zinc-400 leading-relaxed">I agree to receive membership communications from High Frequency.</span>
          </label>
          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" checked={form.certify18} onChange={setCheck('certify18')} className="w-4 h-4 mt-0.5 rounded border-border accent-teal" required />
            <span className="text-xs text-zinc-400 leading-relaxed">I certify that I am at least 18 years old.</span>
          </label>
        </div>

        <button type="submit" disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 bg-teal text-white font-bold text-sm tracking-wider uppercase px-8 py-4 rounded-lg hover:bg-teal/90 transition-all disabled:opacity-60">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Create Account <ArrowRight className="w-4 h-4" /></>}
        </button>
      </form>

      <p className="text-center text-xs text-zinc-500 mt-6">
        Already have an account?{' '}
        <button onClick={() => base44.auth.redirectToLogin()} className="text-teal font-medium hover:underline">Log in</button>
      </p>
    </div>
  );
}