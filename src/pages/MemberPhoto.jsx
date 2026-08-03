import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Loader2, Upload, Camera, RefreshCw, Check } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { Image } from '@/components/ui/image';
import ProgressSteps from '@/components/membership/ProgressSteps';
import { useToast } from '@/components/ui/use-toast';

const photoRules = [
  'Only one person in the photo',
  'Face clearly visible',
  'No sunglasses',
  'No hat covering the face',
  'Good lighting',
  'Neutral background',
  'Head and shoulders centered',
  'Recent photograph',
];

export default function MemberPhoto() {
  const navigate = useNavigate();
  const { user, isLoadingAuth } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef(null);
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [photoUrl, setPhotoUrl] = useState(null);
  const [consent, setConsent] = useState(false);
  const [approved, setApproved] = useState(false);

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
            if (members[0].photo_url) setPhotoUrl(members[0].photo_url);
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [user, isLoadingAuth]);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
      toast({ title: 'Invalid file', description: 'Please upload a JPG or PNG image.', variant: 'destructive' });
      return;
    }
    setUploading(true);
    setApproved(false);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setPhotoUrl(file_url);
    } catch (err) {
      toast({ title: 'Upload failed', description: err.message || 'Please try again.', variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const handleRetake = () => {
    setPhotoUrl(null);
    setApproved(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleApprove = () => setApproved(true);

  const handleContinue = async () => {
    setSaving(true);
    try {
      await base44.entities.Members.update(member.id, {
        photo_url: photoUrl,
        photo_consent: true,
      });
      toast({ title: 'Photo saved', description: 'Continuing to payment.' });
      navigate('/checkout');
    } catch (err) {
      toast({ title: 'Save failed', description: err.message || 'Please try again.', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  if (isLoadingAuth || loading || !user) {
    return <div className="flex items-center justify-center min-h-[60vh]"><div className="w-8 h-8 border-4 border-border border-t-teal rounded-full animate-spin" /></div>;
  }

  const canContinue = photoUrl && approved && consent;

  return (
    <div className="animate-fade-in max-w-2xl mx-auto px-6 py-12 md:py-16">
      <ProgressSteps current="Photo" />
      <div className="mb-8">
        <span className="text-[10px] tracking-[0.4em] uppercase text-teal font-bold">Step 5</span>
        <h1 className="font-display text-3xl md:text-4xl text-white mt-2">Membership Photo</h1>
        <p className="text-sm text-zinc-400 mt-2">Upload a clear photo for your membership identification and digital access pass.</p>
      </div>

      {/* Photo area */}
      <div className="rounded-2xl border border-border bg-card p-6 mb-6">
        {photoUrl ? (
          <div className="flex flex-col items-center">
            <div className="w-48 h-48 rounded-xl overflow-hidden border-2 border-teal/30 mb-4">
              <Image src={photoUrl} alt="Member preview" fittingType="fill" className="w-full h-full" />
            </div>
            {approved ? (
              <div className="flex items-center gap-2 text-teal text-sm font-medium mb-3">
                <Check className="w-4 h-4" /> Photo approved
              </div>
            ) : (
              <div className="flex gap-3 mb-3">
                <button onClick={handleApprove} className="bg-teal text-white font-bold text-xs tracking-wider uppercase px-6 py-2.5 rounded-lg hover:bg-teal/90 transition-all">
                  Approve Photo
                </button>
                <button onClick={handleRetake} className="border border-platinum/30 text-platinum font-bold text-xs tracking-wider uppercase px-6 py-2.5 rounded-lg hover:bg-white/5 transition-all inline-flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5" /> Retake
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center py-8">
            {uploading ? (
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 text-teal animate-spin" />
                <p className="text-sm text-zinc-400">Uploading...</p>
              </div>
            ) : (
              <>
                <button onClick={() => fileInputRef.current?.click()}
                  className="w-48 h-48 rounded-xl border-2 border-dashed border-border hover:border-teal/50 flex flex-col items-center justify-center gap-3 transition-all">
                  <Camera className="w-8 h-8 text-zinc-600" />
                  <span className="text-xs text-zinc-500">Take or upload photo</span>
                </button>
                <p className="text-[10px] text-zinc-600 mt-3">JPG or PNG, max 10MB</p>
              </>
            )}
          </div>
        )}
        <input ref={fileInputRef} type="file" accept="image/jpeg,image/jpg,image/png" onChange={handleFile} className="hidden" />
      </div>

      {/* Photo rules */}
      <div className="rounded-xl border border-border bg-card p-5 mb-6">
        <h3 className="text-xs font-bold text-zinc-300 mb-3 tracking-wide uppercase">Photo Requirements</h3>
        <div className="grid grid-cols-2 gap-2">
          {photoRules.map((rule) => (
            <div key={rule} className="flex items-center gap-2 text-xs text-zinc-500">
              <span className="w-1 h-1 bg-teal rounded-full flex-shrink-0" />
              {rule}
            </div>
          ))}
        </div>
      </div>

      {/* Consent */}
      <label className="flex items-start gap-3 cursor-pointer mb-6 rounded-xl border border-border bg-card p-4">
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)}
          className="w-4 h-4 mt-0.5 rounded border-border accent-teal flex-shrink-0" />
        <span className="text-xs text-zinc-400 leading-relaxed">
          I authorize High Frequency to store and display this photograph for membership identification, facility access verification, fraud prevention, and account administration. This photograph will not be used to create a biometric faceprint without separate express consent.
        </span>
      </label>

      <button onClick={handleContinue} disabled={!canContinue || saving}
        className="w-full inline-flex items-center justify-center gap-2 bg-teal text-white font-bold text-sm tracking-wider uppercase px-8 py-4 rounded-lg hover:bg-teal/90 transition-all disabled:opacity-50">
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Save & Continue to Payment <ArrowRight className="w-4 h-4" /></>}
      </button>
    </div>
  );
}