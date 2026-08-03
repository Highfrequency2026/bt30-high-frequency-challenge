import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Loader2, Check, Lock } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import ProgressSteps from '@/components/membership/ProgressSteps';
import { useToast } from '@/components/ui/use-toast';
import { agreementDocuments } from '@/data/agreements';

export default function MembershipAgreements() {
  const navigate = useNavigate();
  const { user, isLoadingAuth } = useAuth();
  const { toast } = useToast();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [accepted, setAccepted] = useState({});
  const [scrolled, setScrolled] = useState({});
  const [typedName, setTypedName] = useState('');
  const [signature, setSignature] = useState('');
  const [voluntary, setVoluntary] = useState(false);
  const [today] = useState(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));

  useEffect(() => {
    if (!isLoadingAuth && !user) {
      base44.auth.redirectToLogin(window.location.href);
      return;
    }
    if (user) {
      base44.entities.Members.filter({ user_id: user.id })
        .then((members) => {
          if (members.length > 0) {
            setMember(members[0]);
            setTypedName(`${members[0].first_name} ${members[0].last_name}`);
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [user, isLoadingAuth]);

  const handleScroll = (type) => (e) => {
    const el = e.target;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 20) {
      setScrolled({ ...scrolled, [type]: true });
    }
  };

  const toggleAccept = (type) => (e) => {
    if (!scrolled[type]) {
      toast({ title: 'Please scroll to read', description: 'Scroll through the full agreement before accepting.', variant: 'destructive' });
      e.target.checked = false;
      return;
    }
    setAccepted({ ...accepted, [type]: e.target.checked });
  };

  const allAccepted = agreementDocuments.every(doc => accepted[doc.type]);
  const canSign = allAccepted && typedName.trim() && signature.trim() && voluntary && member;

  const handleSign = async () => {
    setSaving(true);
    try {
      const deviceInfo = navigator.userAgent;
      const signedAt = new Date().toISOString();
      await base44.entities.SignedAgreements.bulkCreate(
        agreementDocuments.map(doc => ({
          member_id: member.id,
          agreement_type: doc.type,
          agreement_version: doc.version,
          document_url: doc.text.substring(0, 500),
          typed_name: typedName,
          signature_url: signature,
          accepted: true,
          signed_at: signedAt,
          device_info: deviceInfo,
        }))
      );
      await base44.entities.Members.update(member.id, { waiver_status: 'signed' });
      toast({ title: 'Agreements signed', description: 'Continuing to photo upload.' });
      navigate('/member-photo');
    } catch (err) {
      toast({ title: 'Signing failed', description: err.message || 'Please try again.', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  if (isLoadingAuth || loading || !user) {
    return <div className="flex items-center justify-center min-h-[60vh]"><div className="w-8 h-8 border-4 border-border border-t-teal rounded-full animate-spin" /></div>;
  }

  return (
    <div className="animate-fade-in max-w-2xl mx-auto px-6 py-12 md:py-16">
      <ProgressSteps current="Agreements" />
      <div className="mb-8">
        <span className="text-[10px] tracking-[0.4em] uppercase text-teal font-bold">Step 4</span>
        <h1 className="font-display text-3xl md:text-4xl text-white mt-2">Agreements & Waivers</h1>
        <p className="text-sm text-zinc-400 mt-2">Please review and accept each agreement below. Scroll through each document to enable its acceptance checkbox.</p>
      </div>

      {/* Agreements */}
      <div className="space-y-4 mb-8">
        {agreementDocuments.map((doc) => (
          <div key={doc.type} className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-border">
              <h3 className="text-sm font-bold text-white">{doc.title}</h3>
              <span className="text-[10px] text-zinc-600">v{doc.version}</span>
            </div>
            <div onScroll={handleScroll(doc.type)} className="h-48 overflow-y-auto px-5 py-4 text-xs text-zinc-400 leading-relaxed whitespace-pre-wrap">
              {doc.text}
            </div>
            <div className="px-5 py-3 border-t border-border flex items-center gap-2.5">
              <input type="checkbox" checked={accepted[doc.type] || false} onChange={toggleAccept(doc.type)}
                className="w-4 h-4 rounded border-border accent-teal" id={`agree-${doc.type}`} />
              <label htmlFor={`agree-${doc.type}`} className="text-xs text-zinc-400 cursor-pointer">
                I have read and accept the {doc.title}
              </label>
              {!scrolled[doc.type] && (
                <span className="ml-auto flex items-center gap-1 text-[10px] text-zinc-600">
                  <Lock className="w-3 h-3" /> Scroll to read
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Signature Section */}
      <div className={`rounded-xl border p-6 transition-all ${allAccepted ? 'border-teal/40 bg-teal/5' : 'border-border bg-card opacity-60'}`}>
        <h3 className="font-display text-xl text-white mb-1">Electronic Signature</h3>
        <p className="text-xs text-zinc-500 mb-5">By typing your full legal name below, you are electronically signing all agreements above.</p>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-zinc-400 font-medium mb-1.5 block">Typed Legal Name</label>
            <input disabled={!allAccepted}
              className="w-full h-12 bg-input border border-border rounded-lg px-4 text-sm text-white focus:outline-none focus:border-teal transition-colors disabled:opacity-50"
              value={typedName} onChange={(e) => setTypedName(e.target.value)} />
          </div>
          <div>
            <label className="text-xs text-zinc-400 font-medium mb-1.5 block">Electronic Signature (type your name)</label>
            <input disabled={!allAccepted} placeholder="Type your full name as your signature"
              className="w-full h-12 bg-input border border-border rounded-lg px-4 text-sm text-white italic focus:outline-none focus:border-teal transition-colors disabled:opacity-50"
              value={signature} onChange={(e) => setSignature(e.target.value)} style={{ fontFamily: 'cursive' }} />
          </div>
          <div className="flex items-center justify-between text-xs text-zinc-500">
            <span>Date: <span className="text-zinc-300">{today}</span></span>
          </div>
          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" checked={voluntary} onChange={(e) => setVoluntary(e.target.checked)} disabled={!allAccepted}
              className="w-4 h-4 mt-0.5 rounded border-border accent-teal disabled:opacity-50" />
            <span className="text-xs text-zinc-400 leading-relaxed">I confirm that I am signing these agreements voluntarily and that the information I have provided is accurate.</span>
          </label>
        </div>
      </div>

      <button onClick={handleSign} disabled={!canSign || saving}
        className="w-full mt-6 inline-flex items-center justify-center gap-2 bg-teal text-white font-bold text-sm tracking-wider uppercase px-8 py-4 rounded-lg hover:bg-teal/90 transition-all disabled:opacity-50">
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Sign & Continue <ArrowRight className="w-4 h-4" /></>}
      </button>
    </div>
  );
}