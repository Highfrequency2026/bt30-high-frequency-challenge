import React from 'react';

export default function QRCode({ value, size = 200, className = '' }) {
  if (!value) return null;
  const src = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(value)}&bgcolor=0d0d0d&color=ffffff`;
  return (
    <img
      src={src}
      alt="QR Code"
      width={size}
      height={size}
      className={`rounded-lg ${className}`}
      style={{ imageRendering: 'pixelated' }}
    />
  );
}