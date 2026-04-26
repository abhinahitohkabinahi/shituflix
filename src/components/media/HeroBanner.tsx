'use client';

import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { BannerTemplate } from './BannerTemplate';
import { useMyList } from '@/hooks/useMyList';
import { useAuth } from '@/hooks/useAuth';
import { openModal } from '@/store/mediaSlice';
import type { MediaItem } from '@/types/media';

interface HeroBannerProps {
  items: MediaItem[];
}

/**
 * HERO BANNER CONTROLLER
 * Manages the rotation logic and data fetching for the hero banner,
 * using the centralized BannerTemplate for the UI design.
 */
export function HeroBanner({ items }: HeroBannerProps) {
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();
  const { isInList, addMutation, removeMutation } = useMyList();
  
  const [currentIndex, setCurrentIndex] = useState(0);

  // Automatic Rotation Logic
  useEffect(() => {
    if (!items || items.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 8000); // 8 seconds per slide

    return () => clearInterval(interval);
  }, [items]);

  if (!items || items.length === 0) return null;

  const currentItem = items[currentIndex];
  const inList = isAuthenticated ? isInList(currentItem.id) : false;

  const handleListToggle = () => {
    if (inList) {
      removeMutation.mutate(currentItem.id);
    } else {
      addMutation.mutate({ contentId: currentItem.id, contentType: currentItem.contentType });
    }
  };

  const handleInfoClick = () => {
    dispatch(openModal(currentItem));
  };

  const handleIndexChange = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <BannerTemplate 
      item={currentItem}
      inList={inList}
      onListToggle={handleListToggle}
      onInfoClick={handleInfoClick}
      currentIndex={currentIndex}
      totalItems={items.length}
      onIndexChange={handleIndexChange}
    />
  );
}
