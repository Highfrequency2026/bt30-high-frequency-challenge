import React from 'react';

const LOGO_URL = "https://media.base44.com/images/public/6a6d316d80e436e8127c02a4/f1f9fe9d8_ChatGPTImageJul31202605_45_18PM.png";

const darkFilter = 'invert(1) hue-rotate(180deg)';

export default function HFLogo({ compact = false, className = '' }) {
  if (compact) {
    return (
      <div className={`relative w-9 h-9 rounded-full overflow-hidden flex-shrink-0 ${className}`}>
        <img
          src={LOGO_URL}
          alt="High Frequency"
          className="w-full h-full object-cover"
          style={{ filter: darkFilter, objectPosition: 'center 15%' }}
        />
      </div>
    );
  }
  return (
    <img
      src={LOGO_URL}
      alt="High Frequency — Digital Media"
      className={`w-32 h-auto ${className}`}
      style={{ filter: darkFilter }}
    />
  );
}