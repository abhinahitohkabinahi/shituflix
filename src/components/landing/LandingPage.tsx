'use client';

import { LandingHeader } from './LandingHeader';
import { HeroSection } from './HeroSection';
import { FeatureBlock } from './FeatureBlock';
import { LandingFooter } from './LandingFooter';

export function LandingPage() {
  return (
    <div className="bg-black min-h-screen">
      <LandingHeader />
      
      <main>
        <HeroSection />
        
        <FeatureBlock 
          title="Enjoy on your TV" 
          description="Watch on Smart TVs, Playstation, Xbox, Chromecast, Apple TV, Blu-ray players, and more."
          image="/assets/images/tv.png"
        />
        
        <FeatureBlock 
          title="Download your shows to watch offline" 
          description="Save your favorites easily and always have something to watch."
          image="/assets/images/mobile.png"
          isReversed
        />
        
        <FeatureBlock 
          title="Watch everywhere" 
          description="Stream unlimited movies and TV shows on your phone, tablet, laptop, and TV."
          image="/assets/images/mac.png"
        />
        
        <FeatureBlock 
          title="Create profiles for kids" 
          description="Send kids on adventures with their favorite characters in a space made just for them—free with your membership."
          image="/assets/images/kids.png"
          isReversed
        />
      </main>

      <LandingFooter />
    </div>
  );
}
