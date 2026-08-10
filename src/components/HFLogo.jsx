import React from 'react';

const LOGO_URL = "https://media.base44.com/images/public/6a6d316d80e436e8127c02a4/584e19fbe_ChatGPTImageAug9202606_29_28PM.png";

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
      className={`w-32 h-auto rounded-lg ${className}`}
    />
  );
}