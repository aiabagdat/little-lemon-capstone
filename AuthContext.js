import { createContext } from 'react';

// Shares the saved profile and the save / log out actions between screens
export const AuthContext = createContext({
  profile: null,
  saveProfile: async () => {},
  logOut: async () => {},
});
