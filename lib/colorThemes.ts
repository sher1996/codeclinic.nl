export type ThemeName = 'spring' | 'sunset' | 'candy' | 'matrix';

export const palettes = {
  spring: ['#b5e48c', '#99d98c', '#52b69a', '#38a3a5', '#22577a'],
  sunset: ['#ff9e00', '#ff6d00', '#ff206e', '#fb5607', '#ffbe0b'],
  candy: ['#ffadad', '#ffd6a5', '#fdffb6', '#caffbf', '#9bf6ff'],
  matrix: ['#00ff66', '#00ff66', '#00ff66', '#00ff66', '#00ff66'], // Default Matrix green
} as const;

// Helper to get the primary color for each theme
export const themePrimaryColors = {
  spring: '#52b69a',
  sunset: '#ff6d00',
  candy: '#ffd6a5',
  matrix: '#00ff66',
} as const;

// Helper to get the text color for each theme
export const themeTextColors = {
  spring: '#22577a',
  sunset: '#ffbe0b',
  candy: '#ffadad',
  matrix: '#ffffff',
} as const; 