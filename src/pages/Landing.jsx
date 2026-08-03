import React from 'react';
import LandingHero from '@/components/landing/LandingHero';
import LandingManifesto from '@/components/landing/LandingManifesto';
import LandingFeatures from '@/components/landing/LandingFeatures';
import LandingCTA from '@/components/landing/LandingCTA';

export default function Landing() {
  return (
    <div className="animate-fade-in">
      <LandingHero />
      <LandingManifesto />
      <LandingFeatures />
      <LandingCTA />
    </div>
  );
}