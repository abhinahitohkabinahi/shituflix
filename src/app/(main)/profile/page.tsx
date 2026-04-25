'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
    <div className="min-h-screen bg-[#141414] py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-white mb-6">Profile</h1>

        {/* Profile info */}
        <div className="bg-gray-900 rounded-lg p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-white font-semibold text-lg">{profile.name}</p>
              <p className="text-gray-400 text-sm mt-1">{profile.email}</p>
              <p className="text-gray-600 text-xs mt-1 capitalize">{profile.role}</p>
            </div>
            <Button variant="secondary" size="sm" onClick={openEdit}>Edit</Button>
          </div>
        </div>

        {/* Links */}
        <div className="bg-gray-900 rounded-lg p-4 mb-6 flex gap-4">
          <Link href="/my-list" className="text-[#e50914] hover:underline text-sm">My List</Link>
        </div>

        {/* Continue Watching */}
        <div className="bg-gray-900 rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-white">Continue Watching</h2>
            {watchHistory.length > 0 && (
              <button
                onClick={() => clearMutation.mutate()}
                className="text-gray-400 hover:text-red-400 text-sm transition-colors"
              >
                Clear History
              </button>
            )}
          </div>
          {historyLoading ? (
            <Spinner size="sm" />
          ) : watchHistory.length === 0 ? (
            <p className="text-gray-500 text-sm">No watch history yet.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {watchHistory.slice(0, 10).map(item => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <span className="text-gray-300">{item.content_id}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    item.content_type === 'movie' ? 'bg-red-900 text-red-200' :
                    item.content_type === 'tv' ? 'bg-blue-900 text-blue-200' :
                    'bg-purple-900 text-purple-200'
                  }`}>{item.content_type}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sign out */}
        <Button variant="ghost" onClick={handleSignOut} className="w-full border border-gray-700">
          Sign Out
        </Button>
      </div>

      {/* Edit modal */}
      <Modal isOpen={editOpen} onClose={() => setEditOpen(false)} title="Edit Profile">
        <form onSubmit={handleEditSubmit} className="flex flex-col gap-4">
          <Input label="Name" value={editName} onChange={e => setEditName(e.target.value)} required />
          <Input label="Email" type="email" value={editEmail} onChange={e => setEditEmail(e.target.value)} required />
          {editError && <p className="text-red-400 text-sm">{editError}</p>}
          <Button type="submit" disabled={editLoading}>
            {editLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
