'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Tv, PlayCircle, Heart, User } from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/series', icon: Tv, label: 'Series' },
  { href: '/anime', icon: PlayCircle, label: 'Anime' },
  { href: '/my-list', icon: Heart, label: 'My List' },
  { href: '/profile', icon: User, label: 'More' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 z-[100] w-full border-t border-white/10 bg-black/80 pb-safe pt-2 backdrop-blur-xl md:hidden">
      <div className="flex items-center justify-around px-2 pb-2">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className="group flex flex-col items-center gap-1 transition-all active:scale-90"
            >
              <div className="relative">
                <Icon
                  className={`h-6 w-6 transition-colors ${
                    isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-300'
                  }`}
                />
                {isActive && (
                  <motion.div
                    layoutId="bottomNavActive"
                    className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[#e50914]"
                  />
                )}
              </div>
              <span
                className={`text-[10px] font-medium transition-colors ${
                  isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-300'
                }`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
