// Little Lemon brand colors
export const colors = {
  green: '#495E57',
  yellow: '#F4CE14',
  salmon: '#EE9972',
  peach: '#FBDABB',
  light: '#EDEFEE',
  dark: '#333333',
  white: '#FFFFFF',
  grey: '#AFAFAF',
};

export const PROFILE_KEY = 'littleLemon.profile';
export const MENU_KEY = 'littleLemon.menu';
export const MENU_URL =
  'https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json';
export const imageUrl = (fileName) =>
  `https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/${fileName}?raw=true`;

export const validateEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());

export const validateName = (name) => /^[A-Za-zÀ-ɏЀ-ӿ' -]+$/.test(name.trim());
