'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { Bell, User, LogOut, History, Heart, List, Menu, X, Type } from 'lucide-react';
import { toggleTitles } from '@/store/mediaSlice';
import { RootState } from '@/store/store';
import { signOut } from '@/services/supabase/auth';
import { useAuth } from '@/hooks/useAuth';
import { getIconUrl } from '@/utils/profileIcons';

const GENRES = [
  { id: '28', name: 'Action', type: 'movie' },
  { id: '35', name: 'Comedy', type: 'movie' },
  { id: '18', name: 'Drama', type: 'movie' },
  { id: '27', name: 'Horror', type: 'movie' },
  { id: '878', name: 'Sci-Fi', type: 'movie' },
  { id: '10749', name: 'Romance', type: 'movie' },
  { id: '53', name: 'Thriller', type: 'movie' },
  { id: '99', name: 'Documentary', type: 'movie' },
];

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/movies', label: 'Movies' },
  { href: '/tv', label: 'TV Shows' },
  { href: '/anime', label: 'Anime' },
  { href: '/my-list', label: 'My List' },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [query, setQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isGenresOpen, setIsGenresOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const showTitles = useSelector((state: RootState) => state.media.showTitles);
  const { profile, isKidsMode } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setIsSearchOpen(false);
    }
  }

  async function handleSignOut() {
    try {
      await signOut();
      router.push('/sign-in');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }

  return (
    <nav
      className={`fixed top-0 z-50 w-full transition-colors duration-500 ${isScrolled ? 'bg-black' : 'bg-transparent bg-gradient-to-b from-black/80 to-transparent'
        }`}
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-4 py-4 md:px-8">
        {/* Left Side: Logo & Desktop Links */}
        <div className="flex items-center gap-8">
          <Link href="/" className="transition-transform hover:scale-105 active:scale-95">
            <span className="text-[#e50914] text-2xl font-display tracking-tighter uppercase md:hidden">shituFLIX</span>
            <span className="text-[#e50914] text-2xl font-display tracking-tighter uppercase hidden md:block">shituFlix</span>
          </Link>

          <div className="hidden items-center gap-6 md:flex">
            <Link href="/" className={`text-sm transition-colors hover:text-gray-300 ${pathname === '/' ? 'font-bold text-white' : 'text-gray-200'}`}>Home</Link>
            <Link href="/movies" className={`text-sm transition-colors hover:text-gray-300 ${pathname === '/movies' ? 'font-bold text-white' : 'text-gray-200'}`}>Movies</Link>
            <Link href="/tv" className={`text-sm transition-colors hover:text-gray-300 ${pathname === '/tv' ? 'font-bold text-white' : 'text-gray-200'}`}>TV Shows</Link>
            
            {/* Genres Dropdown */}
            <div className="group relative">
              <button className="flex items-center gap-1 text-sm text-gray-200 transition-colors hover:text-gray-300">
                Genres
                <motion.div
                  animate={{ rotate: 0 }}
                  className="ml-1 border-b-2 border-r-2 border-gray-400 p-0.5"
                  style={{ transform: 'rotate(45deg)' }}
                />
              </button>
              
              <div className="invisible absolute left-1/2 -translate-x-1/2 top-full pt-4 opacity-0 transition-all group-hover:visible group-hover:opacity-100">
                <div className="w-56 overflow-hidden border border-white/10 bg-black/95 shadow-2xl p-4 grid grid-cols-2 gap-x-4 gap-y-2">
                  {GENRES.map((genre) => (
                    <Link
                      key={genre.id}
                      href={`/genre/${genre.type}/${genre.id}`}
                      className="text-xs text-gray-400 hover:text-white transition-colors"
                    >
                      {genre.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <Link href="/anime" className={`text-sm transition-colors hover:text-gray-300 ${pathname === '/anime' ? 'font-bold text-white' : 'text-gray-200'}`}>Anime</Link>
            <Link href="/my-list" className={`text-sm transition-colors hover:text-gray-300 ${pathname === '/my-list' ? 'font-bold text-white' : 'text-gray-200'}`}>My List</Link>
          </div>
        </div>

        {/* Right Side: Search, Notifications, Profile */}
        <div className="flex items-center gap-4 text-white md:gap-6">
          <div className="relative flex items-center">
            <AnimatePresence>
              {isSearchOpen && (
                <motion.form
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 250, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  onSubmit={handleSearch}
                  className="absolute right-0 flex items-center overflow-hidden border border-white/40 bg-black/60 px-2 py-1 backdrop-blur-md"
                >
                  <img
                    src="/assets/icons/Search.svg"
                    alt="Search"
                    className="h-4 w-4 brightness-0 invert"
                  />
                  <input
                    autoFocus
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Titles, people, genres"
                    className="ml-2 w-full bg-transparent text-sm text-white placeholder-gray-400 outline-none"
                  />
                  <X
                    className="h-4 w-4 cursor-pointer text-white"
                    onClick={() => setIsSearchOpen(false)}
                  />
                </motion.form>
              )}
            </AnimatePresence>
            {!isSearchOpen && (
              <img
                src="/assets/icons/Search.svg"
                alt="Search"
                className="hidden h-6 w-6 cursor-pointer brightness-0 invert transition-transform hover:scale-110 active:scale-90 md:block"
                onClick={() => setIsSearchOpen(true)}
              />
            )}
          </div>



          {/* Toggle Titles Icon */}
          <button
            onClick={() => dispatch(toggleTitles())}
            className={`hidden md:flex items-center justify-center p-1 rounded-md transition-all ${showTitles ? 'text-white bg-white/10' : 'text-gray-400 hover:text-white'}`}
            title={showTitles ? "Hide movie names" : "Show movie names"}
          >
            <Type className="h-6 w-6" />
          </button>

          {/* Profile Dropdown */}
          <div className="group relative hidden md:block">
            <Link href="/profile-selection" className="flex cursor-pointer items-center gap-2">
              <div className="h-8 w-8 overflow-hidden rounded bg-gray-500">
                <img
                  src={isKidsMode ? "/assets/images/profiles/kids.svg" : getIconUrl(profile?.avatar_url)}
                  alt="Avatar"
                  className="h-full w-full object-cover"
                />
              </div>
              <motion.div
                animate={{ rotate: 0 }}
                className="hidden border-b-2 border-r-2 border-white p-0.5 md:block"
                style={{ transform: 'rotate(45deg)' }}
              />
            </Link>

            {/* Dropdown Menu */}
            <div className="invisible absolute right-0 top-full pt-4 opacity-0 transition-all group-hover:visible group-hover:opacity-100">
              <div className="w-48 overflow-hidden border border-white/10 bg-black/95 shadow-2xl">
                <div className="border-b border-white/10 p-4">
                  <Link href="/profile" className="flex items-center gap-3 text-sm hover:underline">
                    <User className="h-4 w-4" />
                    Account
                  </Link>
                </div>
                <div className="p-4 space-y-4">
                  <Link href="/history" className="flex items-center gap-3 text-sm hover:underline">
                    <History className="h-4 w-4" />
                    History
                  </Link>
                  <Link href="/my-list" className="flex items-center gap-3 text-sm hover:underline">
                    <List className="h-4 w-4" />
                    My List
                  </Link>
                </div>
                <div className="border-t border-white/10 p-4">
                  <button 
                    onClick={handleSignOut}
                    className="flex items-center gap-3 text-sm text-red-500 hover:underline w-full text-left"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Profile & Search */}
          <div className="flex items-center gap-3 md:hidden">
            <button
              onClick={() => dispatch(toggleTitles())}
              className={`flex items-center justify-center p-1 rounded-md transition-all ${showTitles ? 'text-white bg-white/10' : 'text-gray-400 hover:text-white'}`}
              title={showTitles ? "Hide movie names" : "Show movie names"}
            >
              <Type className="h-6 w-6" />
            </button>
            <Link href="/search">
              <img
                src="/assets/icons/Search.svg"
                alt="Search"
                className="h-6 w-6 brightness-0 invert opacity-100 active:scale-90 transition-transform"
              />
            </Link>
            <Link href="/profile-selection" className="h-8 w-8 overflow-hidden rounded bg-gray-500 border border-white/20 active:scale-90 transition-transform">
              <img
                src={isKidsMode ? "/assets/images/profiles/kids.svg" : getIconUrl(profile?.avatar_url)}
                alt="Avatar"
                className="h-full w-full object-cover"
              />
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay - HIDDEN as we use BottomNav now */}
      {/* 
      <AnimatePresence>
        ...
      </AnimatePresence> 
      */}
    </nav>
  );
}

