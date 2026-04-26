'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Pencil, ArrowLeft, ChevronDown } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setProfileSelected, setKidsMode } from '@/store/authSlice';
import { MAIN_ICONS, OTHER_ICONS } from './icons';

import { useAuth } from '@/hooks/useAuth';
import { getIconUrl, PROFILE_ICONS } from '@/utils/profileIcons';
import { updateAvatar } from '@/services/supabase/profile';

export default function ProfileSelectionPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, profile } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [showMoreIcons, setShowMoreIcons] = useState(false);

  const handleProfileClick = async () => {
    if (isEditing) {
      setShowIconPicker(true);
    } else {
      dispatch(setKidsMode(false));
      dispatch(setProfileSelected(true));
      router.push('/');
    }
  };

  const handleIconSelect = async (iconCode: string) => {
    if (user) {
      try {
        await updateAvatar(user.id, iconCode);
        setShowIconPicker(false);
        setShowMoreIcons(false);
        // Refresh page to see new icon (or use state)
        window.location.reload();
      } catch (err) {
        console.error('Failed to update icon', err);
      }
    }
  };

  if (showIconPicker) {
    const classicCodes = Object.keys(PROFILE_ICONS).filter(k => k.startsWith('classic_'));
    const otherCodes = Object.keys(PROFILE_ICONS).filter(k => k.startsWith('other_'));

    return (
      <div className="min-h-screen bg-[#141414] flex flex-col items-center py-20 px-4 animate-in fade-in duration-500">
        <div className="max-w-6xl w-full">
          <div className="flex items-center gap-4 mb-12">
            <button 
              onClick={() => {
                setShowIconPicker(false);
                setShowMoreIcons(false);
              }}
              className="text-white hover:bg-white/10 p-2 rounded-full transition-colors"
            >
              <ArrowLeft size={32} />
            </button>
            <div>
              <h1 className="text-white text-3xl md:text-5xl font-medium">Choose Profile Icon</h1>
              <p className="text-gray-500 mt-2 text-lg">Select a character for your profile</p>
            </div>
          </div>
          
          <div className="space-y-12">
            <div>
              <h2 className="text-white text-2xl font-medium mb-6">Classics</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {classicCodes.map((code) => (
                  <div 
                    key={code}
                    className="relative aspect-square cursor-pointer hover:scale-105 transition-transform rounded overflow-hidden hover:ring-4 hover:ring-white"
                    onClick={() => handleIconSelect(code)}
                  >
                    <Image 
                      src={PROFILE_ICONS[code]} 
                      alt={code} 
                      fill 
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {!showMoreIcons ? (
              <div className="flex justify-center mt-8 pb-12">
                <button 
                  onClick={() => setShowMoreIcons(true)}
                  className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors border border-gray-500 hover:border-white rounded-full px-6 py-3 font-medium"
                >
                  <ChevronDown size={20} />
                  <span>Show More</span>
                </button>
              </div>
            ) : (
              <div className="pb-20 animate-in slide-in-from-bottom-4 duration-700">
                <h2 className="text-white text-2xl font-medium mb-6">More Avatars</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                  {otherCodes.map((code) => (
                    <div 
                      key={code}
                      className="relative aspect-square cursor-pointer hover:scale-110 hover:z-10 transition-transform rounded overflow-hidden hover:ring-2 hover:ring-white"
                      onClick={() => handleIconSelect(code)}
                    >
                      <Image 
                        src={PROFILE_ICONS[code]} 
                        alt={code} 
                        fill 
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-[#141414] flex flex-col items-center justify-center p-4 animate-in fade-in duration-1000">
      <h1 className="text-white text-3xl md:text-5xl font-medium mb-12 drop-shadow-lg">
        {isEditing ? 'Manage Profiles:' : "Who's watching?"}
      </h1>
      
      <div className="flex flex-wrap justify-center gap-6 md:gap-12">
        <div 
          className="group flex flex-col items-center gap-4 cursor-pointer transition-all duration-300"
          onClick={handleProfileClick}
        >
          <div className="relative w-32 h-32 md:w-44 md:h-44 rounded-md overflow-hidden ring-4 ring-transparent group-hover:ring-white transition-all duration-300 group-hover:scale-105 shadow-2xl">
            <Image 
              src={getIconUrl(profile.avatar_url)} 
              alt={profile.name} 
              fill 
              className={`object-cover transition-opacity duration-300 ${isEditing ? 'opacity-50' : 'opacity-100'}`}
            />
            {isEditing && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <div className="bg-black/60 p-3 rounded-full border border-white/50 backdrop-blur-sm">
                  <Pencil className="text-white" size={24} />
                </div>
              </div>
            )}
          </div>
          <span className="text-gray-500 text-xl md:text-2xl font-medium group-hover:text-white transition-colors duration-300">
            {profile.name}
          </span>
        </div>

        <div 
          className="group flex flex-col items-center gap-4 cursor-pointer transition-all duration-300"
          onClick={() => {
            if (!isEditing) {
              dispatch(setKidsMode(true));
              dispatch(setProfileSelected(true));
              router.push('/');
            }
          }}
        >
          <div className="relative w-32 h-32 md:w-44 md:h-44 rounded-md overflow-hidden ring-4 ring-transparent group-hover:ring-white transition-all duration-300 group-hover:scale-105 shadow-2xl">
            <Image 
              src="/assets/images/profiles/kids.svg" 
              alt="Kids" 
              fill 
              className={`object-cover transition-opacity duration-300 ${isEditing ? 'opacity-50' : 'opacity-100'}`}
            />
          </div>
          <span className="text-gray-500 text-xl md:text-2xl font-medium group-hover:text-white transition-colors duration-300">
            Kids
          </span>
        </div>
        
        {!isEditing && (
          <div className="group flex flex-col items-center gap-4 cursor-pointer transition-all duration-300 opacity-30 grayscale hover:grayscale-0 hover:opacity-100">
            <div className="relative w-32 h-32 md:w-44 md:h-44 flex items-center justify-center bg-[#181818] group-hover:bg-gray-800 transition-all duration-300 rounded-md group-hover:scale-105 shadow-2xl">
              <span className="text-gray-500 text-6xl group-hover:text-white transition-colors duration-300">+</span>
            </div>
            <span className="text-gray-500 text-xl md:text-2xl font-medium group-hover:text-white transition-colors duration-300">
              Add Profile
            </span>
          </div>
        )}
      </div>

      <button 
        onClick={() => setIsEditing(!isEditing)}
        className={`mt-24 px-8 py-2 text-sm md:text-lg uppercase tracking-[0.2em] transition-all duration-300 border ${
          isEditing 
          ? 'bg-white text-black border-white font-bold hover:bg-gray-200' 
          : 'bg-transparent text-gray-500 border-gray-500 hover:text-white hover:border-white'
        }`}
      >
        {isEditing ? 'Done' : 'Manage Profiles'}
      </button>
    </div>
  );
}
