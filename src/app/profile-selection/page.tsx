'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Pencil, ArrowLeft, ChevronDown } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setProfileSelected } from '@/store/authSlice';
import { MAIN_ICONS, OTHER_ICONS } from './icons';

const INITIAL_PROFILES = [
  { id: '1', name: 'User 1', image: MAIN_ICONS[13] || MAIN_ICONS[0] }, // red.svg
  { id: '2', name: 'User 2', image: MAIN_ICONS[1] || MAIN_ICONS[0] }, // blue.svg
  { id: '3', name: 'User 3', image: MAIN_ICONS[12] || MAIN_ICONS[0] }, // purple.svg
  { id: '4', name: 'Kids', image: MAIN_ICONS[14] || MAIN_ICONS[0] }, // yellow.svg
];

export default function ProfileSelectionPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [profiles, setProfiles] = useState(INITIAL_PROFILES);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProfileId, setEditingProfileId] = useState<string | null>(null);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [showMoreIcons, setShowMoreIcons] = useState(false);

  const handleProfileClick = (id: string) => {
    if (isEditing) {
      setEditingProfileId(id);
      setShowIconPicker(true);
    } else {
      dispatch(setProfileSelected(true));
      router.push('/');
    }
  };

  const handleIconSelect = (icon: string) => {
    if (editingProfileId) {
      setProfiles(prev => prev.map(p => 
        p.id === editingProfileId ? { ...p, image: icon } : p
      ));
      setShowIconPicker(false);
      setEditingProfileId(null);
      setShowMoreIcons(false); // Reset for next time
    }
  };

  if (showIconPicker) {
    return (
      <div className="min-h-screen bg-[#141414] flex flex-col items-center py-20 px-4">
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
              <p className="text-grey-350 mt-2 text-lg">Select a character for your profile</p>
            </div>
          </div>
          
          <div className="space-y-12">
            <div>
              <h2 className="text-white text-2xl font-medium mb-6">Classics</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {MAIN_ICONS.map((icon, index) => (
                  <div 
                    key={index}
                    className="relative aspect-square cursor-pointer hover:scale-105 transition-transform rounded overflow-hidden hover:ring-4 hover:ring-white"
                    onClick={() => handleIconSelect(icon)}
                  >
                    <Image 
                      src={icon} 
                      alt={`Main Icon ${index}`} 
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
                  className="flex items-center gap-2 text-grey-350 hover:text-white transition-colors border border-grey-350 hover:border-white rounded-full px-6 py-3"
                >
                  <ChevronDown size={20} />
                  <span>Show More</span>
                </button>
              </div>
            ) : (
              <div className="pb-20 animate-fade-in">
                <h2 className="text-white text-2xl font-medium mb-6">More Avatars</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                  {OTHER_ICONS.map((icon, index) => (
                    <div 
                      key={index}
                      className="relative aspect-square cursor-pointer hover:scale-110 hover:z-10 transition-transform rounded overflow-hidden hover:ring-2 hover:ring-white"
                      onClick={() => handleIconSelect(icon)}
                    >
                      <Image 
                        src={icon} 
                        alt={`Other Icon ${index}`} 
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

  return (
    <div className="min-h-screen bg-[#141414] flex flex-col items-center justify-center p-4">
      <h1 className="text-white text-3xl md:text-5xl font-medium mb-12">
        {isEditing ? 'Manage Profiles:' : "Who's watching?"}
      </h1>
      
      <div className="flex flex-wrap justify-center gap-6 md:gap-10">
        {profiles.map((profile) => (
          <div 
            key={profile.id} 
            className="group flex flex-col items-center gap-4 cursor-pointer"
            onClick={() => handleProfileClick(profile.id)}
          >
            <div className="relative w-28 h-28 md:w-40 md:h-40 border-4 border-transparent group-hover:border-white transition-all rounded overflow-hidden">
              <Image 
                src={profile.image} 
                alt={profile.name} 
                fill 
                className={`object-cover ${isEditing ? 'opacity-50' : ''}`}
              />
              {isEditing && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-black/50 p-2 rounded-full border border-white">
                    <Pencil className="text-white" size={24} />
                  </div>
                </div>
              )}
            </div>
            <span className="text-grey-350 text-xl group-hover:text-white transition-colors">
              {profile.name}
            </span>
          </div>
        ))}
        
        {!isEditing && (
          <div className="group flex flex-col items-center gap-4 cursor-pointer">
            <div className="relative w-28 h-28 md:w-40 md:h-40 flex items-center justify-center bg-grey-800/20 group-hover:bg-grey-700 transition-all rounded border-4 border-transparent">
              <span className="text-grey-350 text-6xl group-hover:text-white">+</span>
            </div>
            <span className="text-grey-350 text-xl group-hover:text-white transition-colors">
              Add Profile
            </span>
          </div>
        )}
      </div>

      <button 
        onClick={() => setIsEditing(!isEditing)}
        className={`mt-20 border px-6 py-2 uppercase tracking-widest transition-all ${
          isEditing 
          ? 'bg-white text-black border-white font-bold' 
          : 'border-grey-350 text-grey-350 hover:text-white hover:border-white'
        }`}
      >
        {isEditing ? 'Done' : 'Manage Profiles'}
      </button>
    </div>
  );
}
