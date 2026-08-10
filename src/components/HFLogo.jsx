import React from 'react';

const LOGO_URL = "https://base44.app/api/apps/6a6d316d80e436e8127c02a4/files/mp/public/6a6d316d80e436e8127c02a4/d9f159313_hf-logo-transparent.png";

export default function HFLogo({ compact = false, className = '' }) {
  if (compact) {
    return (
      <div className={`relative w-9 h-9 rounded-full overflow-hidden flex-shrink-0 ${className}`}>
        <img
          src={LOGO_URL}
          alt="High Frequency"
          className="w-full h-full object-cover"
        />
      </div>
    );
  }
  return (
    <img
      src={LOGO_URL}
      alt="High Frequency — Digital Media"
      className={`w-32 h-auto ${className}`}
    />
  );
}