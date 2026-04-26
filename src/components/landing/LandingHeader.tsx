'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export function LandingHeader() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-colors duration-500 px-8 py-4 lg:px-12 flex items-center justify-between ${isScrolled ? 'bg-black' : 'bg-transparent bg-gradient-to-b from-black/80 to-transparent'
        }`}
    >
      <div className="flex items-center">
        <Link href="/">
          <Image
            src="/assets/images/logo.svg"
            alt="shituFlix"
            width={148}
            height={40}
            className="w-28 lg:w-36 h-auto"
            priority
          />
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <Link
          href="/sign-in"
          className="bg-[#e50815] text-white px-4 py-1.5 rounded text-sm font-medium hover:bg-[#c10712] transition-colors"
        >
          Sign In
        </Link>
      </div>
    </header>
  );
}
