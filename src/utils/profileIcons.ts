import { MAIN_ICONS, OTHER_ICONS } from '@/app/profile-selection/icons';

export const PROFILE_ICONS: Record<string, string> = {};

// Map MAIN_ICONS to 'classic_0', 'classic_1', etc.
MAIN_ICONS.forEach((url, index) => {
  PROFILE_ICONS[`classic_${index}`] = url;
});

// Map OTHER_ICONS to 'other_0', 'other_1', etc.
OTHER_ICONS.forEach((url, index) => {
  PROFILE_ICONS[`other_${index}`] = url;
});

export function getIconUrl(code: string | null | undefined): string {
  if (!code) return MAIN_ICONS[0];
  return PROFILE_ICONS[code] || MAIN_ICONS[0];
}

export function getRandomIconCode(): string {
  const allCodes = Object.keys(PROFILE_ICONS);
  return allCodes[Math.floor(Math.random() * allCodes.length)];
}
