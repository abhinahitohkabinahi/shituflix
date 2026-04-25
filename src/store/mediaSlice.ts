import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { VideoProvider, MediaItem } from '@/types/media';

interface MediaState {
  selectedProvider: VideoProvider;
  showTitles: boolean;
  modalItem: MediaItem | null;
  isModalOpen: boolean;
}

const initialState: MediaState = {
  selectedProvider: 'videoeasy',
  showTitles: false,
  modalItem: null,
  isModalOpen: false,
};

export const mediaSlice = createSlice({
  name: 'media',
  initialState,
  reducers: {
    setProvider(state, action: PayloadAction<VideoProvider>) {
      state.selectedProvider = action.payload;
    },
    toggleTitles(state) {
      state.showTitles = !state.showTitles;
    },
    openModal(state, action: PayloadAction<MediaItem>) {
      state.modalItem = action.payload;
      state.isModalOpen = true;
    },
    closeModal(state) {
      state.isModalOpen = false;
      // We keep the modalItem populated so the exit animation doesn't pop blank
    },
  },
});

export const { setProvider, toggleTitles, openModal, closeModal } = mediaSlice.actions;
export default mediaSlice.reducer;
