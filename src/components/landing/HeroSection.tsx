'use client';

import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export function HeroSection() {
  return (
    <div className="relative h-[80vh] lg:h-[95vh] w-full flex items-center justify-center text-center overflow-hidden">
      {/* Background with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/assets/images/hero-bg.png"
          alt="Hero Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40 bg-gradient-to-t from-black via-black/20 to-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 px-4 max-w-4xl mx-auto mt-20">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-4 tracking-tight">
          Unlimited movies, TV shows, and more
        </h1>
        <p className="text-lg md:text-2xl text-white mb-8 font-medium">
          Watch anywhere. Cancel anytime.
        </p>
        
        <div className="flex flex-col items-center gap-4">
          <p className="text-base md:text-xl text-white">
            Ready to watch? Enter your email to create or restart your membership.
          </p>
          
          <div className="flex flex-col md:flex-row w-full max-w-2xl gap-2 px-4">
            <input 
              type="email" 
              placeholder="Email address" 
              className="flex-1 bg-black/40 border border-grey-350/50 rounded px-4 py-4 text-white placeholder:text-grey-350 focus:outline-none focus:ring-2 focus:ring-white/40"
            />
            <button className="bg-[#e50815] text-white px-8 py-4 rounded text-xl md:text-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#c10712] transition-colors whitespace-nowrap">
              Get Started
              <ArrowRight size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
