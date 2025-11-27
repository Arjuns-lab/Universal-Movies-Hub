export enum Language {
  TELUGU = 'Telugu',
  HINDI = 'Hindi',
  ENGLISH = 'English',
  TAMIL = 'Tamil',
  KANNADA = 'Kannada',
  MALAYALAM = 'Malayalam',
  KOREAN = 'Korean',
  JAPANESE = 'Japanese',
}

export enum Genre {
  ACTION = 'Action',
  DRAMA = 'Drama',
  THRILLER = 'Thriller',
  ROMANCE = 'Romance',
  COMEDY = 'Comedy',
  SCI_FI = 'Sci-Fi',
  HORROR = 'Horror',
}

export enum Quality {
  SD_480P = '480p',
  HD_720P = '720p',
  FHD_1080P = '1080p',
  UHD_4K = '4K',
}

export interface Movie {
  id: string;
  title: string;
  description: string;
  posterUrl: string;
  bannerUrl: string;
  videoUrl?: string; // Optional for mock
  rating: number; // 0-10
  year: number;
  languages: Language[];
  genres: Genre[];
  director: string;
  cast: string[];
  trending?: boolean;
  newRelease?: boolean;
  quality?: string;
  progress?: number; // 0-100 percentage
  duration?: number; // minutes
  parentalRating?: string; // e.g. U/A 16+, A, PG-13
}

export interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  watchlist: string[]; // IDs of movies
}

export type ViewState = 
  | 'SPLASH'
  | 'AUTH_LOGIN'
  | 'AUTH_SIGNUP'
  | 'HOME' 
  | 'DETAILS' 
  | 'PLAYER' 
  | 'SEARCH' 
  | 'QUICK_BITS' // New Short-form feed
  | 'CINEMAS' // New Maps Feature
  | 'ADMIN_DASHBOARD'
  | 'ADMIN_UPLOAD' 
  | 'PROFILE'
  | 'EDIT_PROFILE'
  | 'WATCHLIST'
  | 'DOWNLOADS'
  | 'SETTINGS';

export interface DownloadTask {
  id: string;
  movieId: string;
  movieTitle: string;
  posterUrl?: string;
  quality: Quality;
  progress: number; // 0-100
  status: 'downloading' | 'paused' | 'completed';
  totalSize?: string;
  downloadedSize?: string;
  speed?: string;
  timeRemaining?: string;
}