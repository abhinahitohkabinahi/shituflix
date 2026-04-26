'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import { useWatchHistory } from '@/hooks/useWatchHistory';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { signOut } from '@/services/supabase/auth';
import { updateProfile } from '@/services/supabase/profile';
import { useDispatch } from 'react-redux';
import { clearAuth } from '@/store/authSlice';
import type { AppDispatch } from '@/store/store';
import { useQuery } from '@tanstack/react-query';
import { fetchMovieById, fetchTVShowById } from '@/services/tmdb';
import { TMDB_IMAGE_BASE_URL } from '@/utils/constants';
import { getIconUrl } from '@/utils/profileIcons';

function HistoryItem({ contentId, contentType }: { contentId: string; contentType: string }) {
  const { data: details, isLoading } = useQuery({
    queryKey: [contentType, contentId],
    queryFn: async () => {
      if (contentType === 'tv') return fetchTVShowById(contentId);
      return fetchMovieById(contentId);
    },
  }) as any;

  if (isLoading || !details) {
    return <div className="h-12 bg-gray-800 animate-pulse rounded" />;
  }

  return (
    <div className="flex items-center justify-between p-3 bg-gray-800/50 hover:bg-gray-800 rounded-lg transition-colors group">
      <div className="flex items-center gap-4">
        <div className="relative w-16 aspect-video rounded overflow-hidden">
          <Image 
            src={`${TMDB_IMAGE_BASE_URL}${details.backdrop_path || details.poster_path}`} 
            alt={details.title || details.name} 
            fill 
            className="object-cover"
            unoptimized
          />
        </div>
        <div>
          <p className="text-white font-medium text-sm line-clamp-1">{details.title || details.name}</p>
          <span className="text-xs text-gray-400 capitalize">{contentType}</span>
        </div>
      </div>
      <Link 
        href={`/watch/${contentType}/${contentId}`}
        className="text-[#e50914] text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity"
      >
        Watch Again
      </Link>
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { profile, isAuthenticated, loading } = useAuth();
  const { data: watchHistory = [], isLoading: historyLoading, clearMutation } = useWatchHistory();

  const [editOpen, setEditOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editError, setEditError] = useState('');
  const [editLoading, setEditLoading] = useState(false);

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  if (!isAuthenticated || !profile) {
    router.replace('/auth/sign-in');
    return null;
  }

  function openEdit() {
    setEditName(profile!.name);
    setEditEmail(profile!.email);
    setEditError('');
    setEditOpen(true);
  }

  async function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEditError('');
    setEditLoading(true);
    try {
      await updateProfile(profile!.id, { name: editName, email: editEmail });
      setEditOpen(false);
    } catch {
      setEditError('Failed to update profile. Please try again.');
    } finally {
      setEditLoading(false);
    }
  }

  async function handleSignOut() {
    await signOut();
    dispatch(clearAuth());
    router.push('/auth/sign-in');
  }

  return (
    <div className="min-h-screen bg-[#141414] pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 md:px-12 lg:px-16">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center gap-8 mb-12 p-8 bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-gray-800 shadow-2xl">
          <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-xl overflow-hidden shadow-2xl ring-4 ring-gray-800">
             <Image 
               src={getIconUrl(profile.avatar_url)} 
               alt="Profile" 
               fill 
               className="object-cover"
             />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight">{profile.name}</h1>
            <p className="text-gray-400 text-lg mb-4">{profile.email}</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
               <button 
                 onClick={openEdit}
                 className="px-6 py-2 bg-white text-black font-bold rounded hover:bg-gray-200 transition-colors"
               >
                 Edit Profile
               </button>
               <button 
                 onClick={handleSignOut}
                 className="px-6 py-2 bg-transparent text-gray-400 border border-gray-700 font-bold rounded hover:text-white hover:border-white transition-colors"
               >
                 Sign Out
               </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-800">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Continue Watching</h2>
                {watchHistory.length > 0 && (
                  <button
                    onClick={() => clearMutation.mutate()}
                    className="text-gray-500 hover:text-red-500 text-sm font-medium transition-colors"
                  >
                    Clear History
                  </button>
                )}
              </div>
              
              {historyLoading ? (
                <div className="flex justify-center py-8"><Spinner size="sm" /></div>
              ) : watchHistory.length === 0 ? (
                <p className="text-gray-500 text-center py-8 bg-gray-800/30 rounded-lg">No watch history yet.</p>
              ) : (
                <div className="space-y-3">
                  {watchHistory.slice(0, 10).map(item => (
                    <HistoryItem 
                      key={item.id} 
                      contentId={item.content_id} 
                      contentType={item.content_type} 
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-[#181818] p-6 rounded-2xl border border-gray-800">
              <h3 className="text-white font-bold mb-4">Quick Links</h3>
              <div className="flex flex-col gap-3">
                 <Link href="/my-list" className="p-3 bg-gray-800/50 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition-all flex items-center justify-between group">
                   <span>My List</span>
                   <span className="text-[#e50914] text-xs font-bold group-hover:translate-x-1 transition-transform">→</span>
                 </Link>
                 <Link href="/anime" className="p-3 bg-gray-800/50 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition-all flex items-center justify-between group">
                   <span>Anime Collection</span>
                   <span className="text-[#e50914] text-xs font-bold group-hover:translate-x-1 transition-transform">→</span>
                 </Link>
              </div>
            </div>

            <div className="bg-[#e50914]/10 p-6 rounded-2xl border border-[#e50914]/20">
              <h3 className="text-[#e50914] font-bold mb-2">DograFlix Premium</h3>
              <p className="text-gray-400 text-xs leading-relaxed">
                You are currently on the free tier. Upgrade for 4K streaming and offline downloads.
              </p>
              <button className="mt-4 w-full py-2 bg-[#e50914] text-white font-bold rounded text-sm hover:bg-[#b20710] transition-colors">
                Coming Soon
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit modal */}
      <Modal isOpen={editOpen} onClose={() => setEditOpen(false)} title="Edit Profile">
        <div className="flex flex-col items-center mb-8">
          <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden shadow-2xl ring-2 ring-gray-700 mb-4">
             <Image 
               src={getIconUrl(profile.avatar_url)} 
               alt="Profile" 
               fill 
               className="object-cover"
             />
          </div>
          <p className="text-gray-500 text-sm">To change your icon, use the "Manage Profiles" screen.</p>
        </div>

        <form onSubmit={handleEditSubmit} className="space-y-6">
          <Input 
            label="Display Name"
            value={editName} 
            onChange={e => setEditName(e.target.value)} 
            required 
            placeholder="Your name"
            className="bg-[#333] border-none text-white h-12 focus:bg-[#444] transition-colors"
          />
          
          <Input 
            label="Email Address"
            type="email" 
            value={editEmail} 
            onChange={e => setEditEmail(e.target.value)} 
            required 
            placeholder="Your email"
            className="bg-[#333] border-none text-white h-12 focus:bg-[#444] transition-colors"
          />

          {editError && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded text-sm font-medium animate-in shake-in duration-300">
              {editError}
            </div>
          )}

          <div className="flex flex-col gap-3 pt-4">
             <button 
               type="submit" 
               disabled={editLoading}
               className="w-full h-12 bg-white text-black font-black uppercase tracking-widest text-sm hover:bg-gray-200 transition-all disabled:opacity-50 flex items-center justify-center rounded"
             >
               {editLoading ? <Spinner size="sm" /> : 'Save Changes'}
             </button>
             <button 
               onClick={() => setEditOpen(false)}
               type="button"
               className="w-full h-12 bg-transparent text-gray-400 font-bold uppercase tracking-widest text-xs hover:text-white transition-colors"
             >
               Cancel
             </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
