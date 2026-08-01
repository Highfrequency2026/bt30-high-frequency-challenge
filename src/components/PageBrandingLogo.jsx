import React from 'react';

const BT_LOGO_URL = "https://media.base44.com/images/public/6a6d316d80e436e8127c02a4/12a4b6940_ChatGPTImageAug1202608_03_36AM.png";

/**
 * Fixed BT branding logo positioned in the top-right corner of each interior page.
 * Uses screen blend mode so the black background drops out against any backdrop,
 * with a drop shadow for legibility. Hidden on Home (which has its own hero logo).
 */
export default function PageBrandingLogo({ hidden = false }) {
  if (hidden) return null;

  return (
    <img
      src={BT_LOGO_URL}
      alt="BT — Bre Tiesi × High Frequency"
      className="absolute top-4 right-4 md:top-6 md:right-8 z-30 w-16 h-20 md:w-20 md:h-24 lg:w-24 lg:h-28 object-contain object-top pointer-events-none"
      style={{
        mixBlendMode: 'screen',
        filter: 'brightness(1.12) contrast(1.15) hue-rotate(-22deg) saturate(1.4) drop-shadow(0 2px 12px rgba(0,0,0,0.5))',
      }}
    />
  );
}